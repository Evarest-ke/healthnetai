// Mock facility status updates for Kisumu healthcare facilities
export const getFacilityUpdates = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: 1,
          name: 'Jaramogi Oginga Odinga Teaching & Referral Hospital',
          status: Math.random() > 0.8 ? 'warning' : 'online',
          coordinates: [34.7577, -0.0917], // Kisumu JOOTRH coordinates
          signal: Math.floor(Math.random() * (100 - 85) + 85),
          patients: 245,
          lastUpdate: '1 min ago'
        },
        {
          id: 2,
          name: 'Kisumu County Hospital',
          status: Math.random() > 0.9 ? 'offline' : 'online',
          coordinates: [34.7520, -0.0894],
          signal: Math.floor(Math.random() * (100 - 75) + 75),
          patients: 158,
          lastUpdate: '3 mins ago'
        },
        {
          id: 3,
          name: 'Aga Khan Hospital Kisumu',
          status: 'online',
          coordinates: [34.7627, -0.0931],
          signal: Math.floor(Math.random() * (100 - 90) + 90),
          patients: 120,
          lastUpdate: '2 mins ago'
        },
        {
          id: 4,
          name: 'Avenue Hospital Kisumu',
          status: Math.random() > 0.85 ? 'warning' : 'online',
          coordinates: [34.7547, -0.0876],
          signal: Math.floor(Math.random() * (100 - 80) + 80),
          patients: 95,
          lastUpdate: '5 mins ago'
        },
        {
          id: 5,
          name: 'Nightingale Hospital',
          status: Math.random() > 0.9 ? 'offline' : 'online',
          coordinates: [34.7556, -0.0922],
          signal: Math.floor(Math.random() * (100 - 70) + 70),
          patients: 75,
          lastUpdate: '4 mins ago'
        },
        {
          id: 6,
          name: 'Nyalenda Health Centre',
          status: Math.random() > 0.8 ? 'warning' : 'online',
          coordinates: [34.7677, -0.1033],
          signal: Math.floor(Math.random() * (100 - 65) + 65),
          patients: 45,
          lastUpdate: '6 mins ago'
        },
        {
          id: 7,
          name: 'Lumumba Health Centre',
          status: Math.random() > 0.85 ? 'warning' : 'online',
          coordinates: [34.7445, -0.0894],
          signal: Math.floor(Math.random() * (100 - 60) + 60),
          patients: 38,
          lastUpdate: '8 mins ago'
        },
        {
          id: 8,
          name: 'Marie Stopes Clinic Kisumu',
          status: 'online',
          coordinates: [34.7558, -0.0901],
          signal: Math.floor(Math.random() * (100 - 85) + 85),
          patients: 25,
          lastUpdate: '3 mins ago'
        }
      ]);
    }, 1000);
  });
}; 