import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import ErrorMessage from '../components/common/ErrorMessage.jsx';

const Login = () => {
  const [email, setEmail] = useState('admin@company.com');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, toast, getErrorMessage } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      toast.success('Logged in successfully!');
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
          <div style={{ fontSize: '36px' }}>✨</div>
          <h1 className="auth-headline">
            Welcome to <span>PerformIQ</span>
          </h1>
          <p className="auth-sub">
            AI-powered employee performance analytics and intelligent recommendations for modern teams.
          </p>
          <div style={{ marginTop: '32px' }}>
            <div className="auth-feature">
              <div className="fi">🎯</div>
              <div>
                <strong>Smart Analytics</strong>
                <p>Real-time insights into employee performance and growth potential.</p>
              </div>
            </div>
            <div className="auth-feature">
              <div className="fi">🤖</div>
              <div>
                <strong>AI-Powered Recommendations</strong>
                <p>Intelligent suggestions for promotion, training, and talent development.</p>
              </div>
            </div>
            <div className="auth-feature">
              <div className="fi">📈</div>
              <div>
                <strong>Comprehensive Rankings</strong>
                <p>Rank employees by performance, experience, and skill proficiency.</p>
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
          <h1>Sign In</h1>
          <p className="lead">Access your performance dashboard</p>

          {error && (
            <ErrorMessage message={error} onDismiss={() => setError('')} />
          )}

          <form onSubmit={handleSubmit} style={{ marginTop: '20px' }}>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                className="form-input"
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>

          <div className="demo-hint">
            <strong>Demo Credentials:</strong>
            <div style={{ marginTop: '6px' }}>
              <div><code>admin@company.com</code></div>
              <div><code>admin123</code></div>
            </div>
          </div>

          <div className="auth-switch">
            Don't have an account? <Link to="/signup">Create one</Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Login;
