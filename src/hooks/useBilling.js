import { useCallback } from 'react';
import { privateApiClient } from '../api/client';

export const useTransactions = () => {
  const getTransactions = useCallback(async (params) => {
    try {
      const response = await privateApiClient.get('/transactions', { params });
      return response.data.data;
    } catch (err) {
      console.error('Error fetching transactions:', err.response?.data || err.message);
      throw err;
    }
  }, []);

  const getTransaction = async (id) => {
    try {
      const response = await privateApiClient.get(`/transactions/${id}`);
      return response.data.data;
    } catch (err) {
      console.error(`Error fetching transaction ${id}:`, err.response?.data || err.message);
      throw err;
    }
  };

  const createTransaction = async (data) => {
    try {
      const response = await privateApiClient.post('/transactions', data);
      return response.data.data;
    } catch (err) {
      console.error('Error creating transaction:', err.response?.data || err.message);
      throw err;
    }
  };

  const updateTransactionStatus = async (id, status) => {
    try {
      const response = await privateApiClient.patch(`/transactions/${id}/status`, { status });
      return response.data.data;
    } catch (err) {
      console.error(`Error updating transaction status for ${id}:`, err.response?.data || err.message);
      throw err;
    }
  };

  return { getTransactions, getTransaction, createTransaction, updateTransactionStatus };
};

export const useInvoices = () => {
  const getInvoices = useCallback(async (params) => {
    try {
      const response = await privateApiClient.get('/invoices', { params });
      return response.data.data;
    } catch (err) {
      console.error('Error fetching invoices:', err.response?.data || err.message);
      throw err;
    }
  }, []);

  const createInvoice = async (data) => {
    try {
      const response = await privateApiClient.post('/invoices', data);
      return response.data.data;
    } catch (err) {
      console.error('Error creating invoice:', err.response?.data || err.message);
      throw err;
    }
  };

  const downloadInvoice = async (id) => {
    try {
      const response = await privateApiClient.get(`/invoices/${id}/pdf`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `invoice-${id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Failed to download invoice', err);
      throw err;
    }
  };

  const makePaymentOnInvoice = async (id, paymentData) => {
    try {
      console.log('useBilling -> makePaymentOnInvoice invoiceId:', id);
      console.log('useBilling -> makePaymentOnInvoice paymentData:', paymentData);
      const response = await privateApiClient.post(`/invoices/${id}/pay`, paymentData);
      console.log('useBilling -> makePaymentOnInvoice response:', response.data);
      return response.data.data;
    } catch (err) {
      console.error('Error making payment on invoice:', err.response?.data || err);
      throw err;
    }
  };

  return { getInvoices, createInvoice, downloadInvoice, makePaymentOnInvoice };
};

export const usePayments = () => {
  const getPayments = useCallback(async (params) => {
    try {
      const response = await privateApiClient.get('/payments', { params });
      return response.data.data;
    } catch (err) {
      console.error('Error fetching payments:', err.response?.data || err.message);
      throw err;
    }
  }, []);

  const recordPayment = async (data) => {
    try {
      const response = await privateApiClient.post('/payments', data);
      return response.data.data;
    } catch (err) {
      console.error('Error recording payment:', err.response?.data || err.message);
      throw err;
    }
  };

  return { getPayments, recordPayment };
};

export const useReceipts = () => {
  const getReceipts = useCallback(async (params) => {
    try {
      const response = await privateApiClient.get('/receipts', { params });
      return response.data.data;
    } catch (err) {
      console.error('Error fetching receipts:', err.response?.data || err.message);
      throw err;
    }
  }, []);

  const createReceipt = async (data) => {
    try {
      const response = await privateApiClient.post('/receipts', data);
      return response.data.data;
    } catch (err) {
      console.error('Error creating receipt:', err.response?.data || err.message);
      throw err;
    }
  };

  const generateReceiptFromPayment = async (paymentId) => {
    try {
      const response = await privateApiClient.post('/receipts/generate', { paymentId });
      return response.data.data;
    } catch (err) {
      console.error('Error generating receipt from payment:', err.response?.data || err.message);
      throw err;
    }
  };

  const downloadReceipt = async (id) => {
    try {
      const response = await privateApiClient.get(`/receipts/${id}/pdf`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `receipt-${id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Failed to download receipt', err);
      throw err;
    }
  };

  return { getReceipts, createReceipt, generateReceiptFromPayment, downloadReceipt };
};
