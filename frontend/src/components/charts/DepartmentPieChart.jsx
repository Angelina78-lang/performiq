import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from 'recharts';

const DepartmentPieChart = ({ data = [], loading = false }) => {
  if (loading || !data.length) {
    return (
      <div className="card card-pad" style={{ textAlign: 'center', color: 'var(--text-dim)' }}>
        {loading ? 'Loading chart…' : 'No data available'}
      </div>
    );
  }

  const COLORS = [
    'var(--brand)',
    'var(--green)',
    'var(--amber)',
    'var(--red)',
    'var(--purple)',
    '#f472b6',
  ];

  return (
    <div className="card card-pad">
      <h3 style={{ marginBottom: '16px' }}>Employee Distribution by Department</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ department, count }) => `${department} (${count})`}
            outerRadius={90}
            fill="#8884d8"
            dataKey="count"
          >
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: 'var(--surface-2)',
              border: '1px solid var(--border-soft)',
              borderRadius: 'var(--radius-sm)',
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DepartmentPieChart;
