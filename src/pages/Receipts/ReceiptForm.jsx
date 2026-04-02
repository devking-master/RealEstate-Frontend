import { useState } from 'react';
import { useData } from '../../hooks/useData';

const ReceiptForm = ({ onClose }) => {
  const { payments, addReceipt } = useData();
  const [formData, setFormData] = useState({
    payment: '',
    amountPaid: '',
    balanceRemaining: '0'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    addReceipt(formData);
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
      <div className="form-group">
        <label className="form-label">Verified Payment Record</label>
        <select required name="payment" className="form-control" value={formData.payment} onChange={handleChange} style={{ fontWeight: 700 }}>
          <option value="" disabled>-- Select Verified Entry --</option>
          {payments.map(p => (
            <option key={p._id || p.id} value={p._id || p.id}>
                {p.client?.name || 'Client'} - {new Date(p.date || p.createdAt).toLocaleDateString()} ({p.amount})
            </option>
          ))}
        </select>
      </div>

      <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem'}}>
        <div className="form-group">
          <label className="form-label">Liquidated Amount</label>
          <input required type="number" name="amountPaid" className="form-control" value={formData.amountPaid} onChange={handleChange} placeholder="0.00" style={{ fontWeight: 800 }} />
        </div>
        
        <div className="form-group">
          <label className="form-label">Residual Balance</label>
          <input type="number" name="balanceRemaining" className="form-control" value={formData.balanceRemaining} onChange={handleChange} placeholder="0.00" style={{ fontWeight: 600, background: 'var(--bg-hover)' }} />
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '2.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-subtle)' }}>
        <button type="button" className="btn btn-outline" onClick={onClose}>Cancel</button>
        <button type="submit" className="btn btn-primary" style={{ minWidth: '160px' }} disabled={!formData.payment}>Confirm Receipt</button>
      </div>
    </form>
  );
};

export default ReceiptForm;
