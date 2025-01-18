import React, { useEffect, useRef } from 'react';
import { MapPin, Server } from 'lucide-react';

export default function FacilityMap({ facilities, selectedFacility, onFacilitySelect }) {
  const mapRef = useRef(null);
  const markersRef = useRef({});

  useEffect(() => {
    // Initialize map
    if (!mapRef.current) {
      // Note: You'll need to add your preferred map provider here
      // This is a placeholder for map initialization
      console.log('Map would be initialized here');
    }

    // Add markers for facilities
    facilities.forEach(facility => {
      // This is where you'd add markers to the map
      console.log(`Adding marker for ${facility.name}`);
    });
  }, [facilities]);

  return (
    <div className="relative">
      {/* Map Container */}
      <div 
        ref={mapRef} 
        className="w-full h-[600px] bg-gray-100 rounded-lg"
        style={{ border: '1px solid #E5E7EB' }}
      >
        {/* Placeholder for map implementation */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-gray-500">
            <MapPin className="h-12 w-12 mx-auto mb-2" />
            <p>Map Component</p>
            <p className="text-sm">Integrate your preferred map provider here</p>
          </div>
        </div>
      </div>

      {/* Facility List Sidebar */}
      <div className="absolute top-4 right-4 w-64 bg-white rounded-lg shadow-lg max-h-[calc(600px-2rem)] overflow-y-auto">
        <div className="p-4">
          <h3 className="text-lg font-semibold mb-4">Facilities</h3>
          <div className="space-y-2">
            {facilities.map(facility => (
              <button
                key={facility.id}
                onClick={() => onFacilitySelect(facility)}
                className={`w-full text-left p-2 rounded-lg transition-colors ${
                  selectedFacility?.id === facility.id
                    ? 'bg-indigo-50 text-indigo-600'
                    : 'hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center">
                  <Server className="h-4 w-4 mr-2" />
                  <div>
                    <p className="font-medium">{facility.name}</p>
                    <p className="text-xs text-gray-500">{facility.location}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 