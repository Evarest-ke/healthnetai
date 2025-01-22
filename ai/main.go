// main.go
package main

import (
	"log"
	"os"
	"time"

	"github.com/Evarest-ke/healthnetai/analyzer"
	"github.com/Evarest-ke/healthnetai/collector"
	"github.com/Evarest-ke/healthnetai/models"
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

	metricsChan := networkCollector.Start()
	var metrics []models.Metrics

	log.Println("Starting network monitoring system...")
	log.Println("Development mode: Analysis will run every 1 minute")

	// Add alert rate limiting
	alertThrottle := time.NewTicker(1 * time.Minute)
	defer alertThrottle.Stop()

	// Main monitoring loop
	for metric := range metricsChan {
		select {
		case <-alertThrottle.C:
			// Process alerts only once per minute
			if alerts := networkCollector.Baseline.DetectAnomalies(metric); len(alerts) > 0 {
				log.Println("🚨 Baseline Anomalies Detected:")
				for _, alert := range alerts {
					log.Printf("• %s: %s\n  ↳ %s",
						alert.Severity, alert.Description, alert.Recommended)
				}
			}
		default:
			// Continue processing metrics without alerts
		}
		predictor.AddMetrics(metric)
		metrics = append(metrics, metric)

		// Get system metrics
		sysMetrics, err := networkCollector.SystemMetrics()
		if err != nil {
			log.Printf("Error collecting system metrics: %v", err)
		} else {
			log.Printf("Memory Usage: %.2f%%, Disk Usage: %.2f%%",
				sysMetrics.MemoryUsage,
				sysMetrics.DiskUsage)
		}

		// Analyze every 1 minute (10 intervals of 6 seconds)
		if len(metrics) >= 10 {
			log.Println("=== Analysis Report ===")
			log.Println("Time:", time.Now().Format("15:04:05"))

			// Get AI analysis
			alerts, err := networkAnalyzer.AnalyzeMetrics(metrics)
			if err != nil {
				log.Printf("Analysis error: %v", err)
			} else {
				log.Println("🔍 AI Alerts:")
				for _, alert := range alerts {
					log.Printf("• %s: %s\n  ↳ Recommendation: %s",
						alert.Severity, alert.Description, alert.Recommended)
				}
			}

			// Get predictions
			predictions, err := predictor.PredictNextHour()
			if err != nil {
				log.Printf("Prediction error: %v", err)
			} else {
				log.Println("🔮 Predictions for Next Hour:")
				for _, pred := range predictions {
					log.Printf("• %s: %.2f (Confidence: %.1f%%)",
						pred.Metric, pred.Value, pred.Confidence*100)
				}
			}

			// Calculate averages
			averages := networkCollector.CalculateAverages(metrics)
			log.Println("=== End Report ===")
			log.Println() // Single empty line between reports

			log.Printf("📊 One-Minute Averages:")
			log.Printf("• Bandwidth: %.2f MB/s", float64(averages.BytesReceived+averages.BytesSent)/(1024*1024))
			log.Printf("• Latency: %.2f ms", averages.Latency)
			log.Printf("• CPU: %.2f%%", averages.CPUUsage)
			log.Printf("• Memory: %.2f%%", averages.MemoryUsage)
			log.Printf("• Disk: %.2f%%", averages.DiskUsage)

			// Reset metrics array
			metrics = metrics[:0]
		}
	}
}
