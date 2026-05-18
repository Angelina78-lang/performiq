import axios from 'axios';
import Employee from '../models/Employee.js';
import {
  generateSingleRecommendation,
  generateRankingRecommendation,
} from '../utils/aiFallbackEngine.js';

/**
 * Builds the strict-JSON prompt sent to the AI model.
 */
const buildPrompt = (mode, payload) => {
  if (mode === 'single') {
    return (
      `You are an HR performance analyst. Analyze this single employee and respond ONLY ` +
      `with valid minified JSON (no markdown, no commentary).\n\n` +
      `Employee: ${JSON.stringify(payload)}\n\n` +
      `Required JSON shape:\n` +
      `{"summary":"string","promotionRecommendation":"string",` +
      `"trainingSuggestions":["string"],"feedback":"string",` +
      `"riskLevel":"Low|Medium|High"}`
    );
  }
  return (
    `You are an HR performance analyst. Rank these employees from best to worst. ` +
    `Respond ONLY with valid minified JSON (no markdown, no commentary).\n\n` +
    `Employees: ${JSON.stringify(payload)}\n\n` +
    `Ranking priority: performanceScore first, then experience, then skill count.\n` +
    `Required JSON shape:\n` +
    `{"summary":"string","ranking":[{"employeeEmail":"string","employeeName":"string",` +
    `"rank":1,"reason":"string"}]}`
  );
};

/**
 * Safely extracts a JSON object from a possibly noisy AI string response.
 */
const safeParseJSON = (text) => {
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch (_) {
    // Try to extract the first {...} block
    const match = text.match(/\{[\s\S]*\}/);
    if (match) {
      try {
        return JSON.parse(match[0]);
      } catch (_) {
        return null;
      }
    }
    return null;
  }
};

/**
 * Calls the external OpenRouter/OpenAI-compatible chat completions endpoint.
 * Throws on any failure so the caller can fall back.
 */
const callAIModel = async (prompt) => {
  const url = process.env.AI_API_URL;
  const key = process.env.AI_API_KEY;
  const model = process.env.AI_MODEL;

  if (!url || !key || !model) {
    throw new Error('AI API environment variables are not configured');
  }

  const response = await axios.post(
    url,
    {
      model,
      messages: [
        {
          role: 'system',
          content: 'You are an HR analytics assistant that always replies with strict JSON.',
        },
        { role: 'user', content: prompt },
      ],
      temperature: 0.3,
    },
    {
      headers: {
        Authorization: `Bearer ${key}`,
        'Content-Type': 'application/json',
        // OpenRouter-recommended headers (harmless for OpenAI)
        'HTTP-Referer': process.env.CLIENT_URL || 'http://localhost:5173',
        'X-Title': 'Employee Performance Analytics',
      },
      timeout: 20000,
    }
  );

  const content = response?.data?.choices?.[0]?.message?.content;
  const parsed = safeParseJSON(content);
  if (!parsed) {
    throw new Error('AI response could not be parsed as JSON');
  }
  return parsed;
};

/**
 * @desc    Generate AI recommendations for one or many employees
 * @route   POST /api/ai/recommend
 * @access  Private
 *
 * Body options:
 *   { "employeeId": "<id>" }                -> single employee from DB
 *   { "employee": { ...employee fields } }  -> single ad-hoc employee
 *   { "employeeIds": ["id1","id2"] }        -> multiple employees from DB
 *   { "all": true }                         -> rank all employees in DB
 */
export const getRecommendation = async (req, res, next) => {
  try {
    const { employeeId, employee, employeeIds, all } = req.body;

    let mode = 'single';
    let payload = null;
    let dbEmployees = [];

    if (employeeId) {
      const found = await Employee.findById(employeeId);
      if (!found) {
        res.status(404);
        throw new Error('Employee not found');
      }
      dbEmployees = [found];
      payload = {
        name: found.name,
        email: found.email,
        department: found.department,
        skills: found.skills,
        performanceScore: found.performance_score,
        experience: found.experience,
      };
    } else if (employee) {
      payload = employee;
    } else if (all === true || (Array.isArray(employeeIds) && employeeIds.length > 0)) {
      mode = 'ranking';
      if (all === true) {
        dbEmployees = await Employee.findAll_Simple();
      } else {
        // Find multiple employees by IDs
        const dbAll = await Employee.findAll_Simple();
        dbEmployees = dbAll.filter(e => employeeIds.includes(String(e.id)));
      }
      payload = dbEmployees.map((e) => ({
        name: e.name,
        email: e.email,
        department: e.department,
        skills: e.skills,
        performanceScore: e.performance_score,
        experience: e.experience,
      }));
      if (payload.length === 0) {
        res.status(400);
        throw new Error('No employees found to analyze');
      }
    } else {
      res.status(400);
      throw new Error(
        'Provide one of: employeeId, employee, employeeIds[], or all:true'
      );
    }

    let result;
    let usedFallback = false;

    // Try the external AI; fall back gracefully on any error.
    try {
      const prompt = buildPrompt(mode, payload);
      const aiResult = await callAIModel(prompt);
      result = { ...aiResult, source: 'ai', generatedAt: new Date() };
    } catch (aiError) {
      usedFallback = true;
      console.warn(`⚠️  AI call failed, using fallback engine: ${aiError.message}`);
      if (mode === 'single') {
        result = generateSingleRecommendation(payload);
      } else {
        result = generateRankingRecommendation(payload);
      }
    }

    // Persist the latest insight on the employee record(s).
    if (mode === 'single' && dbEmployees.length === 1) {
      const emp = dbEmployees[0];
      const aiInsights = {
        summary: result.summary || '',
        promotionRecommendation: result.promotionRecommendation || '',
        trainingSuggestions: result.trainingSuggestions || [],
        feedback: result.feedback || '',
        riskLevel: ['Low', 'Medium', 'High'].includes(result.riskLevel)
          ? result.riskLevel
          : '',
        source: result.source || (usedFallback ? 'fallback' : 'ai'),
        generatedAt: new Date(),
      };
      await Employee.update(emp.id, { aiInsights });
    }

    res.json({
      success: true,
      mode,
      usedFallback,
      source: result.source || (usedFallback ? 'fallback' : 'ai'),
      recommendation: result,
    });
  } catch (error) {
    next(error);
  }
};
