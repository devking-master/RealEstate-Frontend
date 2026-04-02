import { useState } from 'react';
import { useData } from '../../hooks/useData';

const InvoiceForm = ({ onClose }) => {
  const { clients, addInvoice } = useData();
  const [formData, setFormData] = useState({
    client: '',
    description: '',
    amount: '',
    dueDate: '',
    status: 'unpaid'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    addInvoice(formData);
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
      <div className="form-group">
        <label className="form-label">Client / Entity</label>
        <select required name="client" className="form-control" value={formData.client} onChange={handleChange} style={{ fontWeight: 700 }}>
          <option value="" disabled>-- Select Counterparty --</option>
          {clients.map(c => (
            <option key={c._id || c.id} value={c._id || c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label className="form-label">Service Description</label>
        <input required type="text" name="description" className="form-control" value={formData.description} onChange={handleChange} placeholder="e.g. Agency Fee for Plot 12" />
      </div>

      <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem'}}>
        <div className="form-group">
          <label className="form-label">Net Amount</label>
          <input required type="number" name="amount" className="form-control" value={formData.amount} onChange={handleChange} placeholder="0.00" style={{ fontWeight: 800 }} />
        </div>
        
        <div className="form-group">
          <label className="form-label">Maturity Date</label>
          <input required type="date" name="dueDate" className="form-control" value={formData.dueDate} onChange={handleChange} style={{ fontWeight: 600 }} />
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Initial Cycle Status</label>
        <select name="status" className="form-control" value={formData.status} onChange={handleChange} style={{ fontWeight: 700 }}>
          <option value="unpaid">Unpaid / Pending</option>
          <option value="paid">Settled / Paid</option>
        </select>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '2.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-subtle)' }}>
        <button type="button" className="btn btn-outline" onClick={onClose}>Cancel</button>
        <button type="submit" className="btn btn-primary" style={{ minWidth: '160px' }} disabled={!formData.client}>Generate Bill</button>
      </div>
    </form>
  );
};

export default InvoiceForm;
