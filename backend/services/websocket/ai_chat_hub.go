package websocket

import (
	"encoding/json"
	"log"
	"net/http"
	"sync"
	"time"

	"github.com/Evarest-ke/healthnetai/models"
	"github.com/Evarest-ke/healthnetai/services/aianalytics"
	"github.com/gorilla/websocket"
)

// AIChatMessage represents a message in the AI chat
type AIChatMessage struct {
	Type      string      `json:"type"`
	Query     string      `json:"query,omitempty"`
	Response  interface{} `json:"response,omitempty"`
	Timestamp time.Time   `json:"timestamp"`
}

// AIChatClient represents a WebSocket client for AI chat
type AIChatClient struct {
	hub  *AIChatHub
	conn *websocket.Conn
	send chan AIChatMessage
}

// AIChatHub maintains the set of active chat clients and broadcasts AI insights
type AIChatHub struct {
	clients    map[*AIChatClient]bool
	broadcast  chan AIChatMessage
	register   chan *AIChatClient
	unregister chan *AIChatClient
	analyzer   *aianalytics.AIAnalyzer
	mu         sync.RWMutex
	upgrader   *websocket.Upgrader
}

// NewAIChatHub creates a new AIChatHub
func NewAIChatHub(analyzer *aianalytics.AIAnalyzer) *AIChatHub {
	return &AIChatHub{
		broadcast:  make(chan AIChatMessage),
		register:   make(chan *AIChatClient),
		unregister: make(chan *AIChatClient),
		clients:    make(map[*AIChatClient]bool),
		analyzer:   analyzer,
	}
}

// SetUpgrader sets the WebSocket upgrader for the AI chat hub
func (h *AIChatHub) SetUpgrader(upgrader websocket.Upgrader) {
	h.upgrader = &upgrader
}

// GetUpgrader returns the WebSocket upgrader
func (h *AIChatHub) GetUpgrader() *websocket.Upgrader {
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

// ServeWS handles WebSocket requests from the client
func (h *AIChatHub) ServeWS(w http.ResponseWriter, r *http.Request) {
	upgrader := h.GetUpgrader()
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Printf("Error upgrading connection: %v", err)
		return
	}

	client := NewAIChatClient(h, conn)
	h.register <- client

	// Start client message handler
	go h.handleClientMessages(client)
	go client.WritePump()
}

// Run starts the AI chat hub
func (h *AIChatHub) Run() {
	for {
		select {
		case client := <-h.register:
			h.mu.Lock()
			h.clients[client] = true
			h.mu.Unlock()
		case client := <-h.unregister:
			h.mu.Lock()
			if _, ok := h.clients[client]; ok {
				delete(h.clients, client)
				close(client.send)
			}
			h.mu.Unlock()
		case message := <-h.broadcast:
			h.mu.RLock()
			for client := range h.clients {
				select {
				case client.send <- message:
				default:
					close(client.send)
					delete(h.clients, client)
				}
			}
			h.mu.RUnlock()
		}
	}
}

// NewAIChatClient creates a new AI chat client
func NewAIChatClient(hub *AIChatHub, conn *websocket.Conn) *AIChatClient {
	return &AIChatClient{
		hub:  hub,
		conn: conn,
		send: make(chan AIChatMessage, 256),
	}
}

// WritePump pumps messages from the hub to the websocket connection
func (c *AIChatClient) WritePump() {
	defer func() {
		c.conn.Close()
	}()

	for message := range c.send {
		err := c.conn.WriteJSON(message)
		if err != nil {
			break
		}
	}
}

// handleClientMessages processes messages from clients
func (h *AIChatHub) handleClientMessages(client *AIChatClient) {
	defer func() {
		h.unregister <- client
		client.conn.Close()
	}()

	for {
		_, message, err := client.conn.ReadMessage()
		if err != nil {
			if websocket.IsUnexpectedCloseError(err, websocket.CloseGoingAway, websocket.CloseAbnormalClosure) {
				log.Printf("AI chat error: %v", err)
			}
			break
		}

		var chatMessage AIChatMessage
		if err := json.Unmarshal(message, &chatMessage); err != nil {
			log.Printf("Failed to unmarshal chat message: %v", err)
			continue
		}

		// Process the message based on its type
		switch chatMessage.Type {
		case "query":
			go h.handleQuery(chatMessage)
		case "analyze":
			go h.handleAnalysis()
		}
	}
}

// handleQuery processes user queries
func (h *AIChatHub) handleQuery(msg AIChatMessage) {
	// Get latest metrics for context
	metrics := getCurrentMetrics() // You'll need to implement this

	response, err := h.analyzer.GetRecommendation(msg.Query, metrics)
	if err != nil {
		log.Printf("Failed to get AI recommendation: %v", err)
		return
	}

	h.broadcast <- AIChatMessage{
		Type:      "response",
		Response:  response,
		Timestamp: time.Now(),
	}
}

// handleAnalysis generates and broadcasts system insights
func (h *AIChatHub) handleAnalysis() {
	metrics := getCurrentMetrics() // You'll need to implement this

	insight, err := h.analyzer.AnalyzeMetrics(metrics)
	if err != nil {
		log.Printf("Failed to analyze metrics: %v", err)
		return
	}

	h.broadcast <- AIChatMessage{
		Type:      "insight",
		Response:  insight,
		Timestamp: time.Now(),
	}
}

// getCurrentMetrics retrieves the latest system metrics
func getCurrentMetrics() models.Metrics {
	// Implement this to get the latest metrics from your metrics collection
	// You might want to use a metrics cache or database
	return models.Metrics{}
}
