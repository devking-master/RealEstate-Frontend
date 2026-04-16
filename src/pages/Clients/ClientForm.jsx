import { useState } from 'react';
import { useData } from '../../hooks/useData';
import { toast } from '../../utils/swal';

const ClientForm = ({ onClose }) => {
  const { addClient } = useData();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addClient(formData);
      toast('🎉 Client Onboarded Successfully!', 'success');
      onClose();
    } catch (err) {
      toast('Failed to add client. Please try again.', 'error');
      console.error('Client creation failed:', err);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
      <div className="form-group">
        <label className="form-label">Full Legal Name</label>
        <input 
          required 
          type="text" 
          name="name" 
          className="form-control" 
          value={formData.name} 
          onChange={handleChange} 
          placeholder="e.g. John Doe"
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        <div className="form-group">
          <label className="form-label">Email Context</label>
          <input 
            required 
            type="email" 
            name="email" 
            className="form-control" 
            value={formData.email} 
            onChange={handleChange} 
            placeholder="john@example.com"
          />
        </div>
        
        <div className="form-group">
          <label className="form-label">Primary Phone</label>
          <input 
            required 
            type="tel" 
            name="phone" 
            className="form-control" 
            value={formData.phone} 
            onChange={handleChange} 
            placeholder="+234 ..."
          />
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Physical Provenance</label>
        <textarea 
          name="address" 
          className="form-control" 
          value={formData.address} 
          onChange={handleChange} 
          placeholder="Client's home or office address"
          style={{ height: '100px', resize: 'none', borderRadius: '12px' }}
        />
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '2.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-subtle)' }}>
        <button type="button" className="btn btn-outline" onClick={onClose}>Cancel</button>
        <button type="submit" className="btn btn-primary" style={{ minWidth: '140px' }}>Onboard Client</button>
      </div>
    </form>
  );
};

export default ClientForm;
