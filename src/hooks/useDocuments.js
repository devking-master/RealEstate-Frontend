import { useCallback } from 'react';
import { privateApiClient } from '../api/client';

export const useDocuments = () => {
  const getDocuments = useCallback(async (params) => {
    try {
      const response = await privateApiClient.get('/documents', { params });
      return response.data.data;
    } catch (err) {
      console.error('Error fetching documents:', err.response?.data || err.message);
      throw err;
    }
  }, []);

  const addDocument = async (docData) => {
    try {
      const response = await privateApiClient.post('/documents', docData);
      return response.data.data;
    } catch (err) {
      console.error('Error adding document:', err.response?.data || err.message);
      throw err;
    }
  };

  const deleteDocument = async (id) => {
    try {
      const response = await privateApiClient.delete(`/documents/${id}`);
      return response.data.data;
    } catch (err) {
      console.error(`Error deleting document ${id}:`, err.response?.data || err.message);
      throw err;
    }
  };

  return { getDocuments, addDocument, deleteDocument };
};
