package kisumu

import (
	"errors"
	"fmt"
	"log"
	"math"
	"sync"
	"time"

	"github.com/Evarest-ke/healthnetai/models"
	"github.com/Evarest-ke/healthnetai/services/healthsites"
	"github.com/Evarest-ke/healthnetai/services/terrain"
)

// KisumuClinics defines the target facilities
var KisumuClinics = []models.Clinic{
	{
		ID:   "ahero-sub",
		Name: "Ahero Sub-County Hospital",
		Coordinates: models.GeoPoint{
			Latitude:  -0.1833,
			Longitude: 34.9167,
		},
		BedCount: 50,
	},
	{
		ID:   "kombewa-dist",
		Name: "Kombewa District Hospital",
		Coordinates: models.GeoPoint{
			Latitude:  -0.0964,
			Longitude: 34.7286,
		},
		BedCount: 100,
	},
	{
		ID:   "lumumba-hc",
		Name: "Lumumba Health Centre",
		Coordinates: models.GeoPoint{
			Latitude:  -0.0915,
			Longitude: 34.7689,
		},
		BedCount: 30,
	},
}

const (
	modeDev  = "dev"
	modeProd = "prod"
)

type NetworkService struct {
	clinics     map[string]models.Clinic
	healthsites *healthsites.Client
	terrain     *terrain.TerrainService
	mu          sync.RWMutex
	lastUpdate  time.Time
	mode        string // "dev" or "prod"
	apiKey      string
}

// NewNetworkService creates a new service - pass empty apiKey for dev mode
func NewNetworkService(apiKey string) *NetworkService {
	mode := modeProd
	if apiKey == "" || apiKey == "test-key" {
		mode = modeDev
	}

	ns := &NetworkService{
		clinics:     make(map[string]models.Clinic),
		healthsites: healthsites.NewClient(apiKey),
		terrain:     terrain.NewTerrainService(),
		mode:        mode,
		apiKey:      apiKey,
	}

	// Initialize with static data
	for _, clinic := range KisumuClinics {
		ns.clinics[clinic.ID] = clinic
	}

	// Only start background refresh in prod mode
	if mode == modeProd && apiKey != "" && apiKey != "test-key" {
		go ns.refreshFacilities()
	}

	return ns
}

func (s *NetworkService) refreshFacilities() {
	ticker := time.NewTicker(15 * time.Minute)
	defer ticker.Stop()

	for {
		if err := s.updateFacilities(); err != nil {
			log.Printf("Failed to update facilities: %v", err)
		}
		<-ticker.C
	}
}

func (s *NetworkService) updateFacilities() error {
	if s.healthsites == nil {
		return fmt.Errorf("healthsites client not initialized")
	}

	facilities, err := s.healthsites.GetKisumuFacilities()
	if err != nil {
		return fmt.Errorf("failed to get facilities: %v", err)
	}

	s.mu.Lock()
	defer s.mu.Unlock()

	// Update existing clinics with new data
	for _, facility := range facilities {
		if existing, ok := s.clinics[facility.ID]; ok {
			// Preserve existing network status and outage info
			facility.NetworkStatus = existing.NetworkStatus
			facility.LastOutage = existing.LastOutage
			facility.EmergencyMode = existing.EmergencyMode
		}
		s.clinics[facility.ID] = facility
	}

	s.lastUpdate = time.Now()
	return nil
}

// CalculateDistance returns distance in kilometers between two points
func (s *NetworkService) CalculateDistance(p1, p2 models.GeoPoint) float64 {
	const R = 6371 // Earth's radius in km

	lat1 := p1.Latitude * math.Pi / 180
	lat2 := p2.Latitude * math.Pi / 180
	dLat := (p2.Latitude - p1.Latitude) * math.Pi / 180
	dLon := (p2.Longitude - p1.Longitude) * math.Pi / 180

	a := math.Sin(dLat/2)*math.Sin(dLat/2) +
		math.Cos(lat1)*math.Cos(lat2)*
			math.Sin(dLon/2)*math.Sin(dLon/2)
	c := 2 * math.Atan2(math.Sqrt(a), math.Sqrt(1-a))

	return R * c
}

// CheckEmergencyBandwidthSharing determines if clinics can share bandwidth
func (s *NetworkService) CheckEmergencyBandwidthSharing(sourceID, targetID string) (bool, float64) {
	source, ok := s.clinics[sourceID]
	if !ok {
		return false, 0
	}

	target, ok := s.clinics[targetID]
	if !ok {
		return false, 0
	}

	distance := s.CalculateDistance(source.Coordinates, target.Coordinates)

	// Check if within 15km radius
	if distance <= 15 {
		// Calculate potential bandwidth based on distance
		// More bandwidth available for closer facilities
		bandwidthFactor := 1 - (distance / 15)
		return true, bandwidthFactor
	}

	return false, 0
}

func (s *NetworkService) GetClinicMetrics(clinicID string) (models.Metrics, error) {
	s.mu.RLock()
	clinic, ok := s.clinics[clinicID]
	s.mu.RUnlock()

	if !ok {
		return models.Metrics{}, errors.New("clinic not found")
	}

	// Calculate terrain factors for nearby clinics
	var terrainFactor float64 = 1.0
	for _, other := range s.clinics {
		if other.ID != clinicID {
			factor := s.terrain.CalculateTerrainFactor(
				clinic.Coordinates,
				other.Coordinates,
			)
			terrainFactor *= factor
		}
	}

	// Get real-time metrics for the clinic
	metrics := models.Metrics{
		ClinicID:      clinicID,
		Timestamp:     time.Now(),
		Coordinates:   clinic.Coordinates,
		TerrainFactor: terrainFactor,
		// Add simulated metrics for now
		CPUUsage:      float64(50 + time.Now().Second()%20),
		MemoryUsage:   float64(60 + time.Now().Second()%15),
		DiskUsage:     float64(40 + time.Now().Second()%10),
		BytesSent:     uint64(1024 * (100 + time.Now().Second())),
		BytesReceived: uint64(1024 * (150 + time.Now().Second())),
		Latency:       float64(20 + time.Now().Second()%10),
	}

	return metrics, nil
}

func (s *NetworkService) AnalyzeConnectivity(clinicID string) (*models.ConnectivityAnalysis, error) {
	return &models.ConnectivityAnalysis{
		TrafficPatterns: []string{"Normal", "High", "Low"},
		PeakHours:       []string{"8:00", "12:00", "16:00"},
		Bottlenecks:     []string{"Bandwidth limitation", "High latency"},
		Recommendations: []string{
			"Increase bandwidth during peak hours",
			"Optimize routing for better latency",
		},
	}, nil
}
