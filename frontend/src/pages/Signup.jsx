import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import ErrorMessage from '../components/common/ErrorMessage.jsx';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup, toast, getErrorMessage } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signup(name, email, password);
      toast.success('Account created! Welcome aboard.');
      navigate('/dashboard');
    } catch (err) {
      const msg = getErrorMessage(err);
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrap">
      <aside className="auth-aside">
        <div>
          <div style={{ fontSize: '36px' }}>🚀</div>
          <h1 className="auth-headline">
            Build Better <span>Teams</span>
          </h1>
          <p className="auth-sub">
            Join forward-thinking organizations using PerformIQ to unlock employee potential.
          </p>
          <div style={{ marginTop: '32px' }}>
            <div className="auth-feature">
              <div className="fi">💡</div>
              <div>
                <strong>Data-Driven Decisions</strong>
                <p>Make hiring and promotion decisions based on comprehensive analytics.</p>
              </div>
            </div>
            <div className="auth-feature">
              <div className="fi">🎓</div>
              <div>
                <strong>Personalized Growth</strong>
                <p>Tailored training recommendations for every team member.</p>
              </div>
            </div>
            <div className="auth-feature">
              <div className="fi">⭐</div>
              <div>
                <strong>Retain Top Talent</strong>
                <p>Identify high performers and create pathways for advancement.</p>
              </div>
            </div>
          </div>
        </div>
        <div style={{ fontSize: '12px', color: 'var(--text-dim)' }}>
          © 2024 PerformIQ. All rights reserved.
        </div>
      </aside>

      <main className="auth-main">
        <div className="auth-card">
          <h1>Create Account</h1>
          <p className="lead">Join your team on PerformIQ</p>

          {error && (
            <ErrorMessage message={error} onDismiss={() => setError('')} />
          )}

          <form onSubmit={handleSubmit} style={{ marginTop: '20px' }}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                className="form-input"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={loading}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                className="form-input"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-input"
                placeholder="At least 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
              {loading ? 'Creating account…' : 'Create Account'}
            </button>
          </form>

          <div className="auth-switch">
            Already have an account? <Link to="/login">Sign in</Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Signup;
