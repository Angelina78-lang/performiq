const RankingList = ({ employees = [], loading = false }) => {
  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <div className="spinner" style={{ margin: '0 auto 12px' }} />
        Computing rankings…
      </div>
    );
  }

  if (!employees.length) {
    return (
      <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-dim)' }}>
        No employees to rank.
      </div>
    );
  }

  return (
    <div className="card">
      <div className="card-head">
        <h3>Performance Rankings</h3>
        <span style={{ color: 'var(--text-dim)', fontSize: '12px' }}>
          {employees.length} employees
        </span>
      </div>
      <div style={{ padding: '0' }}>
        {employees.map((emp, idx) => (
          <div key={emp._id} className="rank-row">
            <div className={`rank-badge rank-${(idx + 1) > 3 ? 'n' : idx + 1}`}>
              #{idx + 1}
            </div>
            <div className="rank-info">
              <strong>{emp.name}</strong>
              <p>
                {emp.department} • {emp.performanceScore}/100 • {emp.experience} yr
                {emp.experience !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RankingList;
