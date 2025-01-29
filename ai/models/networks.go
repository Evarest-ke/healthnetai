package models

type NetworkAnalytics struct {
	BandwidthSharing BandwidthSharing `json:"bandwidthSharing"`
	NetworkLoad      NetworkLoad      `json:"networkLoad"`
	Connections      Connections      `json:"connections"`
}

type BandwidthSharing struct {
	Status       string        `json:"status"`
	ActiveShares []ShareStatus `json:"activeShares"`
}

type ShareStatus struct {
	ID         string  `json:"id"`
	SourceName string  `json:"sourceName"`
	TargetName string  `json:"targetName"`
	Bandwidth  float64 `json:"bandwidth"`
}

type NetworkLoad struct {
	Percentage float64 `json:"percentage"`
	BaseLoad   float64 `json:"baseLoad"`
	Shared     float64 `json:"shared"`
	Available  float64 `json:"available"`
}

type Connections struct {
	Online  int `json:"online"`
	Offline int `json:"offline"`
	Total   int `json:"total"`
}
