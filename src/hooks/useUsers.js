import { useCallback } from 'react';
import { privateApiClient } from '../api/client';

export const useUsers = () => {
  const getUsers = useCallback(async () => {
    try {
      const response = await privateApiClient.get('/users');
      return response.data.data;
    } catch (err) {
      throw err;
    }
  }, []);

  const createUser = async (data) => {
    try {
      const response = await privateApiClient.post('/users', data);
      return response.data.data;
    } catch (err) {
      throw err;
    }
  };

  const updateUser = async (id, data) => {
    try {
      const response = await privateApiClient.put(`/users/${id}`, data);
      return response.data.data;
    } catch (err) {
      throw err;
    }
  };

  const deleteUser = async (id) => {
    try {
      const response = await privateApiClient.delete(`/users/${id}`);
      return response.data.data;
    } catch (err) {
      throw err;
    }
  };

  return { getUsers, createUser, updateUser, deleteUser };
};
