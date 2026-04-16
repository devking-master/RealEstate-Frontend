import { useState, useEffect } from 'react';
import { useData } from '../../hooks/useData';
import { alert as swalAlert, toast } from '../../utils/swal';

const TransactionForm = ({ onClose }) => {
  const { properties = [], clients = [], addTransaction, loading } = useData();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    client: '',
    property: '',
    type: 'sale',
    totalAmount: '',
    paidAmount: '',
    paymentMethod: 'bank_transfer',
    paymentStructure: 'full',
    status: 'pending',
    notes: ''
  });

  useEffect(() => {
    if (!loading && formData.property && properties.length > 0) {
      const selectedProp = properties.find(p => (p._id || p.id) === formData.property);
      if (selectedProp) {
        setFormData(prev => ({ ...prev, totalAmount: selectedProp.price || '' }));
      }
    }
  }, [formData.property, properties, loading]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      let newData = { ...prev, [name]: value };
      const total = Number(name === 'totalAmount' ? value : newData.totalAmount);
      const paid = Number(name === 'paidAmount' ? value : newData.paidAmount);
      if (total > 0) {
        if (paid >= total) newData.status = 'completed';
        else if (paid > 0) newData.status = 'partially_paid';
        else newData.status = 'pending';
      }
      return newData;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.client || !formData.property) {
      swalAlert("Missing Selection", "Please select client and property.", "warning");
      return;
    }

    setIsSubmitting(true);
    try {
      await addTransaction({
        ...formData,
        totalAmount: Number(formData.totalAmount),
        paidAmount: Number(formData.paidAmount) || 0,
        transactionId: `TXN-${Date.now().toString().slice(-6)}`
      });
      toast('💰 Transaction Created Successfully!', 'success');
      onClose();
    } catch (err) {
      swalAlert("Operation Failed", err.message, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="animate-fade-in-up">
      <div className="form-group">
        <label className="form-label">Client Name</label>
        <select required name="client" className="form-control" value={formData.client} onChange={handleChange}>
          <option value="">-- Select Client --</option>
          {clients.map(c => <option key={c._id || c.id} value={c._id || c.id}>{c.name}</option>)}
        </select>
      </div>

      <div className="form-group">
        <label className="form-label">Property</label>
        <select required name="property" className="form-control" value={formData.property} onChange={handleChange}>
          <option value="">-- Select Property --</option>
          {properties.filter(p => p.status === 'available').map(p => (
            <option key={p._id || p.id} value={p._id || p.id}>{p.name || p.title}</option>
          ))}
        </select>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        <div className="form-group">
          <label className="form-label">Total Price (₦)</label>
          <input required type="number" name="totalAmount" className="form-control" value={formData.totalAmount} onChange={handleChange} placeholder="0.00" />
        </div>
        <div className="form-group">
          <label className="form-label">Initial Deposit (₦)</label>
          <input type="number" name="paidAmount" className="form-control" value={formData.paidAmount} onChange={handleChange} placeholder="0.00" />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', alignItems: 'center' }}>
        <div className="form-group">
          <label className="form-label">Payment Method</label>
          <select name="paymentMethod" className="form-control" value={formData.paymentMethod} onChange={handleChange}>
            <option value="bank_transfer">Bank Transfer</option>
            <option value="cash">Cash</option>
            <option value="check">Check</option>
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Status</label>
          <div className={`badge ${formData.status === 'completed' ? 'badge-success' : formData.status === 'partially_paid' ? 'badge-warning' : ''}`} style={{ textAlign: 'center', padding: '0.8rem' }}>
            {formData.status.replace('_', ' ')}
          </div>
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Internal Notes</label>
        <textarea name="notes" className="form-control" value={formData.notes} onChange={handleChange} rows="3" placeholder="Deal details..." />
      </div>

      <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-main">
        <button type="button" className="btn btn-outline" onClick={onClose}>Cancel</button>
        <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
          {isSubmitting ? 'Processing...' : 'Create Transaction'}
        </button>
      </div>
    </form>
  );
};

export default TransactionForm;