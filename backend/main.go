// main.go
package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/Evarest-ke/healthnetai/analyzer"
	"github.com/Evarest-ke/healthnetai/backend/database"
	"github.com/Evarest-ke/healthnetai/backend/handlers"
	"github.com/Evarest-ke/healthnetai/collector"
	"github.com/Evarest-ke/healthnetai/models"
	"github.com/Evarest-ke/healthnetai/services/aianalytics"
	"github.com/Evarest-ke/healthnetai/services/cache"
	"github.com/Evarest-ke/healthnetai/services/kisumu"
	"github.com/Evarest-ke/healthnetai/services/loadbalancer"
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

	// err = healthsites.MigrateFromSQLiteToPostgres()
	// if err != nil {
	// 	log.Fatalf("Migration failed: %v", err)
	// }
	// log.Println("Migration completed successfully")

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

	// Initialize AI analytics
	aiAnalyzer, err := aianalytics.NewAIAnalyzer(apiKey)
	if err != nil {
		log.Fatal("Failed to initialize AI analyzer:", err)
	}

	// Initialize AI chat hub
	aiChatHub := websocket.NewAIChatHub(aiAnalyzer)
	go aiChatHub.Run()

	// Initialize services
	redisCache, err := cache.NewRedisCache(
		context.Background(),
		os.Getenv("REDIS_ADDR"),
		os.Getenv("REDIS_PASSWORD"),
		"healthnet:", // key prefix
	)
	if err != nil {
		log.Printf("Warning: Failed to initialize Redis cache: %v", err)
	}

	// Initialize load balancer with weighted strategy
	lb := loadbalancer.NewLoadBalancer(&loadbalancer.WeightedStrategy{})

	// Initialize metrics hub with cache and load balancer
	metricsHub := websocket.NewMetricsHub(redisCache, lb)
	go metricsHub.Run()

	// Initialize Gin router
	r := gin.Default()

	// Configure CORS
	config := cors.DefaultConfig()
	config.AllowOrigins = []string{"http://localhost:5173", "http://localhost:3000"} // Add your frontend URLs
	config.AllowCredentials = true
	config.AllowHeaders = []string{"Origin", "Content-Type", "Accept", "Authorization", "X-Requested-With"}
	config.AllowMethods = []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"}
	r.Use(cors.New(config))

	// Configure WebSocket upgrader
	upgrader := ws.Upgrader{
		CheckOrigin: func(r *http.Request) bool {
			origin := r.Header.Get("Origin")
			for _, allowed := range config.AllowOrigins {
				if origin == allowed {
					return true
				}
			}
			return false
		},
	}

	// Use the upgrader in your WebSocket handlers
	aiChatHub.SetUpgrader(upgrader)
	metricsHub.SetUpgrader(upgrader)

	// Start metrics collection
	metricsChan := networkCollector.Start()
	var metrics []models.Metrics

	// Initialize database
	database.InitDB("./backend/database/healthnet.db")

	// Add auth routes
	auth := r.Group("/api/auth")
	{
		auth.POST("/signup", handlers.Signup)
		auth.POST("/login", handlers.Login)
		auth.GET("/me", handlers.GetCurrentUser)
	}

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

			// Initialize network stats analyzer
			networkStatsAnalyzer, err := analyzer.NewNetworkStatsAnalyzer(apiKey)
			if err != nil {
				log.Fatal("Failed to initialize network stats analyzer:", err)
			}

			// Update the stats endpoint
			network.GET("/stats", func(c *gin.Context) {
				clinics, err := kisumuNetwork.GetClinics()
				if err != nil {
					c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
					return
				}

				stats, err := networkStatsAnalyzer.AnalyzeNetworkStats(metrics, clinics)
				if err != nil {
					c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
					return
				}

				c.JSON(http.StatusOK, stats)
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

					client := websocket.NewClient(wsHub, conn)
					wsHub.Register(client)

					// Start goroutine for handling client messages
					go client.WritePump()
				})
			}
		}
	}

	// Register this instance
	instance := &loadbalancer.ServiceInstance{
		ID:     generateInstanceID(),
		Host:   os.Getenv("HOST"),
		Port:   8080,
		Health: 1.0,
		Load:   0.0,
	}
	lb.RegisterInstance(instance)

	// Start load monitoring
	go monitorLoad(lb, instance.ID, networkCollector)

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

			// Cache the latest metrics
			if redisCache != nil {
				cacheKey := fmt.Sprintf("metrics:%d", metric.Timestamp.Unix())
				if data, err := json.Marshal(metric); err == nil {
					if err := redisCache.Set(cacheKey, data, 1*time.Hour); err != nil {
						log.Printf("Failed to cache metrics: %v", err)
					}
				}
			}

			// Format metrics for broadcasting
			formattedMetrics := struct {
				CacheStats struct {
					Hits   int `json:"hits"`
					Misses int `json:"misses"`
					Size   int `json:"size"`
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
			}{
				CacheStats: struct {
					Hits   int `json:"hits"`
					Misses int `json:"misses"`
					Size   int `json:"size"`
				}{
					Hits:   int(metric.BytesSent),     // Using BytesSent as a proxy for cache hits
					Misses: int(metric.BytesReceived), // Using BytesReceived as a proxy for cache misses
					Size:   int(metric.DiskUsage),     // Using DiskUsage as a proxy for cache size
				},
				WSConnections: struct {
					Active int `json:"active"`
					Total  int `json:"total"`
				}{
					Active: metric.Connections,
					Total:  metricsHub.GetClients(),
				},
				LoadBalancer: struct {
					Instances []struct {
						ID   string  `json:"ID"`
						Load float64 `json:"Load"`
					} `json:"instances"`
					AvgLoad float64 `json:"avgLoad"`
				}{
					Instances: []struct {
						ID   string  `json:"ID"`
						Load float64 `json:"Load"`
					}{{
						ID:   metric.ClinicID,
						Load: metric.CPUUsage,
					}},
					AvgLoad: metric.CPUUsage,
				},
				Timestamp: metric.Timestamp,
			}

			// Broadcast metrics to WebSocket clients
			metricsHub.BroadcastMetrics(formattedMetrics)
			log.Printf("Broadcasting metrics: %+v", formattedMetrics)
		}
	}()

	// WebSocket routes with custom CORS handling
	r.GET("/ws/metrics", func(c *gin.Context) {
		log.Printf("Received metrics connection request from origin: %s", c.GetHeader("Origin"))
		metricsHub.ServeWS(c.Writer, c.Request)
	})

	// AI chat WebSocket endpoint
	r.GET("/ws/ai-chat", func(c *gin.Context) {
		log.Printf("Received AI chat connection request from origin: %s", c.GetHeader("Origin"))
		aiChatHub.ServeWS(c.Writer, c.Request)
	})

	// AI insights endpoint
	r.GET("/api/ai/insights", func(c *gin.Context) {
		metrics, err := networkCollector.SystemMetrics()
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		insights, err := aiAnalyzer.AnalyzeMetrics(*metrics)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		c.JSON(http.StatusOK, insights)
	})

	// Start the server
	log.Println("Starting server on :8080...")
	if err := r.Run(":8080"); err != nil {
		log.Fatal("Failed to start server:", err)
	}
}

