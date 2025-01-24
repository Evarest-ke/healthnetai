import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import Header from './components/Header';
import Hero from './components/Hero';
import Features from './components/Features';
import WhyChooseUs from './components/WhyChooseUs';
import Testimonials from './components/Testimonials';
import CallToAction from './components/CallToAction';
import Footer from './components/Footer';
import SignUpPage from './pages/SignUpPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import DoctorDashboard from './dashboard/doctor/dashboard/DoctorDashboard';
import PatientDashboard from './dashboard/patient/PatientDashboard';
import NetworkDashboard from './dashboard/network/NetworkDashboard';
import NetworkStatus from './dashboard/network/pages/NetworkStatus';
import AppointmentsPage from './dashboard/appointments/AppointmentsPage';
import PatientsPage from './dashboard/doctor/patients/PatientsPage';
import Facilities from './dashboard/network/pages/Facilities';
import MaintenancePage from './dashboard/network/pages/MaintenancePage';
import NetworkAnalytics from './dashboard/network/pages/NetworkAnalytics';
import NetworkAlerts from './dashboard/network/pages/NetworkAlerts';
import NetworkSettings from './dashboard/network/pages/NetworkSettings';
import MedicalRecordsPage from './dashboard/doctor/records/MedicalRecordsPage';
import AnalyticsPage from './dashboard/doctor/analytics/AnalyticsPage';
import DashboardLayout from './components/layout/DashboardLayout';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { ToastContainer } from 'react-toastify';
import ErrorBoundary from './components/error/ErrorBoundary';
import SyncStatus from './components/common/SyncStatus';
import { performanceMonitor } from './utils/monitoring/performanceMonitor';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const [syncStatus, setSyncStatus] = React.useState('online');
  const [lastSync, setLastSync] = React.useState(new Date());

  React.useEffect(() => {
    performanceMonitor.trackPageLoad('App');
  }, []);

  return (
    <ErrorBoundary>
      <AuthProvider>
        <Router>
          <ToastContainer />
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignUpPage />} /> 
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            
            <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
            <Route path="/doctor/appointments" element={<AppointmentsPage />} />
            <Route path="/doctor/patients" element={<PatientsPage />} />
            <Route path="/patient/dashboard" element={<PatientDashboard />} />
            <Route path="/network/dashboard" element={<NetworkDashboard />} />
            <Route path="/network/status" element={<NetworkStatus />} />
            <Route path="/network/facilities" element={<Facilities />} />
            <Route path="/network/maintenance" element={<MaintenancePage />} />
            <Route path="/network/analytics" element={<NetworkAnalytics />} />
            <Route path="/network/alerts" element={<NetworkAlerts />} />
            <Route path="/network/settings" element={<NetworkSettings />} />
            <Route path="/doctor/records" element={<MedicalRecordsPage />} />
            <Route path="/doctor/analytics" element={<AnalyticsPage />} />

            <Route path="/" element={
              <main>
                <Header />
                <Hero />
                <Features />
                <WhyChooseUs />
                <Testimonials />
                <CallToAction />
                <Footer />
              </main>
            } />

            <Route
              path="/dashboard/*"
              element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            />
          </Routes>
          <SyncStatus status={syncStatus} lastSync={lastSync} />
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App; 