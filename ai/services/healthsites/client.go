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
	baseURL = "https://healthsites.io/api/v3"
)

type Client struct {
	httpClient *http.Client
	apiKey     string
}

type HealthSite struct {
	Attributes struct {
		Amenity            string  `json:"amenity"`
		Healthcare         string  `json:"healthcare"`
		Name               string  `json:"name"`
		OperatorType       string  `json:"operator_type"`
		OperationalStatus  string  `json:"operational_status"`
		OpeningHours       string  `json:"opening_hours"`
		Beds               string  `json:"beds"`
		AddrCity           string  `json:"addr_city"`
		ChangesetID        float64 `json:"changeset_id"`
		ChangesetVersion   float64 `json:"changeset_version"`
		ChangesetTimestamp string  `json:"changeset_timestamp"`
		ChangesetUser      string  `json:"changeset_user"`
		UUID               string  `json:"uuid"`
	} `json:"attributes"`
	Centroid struct {
		Type        string    `json:"type"`
		Coordinates []float64 `json:"coordinates"`
	} `json:"centroid"`
	OSMID        int64   `json:"osm_id"`
	OSMType      string  `json:"osm_type"`
	Completeness float64 `json:"completeness"`
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
	// Mock data to return when no facilities are found or using test key
	mockClinics := []models.Clinic{
		{
			ID:   "kch-001",
			Name: "Kisumu County Hospital",
			Coordinates: models.GeoPoint{
				Latitude:  -0.0917,
				Longitude: 34.7575,
			},
			NetworkStatus: "online",
			LastOutage:    time.Time{},
			EmergencyMode: false,
		},
		{
			ID:   "jootrh-001",
			Name: "Jaramogi Oginga Odinga Teaching & Referral Hospital",
			Coordinates: models.GeoPoint{
				Latitude:  -0.0915,
				Longitude: 34.7689,
			},
			NetworkStatus: "online",
			LastOutage:    time.Time{},
			EmergencyMode: false,
		},
		{
			ID:   "kisumu-sub",
			Name: "Kisumu Sub-County Hospital",
			Coordinates: models.GeoPoint{
				Latitude:  -0.1021,
				Longitude: 34.7519,
			},
			NetworkStatus: "online",
			LastOutage:    time.Time{},
			EmergencyMode: false,
		},
		{
			ID:   "nyahera-hc",
			Name: "Nyahera Health Centre",
			Coordinates: models.GeoPoint{
				Latitude:  -0.0726,
				Longitude: 34.7097,
			},
			NetworkStatus: "online",
			LastOutage:    time.Time{},
			EmergencyMode: false,
		},
	}

	// Return mock data if no API key or using test key
	if c.apiKey == "" || c.apiKey == "test-key" {
		return mockClinics, nil
	}

	url := fmt.Sprintf("%s/facilities/?api-key=%s&page=1&country=Kenya", baseURL, c.apiKey)

	resp, err := http.Get(url)
	if err != nil {
		return nil, fmt.Errorf("failed to get facilities: %w", err)
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, fmt.Errorf("failed to read response: %w", err)
	}

	// Print the raw response for debugging
	// log.Printf("Raw API response: %s", string(body))

	// Check if response is an error message
	if !json.Valid(body) || strings.HasPrefix(string(body), "{\"error\":") {
		return nil, fmt.Errorf("API error: %s", string(body))
	}

	// First, unmarshal into a map to inspect the structure
	var rawResponse map[string]interface{}
	if err := json.Unmarshal(body, &rawResponse); err != nil {
		return nil, fmt.Errorf("failed to decode raw response: %w", err)
	}

	// Convert the response to JSON bytes
	facilitiesJSON, err := json.Marshal(rawResponse)
	if err != nil {
		return nil, fmt.Errorf("failed to marshal facilities: %w", err)
	}

	var healthSites []HealthSite
	if err := json.Unmarshal(facilitiesJSON, &healthSites); err != nil {
		// Try unmarshaling as a single object
		var singleSite HealthSite
		if err := json.Unmarshal(facilitiesJSON, &singleSite); err != nil {
			return nil, fmt.Errorf("failed to decode response as array or single object: %w", err)
		}
		healthSites = []HealthSite{singleSite}
	}

	clinics := make([]models.Clinic, 0)
	for _, site := range healthSites {
		if len(site.Centroid.Coordinates) < 2 {
			log.Printf("Skipping site with insufficient coordinates: %+v", site)
			continue
		}
		clinic := models.Clinic{
			ID:   site.Attributes.UUID,
			Name: site.Attributes.Name,
			Coordinates: models.GeoPoint{
				Latitude:  site.Centroid.Coordinates[1],
				Longitude: site.Centroid.Coordinates[0],
			},
			NetworkStatus: c.getNetworkStatus(site.Attributes.UUID),
			LastOutage:    time.Time{},
			EmergencyMode: false,
		}
		clinics = append(clinics, clinic)
	}

	// If no clinics were found, return mock data
	if len(clinics) == 0 {
		log.Printf("No facilities found, returning mock data")
		return mockClinics, nil
	}

	// log.Printf("Retrieved %d clinics from Healthsites API:", len(clinics))
	// for _, clinic := range clinics {
	// 	log.Printf("- %s (%s) at %.4f, %.4f",
	// 		clinic.Name,
	// 		clinic.ID,
	// 		clinic.Coordinates.Latitude,
	// 		clinic.Coordinates.Longitude)
	// }
	return clinics, nil
}
