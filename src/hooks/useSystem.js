import { useCallback } from 'react';
import { privateApiClient } from '../api/client';

export const useSettings = () => {
  const getSettings = useCallback(async () => {
    try {
      const response = await privateApiClient.get('/settings');
      return response.data.data;
    } catch (err) {
      console.error('Error fetching settings:', err.response?.data || err.message);
      throw err;
    }
  }, []);

  const updateSettings = async (data) => {
    try {
      const response = await privateApiClient.put('/settings', data);
      return response.data.data;
    } catch (err) {
      console.error('Error updating settings:', err.response?.data || err.message);
      throw err;
    }
  };

  return { getSettings, updateSettings };
};

export const useReports = () => {
  const getDashboardStats = useCallback(async () => {
    try {
      const response = await privateApiClient.get('/reports/dashboard');
      return response.data.data;
    } catch (err) {
      console.error('Error fetching dashboard stats:', err.response?.data || err.message);
      return null; // Return null instead of throwing to prevent app crash
    }
  }, []);

  const getRevenueReport = async (params) => {
    try {
      const response = await privateApiClient.get('/reports/revenue', { params });
      return response.data.data;
    } catch (err) {
      console.error('Error fetching revenue report:', err.response?.data || err.message);
      throw err;
    }
  };

  return { getDashboardStats, getRevenueReport };
};