func monitorLoad(lb *loadbalancer.LoadBalancer, instanceID string, collector *collector.Collector) {
	ticker := time.NewTicker(5 * time.Second)
	defer ticker.Stop()

	for range ticker.C {
		// Calculate current load based on system metrics
		sysMetrics, err := collector.SystemMetrics()
		if err != nil {
			continue
		}

		// Calculate load factor (0-1) based on system metrics
		loadFactor := (sysMetrics.CPUUsage + sysMetrics.MemoryUsage) / 200.0
		if loadFactor > 1.0 {
			loadFactor = 1.0
		}

		// Update instance load in load balancer
		lb.UpdateLoad(instanceID, loadFactor)

		// Update instance health based on system status
		health := calculateHealth(sysMetrics)
		lb.UpdateHealth(instanceID, health)
	}
}

func calculateHealth(metrics *models.Metrics) float64 {
	// Calculate health score based on system metrics
	cpuHealth := 1.0 - (metrics.CPUUsage / 100.0)
	memHealth := 1.0 - (metrics.MemoryUsage / 100.0)
	diskHealth := 1.0 - (metrics.DiskUsage / 100.0)

	// Weight the factors (adjust weights based on importance)
	health := (cpuHealth * 0.4) + (memHealth * 0.4) + (diskHealth * 0.2)

	if health < 0.0 {
		health = 0.0
	} else if health > 1.0 {
		health = 1.0
	}

	return health
}

func generateInstanceID() string {
	hostname, err := os.Hostname()
	if err != nil {
		hostname = "unknown"
	}
	return fmt.Sprintf("%s-%d", hostname, time.Now().UnixNano())
}
