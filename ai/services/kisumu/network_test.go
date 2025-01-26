package kisumu

import (
	"testing"
)

func TestEmergencyBandwidthSharing(t *testing.T) {
	service := NewNetworkService("test-key")

	tests := []struct {
		name           string
		sourceID       string
		targetID       string
		expectCanShare bool
	}{
		{
			name:           "Ahero to Kombewa (> 15km)",
			sourceID:       "ahero-sub",
			targetID:       "kombewa-dist",
			expectCanShare: false,
		},
		{
			name:           "Kombewa to Lumumba (< 15km)",
			sourceID:       "kombewa-dist",
			targetID:       "lumumba-hc",
			expectCanShare: true,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			canShare, factor := service.CheckEmergencyBandwidthSharing(
				tt.sourceID,
				tt.targetID,
			)
			if canShare != tt.expectCanShare {
				t.Errorf("Expected canShare=%v, got %v with factor %v",
					tt.expectCanShare, canShare, factor)
			}
		})
	}
}

func TestGetClinicMetrics(t *testing.T) {
	service := NewNetworkService("test-key")

	metrics, err := service.GetClinicMetrics("ahero-sub")
	if err != nil {
		t.Fatalf("Failed to get clinic metrics: %v", err)
	}

	if metrics.ClinicID != "ahero-sub" {
		t.Errorf("Expected clinic ID 'ahero-sub', got %s", metrics.ClinicID)
	}

	if metrics.Coordinates.Latitude != -0.1833 {
		t.Errorf("Expected latitude -0.1833, got %f", metrics.Coordinates.Latitude)
	}
}
