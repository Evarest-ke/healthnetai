// main.go
package main

import (
	"encoding/json"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/Evarest-ke/healthnetai/analyzer"
	"github.com/Evarest-ke/healthnetai/collector"
	"github.com/Evarest-ke/healthnetai/models"
	"github.com/Evarest-ke/healthnetai/services/kisumu"
	"github.com/Evarest-ke/healthnetai/services/websocket"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	ws "github.com/gorilla/websocket"
	"github.com/joho/godotenv"
)

func main() {
	// Load .env file
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file:", err)
	}

	apiKey := os.Getenv("GEMINI_API_KEY")
	if apiKey == "" {
		log.Fatal("GEMINI_API_KEY environment variable not set")
	}

	// Get HealthSites.io API key from environment (optional when using mock data)
	healthsitesKey := os.Getenv("HEALTHSITES_API_KEY")

	// Initialize components
	networkCollector := collector.NewCollector(6 * time.Second)
	networkAnalyzer, err := analyzer.NewAnalyzer(apiKey, 0.8)
	if err != nil {
		log.Fatal("Failed to initialize analyzer:", err)
	}
	predictor := analyzer.NewPredictor(10)

	// Initialize Kisumu network service
	kisumuNetwork := kisumu.NewNetworkService(healthsitesKey)

	// Initialize WebSocket hub
	wsHub := websocket.NewHub()
	go wsHub.Run()

	// WebSocket upgrader
	upgrader := ws.Upgrader{
		CheckOrigin: func(r *http.Request) bool {
			return true // Allow all origins in development
		},
	}

	// Initialize Gin router
	r := gin.Default()

	// Add CORS middleware
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:5173"},
		AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept"},
		AllowCredentials: true,
	}))

	// Start metrics collection
	metricsChan := networkCollector.Start()
	var metrics []models.Metrics

	// API Routes
	api := r.Group("/api")
	{
		network := api.Group("/network")
		{
			// Get current metrics
			network.GET("/metrics", func(c *gin.Context) {
				sysMetrics, err := networkCollector.SystemMetrics()
				if err != nil {
					c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
					return
				}
				c.JSON(http.StatusOK, sysMetrics)
			})

			// Get alerts
			network.GET("/alerts", func(c *gin.Context) {
				if len(metrics) > 0 {
					alerts := networkCollector.Baseline.DetectAnomalies(metrics[len(metrics)-1])
					c.JSON(http.StatusOK, alerts)
				} else {
					c.JSON(http.StatusOK, []models.Alert{})
				}
			})

			// Get predictions
			network.GET("/predictions", func(c *gin.Context) {
				predictions, err := predictor.PredictNextHour()
				if err != nil {
					c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
					return
				}
				c.JSON(http.StatusOK, predictions)
			})

			// Get analysis
			network.GET("/analysis", func(c *gin.Context) {
				if len(metrics) >= 10 {
					analysis, err := networkAnalyzer.AnalyzeMetrics(metrics)
					if err != nil {
						c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
						return
					}
					c.JSON(http.StatusOK, analysis)
				} else {
					c.JSON(http.StatusOK, []models.Alert{})
				}
			})

			// Get averages
			network.GET("/averages", func(c *gin.Context) {
				if len(metrics) > 0 {
					averages := networkCollector.CalculateAverages(metrics)
					c.JSON(http.StatusOK, averages)
				} else {
					c.JSON(http.StatusOK, gin.H{
						"latency":      0,
						"bandwidth":    0,
						"cpu_usage":    0,
						"memory_usage": 0,
						"disk_usage":   0,
					})
				}
			})

			// Kisumu-specific endpoints
			kisumu := network.Group("/kisumu")
			{
				// Get all clinics
				kisumu.GET("/clinics", func(c *gin.Context) {
					clinics, err := kisumuNetwork.GetClinics()
					if err != nil {
						c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
						return
					}
					c.JSON(http.StatusOK, clinics)
				})

				// Get clinic status
				kisumu.GET("/clinic/:id", func(c *gin.Context) {
					clinicID := c.Param("id")
					metrics, err := kisumuNetwork.GetClinicMetrics(clinicID)
					if err != nil {
						c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
						return
					}
					c.JSON(http.StatusOK, metrics)
				})

				// Emergency bandwidth sharing
				kisumu.POST("/emergency-share", func(c *gin.Context) {
					var req struct {
						SourceID string `json:"source_id"`
						TargetID string `json:"target_id"`
					}

					if err := c.BindJSON(&req); err != nil {
						c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
						return
					}

					canShare, bandwidth := kisumuNetwork.CheckEmergencyBandwidthSharing(
						req.SourceID,
						req.TargetID,
					)

					c.JSON(http.StatusOK, gin.H{
						"can_share":        canShare,
						"bandwidth_factor": bandwidth,
						"timestamp":        time.Now(),
					})
				})

				// WebSocket endpoint for real-time metrics
				kisumu.GET("/ws", func(c *gin.Context) {
					conn, err := upgrader.Upgrade(c.Writer, c.Request, nil)
					if err != nil {
						log.Printf("Failed to upgrade connection: %v", err)
						return
					}

					client := &websocket.Client{
						Hub:  wsHub,
						Conn: conn,
						Send: make(chan []byte, 256),
					}
					client.Hub.Register(client)

					// Start goroutine for handling client messages
					go client.WritePump()
				})
			}
		}
	}

	// Start monitoring loop in a goroutine
	go func() {
		alertThrottle := time.NewTicker(1 * time.Minute)
		defer alertThrottle.Stop()

		for metric := range metricsChan {
			select {
			case <-alertThrottle.C:
				if alerts := networkCollector.Baseline.DetectAnomalies(metric); len(alerts) > 0 {
					log.Println("🚨 Baseline Anomalies Detected:")
					for _, alert := range alerts {
						log.Printf("• %s: %s\n  ↳ %s",
							alert.Severity, alert.Description, alert.Recommended)
					}
				}
			default:
			}
			predictor.AddMetrics(metric)
			metrics = append(metrics, metric)

			// Keep only last hour of metrics (600 samples at 6-second intervals)
			if len(metrics) > 600 {
				metrics = metrics[1:]
			}

			// Broadcast metrics to WebSocket clients
			if data, err := json.Marshal(metric); err == nil {
				wsHub.Broadcast(data)
			}
		}
	}()

	// Start the server
	log.Println("Starting server on :8080...")
	if err := r.Run(":8080"); err != nil {
		log.Fatal("Failed to start server:", err)
	}
}
