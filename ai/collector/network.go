package collector

import (
	stdnet "net"
	"sort"
	"time"

	"github.com/Evarest-ke/healthnetai/models"
	"github.com/shirou/gopsutil/v3/cpu"
	psnet "github.com/shirou/gopsutil/v3/net"
)

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
}

type Collector struct {
	interval time.Duration
	metrics  chan models.Metrics
	Baseline *BaselineMonitor
}

func NewCollector(interval time.Duration) *Collector {
	return &Collector{
		interval: interval,
		metrics:  make(chan models.Metrics, 100),
		Baseline: NewBaselineMonitor(100, 1*time.Hour, 1*time.Minute), // Added alert threshold
	}
}

func (c *Collector) Start() chan models.Metrics {
	go func() {
		ticker := time.NewTicker(c.interval)
		defer ticker.Stop()

		for range ticker.C {
			metrics, err := c.collect()
			if err != nil {
				continue
			}
			c.metrics <- metrics
		}
	}()
	return c.metrics
}

func (c *Collector) collect() (models.Metrics, error) {
	metrics, err := c.collectMetrics()
	if err != nil {
		return models.Metrics{}, err
	}

	// Add metrics to baseline monitor
	c.Baseline.AddMetrics(metrics)

	return metrics, nil
}

func (c *Collector) collectMetrics() (models.Metrics, error) {
	// Use gopsutil/net for network metrics
	stats, err := psnet.IOCounters(true)
	if err != nil {
		return models.Metrics{}, err
	}

	cpuPercent, err := cpu.Percent(time.Second, false)
	if err != nil {
		return models.Metrics{}, err
	}

	interfaces, err := psnet.Interfaces()
	if err != nil {
		return models.Metrics{}, err
	}

	var totalBytesSent, totalBytesRecv, totalPacketsSent, totalPacketsRecv uint64
	var ifaceNames []string

	for _, stat := range stats {
		totalBytesSent += stat.BytesSent
		totalBytesRecv += stat.BytesRecv
		totalPacketsSent += stat.PacketsSent
		totalPacketsRecv += stat.PacketsRecv
	}

	for _, iface := range interfaces {
		ifaceNames = append(ifaceNames, iface.Name)
	}

	// Measure latency without passing the unused host parameter
	latency := measureLatency()

	return models.Metrics{
		Timestamp:     time.Now(),
		BytesSent:     totalBytesSent,
		BytesReceived: totalBytesRecv,
		PacketsSent:   totalPacketsSent,
		PacketsRecv:   totalPacketsRecv,
		Latency:       latency,
		Connections:   len(interfaces),
		Interfaces:    ifaceNames,
		CPUUsage:      cpuPercent[0],
	}, nil
}

func measureLatency() float64 {
	hosts := []string{"8.8.8.8:80", "1.1.1.1:80", "google.com:80"}
	var latencies []float64

	for _, h := range hosts {
		if lat := pingHost(h); lat > 0 {
			latencies = append(latencies, lat)
		}
	}

	if len(latencies) == 0 {
		return 1000.0
	}
	return calculateMedian(latencies)
}

func pingHost(host string) float64 {
	start := time.Now()
	conn, err := stdnet.DialTimeout("tcp", host, time.Second)
	if err == nil {
		latency := float64(time.Since(start).Milliseconds())
		conn.Close()
		return latency
	}
	return -1.0
}

func calculateMedian(numbers []float64) float64 {
	n := len(numbers)
	if n == 0 {
		return 0.0
	}

	sorted := make([]float64, n)
	copy(sorted, numbers)
	sort.Float64s(sorted)

	middle := n / 2
	if n%2 == 0 {
		return (sorted[middle-1] + sorted[middle]) / 2.0
	}
	return sorted[middle]
}
