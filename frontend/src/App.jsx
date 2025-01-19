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
import DoctorDashboard from './dashboard/doctor/DoctorDashboard';
import PatientDashboard from './dashboard/patient/PatientDashboard';
import NetworkDashboard from './dashboard/network/NetworkDashboard';
import NetworkStatus from './dashboard/network/pages/NetworkStatus';
import AppointmentsPage from './dashboard/appointments/AppointmentsPage';
import Facilities from './dashboard/network/pages/Facilities';
import MaintenancePage from './dashboard/network/pages/MaintenancePage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        
        <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
        <Route path="/doctor/appointments" element={<AppointmentsPage />} />
        <Route path="/patient/dashboard" element={<PatientDashboard />} />
        <Route path="/network/dashboard" element={<NetworkDashboard />} />
        <Route path="/network/status" element={<NetworkStatus />} />
        <Route path="/network/facilities" element={<Facilities />} />
        <Route path="/network/maintenance" element={<MaintenancePage />} />
        
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
      </Routes>
    </Router>
  );
}

export default App; 