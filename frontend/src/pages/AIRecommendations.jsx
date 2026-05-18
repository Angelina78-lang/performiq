import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance.js';
import { useAuth } from '../context/AuthContext.jsx';
import Navbar from '../components/layout/Navbar.jsx';
import RecommendationCard from '../components/ai/RecommendationCard.jsx';
import RankingList from '../components/ai/RankingList.jsx';
import Loader from '../components/common/Loader.jsx';
import EmptyState from '../components/common/EmptyState.jsx';

const AIRecommendations = ({ onMenuToggle }) => {
  const { toast } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const employeeId = searchParams.get('employeeId');

  const [recommendation, setRecommendation] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState(employeeId ? 'single' : 'ranking');
  const [source, setSource] = useState('ai');

  const fetchRecommendation = async (type = 'single') => {
    setLoading(true);
    try {
      let payload = {};
      if (type === 'single' && employeeId) {
        payload = { employeeId };
      } else {
        payload = { all: true };
        setMode('ranking');
      }

      const { data } = await axiosInstance.post('/ai/recommend', payload);
      setRecommendation(data.recommendation);
      setSource(data.source || (data.usedFallback ? 'fallback' : 'ai'));
      setMode(data.mode || 'single');

      if (type === 'ranking' || data.mode === 'ranking') {
        // Fetch all employees for the ranking list sidebar
        const empData = await axiosInstance.get('/employees');
        setEmployees(empData.data.employees || []);
      }
    } catch (err) {
      toast.error('Failed to generate recommendations');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (employeeId) {
      fetchRecommendation('single');
    }
  }, [employeeId, toast]);

  return (
    <>
      <Navbar pageTitle="AI Insights" pageSubtitle="AI-powered performance recommendations" onMenuToggle={onMenuToggle} />

      <div className="page-content">
        <div className="section-head">
          <div>
            <h1>AI Performance Recommendations</h1>
            <p>Intelligent insights powered by advanced analytics</p>
          </div>
          <button className="btn btn-primary" onClick={() => fetchRecommendation('ranking')}>
            📊 Rank All Employees
          </button>
        </div>

        {!recommendation && !loading && (
          <EmptyState
            icon="🤖"
            title="No Recommendations Yet"
            message="Select an employee or rank all employees to generate AI insights."
            action={
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                <button
                  className="btn btn-primary"
                  onClick={() => fetchRecommendation('ranking')}
                >
                  📊 Rank All
                </button>
                <button
                  className="btn btn-ghost"
                  onClick={() => navigate('/employees')}
                >
                  👥 Go to Employees
                </button>
              </div>
            }
          />
        )}

        {loading && <Loader label="Generating AI recommendations…" />}

        {recommendation && (
          <div className="grid-2">
            {/* Main recommendation card */}
            <div>
              <RecommendationCard
                type={mode}
                data={recommendation}
                source={source}
              />
            </div>

            {/* Sidebar for ranking */}
            {mode === 'ranking' && (
              <RankingList employees={employees} />
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default AIRecommendations;
