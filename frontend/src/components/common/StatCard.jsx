// Reusable stat card for dashboards.
const StatCard = ({
  icon = '📊',
  label = 'Stat',
  value = '—',
  foot = '',
  accent = 'var(--brand)',
}) => {
  return (
    <div className="stat-card" style={{ '--accent': accent }}>
      <div className="stat-icon">{icon}</div>
      <div className="stat-label">{label}</div>
      <div className="stat-value">{value}</div>
      {foot && <div className="stat-foot">{foot}</div>}
    </div>
  );
};

export default StatCard;
