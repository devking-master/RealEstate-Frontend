import { useState, useMemo } from 'react';
import { useData } from '../../hooks/useData';
import { toast } from '../../utils/swal';

const PaymentForm = ({ transactionId, onClose }) => {
  const { makeInvoicePayment, transactions = [], invoices = [] } = useData();
  const [formData, setFormData] = useState({
    amount: '',
    method: 'bank_transfer',
    date: new Date().toISOString().split('T')[0]
  });
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentTransaction = useMemo(() => {
    return transactions.find(t => (t._id || t.id) === transactionId);
  }, [transactions, transactionId]);

  const remainingBalance = currentTransaction 
    ? (Number(currentTransaction.totalAmount) - Number(currentTransaction.paidAmount || 0)) 
    : 0;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      if (!currentTransaction) throw new Error("Transaction details not found.");
      
      const linkedInvoice = invoices.find(inv => {
        const invTxnId = inv.transactionId?._id || inv.transactionId;
        return invTxnId === transactionId;
      });

      if (!linkedInvoice) throw new Error("No invoice found for this transaction.");

      const paymentData = {
        amount: Number(formData.amount),
        paymentMethod: formData.method,
        propertyId: currentTransaction.property?._id || currentTransaction.property,
        date: formData.date
      };

      await makeInvoicePayment(linkedInvoice._id, paymentData);
      toast('✅ Payment Recorded Successfully!', 'success');
      onClose(); 
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="animate-fade-in-up">
      {error && (
        <div className="badge badge-danger" style={{ width: '100%', marginBottom: '1rem', padding: '0.75rem' }}>
          {error}
        </div>
      )}

      {currentTransaction && (
        /* UPDATED: High Contrast Balance Box */
        <div style={{ 
          padding: '1.5rem', 
          marginBottom: '2rem', 
          background: 'var(--zinc-900)', // Dark background
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--zinc-800)',
          color: '#ffffff' // Pure white text
        }}>
          <p style={{ 
            fontSize: '0.7rem', 
            fontWeight: 800, 
            textTransform: 'uppercase', 
            letterSpacing: '0.1em', 
            color: 'var(--zinc-400)', // Muted label color
            marginBottom: '0.5rem'
          }}>
            Outstanding Balance
          </p>
          <p style={{ 
            fontSize: '2rem', 
            fontWeight: 900, 
            letterSpacing: '-0.05em',
            color: '#ffffff' // The amount is now bright white
          }}>
            ₦{remainingBalance.toLocaleString()}
          </p>
          <p style={{ 
            fontSize: '0.8rem', 
            marginTop: '0.5rem', 
            color: 'var(--zinc-400)',
            fontWeight: 500
          }}>
            Property: {currentTransaction.property?.title || currentTransaction.property?.name || 'Asset'}
          </p>
        </div>
      )}
      
      <div className="form-group">
        <label className="form-label">Payment Amount (₦)</label>
        <input 
          required 
          type="number" 
          name="amount" 
          className="form-control" 
          value={formData.amount} 
          onChange={handleChange} 
          placeholder="0.00" 
          max={remainingBalance}
          min="1" 
        />
      </div>

      <div className="form-group">
        <label className="form-label">Payment Method</label>
        <select name="method" className="form-control" value={formData.method} onChange={handleChange}>
          <option value="bank_transfer">Bank Transfer</option>
          <option value="cash">Cash</option>
          <option value="cheque">Cheque</option>
          <option value="online">Online Payment</option>
        </select>
      </div>

      <div className="form-group">
        <label className="form-label">Payment Date</label>
        <input required type="date" name="date" className="form-control" value={formData.date} onChange={handleChange} />
      </div>

      <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-main">
        <button type="button" className="btn btn-outline" onClick={onClose} disabled={isSubmitting}>
          Cancel
        </button>
        <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
          {isSubmitting ? 'Processing...' : 'Confirm Payment'}
        </button>
      </div>
    </form>
  );
};

export default PaymentForm;