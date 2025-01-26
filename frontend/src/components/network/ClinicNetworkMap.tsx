import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

interface Clinic {
  id: string;
  name: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  networkStatus: string;
  terrainFactor: number;
}

interface Props {
  clinics: Clinic[];
  onClinicSelect: (clinicId: string) => void;
}

export const ClinicNetworkMap: React.FC<Props> = ({ clinics, onClinicSelect }) => {
  const kisumuCenter = [-0.1022, 34.7617];

  return (
    <MapContainer
      center={kisumuCenter}
      zoom={11}
      className="h-[600px] w-full rounded-lg"
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      />
      {clinics.map((clinic) => (
        <React.Fragment key={clinic.id}>
          <Marker
            position={[clinic.coordinates.latitude, clinic.coordinates.longitude]}
            eventHandlers={{
              click: () => onClinicSelect(clinic.id),
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
                  {clinic.networkStatus}
                </p>
              </div>
            </Popup>
          </Marker>
          <Circle
            center={[clinic.coordinates.latitude, clinic.coordinates.longitude]}
            radius={15000} // 15km radius
            pathOptions={{
              color: clinic.networkStatus === 'online' ? 'green' : 'red',
              fillColor: clinic.networkStatus === 'online' ? 'green' : 'red',
              fillOpacity: 0.1,
            }}
          />
        </React.Fragment>
      ))}
    </MapContainer>
  );
}; 