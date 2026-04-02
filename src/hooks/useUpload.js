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
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      // BACKEND SENDS: { data: { fileUrl: "uploads/..." } }
      // So we return the fileUrl specifically
      return response.data.data.fileUrl; 
    } catch (err) {
      setUploadError('Upload failed');
      throw err;
    } finally {
      setUploading(false);
    }
  };

  return { uploadFile, uploading, uploadError };
};