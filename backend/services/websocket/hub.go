package websocket

import (
	"bytes"
	"encoding/json"
	"io"
	"log"
	"net/http"
	"sync"
	"time"

	"github.com/gorilla/websocket"
	"github.com/klauspost/compress/gzip"
)

const (
	// Time allowed to write a message to the peer
	writeWait = 10 * time.Second
	// Time allowed to read the next pong message from the peer
	pongWait = 60 * time.Second
	// Send pings to peer with this period
	pingPeriod = (pongWait * 9) / 10
	// Maximum message size allowed from peer
	maxMessageSize = 512
	// Batch update interval
	batchInterval = 100 * time.Millisecond
	// Maximum batch size
	maxBatchSize = 100
	// Compression settings
	compressionLevel   = 6   // gzip compression level (1-9)
	compressionMinSize = 512 // minimum size for compression

	// Connection pool settings
	maxPoolSize        = 1000
	maxIdleConnections = 100
)

// Message represents a WebSocket message
type Message struct {
	Type       string      `json:"type"`
	Data       interface{} `json:"data"`
	Time       time.Time   `json:"time"`
	BatchID    string      `json:"batch_id,omitempty"`
	Compressed bool        `json:"compressed,omitempty"`
}

// BatchMessage represents a batch of messages
type BatchMessage struct {
	Messages []Message `json:"messages"`
	BatchID  string    `json:"batch_id"`
}

// Client represents a WebSocket client
type Client struct {
	hub      *Hub
	conn     *websocket.Conn
	send     chan Message
	topics   map[string]bool
	mu       sync.RWMutex
	throttle *time.Timer
}

// Hub maintains the set of active clients and broadcasts messages
type Hub struct {
	clients     map[*Client]bool
	broadcast   chan Message
	register    chan *Client
	unregister  chan *Client
	topics      map[string]map[*Client]bool
	mu          sync.RWMutex
	batches     map[string][]Message
	batchTimer  *time.Timer
	pool        chan *websocket.Conn
	poolSize    int
	maxPoolSize int
	poolMu      sync.RWMutex
	upgrader    *websocket.Upgrader
}

func NewHub() *Hub {
	h := &Hub{
		broadcast:   make(chan Message),
		register:    make(chan *Client),
		unregister:  make(chan *Client),
		clients:     make(map[*Client]bool),
		topics:      make(map[string]map[*Client]bool),
		batches:     make(map[string][]Message),
		pool:        make(chan *websocket.Conn, maxPoolSize),
		maxPoolSize: maxPoolSize,
	}

	// Initialize connection pool
	for i := 0; i < maxIdleConnections; i++ {
		h.pool <- nil
	}

	return h
}

func (h *Hub) Run() {
	h.batchTimer = time.NewTimer(batchInterval)
	defer h.batchTimer.Stop()

	for {
		select {
		case client := <-h.register:
			h.clients[client] = true
		case client := <-h.unregister:
			if _, ok := h.clients[client]; ok {
				h.removeClient(client)
			}
		case message := <-h.broadcast:
			h.handleMessage(message)
		case <-h.batchTimer.C:
			h.sendBatches()
		}
	}
}

func (h *Hub) handleMessage(message Message) {
	h.mu.Lock()
	defer h.mu.Unlock()

	// Add message to appropriate batch
	topic := message.Type
	if _, ok := h.batches[topic]; !ok {
		h.batches[topic] = make([]Message, 0, maxBatchSize)
	}
	h.batches[topic] = append(h.batches[topic], message)

	// If batch is full, send immediately
	if len(h.batches[topic]) >= maxBatchSize {
		h.sendBatchForTopic(topic)
	}
}

func (h *Hub) sendBatches() {
	h.mu.Lock()
	defer h.mu.Unlock()

	// Send all pending batches
	for topic, messages := range h.batches {
		if len(messages) > 0 {
			h.sendBatchForTopic(topic)
		}
	}

	// Reset timer
	h.batchTimer.Reset(batchInterval)
}

func (h *Hub) sendBatchForTopic(topic string) {
	if messages, ok := h.batches[topic]; ok && len(messages) > 0 {
		batch := BatchMessage{
			Messages: messages,
			BatchID:  generateBatchID(),
		}

		// Send to all clients subscribed to this topic
		if clients, ok := h.topics[topic]; ok {
			for client := range clients {
				select {
				case client.send <- Message{
					Type: "batch",
					Data: batch,
					Time: time.Now(),
				}:
				default:
					h.removeClient(client)
				}
			}
		}

		// Clear the batch
		delete(h.batches, topic)
	}
}

func (h *Hub) removeClient(client *Client) {
	delete(h.clients, client)
	client.mu.RLock()
	for topic := range client.topics {
		if topicClients, ok := h.topics[topic]; ok {
			delete(topicClients, client)
			if len(topicClients) == 0 {
				delete(h.topics, topic)
			}
		}
	}
	client.mu.RUnlock()
	close(client.send)
}

func (h *Hub) Subscribe(client *Client, topic string) {
	h.mu.Lock()
	defer h.mu.Unlock()

	if _, ok := h.topics[topic]; !ok {
		h.topics[topic] = make(map[*Client]bool)
	}
	h.topics[topic][client] = true

	client.mu.Lock()
	client.topics[topic] = true
	client.mu.Unlock()
}

func (h *Hub) Unsubscribe(client *Client, topic string) {
	h.mu.Lock()
	defer h.mu.Unlock()

	if clients, ok := h.topics[topic]; ok {
		delete(clients, client)
		if len(clients) == 0 {
			delete(h.topics, topic)
		}
	}

	client.mu.Lock()
	delete(client.topics, topic)
	client.mu.Unlock()
}

