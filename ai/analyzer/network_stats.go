package analyzer

import (
	"context"
	"fmt"
	"regexp"
	"strconv"
	"strings"

	"github.com/Evarest-ke/healthnetai/models"
	"github.com/google/generative-ai-go/genai"
	"google.golang.org/api/option"
)

type NetworkStatsAnalyzer struct {
	model genai.GenerativeModel
}

func NewNetworkStatsAnalyzer(apiKey string) (*NetworkStatsAnalyzer, error) {
	ctx := context.Background()
	client, err := genai.NewClient(ctx, option.WithAPIKey(apiKey))
	if err != nil {
		return nil, fmt.Errorf("failed to create Gemini client: %v", err)
	}
	return &NetworkStatsAnalyzer{
		model: *client.GenerativeModel("gemini-pro"),
	}, nil
}

func (a *NetworkStatsAnalyzer) AnalyzeNetworkStats(metrics []models.Metrics, clinics []models.Clinic) ([]map[string]interface{}, error) {
	ctx := context.Background()

	// Prepare network data summary
	activeCount := 0
	totalBandwidth := float64(0)
	activeShares := 0

	for _, clinic := range clinics {
		if clinic.NetworkStatus == "online" {
			activeCount++
		}
		if clinic.EmergencyMode {
			activeShares++
		}
	}

	// Calculate average bandwidth from metrics
	for _, metric := range metrics {
		totalBandwidth += float64(metric.BytesReceived+metric.BytesSent) / 1024 / 1024 // Convert to MB
	}
	avgBandwidth := totalBandwidth / float64(len(metrics))

	// Prepare prompt for AI analysis
	prompt := fmt.Sprintf(`Analyze this healthcare network data and generate key statistics:
	- Active facilities: %d out of %d
	- Average bandwidth usage: %.2f MB
	- Active bandwidth shares: %d
	- Recent network metrics count: %d

	Generate 4 key network statistics including:
	1. Network uptime percentage
	2. Active facilities ratio
	3. Bandwidth sharing status
	4. Overall network load

	Format each stat with a title, value, trend (up/down/stable), and change value.
	`, activeCount, len(clinics), avgBandwidth, activeShares, len(metrics))

	response, err := a.model.GenerateContent(ctx, genai.Text(prompt))
	if err != nil {
		return nil, fmt.Errorf("failed to generate analysis: %v", err)
	}

	// Calculate previous network uptime from metrics
	var previousUptime float64
	if len(metrics) > 1 {
		onlineCount := 0
		for _, metric := range metrics[:len(metrics)-1] {
			clinic := findClinicByID(clinics, metric.ClinicID)
			if clinic != nil && clinic.NetworkStatus == "online" {
				onlineCount++
			}
		}
		previousUptime = float64(onlineCount) / float64(len(metrics)-1) * 100
	}

	// Parse AI response and format stats
	networkUptimeValue := "N/A"
	networkUptimeFloat := float64(0)
	if len(response.Candidates) > 0 {
		content := response.Candidates[0].Content
		var textResponse string

		// Iterate over the Parts slice to extract text content
		for _, part := range content.Parts {
			if text, ok := part.(genai.Text); ok {
				textResponse += string(text)
			}
		}

		// Parse the network uptime value using string manipulation
		lines := strings.Split(textResponse, "\n")
		for _, line := range lines {
			line = strings.TrimSpace(line)
			if strings.Contains(strings.ToLower(line), "network uptime") {
				// Extract the percentage value using regex
				re := regexp.MustCompile(`(\d+\.?\d*)%`)
				if matches := re.FindStringSubmatch(line); len(matches) > 1 {
					networkUptimeValue = matches[1] + "%"
					break
				}
			}
		}

		// Convert networkUptimeValue to float for comparison
		re := regexp.MustCompile(`(\d+\.?\d*)%`)
		if matches := re.FindStringSubmatch(networkUptimeValue); len(matches) > 1 {
			networkUptimeFloat, _ = strconv.ParseFloat(matches[1], 64)
		}
	}

	// Calculate uptime change
	uptimeChange := networkUptimeFloat - previousUptime
	uptimeChangeStr := fmt.Sprintf("%+.1f%%", uptimeChange)
	uptimeTrend := "stable"
	if uptimeChange > 0 {
		uptimeTrend = "up"
	} else if uptimeChange < 0 {
		uptimeTrend = "down"
	}

	stats := []map[string]interface{}{
		{
			"title":  "Network Uptime",
			"value":  networkUptimeValue,
			"icon":   "Signal",
			"trend":  uptimeTrend,
			"change": uptimeChangeStr,
		},
		{
			"title":  "Active Facilities",
			"value":  fmt.Sprintf("%d/%d", activeCount, len(clinics)),
			"icon":   "Server",
			"trend":  getActiveFacilitiesTrend(activeCount, len(clinics)),
			"change": fmt.Sprintf("%+d", activeCount-len(clinics)/2),
		},
		{
			"title":  "Active Shares",
			"value":  fmt.Sprintf("%d", activeShares),
			"icon":   "Share2",
			"trend":  getSharesTrend(activeShares),
			"change": fmt.Sprintf("+%d", activeShares),
		},
		{
			"title":  "Network Load",
			"value":  fmt.Sprintf("%.1f%%", avgBandwidth/100),
			"icon":   "Activity",
			"trend":  getLoadTrend(avgBandwidth),
			"change": fmt.Sprintf("%+.1f Mbps", avgBandwidth-50),
		},
	}

	return stats, nil
}

func getActiveFacilitiesTrend(active, total int) string {
	ratio := float64(active) / float64(total)
	if ratio > 0.8 {
		return "up"
	} else if ratio < 0.6 {
		return "down"
	}
	return "stable"
}

func getSharesTrend(shares int) string {
	if shares > 2 {
		return "up"
	} else if shares == 0 {
		return "down"
	}
	return "stable"
}

func getLoadTrend(load float64) string {
	if load > 75 {
		return "up"
	} else if load < 25 {
		return "down"
	}
	return "stable"
}

func findClinicByID(clinics []models.Clinic, clinicID string) *models.Clinic {
	for i := range clinics {
		if clinics[i].ID == clinicID {
			return &clinics[i]
		}
	}
	return nil
}
