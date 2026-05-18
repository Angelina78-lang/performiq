/**
 * Computes a composite ranking score for an employee.
 * Priority: performanceScore (weighted highest), then experience, then skill count.
 *
 * Formula: performanceScore * 10  +  experience * 2  +  skillCount * 1
 * This guarantees performanceScore dominates, experience breaks ties,
 * and skill count is the final tie-breaker.
 *
 * @param {Object} emp - employee-like object
 * @returns {number} composite ranking score
 */
export const computeRankingScore = (emp) => {
  // Handle both performanceScore (from model) and performance_score (from SQLite)
  const score = Number(emp.performanceScore || emp.performance_score) || 0;
  const exp = Number(emp.experience) || 0;
  const skillCount = Array.isArray(emp.skills) ? emp.skills.length : 0;
  return score * 10 + exp * 2 + skillCount;
};

/**
 * Returns a new array of employees sorted from best to worst by ranking score.
 * @param {Array} employees
 * @returns {Array} sorted copy with `rankingScore` attached
 */
export const rankEmployees = (employees = []) => {
  return [...employees]
    .map((e) => {
      const plain = typeof e.toObject === 'function' ? e.toObject() : { ...e };
      return { ...plain, rankingScore: computeRankingScore(plain) };
    })
    .sort((a, b) => b.rankingScore - a.rankingScore);
};
