import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const PerformanceBarChart = ({ data = [], loading = false }) => {
  if (loading || !data.length) {
    return (
      <div className="card card-pad" style={{ textAlign: 'center', color: 'var(--text-dim)' }}>
        {loading ? 'Loading chart…' : 'No data available'}
      </div>
    );
  }

  return (
    <div className="card card-pad">
      <h3 style={{ marginBottom: '16px' }}>Average Performance by Department</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border-soft)" />
          <XAxis dataKey="department" stroke="var(--text-dim)" />
          <YAxis stroke="var(--text-dim)" domain={[0, 100]} />
          <Tooltip
            contentStyle={{
              backgroundColor: 'var(--surface-2)',
              border: '1px solid var(--border-soft)',
              borderRadius: 'var(--radius-sm)',
            }}
            labelStyle={{ color: 'var(--text)' }}
          />
          <Legend wrapperStyle={{ color: 'var(--text-soft)' }} />
          <Bar dataKey="averageScore" fill="var(--brand)" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PerformanceBarChart;
