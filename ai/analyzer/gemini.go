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

	prompt := fmt.Sprintf(`Analyze these network metrics and generate alerts. Current state:

System Metrics:
- CPU: %.2f%% (max: %.2f%%, trend: %+.2f%%)
- Memory: %.2f%% (max: %.2f%%, trend: %+.2f%%)
- Latency: %.2fms (max: %.2fms, trend: %+.2fms)
- Bandwidth: %.2f MB/s (max: %.2f MB/s, trend: %+.2f MB/s)

Alert Thresholds:
- Critical: CPU > 80%%, Memory > 90%%, Latency > 200ms, Bandwidth > 800 MB/s
- Warning: CPU > 70%%, Memory > 80%%, Latency > 150ms, Bandwidth > 600 MB/s

Respond with ONLY a JSON array of alerts. Example:
[
    {
        "severity": "warning",
        "description": "Memory usage trending up significantly: 85%%",
        "recommended": "Monitor application memory consumption"
    }
]`,
		avgCPU, maxCPU, cpuTrend,
		avgMemory, maxMemory, memoryTrend,
		avgLatency, maxLatency, latencyTrend,
		avgBandwidth, maxBandwidth, bandwidthTrend)

	// Debug logging
	log.Printf("Sending prompt to Gemini API")

	ctx := context.Background()
	resp, err := a.model.GenerateContent(ctx, genai.Text(prompt))
	if err != nil {
		log.Printf("Gemini API error: %v", err)
		return nil, fmt.Errorf("gemini API error: %v", err)
	}

	// Debug logging
	log.Printf("Received response from Gemini API")

	if len(resp.Candidates) == 0 || len(resp.Candidates[0].Content.Parts) == 0 {
		log.Printf("No response candidates from Gemini API")
		return []models.Alert{}, nil
	}

	textContent := resp.Candidates[0].Content.Parts[0].(genai.Text)
	cleanedResponse := strings.TrimSpace(string(textContent))

	// Debug logging
	log.Printf("Raw API response: %s", cleanedResponse)

	startIdx := strings.Index(cleanedResponse, "[")
	endIdx := strings.LastIndex(cleanedResponse, "]")
	if startIdx == -1 || endIdx == -1 {
		log.Printf("Invalid JSON format in response: %s", cleanedResponse)
		return []models.Alert{}, nil
	}

	jsonResponse := cleanedResponse[startIdx : endIdx+1]
	var alerts []models.Alert
	if err := json.Unmarshal([]byte(jsonResponse), &alerts); err != nil {
		log.Printf("JSON parsing error: %v\nResponse: %s", err, jsonResponse)
		return []models.Alert{}, nil
	}

	// Debug logging
	log.Printf("Successfully parsed %d alerts", len(alerts))

	return alerts, nil
}
