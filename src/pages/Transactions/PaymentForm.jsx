import { useState, useMemo } from 'react';
import { useData } from '../../hooks/useData';

const PaymentForm = ({ transactionId, onClose }) => {
  const { makeInvoicePayment, transactions = [], invoices = [] } = useData();
  const [formData, setFormData] = useState({
    amount: '',
    method: 'bank_transfer',
    date: new Date().toISOString().split('T')[0]
  });
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 1. Get transaction details to show remaining balance
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
      
      if (Number(formData.amount) <= 0) {
        throw new Error("Please enter a valid payment amount.");
      }

      // 2. Automatically find the invoice linked to this transaction
      const linkedInvoice = invoices.find(inv => {
        const invTxnId = inv.transactionId?._id || inv.transactionId;
        return invTxnId === transactionId;
      });

      if (!linkedInvoice) {
        throw new Error("No invoice found for this transaction. Please generate an invoice first.");
      }

      // 3. Prepare payload for the backend
      const paymentData = {
        amount: Number(formData.amount), // Matches 'amount' in controller
        method: formData.method,
        date: formData.date
      };

      // 4. Execute payment
      await makeInvoicePayment(linkedInvoice._id, paymentData);

      alert('Payment recorded! Transaction and Invoice have been updated.');
      onClose(); 
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.message || 'Error recording payment';
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-2">
      {error && (
        <div className="p-3 bg-red-100 text-red-700 rounded-md text-sm font-bold border border-red-200">
          {error}
        </div>
      )}

      {currentTransaction && (
        <div className="p-4 bg-blue-50 rounded-md border border-blue-200">
          <p className="text-xs text-blue-700 font-bold uppercase tracking-wider">Outstanding Balance</p>
          <p className="text-2xl font-black text-blue-900">
            ₦{remainingBalance.toLocaleString()}
          </p>
          <p className="text-xs text-blue-600 mt-1">Transaction ID: {transactionId.slice(-8).toUpperCase()}</p>
        </div>
      )}
      
      <div className="form-group">
        <label className="block text-sm font-bold mb-1">Payment Amount (₦)</label>
        <input 
          required 
          type="number" 
          name="amount" 
          className="w-full border rounded-md p-2 focus:ring-2 focus:ring-blue-500 outline-none" 
          value={formData.amount} 
          onChange={handleChange} 
          placeholder="0.00" 
          max={remainingBalance > 0 ? remainingBalance : undefined}
          min="1" 
        />
      </div>

      <div className="form-group">
        <label className="block text-sm font-bold mb-1">Payment Method</label>
        <select 
          name="method" 
          className="w-full border rounded-md p-2 focus:ring-2 focus:ring-blue-500 outline-none" 
          value={formData.method} 
          onChange={handleChange}
        >
          <option value="bank_transfer">Bank Transfer</option>
          <option value="cash">Cash</option>
          <option value="cheque">Cheque</option>
          <option value="online">Online Payment</option>
        </select>
      </div>

      <div className="form-group">
        <label className="block text-sm font-bold mb-1">Payment Date</label>
        <input 
          required 
          type="date" 
          name="date" 
          className="w-full border rounded-md p-2 focus:ring-2 focus:ring-blue-500 outline-none" 
          value={formData.date} 
          onChange={handleChange} 
        />
      </div>

      <div className="flex justify-end gap-3 mt-4 pt-4 border-t">
        <button 
          type="button" 
          className="px-4 py-2 text-gray-600 font-bold hover:bg-gray-100 rounded-md transition-colors" 
          onClick={onClose} 
          disabled={isSubmitting}
        >
          Cancel
        </button>
        <button 
          type="submit" 
          className="px-6 py-2 bg-blue-600 text-white rounded-md font-bold hover:bg-blue-700 disabled:opacity-50 transition-colors" 
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Processing...' : 'Confirm Payment'}
        </button>
      </div>
    </form>
  );
};

export default PaymentForm;