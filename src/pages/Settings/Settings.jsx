import { useState, useEffect } from 'react';
import { useData } from '../../hooks/useData';
import { 
  Settings as SettingsIcon, 
  Save, 
  Building2, 
  Receipt, 
  Image as ImageIcon,
  Shield,
  CreditCard,
  Database,
  Globe,
  CheckCircle2,
  ChevronRight,
  Monitor
} from 'lucide-react';

const Settings = () => {
  const { settings, updateSettings } = useData();
  const [formData, setFormData] = useState({
    companyName: settings.companyName,
    currency: settings.currency,
    taxRate: settings.taxRate
  });

  useEffect(() => {
    setFormData({
      companyName: settings.companyName,
      currency: settings.currency,
      taxRate: settings.taxRate
    });
  }, [settings]);

  const [saved, setSaved] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setSaved(false);
  };

  const handleSave = (e) => {
    e.preventDefault();
    updateSettings({
      ...formData,
      taxRate: Number(formData.taxRate)
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const sections = [
    { id: 'profile', label: 'Company Profile', icon: Building2 },
    { id: 'fiscal', label: 'Fiscal Settings', icon: CreditCard },
    { id: 'billing', label: 'Billing Preferences', icon: Receipt },
    { id: 'security', label: 'Security & Access', icon: Shield },
  ];

  return (
    <div className="page-container animate-fade-in-up">
      <div className="page-header">
        <div>
          <h1 className="page-title">Enterprise Infrastructure</h1>
          <p className="page-subtitle">Strategic configuration of your organizational core and fiscal protocols.</p>
        </div>
        <button className="btn btn-primary" onClick={handleSave}>
          <Save size={18} /> Commit Changes
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr 320px', gap: '2.5rem', alignItems: 'start' }}>
        {/* Navigation Rail */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {sections.map(s => (
                <button 
                  key={s.id}
                  className={`nav-item ${s.id === 'profile' ? 'active' : ''}`}
                  style={{ border: 'none', background: 'transparent', width: '100%', textAlign: 'left', cursor: 'pointer' }}
                >
                    <s.icon size={18} className="nav-item-icon" />
                    <span className="nav-label" style={{ opacity: 1 }}>{s.label}</span>
                </button>
            ))}
            <div style={{ marginTop: '2rem', padding: '1rem', background: 'var(--bg-hover)', borderRadius: '12px' }}>
                <p style={{ fontSize: '0.6875rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Environment</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.75rem' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }}></div>
                    <span style={{ fontSize: '0.8125rem', fontWeight: 700 }}>Production Cluster</span>
                </div>
            </div>
        </div>

        {/* Main Configuration form */}
        <div className="card" style={{ padding: '2.5rem' }}>
          <h3 style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: 900, fontSize: '1.25rem' }}>
            <Building2 size={24} color="var(--brand-primary)" />
            Core Identity
          </h3>
          
          <form id="settings-form" onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div className="form-group">
              <label className="form-label" style={{ fontWeight: 800, fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.05em' }}>Organization Legal Name</label>
              <input required type="text" name="companyName" className="form-control" style={{ fontSize: '1rem', fontWeight: 600, padding: '0.875rem 1.25rem', borderRadius: '12px' }} value={formData.companyName} onChange={handleChange} />
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem', fontWeight: 500 }}>Global identifier for invoices, receipts, and system notifications.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <div className="form-group">
                <label className="form-label" style={{ fontWeight: 800, fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.05em' }}>Sovereign Currency</label>
                <div style={{ position: 'relative' }}>
                    <Globe size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <select name="currency" className="form-control" style={{ paddingLeft: '2.75rem', fontWeight: 700, borderRadius: '12px' }} value={formData.currency} onChange={handleChange}>
                        <option value="₦">₦ (NGN)</option>
                        <option value="$">$ (USD)</option>
                        <option value="€">€ (EUR)</option>
                        <option value="£">£ (GBP)</option>
                    </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" style={{ fontWeight: 800, fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.05em' }}>Fiscal Tax Rate (%)</label>
                <input required type="number" step="0.1" name="taxRate" className="form-control" style={{ fontWeight: 700, textAlign: 'right', borderRadius: '12px' }} value={formData.taxRate} onChange={handleChange} />
              </div>
            </div>

            <div style={{ marginTop: '1rem', paddingTop: '2.5rem', borderTop: '1px solid var(--border-subtle)' }}>
              <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: 900, fontSize: '1.25rem' }}>
                <ImageIcon size={24} color="var(--brand-primary)" />
                Visual Assets
              </h3>
              
              <div className="form-group">
                <label className="form-label" style={{ fontWeight: 800, fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.05em' }}>Company Logotype</label>
                <div style={{ padding: '2.5rem', border: '2px dashed var(--border-main)', borderRadius: '16px', textAlign: 'center', background: 'var(--bg-hover)' }}>
                  <ImageIcon size={40} color="var(--text-muted)" style={{ margin: '0 auto 1rem' }} strokeWidth={1} />
                  <p style={{ fontSize: '0.9375rem', color: 'var(--text-main)', fontWeight: 700 }}>Deploy vector or raster logo</p>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>Recommended: 400x400px PNG or SVG</p>
                  <button type="button" className="btn btn-outline" style={{ marginTop: '1.5rem', borderRadius: '10px' }}>Upload Asset</button>
                </div>
              </div>
            </div>
            
            {saved && (
              <div className="animate-slide-up" style={{ padding: '1rem 1.25rem', backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#10b981', borderRadius: '12px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.75rem', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                <CheckCircle2 size={20} /> Changes successfully synchronized
              </div>
            )}
          </form>
        </div>
        
        {/* Secondary Info Rail */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="card" style={{ padding: '1.5rem' }}>
            <h4 style={{ fontWeight: 900, marginBottom: '1.25rem', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>System Node</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ background: 'var(--bg-hover)', p: '0.5rem', borderRadius: '8px' }}>
                    <Monitor size={16} color="var(--text-muted)" />
                  </div>
                  <div>
                    <p style={{ fontSize: '0.75rem', fontWeight: 800 }}>Core Version</p>
                    <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', fontWeight: 600 }}>v15.2.0-stable</p>
                  </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ background: 'var(--bg-hover)', p: '0.5rem', borderRadius: '8px' }}>
                    <Database size={16} color="var(--text-muted)" />
                  </div>
                  <div>
                    <p style={{ fontSize: '0.75rem', fontWeight: 800 }}>Schema Type</p>
                    <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', fontWeight: 600 }}>Relational Hybrid</p>
                  </div>
              </div>
            </div>
            <button className="btn btn-outline" style={{ width: '100%', marginTop: '2rem', justifyContent: 'center' }}>
              Diagnostic Hub
            </button>
          </div>
          
          <div className="card" style={{ padding: '1.5rem', background: 'rgba(239, 68, 68, 0.05)', borderColor: 'rgba(239, 68, 68, 0.1)' }}>
            <h4 style={{ fontWeight: 900, marginBottom: '0.75rem', fontSize: '0.875rem', color: '#ef4444' }}>Danger Sector</h4>
            <p style={{ fontSize: '0.75rem', color: 'rgba(239, 68, 68, 0.8)', lineHeight: '1.5', fontWeight: 600 }}>Permanent removal of all institutional data from this cluster.</p>
            <button className="btn btn-outline" style={{ width: '100%', marginTop: '1.5rem', borderColor: 'rgba(239, 68, 68, 0.2)', color: '#ef4444' }}>
              Purge Database
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
