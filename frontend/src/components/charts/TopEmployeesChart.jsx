import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const TopEmployeesChart = ({ data = [], loading = false }) => {
  if (loading || !data.length) {
    return (
      <div className="card card-pad" style={{ textAlign: 'center', color: 'var(--text-dim)' }}>
        {loading ? 'Loading chart…' : 'No data available'}
      </div>
    );
  }

  const chartData = data.map((emp, idx) => ({
    name: emp.name,
    score: emp.performanceScore,
    experience: emp.experience,
  }));

  return (
    <div className="card card-pad">
      <h3 style={{ marginBottom: '16px' }}>Top 5 Performers</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border-soft)" />
          <XAxis type="number" stroke="var(--text-dim)" />
          <YAxis dataKey="name" type="category" width={120} stroke="var(--text-dim)" />
          <Tooltip
            contentStyle={{
              backgroundColor: 'var(--surface-2)',
              border: '1px solid var(--border-soft)',
              borderRadius: 'var(--radius-sm)',
            }}
          />
          <Bar dataKey="score" fill="var(--brand)" radius={[0, 8, 8, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TopEmployeesChart;
