import './Properties.css';
import { useState, useRef, useEffect } from 'react';
import { useData } from '../../hooks/useData';
import PropertyForm from './PropertyForm';
import Modal from '../../components/UI/Modal';
import {
  MapPin,
  MoreHorizontal,
  Building2,
  Plus,
  TrendingUp,
  Filter,
  Search,
  CheckCircle2,
  Clock,
  Ban,
  Edit2,
  Trash2,
  Image as ImageIcon,
} from 'lucide-react';

const STATUS_CONFIG = {
  available: { label: 'Available', badge: 'badge-success', icon: CheckCircle2, color: '#10b981' },
  sold:      { label: 'Sold',      badge: 'badge-danger',  icon: Ban,          color: '#ef4444' },
  rented:    { label: 'Rented',    badge: 'badge-warning', icon: Clock,        color: '#f59e0b' },
  under_contract: { label: 'Under Contract', badge: 'badge-info', icon: Clock, color: '#3b82f6' },
};

const Properties = () => {
  const { properties, settings, updatePropertyStatus, deleteProperty } = useData();
  const [isModalOpen, setIsModalOpen]   = useState(false);
  const [editTarget, setEditTarget]     = useState(null);
  const [filter, setFilter]             = useState('All');
  const [searchTerm, setSearchTerm]     = useState('');
  const [openMenu, setOpenMenu]         = useState(null);  
  const [statusLoading, setStatusLoading] = useState(null); 
  const menuRef = useRef({});

  useEffect(() => {
    const handler = (e) => {
      const isInsideAny = Object.values(menuRef.current).some(el => el && el.contains(e.target));
      if (!isInsideAny) setOpenMenu(null);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const formatCurrency = (amount) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'NGN' })
      .format(amount || 0)
      .replace('NGN', settings?.currency || '₦');

  const mappedProperties = properties.map(p => {
    let extraData = {};
    try {
      if (p.description && p.description.startsWith('{')) {
        extraData = JSON.parse(p.description);
      }
    } catch (e) {
      extraData = {};
    }

    return {
      ...p,
      title: p.name || 'Untitled',
      location: extraData.location || p.location || 'Unknown Location',
      size: extraData.size || p.size || '—',
      titleStatus: extraData.titleStatus || p.titleStatus || '—',
      images: p.images || (p.imageUrl ? [p.imageUrl] : []),
      status: p.status || 'available',
      price: p.price || 0,
      description: extraData.text || p.description || ''
    };
  });

  const filtered = mappedProperties.filter(p => {
    const matchFilter = filter === 'All' || (p.status && p.status.toLowerCase() === filter.toLowerCase().replace(' ', '_'));
    const matchSearch = !searchTerm ||
      (p.title && p.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (p.location && p.location.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchFilter && matchSearch;
  });

  const handleOpenEdit = (prop) => {
    setEditTarget(prop);
    setIsModalOpen(true);
    setOpenMenu(null);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditTarget(null);
  };

  const handleStatusChange = async (id, newStatus) => {
    setStatusLoading(id);
    setOpenMenu(null);
    try {
      await updatePropertyStatus(id, newStatus);
    } catch (err) {
      console.error('Status update failed:', err);
    } finally {
      setStatusLoading(null);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this property? This action cannot be undone.')) return;
    setOpenMenu(null);
    try {
      await deleteProperty(id);
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  const ActionMenu = ({ prop }) => {
    const isOpen = openMenu === prop._id;
    return (
      <div className="prop-action-wrapper" ref={el => menuRef.current[prop._id] = el}>
        <button
          className="btn-icon prop-action-btn"
          onClick={(e) => { e.stopPropagation(); setOpenMenu(isOpen ? null : prop._id); }}
          title="Actions"
        >
          <MoreHorizontal size={16} />
        </button>

        {isOpen && (
          <div className="prop-dropdown">
            <div className="prop-dropdown-header">Change Status</div>
            {Object.entries(STATUS_CONFIG).map(([key, cfg]) => {
              const Icon = cfg.icon;
              const isCurrent = prop.status === key;
              return (
                <button
                  key={key}
                  className={`prop-dropdown-item ${isCurrent ? 'active' : ''}`}
                  onClick={() => handleStatusChange(prop._id, key)}
                  disabled={isCurrent || statusLoading === prop._id}
                >
                  <Icon size={13} style={{ color: cfg.color, flexShrink: 0 }} />
                  {cfg.label}
                  {isCurrent && <span className="prop-dropdown-current">Current</span>}
                </button>
              );
            })}
            <div className="prop-dropdown-divider" />
            <button className="prop-dropdown-item" onClick={() => handleOpenEdit(prop)}>
              <Edit2 size={13} style={{ color: 'var(--brand-accent)' }} />
              Edit Property
            </button>
            <button className="prop-dropdown-item danger" onClick={() => handleDelete(prop._id)}>
              <Trash2 size={13} />
              Delete Property
            </button>
          </div>
        )}
      </div>
    );
  };

  const CardView = () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '1.5rem' }}>
      {filtered.map((prop, i) => {
        const firstImage = prop.images?.[0];
        const cfg = STATUS_CONFIG[prop.status] || STATUS_CONFIG.available;
        return (
          <div
            className="card prop-card animate-stagger"
            key={prop._id}
            style={{
              animationDelay: `${i * 0.05}s`,
              padding: 0,
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              borderRadius: 'var(--radius-xl)',
            }}
          >
            <div className="prop-card-img" style={{ height: '200px', background: '#f0f0f0', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {firstImage
                ? <img src={firstImage} alt={prop.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                : <Building2 size={52} color="var(--border-main)" strokeWidth={1} />
              }
              <div style={{ position: 'absolute', top: '0.875rem', right: '0.875rem' }}>
                <span className={`badge ${cfg.badge}`}>{cfg.label}</span>
              </div>
            </div>

            <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h3 style={{ fontSize: '1.0625rem', fontWeight: 800 }}>{prop.title}</h3>
                  <p style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8125rem', color: 'var(--text-muted)', marginTop: '0.375rem' }}>
                    <MapPin size={13} /> {prop.location}
                  </p>
                </div>
                <ActionMenu prop={prop} />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.875rem 0', borderTop: '1px solid var(--border-subtle)', borderBottom: '1px solid var(--border-subtle)' }}>
                {[['Type', prop.type], ['Size', prop.size], ['Title', prop.titleStatus]].map(([k, v]) => (
                  <div key={k} style={{ textAlign: 'center' }}>
                    <p style={{ fontSize: '0.6rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>{k}</p>
                    <p style={{ fontSize: '0.8rem', fontWeight: 700, marginTop: '0.25rem' }}>{v || '—'}</p>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <p style={{ fontSize: '0.625rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Market Value</p>
                  <p style={{ fontSize: '1.1875rem', fontWeight: 900, marginTop: '0.25rem' }}>{formatCurrency(prop.price)}</p>
                </div>
                <button className="btn btn-primary" onClick={() => handleOpenEdit(prop)}>
                  <TrendingUp size={15} />
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="page-container animate-fade-in-up">
      <div className="page-header">
        <div>
          <h1 className="page-title">Real Estate Portfolio</h1>
          <p className="page-subtitle">Strategic management of your inventory.</p>
        </div>
        <button className="btn btn-primary" onClick={() => { setEditTarget(null); setIsModalOpen(true); }}>
          <Plus size={16} /> New Listing
        </button>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem', gap: '1.5rem', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {['All', 'Available', 'Under_Contract', 'Sold', 'Rented'].map(f => (
            <button
              key={f}
              className={`btn ${filter === f.replace('_', ' ') ? 'btn-primary' : 'btn-outline'}`}
              style={{ borderRadius: '9999px', fontSize: '0.75rem' }}
              onClick={() => setFilter(f.replace('_', ' '))}
            >
              {f.replace('_', ' ')}
            </button>
          ))}
        </div>
        <div className="search-wrapper">
          <Search className="search-icon" size={18} />
          <input
            type="text"
            placeholder="Search assets..."
            className="form-control search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {filtered.length > 0 ? <CardView /> : <div className="card" style={{ textAlign: 'center', padding: '4rem' }}>No properties found.</div>}

      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={editTarget ? 'Edit Asset' : 'New Asset Registration'}>
        <PropertyForm onClose={handleCloseModal} existingProperty={editTarget} />
      </Modal>
    </div>
  );
};

export default Properties;