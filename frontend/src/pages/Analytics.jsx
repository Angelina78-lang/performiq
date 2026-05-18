import { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance.js';
import { useAuth } from '../context/AuthContext.jsx';
import Navbar from '../components/layout/Navbar.jsx';
import PerformanceBarChart from '../components/charts/PerformanceBarChart.jsx';
import DepartmentPieChart from '../components/charts/DepartmentPieChart.jsx';
import TopEmployeesChart from '../components/charts/TopEmployeesChart.jsx';
import Loader from '../components/common/Loader.jsx';

const Analytics = ({ onMenuToggle }) => {
  const { toast } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await axiosInstance.get('/employees/stats/summary');
        setStats(data.stats);
      } catch (err) {
        toast.error('Failed to load analytics');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [toast]);

  if (loading) return <Loader label="Loading analytics…" />;

  if (!stats) {
    return (
      <div className="page-content">
        <p style={{ color: 'var(--text-dim)' }}>Unable to load analytics.</p>
      </div>
    );
  }

  return (
    <>
      <Navbar pageTitle="Analytics" pageSubtitle="Detailed performance metrics and insights" onMenuToggle={onMenuToggle} />

      <div className="page-content">
        <div className="section-head">
          <div>
            <h1>Analytics Dashboard</h1>
            <p>Comprehensive employee performance analysis</p>
          </div>
        </div>

        {/* Performance by Department */}
        <div className="grid-2">
          <PerformanceBarChart data={stats.departmentAverages} />
          <DepartmentPieChart data={stats.departmentAverages} />
        </div>

        {/* Top Performers */}
        <div style={{ marginTop: '32px' }}>
          <TopEmployeesChart data={stats.topEmployees} />
        </div>

        {/* Skills Distribution */}
        {stats.skillDistribution && stats.skillDistribution.length > 0 && (
          <div className="card card-pad" style={{ marginTop: '32px' }}>
            <h3 style={{ marginBottom: '16px' }}>Top Skills in Your Organization</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
              {stats.skillDistribution.slice(0, 8).map((skill, idx) => (
                <div key={idx} style={{ padding: '12px', background: 'var(--surface-2)', borderRadius: 'var(--radius-sm)' }}>
                  <div style={{ fontWeight: 600, fontSize: '14px', marginBottom: '4px' }}>
                    {skill.skill}
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-dim)' }}>
                    {skill.count} employee{skill.count !== 1 ? 's' : ''}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Analytics;
