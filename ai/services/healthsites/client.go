package healthsites

import (
	"encoding/json"
	"fmt"
	"io"
	"log"
	"math/rand"
	"net/http"
	"strings"
	"sync"
	"time"

	"github.com/Evarest-ke/healthnetai/models"
)

const (
	baseURL = "https://healthsites.io/api/v2"
)

type Client struct {
	httpClient *http.Client
	apiKey     string
}

type HealthSite struct {
	Properties struct {
		Name         string    `json:"name"`
		FacilityType string    `json:"facility_type"`
		LastUpdated  time.Time `json:"last_updated"`
		Amenities    []string  `json:"amenities"`
		BedCount     int       `json:"bed_count"`
	} `json:"properties"`
	Geometry struct {
		Coordinates []float64 `json:"coordinates"`
	} `json:"geometry"`
}

type HealthSitesResponse struct {
	Features []HealthSite `json:"features"`
}

type NetworkCondition struct {
	status      string
	lastChecked time.Time
	uptime      float64
}

var (
	networkConditions = make(map[string]*NetworkCondition)
	statusMutex       sync.RWMutex
)

func init() {
	rand.Seed(time.Now().UnixNano())
}

func NewClient(apiKey string) *Client {
	return &Client{
		httpClient: &http.Client{
			Timeout: 10 * time.Second,
		},
		apiKey: apiKey,
	}
}

func (c *Client) getNetworkStatus(facilityID string) string {
	statusMutex.Lock()
	defer statusMutex.Unlock()

	condition, exists := networkConditions[facilityID]
	now := time.Now()

	// Initialize or update if older than 30 seconds
	if !exists || now.Sub(condition.lastChecked) > 30*time.Second {
		uptime := 0.95 + rand.Float64()*0.05 // 95-100% uptime
		status := "online"
		if rand.Float64() > uptime {
			status = "offline"
		}

		networkConditions[facilityID] = &NetworkCondition{
			status:      status,
			lastChecked: now,
			uptime:      uptime,
		}
		return status
	}

	return condition.status
}

// GetKisumuFacilities retrieves healthcare facilities in Kisumu County
func (c *Client) GetKisumuFacilities() ([]models.Clinic, error) {
	// Return mock data if no API key
	if c.apiKey == "" || c.apiKey == "test-key" {
		return []models.Clinic{
			{
				ID:   "kisumu-county",
				Name: "Kisumu County Hospital",
				Coordinates: models.GeoPoint{
					Latitude:  -0.0917,
					Longitude: 34.7575,
				},
				NetworkStatus: "online",
				LastOutage:    time.Time{},
				EmergencyMode: false,
				BedCount:      200,
			},
			// Add more mock clinics...
		}, nil
	}

	url := fmt.Sprintf("%s/facilities/facilities.json?api-key=%s&page=1&format=geojson&country=KE", baseURL, c.apiKey)

	resp, err := http.Get(url)
	if err != nil {
		return nil, fmt.Errorf("failed to get facilities: %w", err)
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, fmt.Errorf("failed to read response: %w", err)
	}

	// Log response for debugging
	log.Printf("API Response: %s", string(body))

	// Check if response is an error message
	if !json.Valid(body) || strings.HasPrefix(string(body), "{\"error\":") {
		return nil, fmt.Errorf("API error: %s", string(body))
	}

	var response struct {
		Features []struct {
			Properties struct {
				Name string `json:"name"`
				ID   string `json:"id"`
			} `json:"properties"`
			Geometry struct {
				Coordinates []float64 `json:"coordinates"`
			} `json:"geometry"`
		} `json:"features"`
	}

	if err := json.Unmarshal(body, &response); err != nil {
		return nil, fmt.Errorf("failed to decode response: %w", err)
	}

	clinics := make([]models.Clinic, 0)
	for _, result := range response.Features {
		clinic := models.Clinic{
			ID:   result.Properties.ID,
			Name: result.Properties.Name,
			Coordinates: models.GeoPoint{
				Latitude:  result.Geometry.Coordinates[1],
				Longitude: result.Geometry.Coordinates[0],
			},
			NetworkStatus: c.getNetworkStatus(result.Properties.ID),
			LastOutage:    time.Time{},
			EmergencyMode: false,
		}
		clinics = append(clinics, clinic)
	}

	return clinics, nil
}
