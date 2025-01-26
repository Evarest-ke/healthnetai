package kisumu

import (
	"github.com/Evarest-ke/healthnetai/models"
)

func (s *NetworkService) GetClinics() ([]models.Clinic, error) {
	return KisumuClinics, nil
}
