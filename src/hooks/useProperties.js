import { useCallback } from 'react';
import { privateApiClient } from '../api/client';

export const useProperties = () => {
  const getProperties = useCallback(async (params) => {
    try {
      const response = await privateApiClient.get('/properties', { params });
      return response.data.data;
    } catch (err) {
      console.error('Error fetching properties:', err.response?.data || err.message);
      throw err;
    }
  }, []);

  const getProperty = async (id) => {
    try {
      const response = await privateApiClient.get(`/properties/${id}`);
      return response.data.data;
    } catch (err) {
      console.error(`Error fetching property ${id}:`, err.response?.data || err.message);
      throw err;
    }
  };

  const createProperty = async (data) => {
    try {
      // Data now includes name, type, price, location, size, titleStatus, images
      const response = await privateApiClient.post('/properties', data);
      return response.data.data;
    } catch (err) {
      console.error('Error creating property:', err.response?.data || err.message);
      throw err;
    }
  };

  const updateProperty = async (id, data) => {
    try {
      const response = await privateApiClient.put(`/properties/${id}`, data);
      return response.data.data;
    } catch (err) {
      console.error(`Error updating property ${id}:`, err.response?.data || err.message);
      throw err;
    }
  };

  const updatePropertyStatus = async (id, status) => {
    try {
      const response = await privateApiClient.patch(`/properties/${id}/status`, { status });
      return response.data.data;
    } catch (err) {
      console.error(`Error updating property status for ${id}:`, err.response?.data || err.message);
      throw err;
    }
  };

  const addPropertyImages = async (id, imageUrls) => {
    try {
      const response = await privateApiClient.post(`/properties/${id}/images`, { imageUrls });
      return response.data.data;
    } catch (err) {
      console.error(`Error adding images to property ${id}:`, err.response?.data || err.message);
      throw err;
    }
  };

  const removePropertyImage = async (id, imageUrl) => {
    try {
      const response = await privateApiClient.delete(`/properties/${id}/images`, { data: { imageUrl } });
      return response.data.data;
    } catch (err) {
      console.error(`Error removing image from property ${id}:`, err.response?.data || err.message);
      throw err;
    }
  };

  const deleteProperty = async (id) => {
    try {
      const response = await privateApiClient.delete(`/properties/${id}`);
      return response.data.data;
    } catch (err) {
      console.error(`Error deleting property ${id}:`, err.response?.data || err.message);
      throw err;
    }
  };

  return {
    getProperties,
    getProperty,
    createProperty,
    updateProperty,
    updatePropertyStatus,
    addPropertyImages,
    removePropertyImage,
    deleteProperty
  };
};