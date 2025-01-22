package analyzer

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"math"
	"strings"

	"github.com/Evarest-ke/healthnetai/models"
	"github.com/google/generative-ai-go/genai"
	"google.golang.org/api/option"
)

// Define the Alert struct
type Alert struct {
	Severity    string `json:"severity"`
	Description string `json:"description"`
	Recommended string `json:"recommended"`
}

type Analyzer struct {
	client    *genai.Client
	model     *genai.GenerativeModel
	threshold float64
}

func NewAnalyzer(apiKey string, threshold float64) (*Analyzer, error) {
	ctx := context.Background()
	client, err := genai.NewClient(ctx, option.WithAPIKey(apiKey))
	if err != nil {
		return nil, fmt.Errorf("failed to create Gemini client: %v", err)
	}

	model := client.GenerativeModel("gemini-pro")

	return &Analyzer{
		client:    client,
		model:     model,
		threshold: threshold,
	}, nil
}

func (a *Analyzer) AnalyzeMetrics(metrics []models.Metrics) ([]models.Alert, error) {
	if len(metrics) == 0 {
		return nil, fmt.Errorf("no metrics to analyze")
	}

	// Simulate threshold violations for testing
	
	metrics[len(metrics)-1].CPUUsage = 90.0       // Simulate high CPU usage
	metrics[len(metrics)-1].MemoryUsage = 95.0    // Simulate high memory usage
	metrics[len(metrics)-1].Latency = 300.0       // Simulate high latency
	metrics[len(metrics)-1].BytesSent = 900 * 1024 * 1024 // Simulate high bandwidth (900 MB/s)
	

	// Calculate averages and trends
	var (
		avgCPU, avgMemory, avgLatency, avgBandwidth         float64
		maxCPU, maxMemory, maxLatency, maxBandwidth         float64
		cpuTrend, memoryTrend, latencyTrend, bandwidthTrend float64
	)

	for i, m := range metrics {
		// Calculate averages
		avgCPU += m.CPUUsage
		avgMemory += m.MemoryUsage
		avgLatency += m.Latency
		bandwidth := float64(m.BytesSent+m.BytesReceived) / (1024 * 1024)
		avgBandwidth += bandwidth

		// Track maximums
		maxCPU = math.Max(maxCPU, m.CPUUsage)
		maxMemory = math.Max(maxMemory, m.MemoryUsage)
		maxLatency = math.Max(maxLatency, m.Latency)
		maxBandwidth = math.Max(maxBandwidth, bandwidth)

		// Calculate trends (change over time)
		if i > 0 {
			cpuTrend += m.CPUUsage - metrics[i-1].CPUUsage
			memoryTrend += m.MemoryUsage - metrics[i-1].MemoryUsage
			latencyTrend += m.Latency - metrics[i-1].Latency
			prevBandwidth := float64(metrics[i-1].BytesSent+metrics[i-1].BytesReceived) / (1024 * 1024)
			bandwidthTrend += bandwidth - prevBandwidth
		}
	}

	count := float64(len(metrics))
	avgCPU /= count
	avgMemory /= count
	avgLatency /= count
	avgBandwidth /= count

	// Refine the prompt to make it clearer and more explicit
	prompt := fmt.Sprintf(`Analyze these network metrics and generate alerts if any thresholds are exceeded. Current state:

System Metrics:
- CPU: %.2f%% (max: %.2f%%, trend: %+.2f%%)
- Memory: %.2f%% (max: %.2f%%, trend: %+.2f%%)
- Latency: %.2fms (max: %.2fms, trend: %+.2fms)
- Bandwidth: %.2f MB/s (max: %.2f MB/s, trend: %+.2f MB/s)

Alert Thresholds:
- Critical: CPU > 80%%, Memory > 90%%, Latency > 200ms, Bandwidth > 800 MB/s
- Warning: CPU > 70%%, Memory > 80%%, Latency > 150ms, Bandwidth > 600 MB/s
- Trend Warning: CPU increase > 20%%, Memory increase > 15%%, Latency increase > 50ms, Bandwidth increase > 100 MB/s

Respond with ONLY a JSON array of alerts. If no thresholds are exceeded, return an empty array []. Example:
[
    {
        "severity": "warning",
        "description": "Latency has significantly increased to 299.35ms with a rising trend.",
        "recommended": "Investigate possible network issues or bottlenecks."
    }
]`,
		avgCPU, maxCPU, cpuTrend,
		avgMemory, maxMemory, memoryTrend,
		avgLatency, maxLatency, latencyTrend,
		avgBandwidth, maxBandwidth, bandwidthTrend)

	// Debug logging: Log the prompt being sent to the API
	log.Printf("Sending prompt to Gemini API:\n%s", prompt)

	ctx := context.Background()
	resp, err := a.model.GenerateContent(ctx, genai.Text(prompt))
	if err != nil {
		log.Printf("Gemini API error: %v", err)
		return nil, fmt.Errorf("gemini API error: %v", err)
	}

	// Debug logging: Log the raw API response
	log.Printf("Received response from Gemini API")

	if len(resp.Candidates) == 0 || len(resp.Candidates[0].Content.Parts) == 0 {
		log.Printf("No response candidates from Gemini API")
		return []models.Alert{}, nil
	}

	textContent := resp.Candidates[0].Content.Parts[0].(genai.Text)
	cleanedResponse := strings.TrimSpace(string(textContent))

	// Debug logging: Log the raw API response
	log.Printf("Raw API response: %s", cleanedResponse)

	// Check if the response is empty
	if cleanedResponse == "" {
		log.Println("Gemini API returned an empty response")
		return []models.Alert{}, nil
	}

	// Validate JSON structure
	if !json.Valid([]byte(cleanedResponse)) {
		log.Printf("Invalid JSON response from Gemini API: %s", cleanedResponse)
		return []models.Alert{}, nil
	}

	// Parse the JSON response
	var alerts []models.Alert
	if err := json.Unmarshal([]byte(cleanedResponse), &alerts); err != nil {
		log.Printf("JSON parsing error: %v\nResponse: %s", err, cleanedResponse)
		return []models.Alert{}, nil
	}

	// Check if the parsed alerts array is empty
	if len(alerts) == 0 {
		log.Println("Gemini API returned an empty alerts array")
		return []models.Alert{}, nil
	}

	// Debug logging
	log.Printf("Successfully parsed %d alerts", len(alerts))

	return alerts, nil
}