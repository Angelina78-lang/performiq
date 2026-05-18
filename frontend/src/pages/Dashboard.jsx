import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance.js';
import { useAuth } from '../context/AuthContext.jsx';
import Navbar from '../components/layout/Navbar.jsx';
import StatCard from '../components/common/StatCard.jsx';
import Loader from '../components/common/Loader.jsx';
import EmployeeForm from '../components/employees/EmployeeForm.jsx';
import ConfirmDialog from '../components/common/ConfirmDialog.jsx';
import PerformanceBarChart from '../components/charts/PerformanceBarChart.jsx';
import DepartmentPieChart from '../components/charts/DepartmentPieChart.jsx';
import TopEmployeesChart from '../components/charts/TopEmployeesChart.jsx';

const Dashboard = ({ onMenuToggle }) => {
  const { toast } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);

  // Direct dashboard employee management states
  const [searchTerm, setSearchTerm] = useState('');
  const [deptFilter, setDeptFilter] = useState('');
  const [showAllEmployees, setShowAllEmployees] = useState(false);

  const fetchData = async () => {
    try {
      const [statsRes, employeesRes] = await Promise.all([
        axiosInstance.get('/employees/stats/summary'),
        axiosInstance.get('/employees'),
      ]);
      setStats(statsRes.data.stats);
      setEmployees(employeesRes.data.employees || []);
    } catch (err) {
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [toast]);

  const handleSubmitForm = async (payload) => {
    setFormLoading(true);
    try {
      if (editingEmployee) {
        await axiosInstance.put(`/employees/${editingEmployee.id}`, payload);
        toast.success('Employee updated successfully');
      } else {
        await axiosInstance.post('/employees', payload);
        toast.success('Employee created successfully');
      }
      fetchData();
      setShowFormModal(false);
      setEditingEmployee(null);
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to save employee';
      toast.error(msg);
    } finally {
      setFormLoading(false);
    }
  };

  const handleEdit = (emp) => {
    setEditingEmployee(emp);
    setShowFormModal(true);
  };

  const handleDeleteConfirm = (id, name) => {
    setConfirmDelete({ id, name });
  };

  const handleDeleteExecute = async () => {
    const { id } = confirmDelete;
    try {
      await axiosInstance.delete(`/employees/${id}`);
      toast.success('Employee deleted successfully');
      fetchData();
    } catch (err) {
      toast.error('Failed to delete employee');
    } finally {
      setConfirmDelete(null);
    }
  };

  if (loading) return <Loader label="Loading dashboard…" />;

  if (!stats) {
    return (
      <div className="page-content">
        <p style={{ color: 'var(--text-dim)' }}>Unable to load dashboard.</p>
      </div>
    );
  }

  const filteredEmployees = employees.filter((emp) => {
    const nameStr = emp.name || '';
    const emailStr = emp.email || '';
    const matchesSearch =
      nameStr.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emailStr.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = !deptFilter || emp.department === deptFilter;
    return matchesSearch && matchesDept;
  });

  return (
    <>
      <Navbar pageTitle="Dashboard" pageSubtitle="Manage your team and view performance metrics" onMenuToggle={onMenuToggle} />

      <div className="page-content">
        {/* Section Header */}
        <div className="section-head">
          <div>
            <h1>📊 Dashboard Overview</h1>
            <p>Monitor team performance and manage employees</p>
          </div>
          <button
            className="btn btn-primary"
            onClick={() => {
              setEditingEmployee(null);
              setShowFormModal(true);
            }}
          >
            ➕ Add Employee
          </button>
        </div>

        {/* Stat Cards */}
        <div className="stat-grid">
          <StatCard
            icon="👥"
            label="Total Employees"
            value={stats.totalEmployees}
            foot={`${stats.totalEmployees} total members`}
            accent="var(--brand)"
          />
          <StatCard
            icon="📊"
            label="Avg. Performance"
            value={`${stats.averagePerformance}/100`}
            foot={`Team average score`}
            accent="var(--green)"
          />
          <StatCard
            icon="⭐"
            label="Top Performer"
            value={stats.topPerformer?.name || '—'}
            foot={`${stats.topPerformer?.performanceScore}/100`}
            accent="var(--amber)"
          />
          <StatCard
            icon="🚀"
            label="Promotion Ready"
            value={stats.promotionEligibleCount}
            foot={`Ready for advancement`}
            accent="var(--purple)"
          />
        </div>

        {/* Quick Access Control Hub */}
        <div style={{ marginTop: '32px', marginBottom: '12px' }}>
          <h3 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '14px', letterSpacing: '-0.01em', textTransform: 'uppercase', color: 'var(--text-dim)' }}>🚀 Quick Navigation Hub</h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '18px'
          }} className="quick-access-grid">
            
            {/* Card 1: Employees */}
            <div className="card card-pad quick-card" onClick={() => navigate('/employees')} style={{
              background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.07) 0%, rgba(99, 102, 241, 0.03) 100%)',
              border: '1px solid var(--border-soft)',
              borderRadius: 'var(--radius)',
              cursor: 'pointer',
              transition: 'all 0.22s ease',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              minHeight: '140px',
              position: 'relative',
              overflow: 'hidden'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-3px)';
              e.currentTarget.style.borderColor = 'var(--brand)';
              e.currentTarget.style.boxShadow = '0 10px 24px -8px rgba(56, 189, 248, 0.25)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.borderColor = 'var(--border-soft)';
              e.currentTarget.style.boxShadow = 'var(--shadow-soft)';
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                  <span style={{ fontSize: '20px' }}>👥</span>
                  <h4 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text)' }}>Employee Directory</h4>
                </div>
                <p style={{ fontSize: '12px', color: 'var(--text-soft)', lineHeight: '1.4' }}>
                  Search, filter, view and manage all employee records in one place.
                </p>
              </div>
              <div style={{ marginTop: '12px', display: 'flex', justifyContent: 'flex-end' }}>
                <span className="btn btn-sm btn-ghost" style={{ fontSize: '10px', padding: '4px 10px', pointerEvents: 'none' }}>
                  Manage Team →
                </span>
              </div>
            </div>

            {/* Card 2: AI Insights */}
            <div className="card card-pad quick-card" onClick={() => navigate('/ai-recommendations')} style={{
              background: 'linear-gradient(135deg, rgba(167, 139, 250, 0.07) 0%, rgba(99, 102, 241, 0.03) 100%)',
              border: '1px solid var(--border-soft)',
              borderRadius: 'var(--radius)',
              cursor: 'pointer',
              transition: 'all 0.22s ease',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              minHeight: '140px',
              position: 'relative',
              overflow: 'hidden'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-3px)';
              e.currentTarget.style.borderColor = 'var(--purple)';
              e.currentTarget.style.boxShadow = '0 10px 24px -8px rgba(167, 139, 250, 0.25)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.borderColor = 'var(--border-soft)';
              e.currentTarget.style.boxShadow = 'var(--shadow-soft)';
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                  <span style={{ fontSize: '20px' }}>✨</span>
                  <h4 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text)' }}>AI Insights Engine</h4>
                </div>
                <p style={{ fontSize: '12px', color: 'var(--text-soft)', lineHeight: '1.4' }}>
                  Evaluate promotability, training needs, and high-performance indicators.
                </p>
              </div>
              <div style={{ marginTop: '12px', display: 'flex', justifyContent: 'flex-end' }}>
                <span className="btn btn-sm btn-ghost" style={{ fontSize: '10px', padding: '4px 10px', pointerEvents: 'none' }}>
                  Launch AI →
                </span>
              </div>
            </div>

            {/* Card 3: Analytics */}
            <div className="card card-pad quick-card" onClick={() => navigate('/analytics')} style={{
              background: 'linear-gradient(135deg, rgba(52, 211, 153, 0.07) 0%, rgba(16, 185, 129, 0.03) 100%)',
              border: '1px solid var(--border-soft)',
              borderRadius: 'var(--radius)',
              cursor: 'pointer',
              transition: 'all 0.22s ease',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              minHeight: '140px',
              position: 'relative',
              overflow: 'hidden'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-3px)';
              e.currentTarget.style.borderColor = 'var(--green)';
              e.currentTarget.style.boxShadow = '0 10px 24px -8px rgba(52, 211, 153, 0.25)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.borderColor = 'var(--border-soft)';
              e.currentTarget.style.boxShadow = 'var(--shadow-soft)';
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                  <span style={{ fontSize: '20px' }}>📈</span>
                  <h4 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text)' }}>Performance Analytics</h4>
                </div>
                <p style={{ fontSize: '12px', color: 'var(--text-soft)', lineHeight: '1.4' }}>
                  Analyze scores, skill distributions, and overall organizational trends.
                </p>
              </div>
              <div style={{ marginTop: '12px', display: 'flex', justifyContent: 'flex-end' }}>
                <span className="btn btn-sm btn-ghost" style={{ fontSize: '10px', padding: '4px 10px', pointerEvents: 'none' }}>
                  Open Analytics →
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid-2" style={{ marginTop: '32px' }}>
          <PerformanceBarChart data={stats.departmentAverages} />
          <DepartmentPieChart data={stats.departmentAverages} />
        </div>

        <div style={{ marginTop: '32px' }}>
          <TopEmployeesChart data={stats.topEmployees} />
        </div>

        {/* Employee Management Console Section */}
        <div style={{ marginTop: '44px', marginBottom: '40px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '22px', flexWrap: 'wrap', gap: '14px' }}>
            <div>
              <h3 style={{ fontSize: '17px', fontWeight: 700, marginBottom: '4px', letterSpacing: '-0.02em' }}>👥 Employee Management Console</h3>
              <p style={{ fontSize: '12px', color: 'var(--text-dim)' }}>Add, search, edit, rename, or delete any employee instantly</p>
            </div>
            
            {/* Search and Filters */}
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
              <input
                type="text"
                placeholder="🔍 Search name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  padding: '7px 11px',
                  background: 'var(--bg-2)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-sm)',
                  color: 'var(--text)',
                  fontSize: '12.5px',
                  minWidth: '220px'
                }}
              />
              
              <select
                value={deptFilter}
                onChange={(e) => setDeptFilter(e.target.value)}
                style={{
                  padding: '7px 11px',
                  background: 'var(--bg-2)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-sm)',
                  color: 'var(--text)',
                  fontSize: '12.5px',
                  cursor: 'pointer'
                }}
              >
                <option value="">All Departments</option>
                <option value="Development">Development</option>
                <option value="AI/ML">AI/ML</option>
                <option value="HR">HR</option>
                <option value="Sales">Sales</option>
                <option value="Support">Support</option>
              </select>

              {(searchTerm || deptFilter) && (
                <button 
                  className="btn btn-sm btn-ghost"
                  onClick={() => { setSearchTerm(''); setDeptFilter(''); }}
                  style={{ padding: '6px 12px' }}
                >
                  Clear Filters
                </button>
              )}
            </div>
          </div>

          <div className="employees-quick-grid">
            {filteredEmployees.slice(0, showAllEmployees ? filteredEmployees.length : 6).map((emp) => (
              <div key={emp.id || emp._id} className="employee-card-quick" style={{
                transition: 'all 0.18s ease-in-out',
                position: 'relative'
              }}>
                <div className="emp-header">
                  <div className="emp-avatar" style={{
                    background: `linear-gradient(135deg, var(--brand), var(--brand-2))`,
                  }}>
                    {emp.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="emp-info">
                    <h4 style={{ fontSize: '13.5px', fontWeight: 700, color: 'var(--text)' }}>{emp.name}</h4>
                    <p style={{ fontSize: '11px', color: 'var(--text-dim)', marginTop: '2px' }}>{emp.department}</p>
                    <span style={{ fontSize: '10px', color: 'var(--text-dim)' }}>{emp.email}</span>
                  </div>
                </div>
                <div className="emp-score" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '3px' }}>
                  <div className="score-badge" style={{
                    background: (emp.performanceScore || emp.performance_score) >= 85 ? 'var(--green)' : (emp.performanceScore || emp.performance_score) >= 70 ? 'var(--brand)' : (emp.performanceScore || emp.performance_score) >= 50 ? 'var(--amber)' : 'var(--red)',
                    color: '#06121f',
                    fontWeight: 700
                  }}>
                    {(emp.performanceScore || emp.performance_score)}%
                  </div>
                  <span style={{ fontSize: '9px', color: 'var(--text-dim)' }}>
                    {emp.experience} yr{emp.experience !== 1 ? 's' : ''} exp
                  </span>
                </div>
                <div className="emp-actions">
                  <button className="action-btn edit" onClick={() => handleEdit(emp)} title="Rename / Edit Employee">✏️</button>
                  <button className="action-btn delete" onClick={() => handleDeleteConfirm(emp.id || emp._id, emp.name)} title="Delete Employee">🗑️</button>
                </div>
              </div>
            ))}
          </div>

          {filteredEmployees.length > 6 && (
            <div style={{ textAlign: 'center', marginTop: '20px' }}>
              <button 
                className="btn btn-ghost btn-sm" 
                onClick={() => setShowAllEmployees(!showAllEmployees)}
                style={{ padding: '8px 16px', fontSize: '12.5px' }}
              >
                {showAllEmployees ? 'Show Less' : `View All ${filteredEmployees.length} Matching Employees`}
              </button>
            </div>
          )}

          {filteredEmployees.length === 0 && (
            <div style={{ 
              textAlign: 'center', 
              padding: '40px 20px',
              background: 'var(--surface)',
              border: '1px dashed var(--border-soft)',
              borderRadius: 'var(--radius)',
              color: 'var(--text-dim)',
            }}>
              <span style={{ fontSize: '24px', display: 'block', marginBottom: '8px' }}>🔍</span>
              <p style={{ fontSize: '13.5px', fontWeight: 600 }}>No matching employees found.</p>
              <p style={{ fontSize: '12px', color: 'var(--text-dim)', marginTop: '2px' }}>Try typing a different name or adding a new employee record!</p>
            </div>
          )}
        </div>
      </div>

      {/* Employee Form Modal */}
      {showFormModal && (
        <div className="modal-overlay" onClick={() => setShowFormModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-head">
              <h3>{editingEmployee ? '✏️ Edit Employee' : '➕ Create New Employee'}</h3>
              <button
                className="modal-close"
                onClick={() => setShowFormModal(false)}
              >
                ✕
              </button>
            </div>
            <div className="modal-body">
              <EmployeeForm
                initialData={editingEmployee}
                onSubmit={handleSubmitForm}
                loading={formLoading}
                onCancel={() => setShowFormModal(false)}
              />
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {confirmDelete && (
        <ConfirmDialog
          title="Delete Employee"
          message={`Are you sure you want to delete ${confirmDelete.name}? This action cannot be undone.`}
          onConfirm={handleDeleteExecute}
          onCancel={() => setConfirmDelete(null)}
        />
      )}
    </>
  );
};

export default Dashboard;
