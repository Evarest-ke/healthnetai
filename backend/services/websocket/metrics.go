package websocket

import (
	"log"
	"net/http"
	"sync"
	"time"

	"github.com/Evarest-ke/healthnetai/services/cache"
	"github.com/Evarest-ke/healthnetai/services/loadbalancer"
	"github.com/gorilla/websocket"
)

type MetricsHub struct {
	clients      map[*websocket.Conn]bool
	broadcast    chan MetricsData
	register     chan *websocket.Conn
	unregister   chan *websocket.Conn
	mu           sync.RWMutex
	cache        *cache.RedisCache
	loadBalancer *loadbalancer.LoadBalancer
	upgrader     *websocket.Upgrader
}

type MetricsData struct {
	CacheStats struct {
		Hits   int64 `json:"hits"`
		Misses int64 `json:"misses"`
		Size   int64 `json:"size"`
	} `json:"cacheStats"`
	WSConnections struct {
		Active int `json:"active"`
		Total  int `json:"total"`
	} `json:"wsConnections"`
	LoadBalancer struct {
		Instances []struct {
			ID   string  `json:"ID"`
			Load float64 `json:"Load"`
		} `json:"instances"`
		AvgLoad float64 `json:"avgLoad"`
	} `json:"loadBalancer"`
	Timestamp time.Time `json:"timestamp"`
}

func NewMetricsHub(cache *cache.RedisCache, lb *loadbalancer.LoadBalancer) *MetricsHub {
	return &MetricsHub{
		clients:      make(map[*websocket.Conn]bool),
		broadcast:    make(chan MetricsData),
		register:     make(chan *websocket.Conn),
		unregister:   make(chan *websocket.Conn),
		cache:        cache,
		loadBalancer: lb,
	}
}

func (h *MetricsHub) Run() {
	ticker := time.NewTicker(1 * time.Second)
	defer ticker.Stop()

	for {
		select {
		case client := <-h.register:
			h.mu.Lock()
			h.clients[client] = true
			log.Printf("New client registered. Total clients: %d", len(h.clients))
			h.mu.Unlock()

		case client := <-h.unregister:
			h.mu.Lock()
			if _, ok := h.clients[client]; ok {
				delete(h.clients, client)
				client.Close()
				log.Printf("Client unregistered. Total clients: %d", len(h.clients))
			}
			h.mu.Unlock()

		case metrics := <-h.broadcast:
			h.mu.RLock()
			log.Printf("Broadcasting metrics to %d clients", len(h.clients))
			for client := range h.clients {
				err := client.WriteJSON(metrics)
				if err != nil {
					log.Printf("Error broadcasting to client: %v", err)
					client.Close()
					delete(h.clients, client)
				} else {
					log.Printf("Successfully sent metrics to client")
				}
			}
			h.mu.RUnlock()

		case <-ticker.C:
			// Collect and broadcast metrics
			metrics := h.collectMetrics()
			log.Printf("Collected new metrics - Cache hits: %d, Active connections: %d, Load balancer instances: %d",
				metrics.CacheStats.Hits,
				metrics.WSConnections.Active,
				len(metrics.LoadBalancer.Instances))
			h.broadcast <- metrics
		}
	}
}

func (h *MetricsHub) collectMetrics() MetricsData {
	metrics := MetricsData{
		Timestamp: time.Now(),
	}

	// Get cache stats
	if h.cache != nil {
		log.Printf("Collecting cache metrics")
		metrics.CacheStats.Hits = h.cache.GetHits()
		metrics.CacheStats.Misses = h.cache.GetMisses()
		metrics.CacheStats.Size = h.cache.GetSize()
		log.Printf("Cache metrics - Hits: %d, Misses: %d, Size: %d",
			metrics.CacheStats.Hits,
			metrics.CacheStats.Misses,
			metrics.CacheStats.Size)
	} else {
		log.Printf("Warning: Cache is nil, using default values")
	}

	// Get WebSocket stats
	h.mu.RLock()
	metrics.WSConnections.Active = len(h.clients)
	metrics.WSConnections.Total = metrics.WSConnections.Active
	log.Printf("WebSocket stats - Active: %d, Total: %d",
		metrics.WSConnections.Active,
		metrics.WSConnections.Total)
	h.mu.RUnlock()

	// Get load balancer stats
	if h.loadBalancer != nil {
		log.Printf("Collecting load balancer metrics")
		metrics.LoadBalancer.Instances = h.loadBalancer.GetInstanceMetrics()
		metrics.LoadBalancer.AvgLoad = h.loadBalancer.GetAverageLoad()
		log.Printf("Load balancer metrics - Instances: %d, Average Load: %.2f",
			len(metrics.LoadBalancer.Instances),
			metrics.LoadBalancer.AvgLoad)
	} else {
		log.Printf("Warning: LoadBalancer is nil, using default values")
		metrics.LoadBalancer.Instances = []struct {
			ID   string  `json:"ID"`
			Load float64 `json:"Load"`
		}{}
		metrics.LoadBalancer.AvgLoad = 0
	}

	return metrics
}

// BroadcastMetrics broadcasts the given metrics to all connected clients
func (h *MetricsHub) BroadcastMetrics(metrics interface{}) {
	h.mu.RLock()
	defer h.mu.RUnlock()

	log.Printf("Broadcasting metrics to %d clients", len(h.clients))
	for client := range h.clients {
		err := client.WriteJSON(metrics)
		if err != nil {
			log.Printf("Error broadcasting to client: %v", err)
			h.unregister <- client
		} else {
			log.Printf("Successfully sent metrics to client")
		}
	}
}

// SetUpgrader sets the WebSocket upgrader for the metrics hub
func (h *MetricsHub) SetUpgrader(upgrader websocket.Upgrader) {
	h.upgrader = &upgrader
}

// GetUpgrader returns the WebSocket upgrader
func (h *MetricsHub) GetUpgrader() *websocket.Upgrader {
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
func (h *MetricsHub) ServeWS(w http.ResponseWriter, r *http.Request) {
	upgrader := h.GetUpgrader()
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Printf("Error upgrading connection: %v", err)
		return
	}

	h.register <- conn

	// Start reading from the connection in a new goroutine
	go func() {
		defer func() {
			h.unregister <- conn
			conn.Close()
		}()

		for {
			// Read message (even though we don't expect any from metrics clients)
			_, _, err := conn.ReadMessage()
			if err != nil {
				if websocket.IsUnexpectedCloseError(err, websocket.CloseGoingAway, websocket.CloseAbnormalClosure) {
					log.Printf("Error reading message: %v", err)
				}
				break
			}
		}
	}()
}
