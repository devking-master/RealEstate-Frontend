import { useState, useEffect } from 'react';
import { useData } from '../../hooks/useData';

const TransactionForm = ({ onClose }) => {
  // loading is pulled from context to ensure properties are fetched before auto-filling
  const { properties = [], clients = [], addTransaction, loading } = useData();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    client: '',
    property: '',
    type: 'sale',
    totalAmount: '',
    paidAmount: '',
    paymentMethod: 'bank_transfer', // ADDED: Default value
    paymentStructure: 'full',
    status: 'pending',
    notes: ''
  });

  // AUTO-FILL LOGIC: Triggers when property selection changes or data finishes loading
  useEffect(() => {
    if (!loading && formData.property && properties.length > 0) {
      const selectedProp = properties.find(p => 
        (p._id === formData.property) || 
        (p.id === formData.property) || 
        (p.propertyId === formData.property)
      );

      if (selectedProp) {
        console.log("Selected Property Found:", selectedProp);
        
        let actualPrice = selectedProp.price;

        // Fallback for JSON-packed descriptions if price isn't a direct field
        if (!actualPrice && selectedProp.description?.startsWith('{')) {
          try {
            const extraData = JSON.parse(selectedProp.description);
            actualPrice = extraData.price;
          } catch (e) {
            console.error("Could not parse price from description");
          }
        }

        // Auto-fill the price into totalAmount
        setFormData(prev => ({
          ...prev,
          totalAmount: actualPrice || prev.totalAmount || '', 
        }));
      }
    }
  }, [formData.property, properties, loading]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    setFormData(prev => {
      let newData = { ...prev, [name]: value };

      // Recalculate status whenever amounts change
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
      return alert("Please select both a client and a property.");
    }

    setIsSubmitting(true);
    try {
      const payload = {
        ...formData,
        totalAmount: Number(formData.totalAmount),
        paidAmount: Number(formData.paidAmount) || 0,
        // Optional unique ID if your backend doesn't handle it
        transactionId: `TXN-${Date.now().toString().slice(-6)}`
      };
      
      await addTransaction(payload);
      onClose();
    } catch (err) {
      alert("Failed to create transaction: " + (err.response?.data?.message || err.message));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-2">
      {/* Client Selection */}
      <div className="form-group">
        <label className="block text-sm font-bold mb-1">Client Name</label>
        <select 
          required 
          name="client" 
          className="form-control w-full border rounded p-2 focus:ring-2 focus:ring-blue-500 outline-none" 
          value={formData.client} 
          onChange={handleChange}
        >
          <option value="">-- Select Client --</option>
          {clients.map(c => (
            <option key={c._id || c.id} value={c._id || c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      {/* Property Selection */}
      <div className="form-group">
        <label className="block text-sm font-bold mb-1">Property</label>
        <select 
          required 
          name="property" 
          className="form-control w-full border rounded p-2 focus:ring-2 focus:ring-blue-500 outline-none" 
          value={formData.property} 
          onChange={handleChange}
        >
          <option value="">-- Select Property --</option>
          {/* FIX: Filter to only show 'available' properties */}
          {properties
            .filter(p => p.status === 'available')
            .map(p => (
              <option key={p._id || p.id} value={p._id || p.id}>
                {p.name}
              </option>
            ))
          }
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Total Amount */}
        <div className="form-group">
          <label className="block text-sm font-bold mb-1">Total Price (₦)</label>
          <input 
            required 
            type="number" 
            name="totalAmount" 
            placeholder="0.00"
            className="form-control w-full border rounded p-2" 
            value={formData.totalAmount} 
            onChange={handleChange} 
          />
        </div>

        {/* Paid Amount */}
        <div className="form-group">
          <label className="block text-sm font-bold mb-1">Initial Deposit (₦)</label>
          <input 
            type="number" 
            name="paidAmount" 
            placeholder="0.00"
            className="form-control w-full border rounded p-2" 
            value={formData.paidAmount} 
            onChange={handleChange} 
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 items-end">
        {/* Status Badge */}
        <div className="mt-2">
          <label className="block text-xs text-gray-500 font-bold uppercase mb-1">Calculated Status</label>
          <div className={`inline-block px-3 py-2 rounded border text-xs font-black uppercase tracking-wider ${
            formData.status === 'completed' ? 'bg-green-50 text-green-700 border-green-200' : 
            formData.status === 'partially_paid' ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-gray-50 text-gray-700 border-gray-200'
          }`}>
            {formData.status.replace('_', ' ')}
          </div>
        </div>

        {/* ADDED: Payment Method Selection */}
        <div className="form-group">
          <label className="block text-sm font-bold mb-1">Payment Method</label>
          <select 
            name="paymentMethod" 
            className="form-control w-full border rounded p-2 focus:ring-2 focus:ring-blue-500 outline-none" 
            value={formData.paymentMethod} 
            onChange={handleChange}
          >
            <option value="bank_transfer">Bank Transfer</option>
            <option value="cash">Cash</option>
            <option value="check">Check</option>
            <option value="credit_card">Credit Card</option>
          </select>
        </div>
      </div>

      <div className="form-group mt-4">
        <label className="block text-sm font-bold mb-1">Internal Notes</label>
        <textarea 
          name="notes" 
          placeholder="Enter any specific details about this deal..."
          className="form-control w-full border rounded p-2 min-h-[80px]" 
          value={formData.notes} 
          onChange={handleChange} 
          rows="2" 
        />
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t">
        <button type="button" className="px-5 py-2 text-gray-600 font-bold border rounded hover:bg-gray-50 transition-colors" onClick={onClose}>
          Cancel
        </button>
        <button 
          type="submit" 
          className="px-5 py-2 bg-blue-600 text-white rounded font-bold hover:bg-blue-700 disabled:opacity-50 transition-colors shadow-sm" 
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Processing...' : 'Create Transaction'}
        </button>
      </div>
    </form>
  );
};

export default TransactionForm;