import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useProperties } from '../hooks/useProperties';
import { useClients } from '../hooks/useClients';
import { useTransactions, useInvoices, usePayments, useReceipts } from '../hooks/useBilling';
import { useSettings, useReports } from '../hooks/useSystem';
import { useDocuments } from '../hooks/useDocuments';

export const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [data, setData] = useState({
    properties: [],
    clients: [],
    transactions: [],
    invoices: [],
    payments: [],
    receipts: [],
    documents: [],
    settings: { companyName: 'Premium Real Estate', currency: '₦', taxRate: 5 },
    stats: null
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { getProperties, createProperty, updateProperty, deleteProperty, updatePropertyStatus, addPropertyImages, removePropertyImage } = useProperties();
  const { getClients, createClient, updateClient, deleteClient } = useClients();
  const { getTransactions, createTransaction, updateTransactionStatus } = useTransactions();
  const { getInvoices, createInvoice, makePaymentOnInvoice, downloadInvoice } = useInvoices();
  const { getPayments, recordPayment } = usePayments();
  const { getReceipts, createReceipt, generateReceiptFromPayment, downloadReceipt } = useReceipts();
  const { getSettings, updateSettings } = useSettings();
  const { getDocuments, addDocument, deleteDocument } = useDocuments();
  const { getDashboardStats } = useReports();

  const refreshData = useCallback(async () => {
    setLoading(true);
    try {
      const results = await Promise.allSettled([
        getProperties(), getClients(), getTransactions(), getInvoices(),
        getPayments(), getReceipts(), getDocuments(), getSettings(), getDashboardStats()
      ]);

      const [
        properties, clients, transactions, rawInvoices,
        payments, receipts, documents, settings, stats
      ] = results.map(res => res.status === 'fulfilled' ? res.value : null);

      let invoiceList = [];
      if (Array.isArray(rawInvoices)) {
        invoiceList = rawInvoices;
      } else if (rawInvoices && Array.isArray(rawInvoices.data)) {
        invoiceList = rawInvoices.data;
      }

      setData(prev => ({
        properties: properties || prev.properties,
        clients: clients || prev.clients,
        transactions: transactions || prev.transactions,
        payments: payments || prev.payments,
        receipts: receipts || prev.receipts,
        documents: documents || prev.documents,
        settings: settings || prev.settings,
        stats: stats || prev.stats,
        invoices: invoiceList.map(inv => {
          const client = (clients || []).find(c => c._id === (inv.clientId?._id || inv.clientId));
          const property = (properties || []).find(p => p._id === (inv.propertyId?._id || inv.propertyId));
          const total = Number(inv.totalAmount || 0);
          const paid = Number(inv.amountPaid || 0);

          return {
            ...inv,
            client: client || { name: inv.clientName || 'Unknown Client' },
            property: property || { title: 'General Service' },
            amountPaid: paid,
            balance: total - paid
          };
        })
      }));

      setError(null);
    } catch (err) {
      console.error("Error in refreshData:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [getProperties, getClients, getTransactions, getInvoices, getPayments, getReceipts, getDocuments, getSettings, getDashboardStats]);

  useEffect(() => { refreshData(); }, [refreshData]);

  const addInvoiceLocal = (newInvoice) => {
    if (!newInvoice) return;
    setData(prev => ({
      ...prev,
      invoices: [
        {
          ...newInvoice,
          client: prev.clients.find(c => c._id === newInvoice.clientId) || { name: newInvoice.clientName || 'Unknown' },
          property: prev.properties.find(p => p._id === newInvoice.propertyId) || { title: 'Processing...' },
          amountPaid: 0,
          balance: newInvoice.totalAmount
        },
        ...prev.invoices
      ]
    }));
  };

  const updateInvoiceLocal = (updatedInvoice) => {
    if (!updatedInvoice) return;
    setData(prev => ({
      ...prev,
      invoices: prev.invoices.map(inv =>
        inv._id === updatedInvoice._id
          ? {
              ...inv,
              ...updatedInvoice,
              // ✅ Ensure client/property objects are preserved during update
              client: prev.clients.find(c => c._id === (updatedInvoice.clientId?._id || updatedInvoice.clientId)) || inv.client,
              property: prev.properties.find(p => p._id === (updatedInvoice.propertyId?._id || updatedInvoice.propertyId)) || inv.property,
              // ✅ Recalculate balance locally for immediate UI update
              balance: Number(updatedInvoice.totalAmount || 0) - Number(updatedInvoice.amountPaid || 0)
            }
          : inv
      )
    }));
  };

  const actions = {
    addProperty: async (prop) => { await createProperty(prop); await refreshData(); },
    updateProperty: async (id, updates) => { await updateProperty(id, updates); await refreshData(); },
    deleteProperty: async (id) => { await deleteProperty(id); await refreshData(); },
    updatePropertyStatus: async (id, status) => { await updatePropertyStatus(id, status); await refreshData(); },
    addPropertyImages: async (id, images) => { await addPropertyImages(id, images); await refreshData(); },
    removePropertyImage: async (id, image) => { await removePropertyImage(id, image); await refreshData(); },
    addClient: async (client) => { await createClient(client); await refreshData(); },
    updateClient: async (id, updates) => { await updateClient(id, updates); await refreshData(); },
    deleteClient: async (id) => { await deleteClient(id); await refreshData(); },
    addTransaction: async (txn) => { 
      try {
        await createTransaction(txn); 
        await refreshData(); 
      } catch (err) {
        throw err; 
      }
    },
    updateTransactionStatus: async (id, status) => { await updateTransactionStatus(id, status); await refreshData(); },
    addInvoice: async (invoice) => {
      const res = await createInvoice(invoice);
      const actualData = res.data?.data || res.data || res;
      addInvoiceLocal(actualData);
      await refreshData();
    },
    makeInvoicePayment: async (invoiceId, paymentData) => {
      try {
        const res = await makePaymentOnInvoice(invoiceId, paymentData);
        // ✅ Match the data structure returned by your controller: { success, data: { invoice, receipt } }
        const updatedInvoice = res.data?.invoice || res.invoice;
        if (updatedInvoice) {
          updateInvoiceLocal(updatedInvoice);
          // Sync all background numbers/stats
          setTimeout(() => refreshData(), 500);
        }
        return res;
      } catch (err) {
        console.error("Payment failed:", err);
        throw err;
      }
    },
    generateReceiptByPayment: async (paymentId) => { await generateReceiptFromPayment(paymentId); await refreshData(); },
    recordPayment: async (payment) => { await recordPayment(payment); await refreshData(); },
    addReceipt: async (receipt) => { await createReceipt(receipt); await refreshData(); },
    addDocument: async (doc) => { await addDocument(doc); await refreshData(); },
    deleteDocument: async (id) => { await deleteDocument(id); await refreshData(); },
    updateSettings: async (settings) => { await updateSettings(settings); await refreshData(); },
    downloadInvoice, downloadReceipt
  };

  return (
    <DataContext.Provider value={{ ...data, loading, error, refreshData, ...actions }}>
      {children}
    </DataContext.Provider>
  );
};