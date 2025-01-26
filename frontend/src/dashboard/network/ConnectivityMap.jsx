import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Wifi, WifiOff, AlertTriangle, RefreshCw, Share2 } from 'lucide-react';
import axios from 'axios';
import { getFacilityUpdates } from '../../mocks/api/facilities';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Set your Mapbox token
mapboxgl.accessToken = 'pk.eyJ1IjoiYXRob29oIiwiYSI6ImNtMWY2N3prZjJsN3MybHNjMWd3bThzOXcifQ.HNgAHQBkzGdrnuS1MtwYlQ';

// Fix Leaflet default marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

export default function ConnectivityMap({ onFacilitySelect, clinics, realTimeMetrics }) {
  const [map, setMap] = useState(null);
  const [lng] = useState(34.7575); // Kisumu longitude
  const [lat] = useState(-0.0917); // Kisumu latitude
  const [zoom] = useState(13); // Closer zoom for city level
  const [selectedClinic, setSelectedClinic] = useState(null);
  const [sharingMode, setSharingMode] = useState(false);
  const [sharingLines, setSharingLines] = useState([]);

  useEffect(() => {
    console.log('Clinics data in map:', clinics);
  }, [clinics]);

  useEffect(() => {
    if (map && clinics && clinics.length > 0) {
      const bounds = L.latLngBounds(clinics.map(clinic => [
        clinic.coordinates.latitude,
        clinic.coordinates.longitude
      ]));
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [map, clinics]);

  const getMarkerIcon = (status, isSelected) => {
    const color = status === 'online' ? 'bg-green-500' : 'bg-red-500';
    const size = isSelected ? 'w-6 h-6' : 'w-4 h-4';
    const border = isSelected ? 'border-2 border-blue-500' : '';
    
    return L.divIcon({
      className: 'custom-marker',
      html: `<div class="${size} rounded-full ${color} ${border}"></div>`,
      iconSize: isSelected ? [24, 24] : [16, 16],
    });
  };

  const handleClinicClick = (clinic) => {
    if (sharingMode && selectedClinic && selectedClinic.id !== clinic.id) {
      // Initiate bandwidth sharing
      initiateSharing(selectedClinic, clinic);
      setSharingMode(false);
      setSelectedClinic(null);
    } else {
      setSelectedClinic(clinic);
      onFacilitySelect(clinic.id);
    }
  };

  const initiateSharing = async (source, target) => {
    try {
      const response = await fetch('http://localhost:8080/api/network/kisumu/emergency-share', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sourceId: source.id,
          targetId: target.id,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to initiate bandwidth sharing');
      }

      // Add sharing line
      setSharingLines(prev => [...prev, {
        source: [source.coordinates.latitude, source.coordinates.longitude],
        target: [target.coordinates.latitude, target.coordinates.longitude],
        id: `${source.id}-${target.id}`
      }]);

    } catch (error) {
      console.error('Failed to initiate sharing:', error);
      alert('Failed to initiate bandwidth sharing. Please try again.');
    }
  };

  return (
    <div className="w-full h-full relative">
      <MapContainer
        center={[lat, lng]}
        zoom={zoom}
        style={{ height: '100%', width: '100%' }}
        whenCreated={setMap}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />
        {Array.isArray(clinics) && clinics.map((clinic) => (
          clinic?.coordinates?.latitude && clinic?.coordinates?.longitude ? (
            <React.Fragment key={clinic.id}>
              <Marker
                position={[Number(clinic.coordinates.latitude), Number(clinic.coordinates.longitude)]}
                icon={getMarkerIcon(clinic.networkStatus, selectedClinic?.id === clinic.id)}
                eventHandlers={{
                  click: () => handleClinicClick(clinic),
                }}
              >
                <Popup>
                  <div className="p-2">
                    <h3 className="font-semibold">{clinic.name}</h3>
                    <p className="text-sm">
                      Signal Quality: {(clinic.terrainFactor * 100).toFixed(0)}%
                    </p>
                    <p className={`text-sm ${
                      clinic.networkStatus === 'online' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      Status: {clinic.networkStatus}
                    </p>
                    <p className="text-sm">
                      Bed Count: {clinic.bed_count}
                    </p>
                    {selectedClinic?.id === clinic.id && !sharingMode && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSharingMode(true);
                        }}
                        className="mt-2 px-3 py-1 bg-blue-500 text-white rounded-md text-sm flex items-center gap-2"
                      >
                        <Share2 className="w-4 h-4" />
                        Share Bandwidth
                      </button>
                    )}
                  </div>
                </Popup>
              </Marker>
              <Circle
                center={[Number(clinic.coordinates.latitude), Number(clinic.coordinates.longitude)]}
                radius={1500}
                pathOptions={{
                  color: clinic.networkStatus === 'online' ? 'green' : 'red',
                  fillColor: clinic.networkStatus === 'online' ? 'green' : 'red',
                  fillOpacity: 0.1
                }}
              />
            </React.Fragment>
          ) : null
        ))}
        {/* Render sharing lines */}
        {sharingLines.map(line => (
          <Polyline
            key={line.id}
            positions={[line.source, line.target]}
            pathOptions={{
              color: 'blue',
              weight: 2,
              dashArray: '5, 10',
              opacity: 0.7
            }}
          />
        ))}
      </MapContainer>
      <div className="absolute bottom-4 left-4 bg-white p-2 rounded-lg shadow z-[1000]">
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
            <span className="text-sm">Online</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
            <span className="text-sm">Offline</span>
          </div>
          {sharingMode && (
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
              <span className="text-sm">Sharing Mode</span>
            </div>
          )}
        </div>
      </div>
      {sharingMode && (
        <div className="absolute top-4 right-4 bg-blue-100 p-3 rounded-lg shadow z-[1000]">
          <p className="text-sm text-blue-800">
            Select another facility to share bandwidth with {selectedClinic?.name}
          </p>
          <button
            onClick={() => {
              setSharingMode(false);
              setSelectedClinic(null);
            }}
            className="mt-2 px-3 py-1 bg-blue-500 text-white rounded-md text-sm"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}