import React from 'react';
import { useState, useMemo } from 'react';
import { useData } from '../../hooks/useData';
import { privateApiClient } from '../../api/client';
import TransactionForm from './TransactionForm';
import PaymentForm from './PaymentForm';
import Modal from '../../components/UI/Modal.jsx'; // Changed UI to ui
import { LoadingSpinner } from '../../components/UI/loader.jsx'; // Added .jsx
import './Transactions.css';
import { toast, alert as swalAlert } from '../../utils/swal';
import {
  DollarSign,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  Layers,
  FileText,
  CreditCard,
  ChevronLeft,
  ChevronRight,
  Search
} from 'lucide-react';

const Transactions = () => {
  const { transactions = [], properties = [], clients = [], invoices = [], settings, refreshData } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filter, setFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  
  // UPDATED: Now tracking the Transaction ID directly
  const [selectedTransactionId, setSelectedTransactionId] = useState(null); 
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  
  const [sortConfig] = useState({ key: 'createdAt', direction: 'desc' });
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const itemsPerPage = 10;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'NGN',
    }).format(amount || 0).replace('NGN', settings?.currency || '₦');
  };

  const getClientName = (clientData) => {
    if (!clientData) return 'Retail Entry';
    if (typeof clientData === 'string') {
      const client = clients.find(c => (c._id || c.id) === clientData);
      return client?.name || 'Unknown Client';
    }
    return clientData.name || 'Unknown Client';
  };

  const getPropertyTitle = (propData) => {
    if (!propData) return 'General Asset';
    if (typeof propData === 'string') {
      const property = properties.find(p => (p._id || p.id) === propData);
      // ADD .title || .name HERE
      return property?.title || property?.name || 'External Asset';
    }
    // ADD .title || .name HERE
    return propData.title || propData.name || 'External Asset';
  };

  const getInvoiceForTransaction = (transactionId) => {
    return invoices?.find(inv => {
      const invTxnId = inv.transactionId?._id || inv.transactionId;
      return invTxnId === transactionId;
    });
  };

  const totalCollected = useMemo(() => {
    return transactions.reduce((sum, txn) => sum + (txn.paidAmount || 0), 0);
  }, [transactions]);

  const totalOutstanding = useMemo(() => {
    return transactions.reduce((sum, txn) => sum + ((txn.totalAmount || 0) - (txn.paidAmount || 0)), 0);
  }, [transactions]);

  const filteredTransactions = useMemo(() => {
    if (!transactions) return [];
    return transactions.filter(t => {
      const matchesFilter = filter === 'All' || t.status === filter;
      const cName = getClientName(t.client).toLowerCase();
      const pTitle = getPropertyTitle(t.property).toLowerCase();
      const type = (t.type || '').toLowerCase();
      
      const matchesSearch = cName.includes(searchTerm.toLowerCase()) || 
                            pTitle.includes(searchTerm.toLowerCase()) ||
                            type.includes(searchTerm.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [transactions, filter, searchTerm, clients, properties]);

  const sortedTransactions = useMemo(() => {
    const sorted = [...filteredTransactions].sort((a, b) => {
      let aValue, bValue;
      switch (sortConfig.key) {
        case 'createdAt':
          aValue = new Date(a.createdAt || a.date || 0);
          bValue = new Date(b.createdAt || b.date || 0);
          break;
        case 'client':
          aValue = getClientName(a.client).toLowerCase();
          bValue = getClientName(b.client).toLowerCase();
          break;
        case 'totalAmount':
          aValue = a.totalAmount || 0;
          bValue = b.totalAmount || 0;
          break;
        default:
          return 0;
      }
      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
    return sorted;
  }, [filteredTransactions, sortConfig, clients]);

  const totalPages = Math.max(1, Math.ceil(sortedTransactions.length / itemsPerPage));
  const paginatedTransactions = useMemo(() => {
    const startIdx = (currentPage - 1) * itemsPerPage;
    return sortedTransactions.slice(startIdx, startIdx + itemsPerPage);
  }, [sortedTransactions, currentPage]);

const handleGenerateInvoice = async (dbId) => {
  setIsLoading(true);
  try {
    // Find the actual transaction object to get the clean property ID
    const txn = transactions.find(t => (t._id || t.id) === dbId);
    const propertyId = txn.property?._id || txn.property;

    const response = await privateApiClient.post('/invoices/generate-from-transaction', { 
      transactionId: dbId,
      propertyId: propertyId // Pass this explicitly to be safe
    });
    
    if (response.data.success) {
      toast('Invoice generated successfully!', 'success');
      await refreshData(); 
    } else {
        swalAlert('Failed', response.data.message || 'Failed to generate invoice', 'error');
      }
    } catch (error) {
      swalAlert('Error', error.response?.data?.message || 'Error generating invoice', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // UPDATED: Standardized to use Transaction ID as the primary key
  const handleRecordPayment = (dbId) => {
    const linkedInvoice = getInvoiceForTransaction(dbId);
    if (!linkedInvoice) {
      swalAlert("Attention", "Please generate an invoice first to record a payment.", "warning");
      return;
    }
    setSelectedTransactionId(dbId); 
    setIsPaymentModalOpen(true);
  };

  const handleClosePaymentModal = async () => {
    setIsPaymentModalOpen(false);
    setSelectedTransactionId(null);
    await refreshData(); // Refresh UI totals immediately after payment
  };

  return (
    <div className="page-container animate-fade-in-up">
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]">
          <LoadingSpinner text="Processing..." />
        </div>
      )}

      <div className="page-header">
        <div>
          <h1 className="page-title">Transaction Hub</h1>
          <p className="page-subtitle">Central management of deals and financial flows.</p>
        </div>
        <div className="flex gap-3">
          <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
            <Plus size={16} /> New Transaction
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <div className="card" style={{ borderLeft: '4px solid #10b981', padding: '1.5rem', display: 'flex', justifyContent: 'space-between' }}>
            <div>
                <p className="text-xs font-bold text-muted uppercase">Total Collected</p>
                <p className="text-2xl font-black">{formatCurrency(totalCollected)}</p>
            </div>
            <ArrowUpRight size={24} color="#10b981" />
        </div>
        <div className="card" style={{ borderLeft: '4px solid #ef4444', padding: '1.5rem', display: 'flex', justifyContent: 'space-between' }}>
            <div>
                <p className="text-xs font-bold text-muted uppercase">Outstanding</p>
                <p className="text-2xl font-black">{formatCurrency(totalOutstanding)}</p>
            </div>
            <ArrowDownRight size={24} color="#ef4444" />
        </div>
        <div className="card" style={{ borderLeft: '4px solid var(--brand-accent)', padding: '1.5rem', display: 'flex', justifyContent: 'space-between' }}>
            <div>
                <p className="text-xs font-bold text-muted uppercase">Active Deals</p>
                <p className="text-2xl font-black">{transactions.length}</p>
            </div>
            <Layers size={24} color="var(--brand-accent)" />
        </div>
      </div>

      <div className="card">
        {/* Filter and Search */}
        <div className="filter-search-container" style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-main)' }}>
            <div className="status-filter-group">
                {['All', 'completed', 'pending', 'partially_paid'].map(f => (
                    <button 
                        key={f}
                        className={`btn filter-btn ${filter === f ? 'btn-primary' : 'btn-outline'}`}
                        onClick={() => { setFilter(f); setCurrentPage(1); }}
                    >
                        {f.replace('_', ' ')}
                    </button>
                ))}
            </div>
            <div className="search-wrapper">
              <Search className="search-icon" size={18} />
              <input
                type="text"
                placeholder="Search by client, property or type..."
                className="form-control search-input"
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              />
            </div>
        </div>

        {/* Transaction Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '1.5rem', padding: '1.5rem' }}>
          {paginatedTransactions.length > 0 ? (
            paginatedTransactions.map((txn) => {
              const dbId = txn._id || txn.id;
              const hasInvoice = getInvoiceForTransaction(dbId);
              
              return (
                <div key={dbId} className="card p-6 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex flex-col gap-4">
                    <h3 className="font-bold text-lg">#{ dbId.slice(-8).toUpperCase() }</h3>
                    <div className="space-y-1 text-sm text-muted">
                      <p><strong>Client:</strong> {getClientName(txn.client)}</p>
                      <p><strong>Property:</strong> {getPropertyTitle(txn.property)}</p>
                      <p><strong>Amount:</strong> {formatCurrency(txn.totalAmount)}</p>
                      <p><strong>Remaining:</strong> 
                        <span className={`ml-1 font-bold ${txn.totalAmount - (txn.paidAmount || 0) > 0 ? 'text-red-500' : 'text-green-500'}`}>
                          {formatCurrency(txn.totalAmount - (txn.paidAmount || 0))}
                        </span>
                      </p>
                    </div>
                    <div>
                      <span className={`badge badge-${txn.status === 'completed' ? 'success' : txn.status === 'pending' ? 'warning' : 'info'}`}>
                        {txn.status.replace('_', ' ').toUpperCase()}
                      </span>
                    </div>
                    <div className="txn-card-actions">
                      {hasInvoice ? (
                        <button onClick={() => window.location.href = '/invoices'} className="btn btn-sm btn-outline">
                          <FileText size={14} /> View Invoice
                        </button>
                      ) : (
                        <button onClick={() => handleGenerateInvoice(dbId)} className="btn btn-sm btn-primary">
                          <FileText size={14} /> Generate Invoice
                        </button>
                      )}
                      <button 
                        onClick={() => handleRecordPayment(dbId)} 
                        className={`btn btn-sm ${txn.status === 'completed' ? 'btn-outline' : 'btn-primary'}`}
                        disabled={txn.status === 'completed'}
                        style={txn.status === 'completed' ? { opacity: 0.45, cursor: 'not-allowed' } : {}}
                      >
                        <CreditCard size={14} /> Payment
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-span-full text-center py-12">
              <DollarSign size={48} className="mx-auto text-muted mb-4" opacity={0.3} />
              <p className="text-muted">No transactions match your search.</p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {paginatedTransactions.length > 0 && (
          <div className="p-6 border-t flex justify-between items-center flex-wrap gap-4">
            <span className="text-xs font-semibold text-muted">
              Showing {Math.min((currentPage - 1) * itemsPerPage + 1, sortedTransactions.length)} to {Math.min(currentPage * itemsPerPage, sortedTransactions.length)} of {sortedTransactions.length}
            </span>
            <div className="flex items-center gap-2">
              <button className="btn btn-outline btn-sm" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}>
                <ChevronLeft size={16} />
              </button>
              <span className="text-xs font-bold">{currentPage} / {totalPages}</span>
              <button className="btn btn-outline btn-sm" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="New Transaction">
        <TransactionForm onClose={() => setIsModalOpen(false)} />
      </Modal>

      <Modal isOpen={isPaymentModalOpen} onClose={handleClosePaymentModal} title="Record Payment">
        <PaymentForm 
          transactionId={selectedTransactionId} 
          onClose={handleClosePaymentModal} 
        />
      </Modal>
    </div>
  );
};

export default Transactions;