package terrain

import (
	"fmt"
	"math"

	"github.com/Evarest-ke/healthnetai/models"
)



type TerrainService struct {
	// Cache terrain data for Kisumu region
	elevationData map[string]float64
}

func NewTerrainService() *TerrainService {
	return &TerrainService{
		elevationData: loadKisumuElevationData(),
	}
}

// CalculateTerrainFactor determines signal propagation characteristics
func (s *TerrainService) CalculateTerrainFactor(src, dst models.GeoPoint) float64 {
	// Get elevation profiles
	srcElev := s.getElevation(src)
	dstElev := s.getElevation(dst)

	// Calculate Fresnel zone and terrain clearance
	distance := calculateDistance(src, dst)
	fresnelRadius := calculateFresnelRadius(distance)

	// Simplified terrain factor based on elevation differential
	elevDiff := math.Abs(srcElev - dstElev)
	terrainFactor := 1.0 - (elevDiff / 100.0) // Normalize to 0-1 range

	// Adjust for Fresnel zone clearance
	if elevDiff < fresnelRadius {
		terrainFactor *= 0.8 // Reduce factor for potential interference
	}

	return math.Max(0.1, terrainFactor) // Minimum factor of 0.1
}

// Mock elevation data for Kisumu region
func loadKisumuElevationData() map[string]float64 {
	return map[string]float64{
		"ahero-sub":    1200, // meters above sea level
		"kombewa-dist": 1150,
		"lumumba-hc":   1180,
	}
}

func (s *TerrainService) getElevation(point models.GeoPoint) float64 {
	// TODO: Implement actual Sentinel-2 DEM data retrieval
	// For now, return mock elevation data
	key := fmt.Sprintf("%.4f,%.4f", point.Latitude, point.Longitude)
	if elev, ok := s.elevationData[key]; ok {
		return elev
	}
	return 1200 // Default elevation for Kisumu area
}

// calculateDistance returns distance in kilometers between two points
func calculateDistance(p1, p2 models.GeoPoint) float64 {
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

func calculateFresnelRadius(distance float64) float64 {
	frequency := 5.8 // GHz (typical WiFi frequency)
	return 8.657 * math.Sqrt(distance/(4*frequency))
}
