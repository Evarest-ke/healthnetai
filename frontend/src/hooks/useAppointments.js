import { useState, useEffect } from 'react';
import { appointmentService } from '../services/appointmentService';

export function useAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    startDate: null,
    endDate: null,
    status: null,
    search: ''
  });

  // Fetch appointments
  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const data = await appointmentService.getAllAppointments(filters);
      setAppointments(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Create appointment
  const createAppointment = async (appointmentData) => {
    try {
      const newAppointment = await appointmentService.createAppointment(appointmentData);
      setAppointments(prev => [...prev, newAppointment]);
      return newAppointment;
    } catch (err) {
      throw err;
    }
  };

  // Update appointment
  const updateAppointment = async (id, appointmentData) => {
    try {
      const updatedAppointment = await appointmentService.updateAppointment(id, appointmentData);
      setAppointments(prev => 
        prev.map(apt => apt.id === id ? updatedAppointment : apt)
      );
      return updatedAppointment;
    } catch (err) {
      throw err;
    }
  };

  // Delete appointment
  const deleteAppointment = async (id) => {
    try {
      await appointmentService.deleteAppointment(id);
      setAppointments(prev => prev.filter(apt => apt.id !== id));
    } catch (err) {
      throw err;
    }
  };

  // Update filters
  const updateFilters = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  // Fetch appointments when filters change
  useEffect(() => {
    fetchAppointments();
  }, [filters]);

  return {
    appointments,
    loading,
    error,
    filters,
    updateFilters,
    createAppointment,
    updateAppointment,
    deleteAppointment,
    refreshAppointments: fetchAppointments
  };
} 