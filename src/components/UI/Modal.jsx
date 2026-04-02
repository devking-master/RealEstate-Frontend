import { X } from 'lucide-react';

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3 style={{fontWeight: 900, fontSize: '1.25rem', letterSpacing: '-0.04em', color: 'var(--text-main)'}}>{title}</h3>
          <button className="btn btn-outline" style={{ padding: '0.5rem', borderRadius: '12px', minWidth: '40px' }} onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        <div className="modal-body">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