func generateBatchID() string {
	return time.Now().Format("20060102150405.000") + "-" + randomString(6)
}

func randomString(n int) string {
	const letters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
	b := make([]byte, n)
	for i := range b {
		b[i] = letters[time.Now().UnixNano()%int64(len(letters))]
	}
	return string(b)
}

func (c *Client) WritePump() {
	defer func() {
		c.conn.Close()
		c.mu.Lock()
		for topic := range c.topics {
			c.hub.Unsubscribe(c, topic)
		}
		c.mu.Unlock()
	}()

	// Enable compression
	c.conn.EnableWriteCompression(true)
	c.conn.SetCompressionLevel(compressionLevel)

	for message := range c.send {
		data, err := json.Marshal(message)
		if err != nil {
			break
		}

		// Compress large messages
		if len(data) > compressionMinSize {
			compressed, err := compressData(data)
			if err == nil {
				message.Compressed = true
				data = compressed
			}
		}

		err = c.conn.WriteMessage(websocket.TextMessage, data)
		if err != nil {
			break
		}
	}
	c.conn.WriteMessage(websocket.CloseMessage, []byte{})
}

func (h *Hub) Broadcast(message []byte) {
	h.broadcast <- Message{
		Type: "message",
		Data: message,
		Time: time.Now(),
	}
}

func (h *Hub) Register(client *Client) {
	h.register <- client
}

func (h *Hub) acquireConn() *websocket.Conn {
	h.poolMu.Lock()
	defer h.poolMu.Unlock()

	select {
	case conn := <-h.pool:
		if conn != nil && !h.isConnValid(conn) {
			conn.Close()
			conn = nil
		}
		return conn
	default:
		if h.poolSize < h.maxPoolSize {
			h.poolSize++
			return nil
		}
		return <-h.pool
	}
}

func (h *Hub) releaseConn(conn *websocket.Conn) {
	if !h.isConnValid(conn) {
		conn.Close()
		return
	}

	h.poolMu.Lock()
	defer h.poolMu.Unlock()

	select {
	case h.pool <- conn:
	default:
		conn.Close()
	}
}

func (h *Hub) isConnValid(conn *websocket.Conn) bool {
	if conn == nil {
		return false
	}

	// Send ping to check connection
	err := conn.WriteControl(websocket.PingMessage, []byte{}, time.Now().Add(writeWait))
	return err == nil
}

func compressData(data []byte) ([]byte, error) {
	var buf bytes.Buffer
	writer, err := gzip.NewWriterLevel(&buf, compressionLevel)
	if err != nil {
		return nil, err
	}
	defer writer.Close()

	if _, err := writer.Write(data); err != nil {
		return nil, err
	}

	if err := writer.Close(); err != nil {
		return nil, err
	}

	return buf.Bytes(), nil
}

func decompressData(data []byte) ([]byte, error) {
	reader, err := gzip.NewReader(bytes.NewReader(data))
	if err != nil {
		return nil, err
	}
	defer reader.Close()

	var buf bytes.Buffer
	if _, err := io.Copy(&buf, reader); err != nil {
		return nil, err
	}

	return buf.Bytes(), nil
}

func NewClient(hub *Hub, conn *websocket.Conn) *Client {
	// Try to get connection from pool
	pooledConn := hub.acquireConn()
	if pooledConn != nil {
		// Close the new connection since we're using a pooled one
		conn.Close()
		conn = pooledConn
	}

	return &Client{
		hub:    hub,
		conn:   conn,
		send:   make(chan Message, 256),
		topics: make(map[string]bool),
	}
}

// GetClients returns a map of all connected clients
func (h *Hub) GetClients() map[*Client]bool {
	h.mu.RLock()
	defer h.mu.RUnlock()
	return h.clients
}

// SetUpgrader sets the WebSocket upgrader for the hub
func (h *Hub) SetUpgrader(upgrader websocket.Upgrader) {
	h.upgrader = &upgrader
}

// GetUpgrader returns the WebSocket upgrader
func (h *Hub) GetUpgrader() *websocket.Upgrader {
	if h.upgrader == nil {
		// Default upgrader if none is set
		h.upgrader = &websocket.Upgrader{
			CheckOrigin: func(r *http.Request) bool {
				return true // Default to allow all origins
			},
		}
	}
	return h.upgrader
}

// ServeWS handles WebSocket requests from clients
func (h *Hub) ServeWS(w http.ResponseWriter, r *http.Request) {
	upgrader := h.GetUpgrader()
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Printf("Error upgrading connection: %v", err)
		return
	}

	client := NewClient(h, conn)
	h.Register(client)

	// Start the write pump in a new goroutine
	go client.WritePump()

	// Start reading from the connection
	go func() {
		defer func() {
			h.unregister <- client
			conn.Close()
		}()

		conn.SetReadLimit(maxMessageSize)
		conn.SetReadDeadline(time.Now().Add(pongWait))
		conn.SetPongHandler(func(string) error {
			conn.SetReadDeadline(time.Now().Add(pongWait))
			return nil
		})

		for {
			_, message, err := conn.ReadMessage()
			if err != nil {
				if websocket.IsUnexpectedCloseError(err, websocket.CloseGoingAway, websocket.CloseAbnormalClosure) {
					log.Printf("Error reading message: %v", err)
				}
				break
			}
			h.broadcast <- Message{
				Type: "message",
				Data: message,
				Time: time.Now(),
			}
		}
	}()
}
