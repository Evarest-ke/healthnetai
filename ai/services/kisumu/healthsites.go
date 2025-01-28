package kisumu

import (
	"github.com/Evarest-ke/healthnetai/models"
)

func (s *NetworkService) GetClinics() ([]models.Clinic, error) {
	// Assuming s.healthsites is an instance of healthsites.Client
	clinics, err := s.healthsites.GetKisumuFacilities()
	if err != nil {
		return nil, err
	}
	return clinics, nil
}
