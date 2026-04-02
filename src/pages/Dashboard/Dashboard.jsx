import { useState } from 'react';
import { useData } from '../../hooks/useData';
import { 
  Building2, 
  Users, 
  TrendingUp, 
  CreditCard,
  ChevronRight,
  ArrowUpRight,
  Plus,
  Zap,
  Search
} from 'lucide-react';
import PropertyForm from '../Properties/PropertyForm';
import Modal from '../../components/UI/Modal';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

const Dashboard = () => {
  const { properties, clients, transactions, settings, stats, loading } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'NGN',
    }).format(amount || 0).replace('NGN', settings.currency);
  };

  const dashboardStats = [
    { label: 'Portfolio Assets', value: stats?.inventory?.total || properties.length, icon: Building2, color: '#3b82f6' },
    { label: 'Strategic Clients', value: clients.length, icon: Users, color: '#10b981' },
    { label: 'Total Capital', value: formatCurrency(stats?.financials?.totalSalesRevenue || 0), icon: TrendingUp, color: '#8b5cf6' },
    { label: 'Active Pipeline', value: transactions.filter(t => t.status === 'pending').length || 0, icon: CreditCard, color: '#f59e0b' },
  ];

  if (loading && !properties.length) {
    return (
        <div className="page-container">
            <div className="page-header">
                <div className="loading-placeholder" style={{ width: '200px', height: '40px' }}></div>
                <div className="loading-placeholder" style={{ width: '120px', height: '40px' }}></div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem' }}>
                {[1,2,3,4].map(i => <div key={i} className="loading-placeholder" style={{ height: '120px' }}></div>)}
            </div>
        </div>
    );
  }

  return (
    <div className="page-container animate-fade-in-up">
      <div className="page-header" style={{ alignItems: 'center' }}>
        <div>
          <h1 className="page-title">Executive Overview</h1>
          <p className="page-subtitle">Unified intelligence across your real estate enterprise.</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
            <button className="btn btn-outline">Generate PDF</button>
            <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
                <Plus size={16} /> New Asset
            </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
        {dashboardStats.map((stat, i) => (
          <div key={i} className="card animate-stagger" style={{ animationDelay: `${i * 0.1}s`, display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
               <div style={{ width: '42px', height: '42px', background: `${stat.color}15`, borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <stat.icon size={20} color={stat.color} />
               </div>
               <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#10b981' }}>+12.5%</span>
            </div>
            <div>
                <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{stat.label}</p>
                <p style={{ fontSize: '1.75rem', fontWeight: 900, marginTop: '0.25rem', letterSpacing: '-0.05em' }}>{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 420px', gap: '2rem' }}>
        <div className="card" style={{ minHeight: '480px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2.5rem' }}>
            <div>
                <h3 style={{ fontSize: '1.125rem' }}>Revenue Projections</h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>Real-time growth tracking and fiscal forecasting.</p>
            </div>
          </div>
          <div style={{ flex: 1, minHeight: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={[
                { name: 'Jan', revenue: 4000 },
                { name: 'Feb', revenue: 3000 },
                { name: 'Mar', revenue: 5000 },
                { name: 'Apr', revenue: 2780 },
                { name: 'May', revenue: 6890 },
                { name: 'Jun', revenue: 8390 },
                { name: 'Jul', revenue: 10490 },
              ]} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--brand-accent)" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="var(--brand-accent)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-main)" />
                <XAxis dataKey="name" fontSize={12} axisLine={false} tickLine={false} tick={{fill: 'var(--text-muted)'}} dy={10} />
                <YAxis fontSize={12} axisLine={false} tickLine={false} tick={{fill: 'var(--text-muted)'}} />
                <Tooltip 
                    contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border-main)', borderRadius: '16px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', color: 'var(--text-main)' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="var(--brand-accent)" strokeWidth={4} fillOpacity={1} fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.125rem' }}>Recent Ledger</h3>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--brand-accent)', textTransform: 'uppercase', cursor: 'pointer' }}>Audits &gt;</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {transactions.slice(0, 6).map((txn, i) => (
                <div key={i} className="animate-fade-in-up" style={{ animationDelay: `${0.4 + i * 0.05}s`, display: 'flex', gap: '1.25rem', alignItems: 'center', paddingBottom: '1.25rem', borderBottom: i === 5 ? 'none' : '1px solid var(--border-subtle)' }}>
                    <div className="avatar" style={{ fontSize: '0.8125rem', width: '40px', height: '40px', borderRadius: '12px', background: 'var(--bg-hover)', color: 'var(--text-main)', border: '1px solid var(--border-main)' }}>
                        {txn.client?.name?.charAt(0) || 'C'}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontSize: '0.9375rem', fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {txn.client?.name || 'External Disbursement'}
                        </p>
                        <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>{new Date(txn.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        <p style={{ fontSize: '0.9375rem', fontWeight: 800 }}>{formatCurrency(txn.paidAmount)}</p>
                        <span style={{ fontSize: '0.625rem', fontWeight: 900, color: '#10b981', textTransform: 'uppercase' }}>Verified</span>
                    </div>
                </div>
            ))}
          </div>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="New Asset Registration">
        <PropertyForm onClose={() => setIsModalOpen(false)} />
      </Modal>
    </div>
  );
};

export default Dashboard;
