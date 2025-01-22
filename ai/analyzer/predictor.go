package analyzer

import (
	"fmt"
	"math"
	"time"

	"github.com/Evarest-ke/healthnetai/models"
)

type Predictor struct {
	historicalData []models.Metrics
	windowSize     int
}

func NewPredictor(windowSize int) *Predictor {
	return &Predictor{
		historicalData: make([]models.Metrics, 0),
		windowSize:     windowSize,
	}
}

// AddMetrics adds new metrics to the historical data
func (p *Predictor) AddMetrics(metrics models.Metrics) {
	p.historicalData = append(p.historicalData, metrics)
	if len(p.historicalData) > p.windowSize {
		p.historicalData = p.historicalData[1:]
	}
}

// PredictNextHour predicts metrics for the next hour
func (p *Predictor) PredictNextHour() ([]models.Prediction, error) {
	if len(p.historicalData) < 2 {
		return nil, fmt.Errorf("insufficient historical data")
	}

	predictions := make([]models.Prediction, 0)

	// Predict bandwidth usage
	bandwidthPred := p.predictMetric(func(m models.Metrics) float64 {
		return float64(m.BytesSent + m.BytesReceived)
	})
	predictions = append(predictions, models.Prediction{
		Timestamp:  time.Now().Add(time.Hour),
		Metric:     "bandwidth",
		Value:      bandwidthPred,
		Confidence: p.calculateConfidence(),
	})

	// Predict latency
	latencyPred := p.predictMetric(func(m models.Metrics) float64 {
		return m.Latency
	})
	predictions = append(predictions, models.Prediction{
		Timestamp:  time.Now().Add(time.Hour),
		Metric:     "latency",
		Value:      latencyPred,
		Confidence: p.calculateConfidence(),
	})

	return predictions, nil
}

// predictMetric uses simple linear regression for prediction
func (p *Predictor) predictMetric(getter func(models.Metrics) float64) float64 {
	if len(p.historicalData) < 2 {
		return 0.0
	}

	// Calculate moving average
	var sum float64
	for _, m := range p.historicalData {
		sum += getter(m)
	}
	average := sum / float64(len(p.historicalData))

	// Use linear regression for trend
	prediction := p.calculatePrediction(getter)

	// Blend prediction with moving average
	blendedPrediction := (prediction + average) / 2

	// Apply reasonable bounds
	switch {
	case getter(p.historicalData[0]) > 1000000: // Bandwidth
		return math.Min(blendedPrediction, 10*1024*1024*1024) // Max 10 GB/s
	case getter(p.historicalData[0]) < 1000: // Latency
		return math.Min(blendedPrediction, 1000) // Max 1000ms
	default:
		return blendedPrediction
	}
}

func (p *Predictor) linearRegression(x, y []float64) (float64, float64) {
	n := float64(len(x))
	if n < 2 {
		return 0, 0
	}

	sumX, sumY := 0.0, 0.0
	sumXY, sumXX := 0.0, 0.0

	for i := 0; i < len(x); i++ {
		sumX += x[i]
		sumY += y[i]
		sumXY += x[i] * y[i]
		sumXX += x[i] * x[i]
	}

	// Avoid division by zero
	denominator := n*sumXX - sumX*sumX
	if denominator == 0 {
		return 0, sumY / n
	}

	slope := (n*sumXY - sumX*sumY) / denominator
	intercept := (sumY - slope*sumX) / n

	return slope, intercept
}

func (p *Predictor) calculateConfidence() float64 {
	if len(p.historicalData) < 5 {
		return 0.5 // Return 50% confidence when insufficient data
	}

	// Get predictions and actuals
	predictions := make([]float64, len(p.historicalData))
	actuals := make([]float64, len(p.historicalData))

	for i, metrics := range p.historicalData {
		actuals[i] = float64(metrics.BytesSent + metrics.BytesReceived)
		predictions[i] = p.calculatePrediction(func(m models.Metrics) float64 {
			return float64(m.BytesSent + m.BytesReceived)
		})
	}

	// Calculate R-squared
	rSquared := calculateRSquared(predictions, actuals)
	if math.IsNaN(rSquared) {
		return 0.5 // Return 50% if R-squared calculation fails
	}

	return math.Max(math.Min(rSquared, 1.0), 0.1)
}

func (p *Predictor) calculateVariance() float64 {
	if len(p.historicalData) < 2 {
		return 0.0
	}

	var sum float64
	var sumSquares float64

	for _, metrics := range p.historicalData {
		value := float64(metrics.BytesSent + metrics.BytesReceived)
		sum += value
		sumSquares += value * value
	}

	n := float64(len(p.historicalData))
	variance := (sumSquares - (sum*sum)/n) / (n - 1)

	return variance
}

func calculateRSquared(predictions, actuals []float64) float64 {
	if len(predictions) != len(actuals) || len(predictions) < 2 {
		return 0.0
	}

	var sumPredictions, sumActuals, sumPredictedSquares, sumActualSquares, sumPredictedActuals float64

	for i := 0; i < len(predictions); i++ {
		sumPredictions += predictions[i]
		sumActuals += actuals[i]
		sumPredictedSquares += predictions[i] * predictions[i]
		sumActualSquares += actuals[i] * actuals[i]
		sumPredictedActuals += predictions[i] * actuals[i]
	}

	n := float64(len(predictions))

	// Avoid division by zero
	if n == 0 {
		return 0.0
	}

	meanPredicted := sumPredictions / n
	meanActual := sumActuals / n

	variancePredicted := sumPredictedSquares/n - meanPredicted*meanPredicted
	varianceActual := sumActualSquares/n - meanActual*meanActual

	// Avoid division by zero
	if variancePredicted == 0 || varianceActual == 0 {
		return 0.0
	}

	covariance := sumPredictedActuals/n - meanPredicted*meanActual
	rSquared := math.Pow(covariance/math.Sqrt(variancePredicted*varianceActual), 2)

	return math.Max(math.Min(rSquared, 1.0), 0.0) // Ensure between 0 and 1
}

func (p *Predictor) calculatePrediction(getter func(models.Metrics) float64) float64 {
	x := make([]float64, len(p.historicalData))
	y := make([]float64, len(p.historicalData))

	for i, metrics := range p.historicalData {
		x[i] = float64(i)
		y[i] = getter(metrics)
	}

	// Calculate linear regression
	slope, intercept := p.linearRegression(x, y)

	// Predict next value
	nextX := float64(len(x))
	return slope*nextX + intercept
}
