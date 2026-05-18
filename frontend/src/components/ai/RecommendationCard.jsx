import { riskBadge } from '../../utils/helpers.js';

const RecommendationCard = ({
  type = 'single', // 'single' or 'ranking'
  data = {},
  loading = false,
  source = 'ai',
}) => {
  if (loading) {
    return (
      <div className="card card-pad" style={{ textAlign: 'center', padding: '40px' }}>
        <div className="spinner" style={{ margin: '0 auto 12px' }} />
        Generating AI recommendations…
      </div>
    );
  }

  if (!data.promotionRecommendation && !data.summary) {
    return null;
  }

  if (type === 'ranking' && data.ranking) {
    return (
      <div className="card">
        <div className="card-head">
          <div>
            <h3>Employee Rankings</h3>
            <span className="sub">{data.summary}</span>
          </div>
          <span className={`ai-source ${source}`}>{source === 'ai' ? '🤖 AI' : '⚡ Fallback'}</span>
        </div>
        <div style={{ padding: '16px' }}>
          {data.ranking.map((item, idx) => (
            <div key={idx} className="rank-row">
              <div className={`rank-badge rank-${item.rank > 3 ? 'n' : item.rank}`}>
                #{item.rank}
              </div>
              <div className="rank-info">
                <strong>{item.employeeName}</strong>
                <p>{item.reason}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="rec-card">
      <div className="rec-head">
        <div className="rec-icon" style={{ background: 'rgba(56,189,248,0.18)', color: 'var(--brand)' }}>
          ✨
        </div>
        <div style={{ flex: 1 }}>
          <h4>AI Analysis Summary</h4>
          <div style={{ fontSize: '11px', color: 'var(--text-dim)', marginTop: '2px' }}>
            {data.summary}
          </div>
        </div>
        <span className={`ai-source ${source}`}>{source === 'ai' ? '🤖 AI' : '⚡ Fallback'}</span>
      </div>

      <div className="divider" />

      <div style={{ marginBottom: '14px' }}>
        <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--text-dim)', fontWeight: 600, marginBottom: '6px' }}>
          Promotion Recommendation
        </div>
        <div style={{ fontSize: '13.5px', color: 'var(--text-soft)', lineHeight: 1.6 }}>
          {data.promotionRecommendation || '—'}
        </div>
      </div>

      {data.riskLevel && (
        <div style={{ marginBottom: '14px' }}>
          <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--text-dim)', fontWeight: 600, marginBottom: '6px' }}>
            Risk Level
          </div>
          <span className={`badge ${riskBadge(data.riskLevel)}`}>{data.riskLevel}</span>
        </div>
      )}

      {data.feedback && (
        <div style={{ marginBottom: '14px' }}>
          <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--text-dim)', fontWeight: 600, marginBottom: '6px' }}>
            Feedback
          </div>
          <div style={{ fontSize: '13px', color: 'var(--text-soft)', lineHeight: 1.6 }}>
            {data.feedback}
          </div>
        </div>
      )}

      {data.trainingSuggestions && data.trainingSuggestions.length > 0 && (
        <div>
          <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--text-dim)', fontWeight: 600, marginBottom: '6px' }}>
            Training Suggestions
          </div>
          <ul className="rec-list">
            {data.trainingSuggestions.map((suggestion, idx) => (
              <li key={idx}>{suggestion}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default RecommendationCard;
