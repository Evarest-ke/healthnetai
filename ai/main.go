// main.go
package main

import (
	"log"
	"net/http"
	"os"
	"time"

	"github.com/Evarest-ke/healthnetai/analyzer"
	"github.com/Evarest-ke/healthnetai/collector"
	"github.com/Evarest-ke/healthnetai/models"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
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

	// Initialize components
	networkCollector := collector.NewCollector(6 * time.Second)
	networkAnalyzer, err := analyzer.NewAnalyzer(apiKey, 0.8)
	if err != nil {
		log.Fatal("Failed to initialize analyzer:", err)
	}
	predictor := analyzer.NewPredictor(10)

	// Initialize Gin router
	r := gin.Default()

	// Add CORS middleware
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:5173"}, // Vite's default port
		AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
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
		}
	}()

	// Start the server
	log.Println("Starting server on :8080...")
	if err := r.Run(":8080"); err != nil {
		log.Fatal("Failed to start server:", err)
	}
}
