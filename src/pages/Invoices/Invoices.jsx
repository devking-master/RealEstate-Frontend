import { useState } from 'react';
import { useData } from '../../hooks/useData';
import { Download, RefreshCw, FileText } from 'lucide-react';
import { privateApiClient } from '../../api/client';
import './Invoices.css'; 

const Invoices = () => {
  const { invoices, settings, loading, refreshData } = useData();
  const [error, setError] = useState(null);

  const formatCurrency = (amount) => {
    const currencySymbol = settings?.currency || '₦';
    return `${currencySymbol}${Number(amount || 0).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`;
  };

  const handleDownloadInvoice = async (invoice) => {
    try {
      const response = await privateApiClient.get(`/invoices/${invoice._id}/pdf`, {
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${invoice.invoiceNumber}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError('Unable to download invoice PDF');
    }
  };

  return (
    <div className="page-container animate-fade-in-up">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className="page-title">Invoices</h1>
          <p className="page-subtitle">View billing history and download official PDFs.</p>
        </div>
        <button onClick={() => refreshData()} className="btn btn-outline" disabled={loading}>
          <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="card" style={{ padding: '1rem' }}>
        {invoices.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem' }}>
            <p>No invoices available.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
            {invoices.map((invoice) => (
              <div key={invoice._id} className="card shadow-sm" style={{ padding: '1.25rem', borderRadius: '1rem', border: '1px solid var(--border-subtle)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <h3 style={{ margin: 0 }}><FileText size={18} /> {invoice.invoiceNumber}</h3>
                  <span className={`badge badge-${invoice.status === 'paid' ? 'success' : 'warning'}`}>
                    {invoice.status?.toUpperCase()}
                  </span>
                </div>
                
                <div style={{ fontSize: '0.9rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <p><strong>Client:</strong> {invoice.client?.name || 'Unknown'}</p>
                  <p><strong>Property:</strong> {
    invoice.propertyId?.title || 
    invoice.propertyId?.name || 
    invoice.property?.title || 
    'N/A'
  }</p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem' }}>
                    <span>Total:</span>
                    <span>{formatCurrency(invoice.totalAmount)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--success)' }}>
                    <span>Paid:</span>
                    <span>{formatCurrency(invoice.amountPaid)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, borderTop: '1px solid #eee', paddingTop: '0.5rem' }}>
                    <span>Balance:</span>
                    <span style={{ color: invoice.balance > 0 ? 'var(--danger)' : 'inherit' }}>
                      {formatCurrency(invoice.balance)}
                    </span>
                  </div>
                </div>

                <button onClick={() => handleDownloadInvoice(invoice)} className="btn btn-outline" style={{ width: '100%', marginTop: '1rem' }}>
                  <Download size={14} /> Download PDF
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Invoices;