import { useCallback } from 'react';
import { privateApiClient } from '../api/client';

export const useClients = () => {
  const getClients = useCallback(async (params) => {
    try {
      const response = await privateApiClient.get('/clients', { params });
      return response.data.data;
    } catch (err) {
      console.error('Error fetching clients:', err.response?.data || err.message);
      throw err;
    }
  }, []);

  const getClient = async (id) => {
    try {
      const response = await privateApiClient.get(`/clients/${id}`);
      return response.data.data;
    } catch (err) {
      console.error(`Error fetching client ${id}:`, err.response?.data || err.message);
      throw err;
    }
  };

  const createClient = async (data) => {
    try {
      const response = await privateApiClient.post('/clients', data);
      return response.data.data;
    } catch (err) {
      console.error('Error creating client:', err.response?.data || err.message);
      throw err;
    }
  };

  const updateClient = async (id, data) => {
    try {
      const response = await privateApiClient.put(`/clients/${id}`, data);
      return response.data.data;
    } catch (err) {
      console.error(`Error updating client ${id}:`, err.response?.data || err.message);
      throw err;
    }
  };

  const deleteClient = async (id) => {
    try {
      const response = await privateApiClient.delete(`/clients/${id}`);
      return response.data.data;
    } catch (err) {
      console.error(`Error deleting client ${id}:`, err.response?.data || err.message);
      throw err;
    }
  };

  return {
    getClients,
    getClient,
    createClient,
    updateClient,
    deleteClient
  };
};
