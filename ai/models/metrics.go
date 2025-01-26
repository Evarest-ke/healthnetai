// model/metrics.go
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
	// Add clinic-specific fields
	ClinicID      string   `json:"clinic_id"`
	Coordinates   GeoPoint `json:"coordinates"`
	TerrainFactor float64  `json:"terrain_factor"` // Sentinel-2 derived factor
}

// GeoPoint represents geographical coordinates
type GeoPoint struct {
	Latitude  float64 `json:"lat"`
	Longitude float64 `json:"lng"`
}

// Clinic represents a healthcare facility
type Clinic struct {
	ID            string    `json:"id"`
	Name          string    `json:"name"`
	Coordinates   GeoPoint  `json:"coordinates"`
	BedCount      int       `json:"bed_count"`
	LastOutage    time.Time `json:"last_outage"`
	NetworkStatus string    `json:"network_status"`
	EmergencyMode bool      `json:"emergency_mode"`
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

// ConnectivityAnalysis represents network connectivity analysis results
type ConnectivityAnalysis struct {
	TrafficPatterns []string `json:"traffic_patterns"`
	PeakHours       []string `json:"peak_hours"`
	Bottlenecks     []string `json:"bottlenecks"`
	Recommendations []string `json:"recommendations"`
}

type NetworkMetrics struct {
	Bandwidth      string    `json:"bandwidth"`       // e.g., "100Mbps"
	Latency        string    `json:"latency"`         // e.g., "15ms"
	PacketLoss     string    `json:"packet_loss"`     // e.g., "0.1%"
	SignalStrength int       `json:"signal_strength"` // 0-100
	Jitter         string    `json:"jitter"`          // e.g., "5ms"
	Uptime         float64   `json:"uptime"`          // percentage
	LastCheck      time.Time `json:"last_check"`
} 