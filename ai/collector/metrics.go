// collector/metrics.go
package collector

import (
	"time"

	"github.com/Evarest-ke/healthnetai/models"
	"github.com/shirou/gopsutil/v3/disk"
	"github.com/shirou/gopsutil/v3/mem"
)

// SystemMetrics collects additional system metrics
func (c *Collector) SystemMetrics() (*models.Metrics, error) {
	// Memory stats
	vmStat, err := mem.VirtualMemory()
	if err != nil {
		return nil, err
	}

	// Disk stats
	diskStat, err := disk.Usage("/")
	if err != nil {
		return nil, err
	}

	metrics := &models.Metrics{
		Timestamp: time.Now(),
		// Add memory metrics
		MemoryUsage: vmStat.UsedPercent,
		// Add disk metrics
		DiskUsage: diskStat.UsedPercent,
	}

	return metrics, nil
}

// CalculateAverages calculates average metrics over a time period
func (c *Collector) CalculateAverages(metrics []models.Metrics) models.Metrics {
	if len(metrics) == 0 {
		return models.Metrics{}
	}

	var totals models.Metrics
	count := float64(len(metrics))

	// Get latest system metrics for memory and disk
	sysMetrics, err := c.SystemMetrics()
	if err == nil && sysMetrics != nil {
		totals.MemoryUsage = sysMetrics.MemoryUsage
		totals.DiskUsage = sysMetrics.DiskUsage
	}

	for _, m := range metrics {
		totals.BytesSent += m.BytesSent
		totals.BytesReceived += m.BytesReceived
		totals.PacketsSent += m.PacketsSent
		totals.PacketsRecv += m.PacketsRecv
		totals.Latency += m.Latency
		totals.CPUUsage += m.CPUUsage
	}

	return models.Metrics{
		Timestamp:     time.Now(),
		BytesSent:     uint64(float64(totals.BytesSent) / count),
		BytesReceived: uint64(float64(totals.BytesReceived) / count),
		PacketsSent:   uint64(float64(totals.PacketsSent) / count),
		PacketsRecv:   uint64(float64(totals.PacketsRecv) / count),
		Latency:       totals.Latency / count,
		CPUUsage:      totals.CPUUsage / count,
		MemoryUsage:   totals.MemoryUsage,
		DiskUsage:     totals.DiskUsage,
	}
}
