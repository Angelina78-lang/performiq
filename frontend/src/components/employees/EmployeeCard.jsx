import { scoreTier, isPromotionEligible } from '../../utils/helpers.js';

const EmployeeCard = ({
  employee,
  onEdit = () => {},
  onDelete = () => {},
  onViewAI = () => {},
}) => {
  const tier = scoreTier(employee.performanceScore);
  const promoted = isPromotionEligible(employee);

  return (
    <div className="card card-pad" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            className="cell-avatar"
            style={{
              background: `linear-gradient(135deg, #38bdf8, #6366f1)`,
              width: '44px',
              height: '44px',
              fontSize: '16px',
            }}
          >
            {employee.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
          </div>
          <div>
            <div style={{ fontWeight: 600, fontSize: '14px' }}>{employee.name}</div>
            <div style={{ fontSize: '12px', color: 'var(--text-dim)' }}>{employee.email}</div>
            <div style={{ fontSize: '11px', color: 'var(--text-dim)', marginTop: '2px' }}>
              {employee.department}
            </div>
          </div>
        </div>
        {promoted && <span className="badge badge-green">🚀 Ready</span>}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '13px' }}>
        <div>
          <div style={{ color: 'var(--text-dim)', fontSize: '11px' }}>Performance</div>
          <div style={{ fontWeight: 600, marginTop: '2px' }}>
            <span style={{ color: tier.color }}>{employee.performanceScore}</span>/100
          </div>
        </div>
        <div>
          <div style={{ color: 'var(--text-dim)', fontSize: '11px' }}>Experience</div>
          <div style={{ fontWeight: 600, marginTop: '2px' }}>
            {employee.experience} year{employee.experience !== 1 ? 's' : ''}
          </div>
        </div>
      </div>

      {employee.skills && employee.skills.length > 0 && (
        <div>
          <div style={{ color: 'var(--text-dim)', fontSize: '11px', marginBottom: '6px' }}>
            Skills ({employee.skills.length})
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
            {employee.skills.slice(0, 3).map((s) => (
              <span key={s} className="skill-chip">
                {s}
              </span>
            ))}
            {employee.skills.length > 3 && (
              <span className="skill-chip" style={{ fontSize: '10px' }}>
                +{employee.skills.length - 3}
              </span>
            )}
          </div>
        </div>
      )}

      <div style={{ display: 'flex', gap: '6px', marginTop: '6px' }}>
        <button
          className="btn btn-sm btn-primary"
          onClick={() => onViewAI(employee._id)}
          style={{ flex: 1 }}
        >
          ✨ AI Insights
        </button>
        <button className="btn btn-sm btn-ghost" onClick={() => onEdit(employee)} title="Edit">
          ✏️
        </button>
        <button
          className="btn btn-sm btn-danger"
          onClick={() => onDelete(employee._id, employee.name)}
          title="Delete"
        >
          🗑️
        </button>
      </div>
    </div>
  );
};

export default EmployeeCard;
