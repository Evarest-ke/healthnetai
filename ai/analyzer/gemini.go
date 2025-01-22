package analyzer

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
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

	// Calculate current averages for thresholds
	var (
		avgCPU       float64
		avgMemory    float64
		avgLatency   float64
		avgBandwidth float64
	)

	for _, m := range metrics {
		avgCPU += m.CPUUsage
		avgMemory += m.MemoryUsage
		avgLatency += m.Latency
		avgBandwidth += float64(m.BytesSent+m.BytesReceived) / (1024 * 1024) // MB/s
	}
	count := float64(len(metrics))
	avgCPU /= count
	avgMemory /= count
	avgLatency /= count
	avgBandwidth /= count

	prompt := fmt.Sprintf(`Analyze these network metrics and generate alerts if:
1. CPU usage > 80%% (current: %.2f%%)
2. Memory usage > 90%% (current: %.2f%%)
3. Latency > 200ms (current: %.2f ms)
4. Bandwidth > 800 MB/s (current: %.2f MB/s)

Respond with ONLY a JSON array. Example:
[
    {
        "severity": "warning",
        "description": "High CPU usage detected: 85%%",
        "recommended": "Investigate high CPU processes"
    }
]

If no issues are detected, respond with an empty array: []`,
		avgCPU, avgMemory, avgLatency, avgBandwidth)

	ctx := context.Background()
	resp, err := a.model.GenerateContent(ctx, genai.Text(prompt))
	if err != nil {
		log.Printf("Gemini API error: %v", err)
		return nil, err
	}

	if len(resp.Candidates) == 0 || len(resp.Candidates[0].Content.Parts) == 0 {
		return []models.Alert{}, nil // Return empty alerts instead of error
	}

	textContent := resp.Candidates[0].Content.Parts[0].(genai.Text)
	cleanedResponse := strings.TrimSpace(string(textContent))

	// Find the JSON array
	startIdx := strings.Index(cleanedResponse, "[")
	endIdx := strings.LastIndex(cleanedResponse, "]")
	if startIdx == -1 || endIdx == -1 {
		log.Printf("Invalid response format: %s", cleanedResponse)
		return []models.Alert{}, nil
	}

	jsonResponse := cleanedResponse[startIdx : endIdx+1]
	var alerts []models.Alert
	if err := json.Unmarshal([]byte(jsonResponse), &alerts); err != nil {
		log.Printf("Failed to parse response: %v\nResponse: %s", err, jsonResponse)
		return []models.Alert{}, nil
	}

	return alerts, nil
}
