import React from 'react';
import { useState } from 'react';
import { useData } from '../../hooks/useData';
import './Receipts.css';
import {
  Receipt as ReceiptIcon,
  Download,
  Search
} from 'lucide-react';

const Receipts = () => {
  const { receipts, settings, downloadReceipt } = useData();
  const [searchTerm, setSearchTerm] = useState('');

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'NGN',
    }).format(amount || 0).replace('NGN', settings?.currency || '₦');
  };

  // Simplified lookups since the backend now populates these directly
  const getClientName = (receipt) => {
    return receipt.clientId?.name || receipt.clientName || "Unknown Client";
  };

  const getPropertyTitle = (receipt) => {
  // Check transaction first, then propertyId object fields
  return (
    receipt.propertyId?.title || 
    receipt.propertyId?.name || 
    receipt.transactionId?.property?.name || 
    "General Asset"
  );
};

  const filteredReceipts = receipts.filter(r => {
    const clientName = getClientName(r);
    const propertyTitle = getPropertyTitle(r);
    const receiptNo = r.receiptNumber || '';
    
    return clientName.toLowerCase().includes(searchTerm.toLowerCase()) || 
           propertyTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
           receiptNo.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const handleDownload = async (receipt) => {
    await downloadReceipt(receipt._id || receipt.id);
  };

  return (
    <div className="page-container animate-fade-in-up">
      <div className="page-header">
        <div>
          <h1 className="page-title">Payment Receipts</h1>
          <p className="page-subtitle">Receipts generated from transaction payments with client and property details.</p>
        </div>
      </div>

      <div className="card">
        <div className="card-header" style={{ padding: '1.5rem 2rem', borderBottom: '1px solid var(--border-main)', background: 'var(--bg-hover)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div className="search-wrapper" style={{ maxWidth: '400px' }}>
                <Search className="search-icon" size={18} />
                <input
                  type="text"
                  placeholder="Search receipts by client, property, or ID..."
                  className="form-control search-input"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {filteredReceipts.length} Receipts
            </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '1.5rem', padding: '1.5rem' }}>
          {filteredReceipts.length > 0 ? (
            filteredReceipts.map((receipt, i) => {
              return (
                <div
                  key={receipt._id || receipt.id}
                  className="card"
                  style={{
                    padding: '1.5rem',
                    borderRadius: 'var(--radius-xl)',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
                    transition: 'box-shadow 0.3s ease',
                    animationDelay: `${0.2 + i * 0.05}s`
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)'}
                  onMouseLeave={(e) => e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.05)'}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <h3 style={{ fontWeight: 'bold', fontSize: '1.25rem', color: 'var(--text-main)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {receipt.receiptNumber || (receipt._id || receipt.id).slice(-10).toUpperCase()}
                    </h3>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                        <strong>Client:</strong> <span>{getClientName(receipt)}</span>
                      </p>
                      <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                        <strong>Property:</strong> <span>{getPropertyTitle(receipt)}</span>
                      </p>
                      <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                        <strong>Amount Paid:</strong> {formatCurrency(receipt.amountPaid)}
                      </p>
                      <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                        <strong>Balance Remaining:</strong> 
                        <span style={{ fontWeight: 'bold', marginLeft: '5px', color: (receipt.balanceRemaining || 0) > 0 ? '#ef4444' : '#10b981' }}>
                          {formatCurrency(receipt.balanceRemaining)}
                        </span>
                      </p>
                      <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                        <strong>Payment Method:</strong> 
                        <span style={{ fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase', color: 'var(--text-muted)', background: 'var(--bg-hover)', padding: '0.25rem 0.5rem', borderRadius: '6px', marginLeft: '5px' }}>
                          {receipt.paymentMethod || 'N/A'}
                        </span>
                      </p>
                      <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                        <strong>Date:</strong> {new Date(receipt.date || receipt.createdAt).toLocaleDateString()}
                      </p>
                    </div>

                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '1rem' }}>
                      <button 
                        onClick={() => handleDownload(receipt)} 
                        className="btn btn-primary" 
                        style={{ flex: 1, padding: '0.5rem 1rem', fontSize: '0.875rem', borderRadius: '0.5rem' }}
                      >
                        <Download size={14} style={{ marginRight: '0.5rem' }} />
                        Download PDF
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="card" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem 1.5rem', borderRadius: 'var(--radius-xl)', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
              <div style={{ marginBottom: '1.5rem', display: 'inline-flex', padding: '1.25rem', background: 'var(--bg-hover)', borderRadius: '1rem' }}>
                <ReceiptIcon size={32} color="var(--text-muted)" strokeWidth={1} />
              </div>
              <h3 style={{ fontSize: '1.125rem', margin: '0 0 0.5rem 0' }}>No Receipts Found</h3>
              <p style={{ color: 'var(--text-muted)', margin: '0', fontSize: '0.875rem' }}>Receipts will appear here once payments are successfully processed.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Receipts;