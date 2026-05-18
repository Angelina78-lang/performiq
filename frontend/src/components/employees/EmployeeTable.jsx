import { scoreTier, isPromotionEligible } from '../../utils/helpers.js';

const EmployeeTable = ({
  employees = [],
  onEdit = () => {},
  onDelete = () => {},
  onViewAI = () => {},
  loading = false,
}) => {
  if (loading) {
    return <div style={{ textAlign: 'center', padding: '40px' }}>⏳ Loading employees…</div>;
  }

  if (!employees.length) {
    return (
      <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-dim)' }}>
        No employees found.
      </div>
    );
  }

  return (
    <div className="table-wrap">
      <table className="data-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Department</th>
            <th>Performance</th>
            <th>Experience</th>
            <th>Skills</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((emp) => {
            const tier = scoreTier(emp.performanceScore);
            const promoted = isPromotionEligible(emp);

            return (
              <tr key={emp._id}>
                <td>
                  <div className="cell-name">
                    <div
                      className="cell-avatar"
                      style={{
                        background: `linear-gradient(135deg, #38bdf8, #6366f1)`,
                      }}
                    >
                      {emp.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                    </div>
                    <div>
                      <strong>{emp.name}</strong>
                      <div className="cell-email">{emp.email}</div>
                    </div>
                  </div>
                </td>
                <td>{emp.department}</td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div
                      className="score-bar"
                      style={{
                        '--percent': `${emp.performanceScore}%`,
                      }}
                    >
                      <div
                        className="score-fill"
                        style={{
                          background: tier.color,
                          width: `${emp.performanceScore}%`,
                        }}
                      />
                    </div>
                    <strong>{emp.performanceScore}/100</strong>
                  </div>
                </td>
                <td>{emp.experience} yr{emp.experience !== 1 ? 's' : ''}</td>
                <td style={{ fontSize: '12px' }}>
                  {emp.skills && emp.skills.length > 0 ? (
                    <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                      {emp.skills.slice(0, 2).map((s) => (
                        <span key={s} className="skill-chip">
                          {s}
                        </span>
                      ))}
                      {emp.skills.length > 2 && (
                        <span className="skill-chip">+{emp.skills.length - 2}</span>
                      )}
                    </div>
                  ) : (
                    <span style={{ color: 'var(--text-dim)' }}>—</span>
                  )}
                </td>
                <td>
                  {promoted && <span className="badge badge-green">🚀 Promotable</span>}
                  {!promoted && <span className={`badge ${tier.badge}`}>{tier.label}</span>}
                </td>
                <td style={{ whiteSpace: 'nowrap' }}>
                  <button
                    className="btn btn-sm btn-ghost"
                    onClick={() => onViewAI(emp._id)}
                    title="View AI recommendations"
                  >
                    ✨
                  </button>
                  <button
                    className="btn btn-sm btn-ghost"
                    onClick={() => onEdit(emp)}
                    title="Edit employee"
                  >
                    ✏️
                  </button>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => onDelete(emp._id, emp.name)}
                    title="Delete employee"
                  >
                    🗑️
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default EmployeeTable;
