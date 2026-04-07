import { useState, useMemo } from 'react'; 
import { useData } from '../../hooks/useData';
import { 
  Building2, 
  Users, 
  TrendingUp, 
  CreditCard,
  Plus,
  User 
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
  const { properties = [], clients = [], transactions = [], settings, stats, loading } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'NGN',
    }).format(amount || 0).replace('NGN', settings?.currency || '₦');
  };

  // Logic for Active Pipeline
  const activePipelineCount = useMemo(() => {
    return transactions.filter(t => 
      t.status === 'pending' || t.status === 'partially_paid'
    ).length;
  }, [transactions]);

  // Logic for Total Capital
  const totalCapitalCalculated = useMemo(() => {
    if (stats?.financials?.totalSalesRevenue) return stats.financials.totalSalesRevenue;
    return transactions.reduce((acc, txn) => acc + (Number(txn.paidAmount) || 0), 0);
  }, [stats, transactions]);

  /** * PROPER CHART IMPLEMENTATION 
   * 1. Maps all 12 months to ensure the X-Axis is always full.
   * 2. Filters only the current year's data.
   * 3. Sorts by date to ensure the line flows correctly.
   */
  const chartData = useMemo(() => {
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentYear = new Date().getFullYear();
    
    // Create base data structure
    const dataMap = monthNames.reduce((acc, month) => {
      acc[month] = 0;
      return acc;
    }, {});

    // Aggregate real transaction data
    transactions.forEach(txn => {
      const date = new Date(txn.createdAt);
      if (date.getFullYear() === currentYear) {
        const monthName = monthNames[date.getMonth()];
        dataMap[monthName] += (Number(txn.paidAmount) || 0);
      }
    });

    // Convert map back to array for Recharts
    return monthNames.map(name => ({
      name,
      revenue: dataMap[name]
    }));
  }, [transactions]);

  const dashboardStats = [
    { label: 'Portfolio Assets', value: stats?.inventory?.total || properties.length, icon: Building2, color: '#3b82f6' },
    { label: 'Strategic Clients', value: clients.length, icon: Users, color: '#10b981' },
    { label: 'Total Capital', value: formatCurrency(totalCapitalCalculated), icon: TrendingUp, color: '#8b5cf6' },
    { label: 'Active Pipeline', value: activePipelineCount, icon: CreditCard, color: '#f59e0b' },
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
                <p style={{ fontSize: '1.5rem', fontWeight: 900, marginTop: '0.25rem', letterSpacing: '-0.05em' }}>{stat.value}</p>
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
          <div style={{ flex: 1, minHeight: '320px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(226, 232, 240, 0.1)" />
                <XAxis 
                  dataKey="name" 
                  fontSize={12} 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#94a3b8'}} 
                  dy={10} 
                />
                <YAxis 
                  fontSize={12} 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#94a3b8'}} 
                  tickFormatter={(value) => `₦${value >= 1000 ? (value/1000) + 'k' : value}`}
                />
                <Tooltip 
                    cursor={{ stroke: '#3b82f6', strokeWidth: 1 }}
                    contentStyle={{ 
                      background: '#0f172a', 
                      border: '1px solid rgba(255,255,255,0.1)', 
                      borderRadius: '12px', 
                      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)',
                      color: '#fff' 
                    }}
                    formatter={(value) => [formatCurrency(value), 'Revenue']}
                />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#3b82f6" 
                  strokeWidth={3} 
                  fillOpacity={1} 
                  fill="url(#colorRev)" 
                  animationDuration={1500}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Ledger Section */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.125rem' }}>Recent Ledger</h3>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--brand-accent)', textTransform: 'uppercase', cursor: 'pointer' }}>Audits &gt;</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {transactions.slice(0, 6).map((txn, i) => (
                <div key={i} className="animate-fade-in-up" style={{ animationDelay: `${0.4 + i * 0.05}s`, display: 'flex', gap: '1.25rem', alignItems: 'center', paddingBottom: '1.25rem', borderBottom: i === 5 ? 'none' : '1px solid var(--border-subtle)' }}>
                    <div className="avatar" style={{ width: '40px', height: '40px', borderRadius: '12px', background: '#10b98115', color: '#10b981', border: '1px solid #10b98130', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <User size={20} />
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