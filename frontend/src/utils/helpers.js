// ====================== Shared frontend helpers ======================

// Consistent department list used in forms & filters.
export const DEPARTMENTS = [
  'Development',
  'AI/ML',
  'HR',
  'Sales',
  'Support',
];

// Avatar background colors keyed by a string hash — stable per name.
const AVATAR_COLORS = [
  'linear-gradient(135deg,#38bdf8,#6366f1)',
  'linear-gradient(135deg,#34d399,#10b981)',
  'linear-gradient(135deg,#fbbf24,#f87171)',
  'linear-gradient(135deg,#a78bfa,#6366f1)',
  'linear-gradient(135deg,#f472b6,#a78bfa)',
];

export const avatarColor = (str = '') => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash);
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
};

export const initials = (name = '') =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();

// Performance score -> color + label tier.
export const scoreTier = (score) => {
  if (score >= 85) return { color: 'var(--green)', label: 'Excellent', badge: 'badge-green' };
  if (score >= 70) return { color: 'var(--brand)', label: 'Strong', badge: 'badge-blue' };
  if (score >= 50) return { color: 'var(--amber)', label: 'Average', badge: 'badge-amber' };
  return { color: 'var(--red)', label: 'At Risk', badge: 'badge-red' };
};

// Risk level -> badge class.
export const riskBadge = (level) => {
  if (level === 'Low') return 'badge-green';
  if (level === 'Medium') return 'badge-amber';
  if (level === 'High') return 'badge-red';
  return 'badge-soft';
};

// Promotion eligibility (mirrors backend heuristic).
export const isPromotionEligible = (emp) =>
  emp.performanceScore >= 85 && emp.experience >= 3;

// Extract a friendly error message from an Axios error.
export const getErrorMessage = (error) => {
  if (error?.response?.data?.message) return error.response.data.message;
  if (error?.message) return error.message;
  return 'Something went wrong. Please try again.';
};

// Parse a comma-separated skills string into a clean array.
export const parseSkills = (str = '') =>
  str
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

export const formatDate = (iso) => {
  if (!iso) return '—';
  try {
    return new Date(iso).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return '—';
  }
};
