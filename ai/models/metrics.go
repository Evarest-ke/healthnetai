package models

import "time"

// Metrics represents network performance metrics
type Metrics struct {
	Timestamp     time.Time
	BytesSent     uint64
	BytesReceived uint64
	PacketsSent   uint64
	PacketsRecv   uint64
	Latency       float64
	Connections   int
	Interfaces    []string
	CPUUsage      float64
	MemoryUsage   float64
	DiskUsage     float64
}

// Alert represents an analysis alert from the Gemini API
type Alert struct {
	Severity    string `json:"severity"`
	Description string `json:"description"`
	Recommended string `json:"recommended"`
}

// Prediction represents a network performance prediction
type Prediction struct {
	Timestamp  time.Time
	Metric     string // e.g., "bandwidth", "latency", "cpu"
	Value      float64
	Confidence float64
}
