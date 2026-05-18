import { dbRun, dbGet, dbAll } from '../config/db.js';

export class Employee {
  static normalizeEmployee(e) {
    if (!e) return null;
    let parsedSkills = [];
    try {
      parsedSkills = typeof e.skills === 'string' ? JSON.parse(e.skills || '[]') : (e.skills || []);
    } catch (err) {
      parsedSkills = Array.isArray(e.skills) ? e.skills : [];
    }

    let parsedAiInsights = {};
    try {
      parsedAiInsights = typeof e.ai_insights === 'string' ? JSON.parse(e.ai_insights || '{}') : (e.ai_insights || e.aiInsights || {});
    } catch (err) {
      parsedAiInsights = typeof e.aiInsights === 'object' ? e.aiInsights : {};
    }

    const score = e.performance_score !== undefined ? e.performance_score : e.performanceScore;

    return {
      ...e,
      id: e.id,
      _id: e.id,
      performanceScore: score,
      performance_score: score,
      skills: parsedSkills,
      aiInsights: parsedAiInsights,
      ai_insights: parsedAiInsights,
      createdAt: e.created_at,
      created_at: e.created_at,
      updatedAt: e.updated_at,
      updated_at: e.updated_at
    };
  }

  static async create(data) {
    const { name, email, department, skills = [], performanceScore, experience } = data;

    try {
      const result = await dbRun(
        `INSERT INTO employees (name, email, department, skills, performance_score, experience)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [name, email.toLowerCase(), department, JSON.stringify(skills), performanceScore, experience]
      );
      return this.findById(result.lastID);
    } catch (error) {
      if (error.message.includes('UNIQUE constraint failed')) {
        throw new Error('An employee with this email already exists');
      }
      throw error;
    }
  }

  static async findById(id) {
    const employee = await dbGet('SELECT * FROM employees WHERE id = ?', [id]);
    return this.normalizeEmployee(employee);
  }

  static async findAll(options = {}) {
    let query = 'SELECT * FROM employees WHERE 1=1';
    const params = [];

    if (options.department) {
      query += ' AND LOWER(department) = LOWER(?)';
      params.push(options.department);
    }

    if (options.sort) {
      const sortField = options.sort === 'performanceScore' ? 'performance_score' : options.sort;
      const sortOrder = options.order === 'asc' ? 'ASC' : 'DESC';
      query += ` ORDER BY ${sortField} ${sortOrder}`;
    } else {
      query += ' ORDER BY created_at DESC';
    }

    const employees = await dbAll(query, params);
    return employees.map(e => this.normalizeEmployee(e));
  }

  static async search(filters) {
    let query = 'SELECT * FROM employees WHERE 1=1';
    const params = [];

    if (filters.department) {
      query += ' AND LOWER(department) = LOWER(?)';
      params.push(filters.department);
    }
    if (filters.minScore !== undefined && !isNaN(Number(filters.minScore))) {
      query += ' AND performance_score >= ?';
      params.push(Number(filters.minScore));
    }
    if (filters.skill) {
      query += ' AND skills LIKE ?';
      params.push(`%${filters.skill}%`);
    }
    if (filters.name) {
      query += ' AND LOWER(name) LIKE LOWER(?)';
      params.push(`%${filters.name}%`);
    }

    query += ' ORDER BY performance_score DESC';
    const employees = await dbAll(query, params);
    return employees.map(e => this.normalizeEmployee(e));
  }

  static async update(id, data) {
    const employee = await this.findById(id);
    if (!employee) return null;

    const updates = [];
    const params = [];

    if (data.name !== undefined) {
      updates.push('name = ?');
      params.push(data.name);
    }
    if (data.email !== undefined) {
      updates.push('email = ?');
      params.push(data.email.toLowerCase());
    }
    if (data.department !== undefined) {
      updates.push('department = ?');
      params.push(data.department);
    }
    if (data.skills !== undefined) {
      updates.push('skills = ?');
      params.push(JSON.stringify(Array.isArray(data.skills) ? data.skills : []));
    }
    if (data.performanceScore !== undefined) {
      updates.push('performance_score = ?');
      params.push(data.performanceScore);
    }
    if (data.experience !== undefined) {
      updates.push('experience = ?');
      params.push(data.experience);
    }
    if (data.aiInsights !== undefined) {
      updates.push('ai_insights = ?');
      params.push(JSON.stringify(data.aiInsights));
    }

    if (updates.length === 0) return employee;

    updates.push('updated_at = CURRENT_TIMESTAMP');
    params.push(id);

    const query = `UPDATE employees SET ${updates.join(', ')} WHERE id = ?`;
    await dbRun(query, params);

    return this.findById(id);
  }

  static async delete(id) {
    await dbRun('DELETE FROM employees WHERE id = ?', [id]);
    return true;
  }

  static async findAll_Simple() {
    const employees = await dbAll('SELECT * FROM employees ORDER BY performance_score DESC');
    return employees.map(e => this.normalizeEmployee(e));
  }
}

export default Employee;
