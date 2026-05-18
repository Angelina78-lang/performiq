import { useState } from 'react';
import { DEPARTMENTS } from '../../utils/helpers.js';

const SearchFilter = ({
  onSearch = () => {},
  onFilterDept = () => {},
  onFilterScore = () => {},
  loading = false,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [dept, setDept] = useState('');
  const [minScore, setMinScore] = useState('');

  const handleSearch = () => {
    onSearch(searchTerm);
  };

  const handleDeptChange = (e) => {
    const newDept = e.target.value;
    setDept(newDept);
    onFilterDept(newDept);
  };

  const handleScoreChange = (e) => {
    const score = e.target.value;
    setMinScore(score);
    onFilterScore(score ? Number(score) : '');
  };

  return (
    <div className="toolbar card-pad" style={{ marginBottom: '20px' }}>
      <div className="search-box grow">
        <span className="search-ic">🔍</span>
        <input
          type="text"
          className="form-input"
          placeholder="Search by name, email, skill..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        />
      </div>

      <select
        className="form-select"
        value={dept}
        onChange={handleDeptChange}
        disabled={loading}
        style={{ minWidth: '140px' }}
      >
        <option value="">All Departments</option>
        {DEPARTMENTS.map((d) => (
          <option key={d} value={d}>
            {d}
          </option>
        ))}
      </select>

      <select
        className="form-select"
        value={minScore}
        onChange={handleScoreChange}
        disabled={loading}
        style={{ minWidth: '140px' }}
      >
        <option value="">All Scores</option>
        <option value="85">85+</option>
        <option value="70">70+</option>
        <option value="50">50+</option>
      </select>

      <button
        className="btn btn-primary"
        onClick={handleSearch}
        disabled={loading || !searchTerm}
      >
        {loading ? 'Searching…' : 'Search'}
      </button>
    </div>
  );
};

export default SearchFilter;
