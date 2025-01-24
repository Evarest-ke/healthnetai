import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Wifi, WifiOff, AlertTriangle, RefreshCw } from 'lucide-react';
import axios from 'axios';
import { getFacilityUpdates } from '../../mocks/api/facilities';

// Set your Mapbox token
mapboxgl.accessToken = 'pk.eyJ1IjoiYXRob29oIiwiYSI6ImNtMWY2N3prZjJsN3MybHNjMWd3bThzOXcifQ.HNgAHQBkzGdrnuS1MtwYlQ';

export default function ConnectivityMap({ onFacilitySelect }) {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const markers = useRef({});
  
  // Initial map center coordinates (example for NYC - adjust to your region)
  const [lng] = useState(34.7575); // Kisumu longitude
  const [lat] = useState(-0.0917); // Kisumu latitude
  const [zoom] = useState(13); // Closer zoom for city level

  // Sample facilities data - Replace with your actual facilities
  const [facilities, setFacilities] = useState([
    {
      id: 1,
      name: 'Mount Sinai Hospital',
      status: 'online',
      coordinates: [-73.9526, 40.7900],
      signal: 95,
      patients: 245,
      lastUpdate: '1 min ago'
    },
    {
      id: 2,
      name: 'NYU Langone Medical Center',
      status: 'online',
      coordinates: [-73.9747, 40.7421],
      signal: 88,
      patients: 180,
      lastUpdate: '3 mins ago'
    },
    {
      id: 3,
      name: 'Bellevue Hospital Center',
      status: 'warning',
      coordinates: [-73.9759, 40.7392],
      signal: 65,
      patients: 156,
      lastUpdate: '5 mins ago'
    },
    {
      id: 4,
      name: 'NewYork-Presbyterian',
      status: 'offline',
      coordinates: [-73.9419, 40.7644],
      signal: 0,
      patients: 200,
      lastUpdate: '15 mins ago'
    }
  ]);

  // Add new state for loading
  const [isLoading, setIsLoading] = useState(false);

  // Add function to fetch facility updates
  const fetchFacilityUpdates = async () => {
    try {
      setIsLoading(true);
      
      // Use mock data in development, real API in production
      const data = process.env.NODE_ENV === 'development' 
        ? await getFacilityUpdates()
        : (await axios.get('/api/facilities/status')).data;
      
      setFacilities(data);
      
      // Update existing markers with new status
      data.forEach(facility => {
        if (markers.current[facility.id]) {
          const el = markers.current[facility.id].getElement();
          el.innerHTML = getFacilityMarkerHTML(facility);
          
          // Update popup content
          markers.current[facility.id].getPopup().setHTML(getFacilityPopupHTML(facility));
        }
      });
    } catch (error) {
      console.error('Error fetching facility updates:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Add polling effect
  useEffect(() => {
    // Initial fetch
    fetchFacilityUpdates();

    // Set up polling interval (every 30 seconds)
    const intervalId = setInterval(fetchFacilityUpdates, 30000);

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    // Wait for the container ref to be available
    if (mapContainer.current && !map.current) {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: [lng, lat],
        zoom: zoom,
        maxBounds: [
          [34.7000, -0.1500], // Southwest coordinates
          [34.8000, -0.0500]  // Northeast coordinates
        ]
      });

      // Add navigation controls
      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
      
      // Add fullscreen control
      map.current.addControl(new mapboxgl.FullscreenControl());

      // Add scale control
      map.current.addControl(new mapboxgl.ScaleControl({
        maxWidth: 100,
        unit: 'metric'
      }));

      // Optional: Add terrain control for 3D view
      map.current.on('style.load', () => {
        map.current.addSource('mapbox-dem', {
          'type': 'raster-dem',
          'url': 'mapbox://mapbox.mapbox-terrain-dem-v1',
          'tileSize': 512,
          'maxzoom': 14
        });
        map.current.setTerrain({ 'source': 'mapbox-dem', 'exaggeration': 1.5 });
      });
    }

    // Add markers only after map is initialized
    if (map.current) {
      facilities.forEach(facility => {
        if (!markers.current[facility.id]) {
          // Create custom marker element
          const el = document.createElement('div');
          el.className = 'facility-marker';
          el.innerHTML = getFacilityMarkerHTML(facility);

          // Create popup
          const popup = new mapboxgl.Popup({ offset: 25, closeButton: false })
            .setHTML(getFacilityPopupHTML(facility));

          // Add marker to map
          markers.current[facility.id] = new mapboxgl.Marker(el)
            .setLngLat(facility.coordinates)
            .setPopup(popup)
            .addTo(map.current);

          // Add click handler
          el.addEventListener('click', () => {
            onFacilitySelect(facility);
          });
        }
      });
    }

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [facilities, lng, lat, zoom]);

  const getFacilityMarkerHTML = (facility) => {
    const colors = {
      online: 'bg-green-500',
      offline: 'bg-red-500',
      warning: 'bg-yellow-500'
    };

    return `
      <div class="relative p-2 rounded-full ${colors[facility.status]} 
                  cursor-pointer transform hover:scale-110 transition-transform 
                  shadow-lg border-2 border-white">
        ${facility.status === 'online' ? 
          `<svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M2 16.1A5 5 0 0 1 5.9 20M2 12.05A9 9 0 0 1 9.95 20M2 8V6a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-6"></path>
            <line x1="2" y1="20" x2="2" y2="20"></line>
          </svg>` : 
          facility.status === 'offline' ? 
          `<svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="1" y1="1" x2="23" y2="23"></line>
            <path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55"></path>
            <path d="M5 12.55a10.94 10.94 0 0 1 5.17-2.39"></path>
            <path d="M10.71 5.05A16 16 0 0 1 22.58 9"></path>
            <path d="M1.42 9a15.91 15.91 0 0 1 4.7-2.88"></path>
            <path d="M8.53 16.11a6 6 0 0 1 6.95 0"></path>
            <line x1="12" y1="20" x2="12" y2="20"></line>
          </svg>` :
          `<svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
            <line x1="12" y1="9" x2="12" y2="13"></line>
            <line x1="12" y1="17" x2="12.01" y2="17"></line>
          </svg>`
        }
      </div>
    `;
  };

  const getFacilityPopupHTML = (facility) => {
    const statusColors = {
      online: 'text-green-600',
      offline: 'text-red-600',
      warning: 'text-yellow-600'
    };

    return `
      <div class="p-3 min-w-[200px]">
        <h3 class="font-semibold text-gray-900">${facility.name}</h3>
        <div class="mt-2 space-y-1">
          <p class="text-sm ${statusColors[facility.status]} font-medium">
            Status: ${facility.status.charAt(0).toUpperCase() + facility.status.slice(1)}
          </p>
          <p class="text-sm">Signal Strength: ${facility.signal}%</p>
          <p class="text-sm">Current Patients: ${facility.patients}</p>
          <p class="text-xs text-gray-500">Last Update: ${facility.lastUpdate}</p>
          <p class="text-xs text-gray-500 mt-2">
            Coordinates: ${facility.coordinates[1].toFixed(4)}, ${facility.coordinates[0].toFixed(4)}
          </p>
        </div>
      </div>
    `;
  };

  return (
    <div className="space-y-4">
      <div 
        ref={mapContainer} 
        className="h-[500px] rounded-lg shadow-inner"
        style={{ border: '1px solid #e5e7eb' }}
      />
      {/* Legend */}
      <div className="flex items-center justify-center space-x-6">
        {/* ... legend items ... */}
      </div>
    </div>
  );
}