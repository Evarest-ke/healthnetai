package analyzer

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"testing"

	"github.com/Evarest-ke/healthnetai/models"
)

// MockModel simulates the Gemini API for testing
type MockModel struct {
	generateFunc func(ctx context.Context, input string) (*MockResponse, error)
}

// MockResponse simulates the API response
type MockResponse struct {
	Content string
}

// GenerateContent simulates the Gemini API's GenerateContent method
func (m *MockModel) GenerateContent(ctx context.Context, input string) (*MockResponse, error) {
	if m.generateFunc != nil {
		return m.generateFunc(ctx, input)
	}
	// Default mock response
	return &MockResponse{Content: `[{"severity":"critical","description":"Latency has exceeded 200ms.","recommended":"Investigate network bottlenecks."}]`}, nil
}

// MockAnalyzer simulates the Analyzer for testing
type MockAnalyzer struct {
	model     *MockModel
	threshold float64
}

// NewMockAnalyzer creates a new MockAnalyzer for testing
func NewMockAnalyzer(threshold float64) *MockAnalyzer {
	return &MockAnalyzer{
		model:     &MockModel{},
		threshold: threshold,
	}
}

// AnalyzeMetrics simulates the Analyzer's AnalyzeMetrics method
func (a *MockAnalyzer) AnalyzeMetrics(metrics []models.Metrics) ([]models.Alert, error) {
	if len(metrics) == 0 {
		return nil, fmt.Errorf("no metrics to analyze")
	}

	// Simulate behavior based on metrics
	var response string
	if metrics[0].Latency > 200 {
		response = `[{"severity":"critical","description":"Latency has exceeded 200ms.","recommended":"Investigate network bottlenecks."}]`
	} else {
		response = "[]"
	}

	resp, err := a.model.GenerateContent(context.Background(), response)
	if err != nil {
		return nil, err
	}

	var alerts []models.Alert
	if err := json.Unmarshal([]byte(resp.Content), &alerts); err != nil {
		return nil, err
	}
	return alerts, nil
}

// TestAnalyzeMetrics tests the AnalyzeMetrics function with valid metrics
func TestAnalyzeMetrics(t *testing.T) {
	analyzer := NewMockAnalyzer(0.5)

	// Case: Metrics exceeding thresholds
	metrics := []models.Metrics{
		{CPUUsage: 50.0, MemoryUsage: 60.0, Latency: 250.0, BytesSent: 1024 * 1024, BytesReceived: 2048 * 1024},
		{CPUUsage: 75.0, MemoryUsage: 85.0, Latency: 300.0, BytesSent: 2048 * 1024, BytesReceived: 1024 * 1024},
	}

	alerts, err := analyzer.AnalyzeMetrics(metrics)
	if err != nil {
		t.Fatalf("AnalyzeMetrics returned an error: %v", err)
	}

	if len(alerts) == 0 {
		t.Fatalf("Expected alerts but got none")
	}

	expectedAlert := models.Alert{
		Severity:    "critical",
		Description: "Latency has exceeded 200ms.",
		Recommended: "Investigate network bottlenecks.",
	}

	if len(alerts) != 1 || alerts[0] != expectedAlert {
		t.Errorf("Unexpected alerts received: got %v, want %v", alerts, expectedAlert)
	}
}

// TestEmptyMetrics tests the AnalyzeMetrics function with no metrics
func TestEmptyMetrics(t *testing.T) {
	analyzer := NewMockAnalyzer(0.5)
	alerts, err := analyzer.AnalyzeMetrics([]models.Metrics{})

	if err == nil {
		t.Fatalf("Expected an error for empty metrics, got none")
	}

	if len(alerts) != 0 {
		t.Fatalf("Expected no alerts for empty metrics, got: %v", alerts)
	}
}

// TestLowMetrics tests the AnalyzeMetrics function with metrics below thresholds
func TestLowMetrics(t *testing.T) {
	analyzer := &MockAnalyzer{
		model: &MockModel{
			generateFunc: func(ctx context.Context, input string) (*MockResponse, error) {
				return &MockResponse{Content: "[]"}, nil
			},
		},
		threshold: 0.5,
	}

	metrics := []models.Metrics{
		{CPUUsage: 10.0, MemoryUsage: 20.0, Latency: 50.0, BytesSent: 1024, BytesReceived: 1024},
	}

	alerts, err := analyzer.AnalyzeMetrics(metrics)
	if err != nil {
		t.Fatalf("AnalyzeMetrics returned an error: %v", err)
	}

	if len(alerts) != 0 {
		t.Fatalf("Expected no alerts but got: %v", alerts)
	}
}

// TestInvalidJSONResponse tests the AnalyzeMetrics function with an invalid JSON response
func TestInvalidJSONResponse(t *testing.T) {
	analyzer := &MockAnalyzer{
		model: &MockModel{
			generateFunc: func(ctx context.Context, input string) (*MockResponse, error) {
				return &MockResponse{Content: "invalid-json"}, nil
			},
		},
		threshold: 0.5,
	}

	metrics := []models.Metrics{
		{CPUUsage: 50.0, MemoryUsage: 60.0, Latency: 250.0, BytesSent: 1024 * 1024, BytesReceived: 2048 * 1024},
	}

	alerts, err := analyzer.AnalyzeMetrics(metrics)

	if err == nil {
		t.Fatalf("Expected an error for invalid JSON response, got none")
	}

	if len(alerts) != 0 {
		t.Fatalf("Expected no alerts for invalid JSON response, got: %v", alerts)
	}
}

// TestErrorFromModel tests the AnalyzeMetrics function when the model returns an error
func TestErrorFromModel(t *testing.T) {
	analyzer := &MockAnalyzer{
		model: &MockModel{
			generateFunc: func(ctx context.Context, input string) (*MockResponse, error) {
				return nil, errors.New("simulated error from model")
			},
		},
		threshold: 0.5,
	}

	metrics := []models.Metrics{
		{CPUUsage: 50.0, MemoryUsage: 60.0, Latency: 250.0, BytesSent: 1024 * 1024, BytesReceived: 2048 * 1024},
	}

	alerts, err := analyzer.AnalyzeMetrics(metrics)

	if err == nil {
		t.Fatalf("Expected an error from the model, got none")
	}

	if len(alerts) != 0 {
		t.Fatalf("Expected no alerts when model returns an error, got: %v", alerts)
	}
}

// TestEmptyAlertsArray tests the AnalyzeMetrics function when the API returns an empty alerts array
func TestEmptyAlertsArray(t *testing.T) {
	analyzer := &MockAnalyzer{
		model: &MockModel{
			generateFunc: func(ctx context.Context, input string) (*MockResponse, error) {
				return &MockResponse{Content: "[]"}, nil
			},
		},
		threshold: 0.5,
	}

	metrics := []models.Metrics{
		{CPUUsage: 50.0, MemoryUsage: 60.0, Latency: 250.0, BytesSent: 1024 * 1024, BytesReceived: 2048 * 1024},
	}

	alerts, err := analyzer.AnalyzeMetrics(metrics)

	if err != nil {
		t.Fatalf("AnalyzeMetrics returned an error: %v", err)
	}

	if len(alerts) != 0 {
		t.Fatalf("Expected no alerts but got: %v", alerts)
	}
}