package terrain

import (
	"testing"

	"github.com/Evarest-ke/healthnetai/models"
)

func TestCalculateTerrainFactor(t *testing.T) {
	service := NewTerrainService()

	tests := []struct {
		name    string
		src     models.GeoPoint
		dst     models.GeoPoint
		wantMin float64
		wantMax float64
	}{
		{
			name: "Ahero to Kombewa",
			src: models.GeoPoint{
				Latitude:  -0.1833,
				Longitude: 34.9167,
			},
			dst: models.GeoPoint{
				Latitude:  -0.0964,
				Longitude: 34.7286,
			},
			wantMin: 0.3,
			wantMax: 0.9,
		},
		{
			name: "Kombewa to Lumumba",
			src: models.GeoPoint{
				Latitude:  -0.0964,
				Longitude: 34.7286,
			},
			dst: models.GeoPoint{
				Latitude:  -0.0915,
				Longitude: 34.7689,
			},
			wantMin: 0.5,
			wantMax: 1.0,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			factor := service.CalculateTerrainFactor(tt.src, tt.dst)
			if factor < tt.wantMin || factor > tt.wantMax {
				t.Errorf("CalculateTerrainFactor() = %v, want between %v and %v",
					factor, tt.wantMin, tt.wantMax)
			}
		})
	}
}

func TestCalculateDistance(t *testing.T) {
	tests := []struct {
		name      string
		p1        models.GeoPoint
		p2        models.GeoPoint
		want      float64
		tolerance float64
	}{
		{
			name: "Ahero to Kombewa",
			p1: models.GeoPoint{
				Latitude:  -0.1833,
				Longitude: 34.9167,
			},
			p2: models.GeoPoint{
				Latitude:  -0.0964,
				Longitude: 34.7286,
			},
			want:      22.5, // km
			tolerance: 0.5,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got := calculateDistance(tt.p1, tt.p2)
			diff := got - tt.want
			if diff < -tt.tolerance || diff > tt.tolerance {
				t.Errorf("calculateDistance() = %v, want %v ± %v",
					got, tt.want, tt.tolerance)
			}
		})
	}
}
