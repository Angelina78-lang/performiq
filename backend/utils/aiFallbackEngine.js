import { rankEmployees } from './rankingUtils.js';

/**
 * Deterministic fallback recommendation engine.
 * Used when the external AI API is unavailable or returns unparseable output.
 * Implements the heuristics defined in the project specification.
 */

// Department -> core skills expected
const DEPARTMENT_CORE_SKILLS = {
  development: ['Node.js', 'React', 'MongoDB'],
  data: ['Python', 'ML', 'SQL'],
  'ai/ml': ['Python', 'ML', 'SQL'],
  hr: ['Communication', 'Analytics', 'Recruitment Tools'],
};

const getCoreSkills = (department = '') => {
  const key = department.trim().toLowerCase();
  if (DEPARTMENT_CORE_SKILLS[key]) return DEPARTMENT_CORE_SKILLS[key];
  if (key.includes('data') || key.includes('ai') || key.includes('ml')) {
    return DEPARTMENT_CORE_SKILLS['ai/ml'];
  }
  if (key.includes('dev')) return DEPARTMENT_CORE_SKILLS.development;
  if (key.includes('hr')) return DEPARTMENT_CORE_SKILLS.hr;
  return [];
};

const missingSkills = (employee) => {
  const core = getCoreSkills(employee.department);
  const have = (employee.skills || []).map((s) => s.toLowerCase().trim());
  return core.filter((c) => !have.includes(c.toLowerCase()));
};

/**
 * Generates a single-employee recommendation deterministically.
 * @param {Object} employee
 * @returns {Object} insight object
 */
export const generateSingleRecommendation = (employee) => {
  const score = Number(employee.performanceScore) || 0;
  const exp = Number(employee.experience) || 0;
  const skillCount = Array.isArray(employee.skills) ? employee.skills.length : 0;
  const lacking = missingSkills(employee);

  let promotionRecommendation;
  let feedback;
  let riskLevel;
  const trainingSuggestions = [];

  if (score >= 85 && exp >= 3) {
    promotionRecommendation =
      `${employee.name} is eligible for promotion. Strong performance (${score}) ` +
      `combined with ${exp} years of experience indicates readiness for greater responsibility.`;
    feedback =
      'Outstanding contributor. Consider leadership or mentorship opportunities to retain and grow this talent.';
    riskLevel = 'Low';
    trainingSuggestions.push('Leadership & team management', 'Advanced domain certification');
  } else if (score >= 70) {
    promotionRecommendation =
      `${employee.name} is a strong performer. Not yet promotion-ready but a clear candidate ` +
      `with targeted upskilling and continued consistency.`;
    feedback =
      'Reliable performer. Focused development in key areas will accelerate career progression.';
    riskLevel = 'Low';
    trainingSuggestions.push('Targeted upskilling in core role competencies');
  } else if (score >= 50) {
    promotionRecommendation =
      `${employee.name} is not currently promotion-eligible. A structured improvement ` +
      `plan over the next 1-2 quarters is recommended.`;
    feedback =
      'Performance is below expectations. A structured improvement plan with measurable milestones is advised.';
    riskLevel = 'Medium';
    trainingSuggestions.push('Structured performance improvement plan', 'Regular manager check-ins');
  } else {
    promotionRecommendation =
      `${employee.name} requires immediate attention. Promotion is not advisable at this stage.`;
    feedback =
      'Significant performance gap. Immediate mentoring and intensive training are strongly recommended.';
    riskLevel = 'High';
    trainingSuggestions.push('Immediate mentoring program', 'Foundational skills training');
  }

  if (skillCount < 3) {
    trainingSuggestions.push('Broaden skill set — current skill count is low');
  }
  if (lacking.length > 0) {
    trainingSuggestions.push(
      `Skill enhancement in ${employee.department}: ${lacking.join(', ')}`
    );
  }

  const summary =
    `${employee.name} (${employee.department}) — performance ${score}/100, ` +
    `${exp} yr experience, ${skillCount} skill(s). Risk level: ${riskLevel}.`;

  return {
    summary,
    promotionRecommendation,
    trainingSuggestions,
    feedback,
    riskLevel,
    source: 'fallback',
    generatedAt: new Date(),
  };
};

/**
 * Generates a ranked list recommendation for multiple employees.
 * @param {Array} employees
 * @returns {Object} insight object containing a ranking array
 */
export const generateRankingRecommendation = (employees = []) => {
  const ranked = rankEmployees(employees);

  const ranking = ranked.map((emp, index) => {
    const lacking = missingSkills(emp);
    let reason =
      `Performance ${emp.performanceScore}/100, ${emp.experience} yr experience, ` +
      `${(emp.skills || []).length} skill(s).`;
    if (emp.performanceScore >= 85 && emp.experience >= 3) {
      reason += ' Promotion-eligible top performer.';
    } else if (emp.performanceScore >= 70) {
      reason += ' Strong, consistent performer.';
    } else if (emp.performanceScore >= 50) {
      reason += ' Needs a structured improvement plan.';
    } else {
      reason += ' Requires immediate mentoring.';
    }
    if (lacking.length > 0) {
      reason += ` Missing core skills: ${lacking.join(', ')}.`;
    }
    return {
      employeeEmail: emp.email,
      employeeName: emp.name,
      rank: index + 1,
      rankingScore: emp.rankingScore,
      reason,
    };
  });

  const top = ranking[0];
  const summary = top
    ? `Analyzed ${ranking.length} employees. Top performer: ${top.employeeName}.`
    : 'No employees available to rank.';

  return {
    summary,
    ranking,
    source: 'fallback',
    generatedAt: new Date(),
  };
};
