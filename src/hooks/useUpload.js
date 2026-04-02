import { useState } from 'react';
import { privateApiClient } from '../api/client';

export const useUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);

  const uploadFile = async (file) => {
    setUploading(true);
    setUploadError(null);
    try {
      const formData = new FormData();
      formData.append('document', file);
      
      const response = await privateApiClient.post('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Upload failed';
      console.error('Error uploading file:', errorMessage);
      setUploadError(errorMessage);
      throw err;
    } finally {
      setUploading(false);
    }
  };

  return { uploadFile, uploading, uploadError };
};
