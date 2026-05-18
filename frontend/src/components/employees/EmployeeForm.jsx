import { useState, useEffect } from 'react';
import { DEPARTMENTS } from '../../utils/helpers.js';

const EmployeeForm = ({
  initialData = null,
  onSubmit = () => {},
  onCancel = () => {},
  loading = false,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    department: '',
    skills: '',
    performanceScore: '',
    experience: '',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        email: initialData.email || '',
        department: initialData.department || '',
        skills: (initialData.skills || []).join(', '),
        performanceScore: initialData.performanceScore || '',
        experience: initialData.experience || '',
      });
    }
  }, [initialData]);

  const validate = () => {
    const newErrors = {};
    if (!formData.name || formData.name.length < 3)
      newErrors.name = 'Name must be at least 3 characters';
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = 'Valid email is required';
    if (!formData.department) newErrors.department = 'Department is required';
    if (!formData.performanceScore || isNaN(formData.performanceScore))
      newErrors.performanceScore = 'Valid performance score is required';
    const score = Number(formData.performanceScore);
    if (score < 0 || score > 100)
      newErrors.performanceScore = 'Score must be between 0 and 100';
    if (formData.experience === '' || isNaN(formData.experience))
      newErrors.experience = 'Valid experience is required';
    if (Number(formData.experience) < 0) newErrors.experience = 'Experience cannot be negative';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      const newErrors = { ...errors };
      delete newErrors[name];
      setErrors(newErrors);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      ...formData,
      skills: formData.skills
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      performanceScore: Number(formData.performanceScore),
      experience: Number(formData.experience),
    };
    onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      <div className="form-group">
        <label className="form-label">Name *</label>
        <input
          type="text"
          name="name"
          className={`form-input ${errors.name ? 'invalid' : ''}`}
          value={formData.name}
          onChange={handleChange}
          placeholder="John Doe"
          disabled={loading}
        />
        {errors.name && <div className="form-error">⚠️ {errors.name}</div>}
      </div>

      <div className="form-group">
        <label className="form-label">Email *</label>
        <input
          type="email"
          name="email"
          className={`form-input ${errors.email ? 'invalid' : ''}`}
          value={formData.email}
          onChange={handleChange}
          placeholder="john@company.com"
          disabled={loading}
        />
        {errors.email && <div className="form-error">⚠️ {errors.email}</div>}
      </div>

      <div className="form-group">
        <label className="form-label">Department *</label>
        <select
          name="department"
          className={`form-select ${errors.department ? 'invalid' : ''}`}
          value={formData.department}
          onChange={handleChange}
          disabled={loading}
        >
          <option value="">Select a department</option>
          {DEPARTMENTS.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
        {errors.department && <div className="form-error">⚠️ {errors.department}</div>}
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Performance Score (0-100) *</label>
          <input
            type="number"
            name="performanceScore"
            className={`form-input ${errors.performanceScore ? 'invalid' : ''}`}
            value={formData.performanceScore}
            onChange={handleChange}
            min="0"
            max="100"
            disabled={loading}
          />
          {errors.performanceScore && (
            <div className="form-error">⚠️ {errors.performanceScore}</div>
          )}
        </div>

        <div className="form-group">
          <label className="form-label">Years of Experience *</label>
          <input
            type="number"
            name="experience"
            className={`form-input ${errors.experience ? 'invalid' : ''}`}
            value={formData.experience}
            onChange={handleChange}
            min="0"
            disabled={loading}
          />
          {errors.experience && <div className="form-error">⚠️ {errors.experience}</div>}
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Skills (comma-separated)</label>
        <input
          type="text"
          name="skills"
          className="form-input"
          value={formData.skills}
          onChange={handleChange}
          placeholder="e.g. React, Node.js, MongoDB"
          disabled={loading}
        />
      </div>

      <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '8px' }}>
        <button
          type="button"
          className="btn btn-ghost"
          onClick={onCancel}
          disabled={loading}
        >
          Cancel
        </button>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Saving…' : initialData ? 'Update' : 'Create'} Employee
        </button>
      </div>
    </form>
  );
};

export default EmployeeForm;
