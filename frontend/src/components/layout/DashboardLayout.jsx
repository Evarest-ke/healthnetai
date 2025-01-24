import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from '../../dashboard/layout/Sidebar';
import DashboardHeader from '../../dashboard/layout/DashboardHeader';
import NetworkDashboard from '../../dashboard/network/NetworkDashboard';
import NetworkStatus from '../../dashboard/network/pages/NetworkStatus';
import NetworkAnalytics from '../../dashboard/network/pages/NetworkAnalytics';
import Facilities from '../../dashboard/network/pages/Facilities';
import MaintenancePage from '../../dashboard/network/pages/MaintenancePage';

const DashboardLayout = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
          <Routes>
            <Route path="/" element={<NetworkDashboard />} />
            <Route path="/network/status" element={<NetworkStatus />} />
            <Route path="/network/analytics" element={<NetworkAnalytics />} />
            <Route path="/network/facilities" element={<Facilities />} />
            <Route path="/network/maintenance" element={<MaintenancePage />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
