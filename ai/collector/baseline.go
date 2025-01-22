// collector/baseline.go
package collector

import (
	"encoding/json"
	"fmt"
	"os"
	"sync"
	"time"

	"github.com/Evarest-ke/healthnetai/models"
)

type BaselineMetrics struct {
	AverageBandwidth float64
	AverageLatency   float64
	CPUBaseline      float64
	MemoryBaseline   float64
	DiskBaseline     float64
	PacketsBaseline  float64
	UpdatedAt        time.Time
}

type BaselineMonitor struct {
	baseline       BaselineMetrics
	samples        []models.Metrics
	sampleSize     int
	updatePeriod   time.Duration
	mutex          sync.RWMutex
	baselinePath   string
	lastAlerts     map[string]time.Time // Track when alerts were last sent
	alertThreshold time.Duration        // Minimum time between similar alerts
}

func NewBaselineMonitor(sampleSize int, updatePeriod time.Duration, alertThreshold time.Duration) *BaselineMonitor {
	bm := &BaselineMonitor{
		sampleSize:     sampleSize,
		updatePeriod:   updatePeriod,
		baselinePath:   "baseline.json",
		alertThreshold: alertThreshold,
		lastAlerts:     make(map[string]time.Time),
		baseline: BaselineMetrics{
			AverageBandwidth: 100 * 1024 * 1024, // Start with 100 MB/s
			AverageLatency:   100,               // Start with 100ms
			CPUBaseline:      50,                // Start with 50%
			MemoryBaseline:   50,                // Start with 50%
			DiskBaseline:     50,                // Start with 50%
			UpdatedAt:        time.Now(),
		},
	}

	if err := bm.loadBaseline(); err != nil {
		// If loading fails, we'll use the default values above
		bm.saveBaseline() // Save the defaults for next time
	}

	go bm.periodicUpdate()
	return bm
}

func (bm *BaselineMonitor) AddMetrics(metrics models.Metrics) {
	bm.mutex.Lock()
	defer bm.mutex.Unlock()

	bm.samples = append(bm.samples, metrics)
	if len(bm.samples) > bm.sampleSize {
		bm.samples = bm.samples[1:]
	}
}

func (bm *BaselineMonitor) GetBaseline() BaselineMetrics {
	bm.mutex.RLock()
	defer bm.mutex.RUnlock()
	return bm.baseline
}

func (bm *BaselineMonitor) updateBaseline() {
	bm.mutex.Lock()
	defer bm.mutex.Unlock()

	if len(bm.samples) < bm.sampleSize/2 {
		return // Not enough samples
	}

	var totals BaselineMetrics
	count := float64(len(bm.samples))

	for _, m := range bm.samples {
		totals.AverageBandwidth += float64(m.BytesSent+m.BytesReceived) / (1024 * 1024) // MB/s
		totals.AverageLatency += m.Latency
		totals.CPUBaseline += m.CPUUsage
		totals.MemoryBaseline += m.MemoryUsage
		totals.DiskBaseline += m.DiskUsage
		totals.PacketsBaseline += float64(m.PacketsSent + m.PacketsRecv)
	}

	bm.baseline = BaselineMetrics{
		AverageBandwidth: totals.AverageBandwidth / count,
		AverageLatency:   totals.AverageLatency / count,
		CPUBaseline:      totals.CPUBaseline / count,
		MemoryBaseline:   totals.MemoryBaseline / count,
		DiskBaseline:     totals.DiskBaseline / count,
		PacketsBaseline:  totals.PacketsBaseline / count,
		UpdatedAt:        time.Now(),
	}

	bm.saveBaseline()
}

func (bm *BaselineMonitor) periodicUpdate() {
	ticker := time.NewTicker(bm.updatePeriod)
	defer ticker.Stop()

	for range ticker.C {
		bm.updateBaseline()
	}
}

func (bm *BaselineMonitor) saveBaseline() {
	data, err := json.MarshalIndent(bm.baseline, "", "  ")
	if err != nil {
		return
	}
	os.WriteFile(bm.baselinePath, data, 0644)
}

func (bm *BaselineMonitor) loadBaseline() error {
	data, err := os.ReadFile(bm.baselinePath)
	if err != nil {
		return err
	}
	return json.Unmarshal(data, &bm.baseline)
}

// DetectAnomalies checks current metrics against baseline
func (bm *BaselineMonitor) DetectAnomalies(metrics models.Metrics) []models.Alert {
	bm.mutex.Lock()
	defer bm.mutex.Unlock()

	if bm.lastAlerts == nil {
		bm.lastAlerts = make(map[string]time.Time)
	}

	baseline := bm.baseline
	var alerts []models.Alert
	now := time.Now()

	// Helper function to check alert throttling
	canSendAlert := func(alertType string) bool {
		lastSent, exists := bm.lastAlerts[alertType]
		if !exists || now.Sub(lastSent) > bm.alertThreshold {
			bm.lastAlerts[alertType] = now
			return true
		}
		return false
	}

	// Bandwidth anomaly (with better thresholds)
	currentBandwidth := float64(metrics.BytesSent+metrics.BytesReceived) / (1024 * 1024)
	if currentBandwidth > baseline.AverageBandwidth*2 && canSendAlert("bandwidth") {
		alerts = append(alerts, models.Alert{
			Severity: "warning",
			Description: fmt.Sprintf("Bandwidth usage %.2f MB/s exceeds baseline %.2f MB/s",
				currentBandwidth, baseline.AverageBandwidth),
			Recommended: "Investigate potential network congestion or unusual traffic patterns",
		})
	}

	// Latency anomaly detection
	if metrics.Latency > baseline.AverageLatency*1.5 {
		alerts = append(alerts, models.Alert{
			Severity:    "warning",
			Description: "Network latency above normal levels",
			Recommended: "Check network connectivity and routing",
		})
	}

	// CPU usage anomaly
	if metrics.CPUUsage > baseline.CPUBaseline*1.8 {
		alerts = append(alerts, models.Alert{
			Severity:    "critical",
			Description: "CPU usage significantly elevated",
			Recommended: "Investigate high CPU processes and potential resource constraints",
		})
	}

	// Memory usage anomaly
	if metrics.MemoryUsage > baseline.MemoryBaseline*1.5 {
		alerts = append(alerts, models.Alert{
			Severity:    "warning",
			Description: "Memory usage above baseline",
			Recommended: "Check for memory leaks and high memory consumers",
		})
	}

	return alerts
}
