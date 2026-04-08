import { useState } from 'react';
import { useData } from '../../hooks/useData';
import ClientForm from './ClientForm';
import Modal from '../../components/UI/Modal';
import './Clients.css';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Search, 
  Filter, 
  MoreHorizontal, 
  Download, 
  UserPlus,
  ChevronRight,
  ExternalLink,
  Users as UsersIcon
} from 'lucide-react';

const Clients = () => {
  const { clients } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredClients = clients.filter(c => 
    c.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="page-container animate-fade-in-up">
      <div className="page-header">
        <div>
          <h1 className="page-title">Client Intelligence</h1>
          <p className="page-subtitle">Unified registry of owners, tenants, and institutional leads.</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button className="btn btn-outline">
                <Download size={16} /> Export
            </button>
            <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
                <UserPlus size={16} /> Add Profile
            </button>
        </div>
      </div>

      <div className="card">
        <div className="card-header" style={{ padding: '1.5rem 2rem', borderBottom: '1px solid var(--border-main)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-hover)' }}>
            <div style={{ display: 'flex', gap: '1.25rem', flex: 1 }}>
                <div className="search-wrapper">
                    <Search className="search-icon" size={18} />
                    <input 
                        type="text" 
                        placeholder="Scan names, emails or identities..." 
                        className="form-control search-input"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <button className="btn btn-outline" style={{ borderRadius: '12px' }}>
                    <Filter size={16} /> Advanced Filters
                </button>
            </div>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {filteredClients.length} Profiles
            </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '1.5rem', padding: '1.5rem' }}>
          {filteredClients.length > 0 ? (
            filteredClients.map((client, i) => (
              <div
                key={client._id || client.id}
                className="card"
                style={{
                  padding: '1.5rem',
                  borderRadius: 'var(--radius-xl)',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
                  transition: 'box-shadow 0.3s ease',
                  animationDelay: `${0.1 + i * 0.05}s`
                }}
                onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)'}
                onMouseLeave={(e) => e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.05)'}
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <h3 style={{ fontWeight: 'bold', fontSize: '1.25rem', color: 'var(--text-main)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{client.name}</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}><strong>ID:</strong> {client._id?.slice(-8).toUpperCase() || 'EXTERNAL'}</p>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}><strong>Email:</strong> <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{client.email}</span></p>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}><strong>Phone:</strong> {client.phone || '--'}</p>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}><strong>Address:</strong> <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{client.address || 'Global Sector'}</span></p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <span className="badge badge-success">Sovereign</span>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '1rem' }}>
                    <button className="btn btn-primary" style={{ flex: 1, padding: '0.5rem 1rem', fontSize: '0.875rem', borderRadius: '0.5rem' }}>
                      <ExternalLink size={14} style={{ marginRight: '0.5rem' }} />
                      View
                    </button>
                    <button className="btn btn-primary" style={{ flex: 1, padding: '0.5rem 1rem', fontSize: '0.875rem', borderRadius: '0.5rem' }}>
                      <MoreHorizontal size={14} style={{ marginRight: '0.5rem' }} />
                      More
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="card" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem 1.5rem', borderRadius: 'var(--radius-xl)', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
              <div style={{ marginBottom: '1.5rem', display: 'inline-flex', padding: '1.25rem', background: 'var(--bg-hover)', borderRadius: '1rem' }}>
                <UsersIcon size={32} color="var(--text-muted)" strokeWidth={1} />
              </div>
              <h3 style={{ fontSize: '1.125rem', margin: '0 0 0.5rem 0' }}>Empty Directory</h3>
              <p style={{ color: 'var(--text-muted)', margin: '0', fontSize: '0.875rem' }}>No tactical records found matching your query. Expand your network or adjust filters.</p>
            </div>
          )}
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Strategic Client Onboarding">
        <ClientForm onClose={() => setIsModalOpen(false)} />
      </Modal>
    </div>
  );
};

export default Clients;
