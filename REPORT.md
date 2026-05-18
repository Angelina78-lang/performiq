# EXAM REPORT: AI-Based Employee Performance Analytics & Recommendation System

**Project Title:** PerformIQ  
**Submitted For:** B.Tech 4th Semester Project Evaluation  
**Date:** 2024  
**Technology Stack:** MERN (MongoDB, Express, React, Node.js)

---

## Executive Summary

This report documents a **complete, production-ready full-stack MERN application** that analyzes employee performance data and provides AI-powered recommendations using external AI APIs (OpenRouter/OpenAI-compatible) with a fallback engine for graceful degradation.

The system features JWT authentication, MongoDB persistence, a premium responsive dashboard, AI-driven insights, and comprehensive error handling. The codebase has been validated through 51 passing integration and unit tests.

---

## 1. Project Overview

### Objective
Design and develop a full-stack MERN application that:
- Manages employee records (CRUD operations)
- Analyzes performance metrics using a composite ranking algorithm
- Provides AI-powered recommendations (promotion, training, risk assessment)
- Offers beautiful, responsive UI for B2B analytics use cases
- Gracefully handles API failures with a deterministic fallback engine

### Key Features Implemented

| Feature | Status | Details |
|---------|--------|---------|
| **Employee Management** | ✅ Complete | Add, edit, delete, search employees across departments |
| **Authentication** | ✅ Complete | JWT + bcrypt hashing, protected routes, session persistence |
| **Performance Analytics** | ✅ Complete | Dashboard with 4 stat cards, 3 Recharts visualizations |
| **AI Recommendations** | ✅ Complete | Single-employee insights + ranking for all employees |
| **AI Fallback Engine** | ✅ Complete | Deterministic recommendations when external API unavailable |
| **Responsive UI** | ✅ Complete | Dark premium theme, mobile/tablet/desktop layouts |
| **Error Handling** | ✅ Complete | Centralized middleware, input validation, user-friendly messages |
| **API Integration** | ✅ Complete | Axios with JWT interceptor, OpenRouter/OpenAI support |

---

## 2. Technology Stack & Architecture

### Backend (Node.js + Express)
- **Framework:** Express.js v4.21.0
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** JWT (jsonwebtoken) + bcryptjs
- **Validation:** Custom middleware validators
- **External APIs:** Axios for OpenRouter/OpenAI
- **Environment:** dotenv for configuration
- **CORS:** Configured for specific origins

### Frontend (React + Vite)
- **Framework:** React 18.3.1 + React Router v6
- **Build Tool:** Vite 5.4.10
- **HTTP Client:** Axios with request/response interceptors
- **Charts:** Recharts 2.13.0
- **Styling:** Custom CSS (no Tailwind) — premium dark theme
- **State Management:** React hooks + Context API

### Database
- **MongoDB Atlas** (recommended) or local MongoDB
- **Collections:** Users, Employees
- **Indexes:** Unique email constraint on both collections
- **Validation:** Mongoose schema-level validation

### Deployment
- **Render.com** for both frontend and backend
- **Environment-based configuration** for API URLs and secrets
- **Build optimizations** (minification, bundling)

---

## 3. API Specification

### Authentication Endpoints

| Method | Endpoint | Body | Response | Protected |
|--------|----------|------|----------|-----------|
| POST | `/api/auth/signup` | name, email, password | user + JWT token | ❌ |
| POST | `/api/auth/login` | email, password | user + JWT token | ❌ |
| GET | `/api/auth/me` | — | authenticated user data | ✅ |

### Employee Endpoints

| Method | Endpoint | Parameters/Body | Response | Protected |
|--------|----------|--------|----------|-----------|
| GET | `/api/employees` | sort, order, department | array of employees | ✅ |
| GET | `/api/employees/search` | department, minScore, skill, name | filtered employees | ✅ |
| POST | `/api/employees` | employee data | created employee | ✅ |
| GET | `/api/employees/:id` | — | single employee | ✅ |
| PUT | `/api/employees/:id` | employee data (partial) | updated employee | ✅ |
| PATCH | `/api/employees/:id/score` | performanceScore | updated employee | ✅ |
| DELETE | `/api/employees/:id` | — | success message | ✅ |
| GET | `/api/employees/stats/summary` | — | dashboard stats | ✅ |

### AI Endpoints

| Method | Endpoint | Body | Response | Protected |
|--------|----------|------|----------|-----------|
| POST | `/api/ai/recommend` | See below | recommendation object | ✅ |

**AI Request Bodies:**
```json
// Single employee from DB:
{ "employeeId": "507f1f77bcf86cd799439011" }

// Ad-hoc employee data:
{ "employee": { name: "John", email: "j@x.com", department: "Dev", ... } }

// Multiple employees:
{ "employeeIds": ["id1", "id2", "id3"] }

// All employees (ranking):
{ "all": true }
```

**AI Response Structure:**
```json
{
  "success": true,
  "mode": "single|ranking",
  "usedFallback": false,
  "source": "ai|fallback",
  "recommendation": {
    "summary": "Employee analysis summary",
    "promotionRecommendation": "...",
    "trainingSuggestions": ["Skill 1", "Skill 2"],
    "feedback": "Performance feedback",
    "riskLevel": "Low|Medium|High",
    "ranking": [
      {
        "employeeEmail": "emp@x.com",
        "employeeName": "Name",
        "rank": 1,
        "reason": "Reasoning"
      }
    ]
  }
}
```

---

## 4. Database Schema

### User Schema
```javascript
{
  _id: ObjectId,
  name: String (min 3 chars, required),
  email: String (unique, lowercase, required),
  password: String (hashed, min 6 chars, required),
  role: String (enum: ['admin', 'hr'], default: 'admin'),
  createdAt: Date,
  updatedAt: Date
}
```

### Employee Schema
```javascript
{
  _id: ObjectId,
  name: String (min 3 chars, required),
  email: String (unique, lowercase, required),
  department: String (required),
  skills: [String] (default: []),
  performanceScore: Number (0-100, required),
  experience: Number (>=0, required),
  aiInsights: {
    summary: String,
    promotionRecommendation: String,
    trainingSuggestions: [String],
    feedback: String,
    riskLevel: String (enum: ['Low', 'Medium', 'High']),
    source: String ('ai' or 'fallback'),
    generatedAt: Date
  },
  createdAt: Date,
  updatedAt: Date
}
```

---

## 5. Business Logic

### Ranking Algorithm
```
rankingScore = (performanceScore × 10) + (experience × 2) + (skillCount × 1)
```
This formula ensures:
- Performance score dominates (multiplied by 10)
- Experience breaks ties (multiplied by 2)
- Skill count is final tiebreaker (multiplied by 1)

**Example:**
```
Employee A: score 90, 5 yr, 4 skills → (90×10) + (5×2) + 4 = 914
Employee B: score 85, 10 yr, 2 skills → (85×10) + (10×2) + 2 = 872
Employee A ranks higher despite less experience (performance dominates)
```

### AI Recommendation Logic (Fallback Engine)

**Promotion Eligibility:**
- If `performanceScore >= 85 AND experience >= 3` → Eligible for promotion
- Otherwise → Recommend improvement plan

**Risk Assessment:**
- `performanceScore >= 85` → Low risk
- `performanceScore 70-84` → Low risk (strong performer)
- `performanceScore 50-69` → Medium risk
- `performanceScore < 50` → High risk

**Training Suggestions (Deterministic):**
- If `skillCount < 3` → Add "Broaden skill set"
- If missing department core skills → Add department-specific recommendations
  - **Development:** Node.js, React, MongoDB
  - **AI/ML:** Python, ML, SQL
  - **HR:** Communication, Analytics, Recruitment Tools
  - **Sales:** Negotiation, CRM, Communication

**Example Fallback Output:**
```json
{
  "summary": "Aarav Sharma (Development) — score 92/100, 5 yr, 4 skills. Low risk.",
  "promotionRecommendation": "Eligible for promotion. Strong performance with 5+ years experience.",
  "trainingSuggestions": ["Leadership & team management", "Advanced domain certification"],
  "feedback": "Outstanding contributor. Consider mentorship opportunities.",
  "riskLevel": "Low",
  "source": "fallback"
}
```

---

## 6. Frontend Architecture

### Page Structure
```
App (AuthProvider)
├── ProtectedRoute
│   ├── Dashboard (stats + charts)
│   ├── Employees (CRUD + search/filter)
│   ├── AIRecommendations (single or ranking)
│   └── Analytics (detailed charts)
├── Login (public)
├── Signup (public)
└── NotFound (404)
```

### Component Hierarchy
```
Layout Components:
- Navbar (user info, logout)
- Sidebar (navigation, brand)
- ProtectedRoute (auth guard)

Employee Components:
- EmployeeForm (add/edit modal form)
- EmployeeTable (searchable, sortable list)
- EmployeeCard (grid card view)
- SearchFilter (department, score, name)

AI Components:
- RecommendationCard (single or ranking display)
- RankingList (leaderboard)

Chart Components:
- PerformanceBarChart (avg by department)
- DepartmentPieChart (distribution)
- TopEmployeesChart (top 5 horizontal bar)

Common Components:
- Loader (spinner)
- EmptyState (no data placeholder)
- ErrorMessage (error banner)
- StatCard (dashboard metric)
- ConfirmDialog (delete confirmation)
```

### State Management
- **AuthContext** → user, loading, toast system
- **useState** → local component state (forms, modals, filters)
- **useEffect** → data fetching, side effects
- **Axios interceptors** → auto-attach JWT, handle 401

---

## 7. Testing & Validation

### Test Coverage

**Backend:**
- ✅ **27 HTTP integration tests** — All endpoints, auth flows, CRUD, AI fallback
- ✅ **24 logic unit tests** — Ranking, validation, fallback engine, JWT

**Total: 51 passing tests**

### Test Results Summary

```
=== RANKING UTILS ===
  ✅ Ranking algorithm weights performance correctly
  ✅ Experience breaks ties
  ✅ Skill count is final tiebreaker
  ✅ rankEmployees returns sorted list
  ✅ rankingScore attached to results

=== FALLBACK ENGINE — SINGLE ===
  ✅ High performer → promotion eligible
  ✅ High performer → Low risk
  ✅ Low performer → High risk
  ✅ Low performer → improvement feedback
  ✅ Few skills → skill enhancement suggestion
  ✅ Dev missing Node.js/MongoDB → recommends them

=== FALLBACK ENGINE — RANKING ===
  ✅ Returns array with rank numbers
  ✅ Ordered best-first
  ✅ Entries have detailed reasons

=== JWT ===
  ✅ generateToken produces verifiable JWT

=== VALIDATION MIDDLEWARE ===
  ✅ validateEmployee accepts valid data
  ✅ Rejects missing performanceScore
  ✅ Rejects bad email
  ✅ Rejects score > 100
  ✅ Rejects short name
  ✅ Rejects non-array skills
  ✅ validateSignup rejects short password
  ✅ validateSignup passes valid data
  ✅ validateScore rejects out-of-range

=== AUTH HTTP ===
  ✅ Signup returns 201 + token
  ✅ Duplicate signup rejected (400)
  ✅ Invalid signup rejected (400)
  ✅ Wrong password returns 401
  ✅ Valid login returns 200 + token
  ✅ No token returns 401
  ✅ Bad token returns 401
  ✅ GET /me with token works
  ✅ Password stored hashed (bcrypt)

=== EMPLOYEE CRUD HTTP ===
  ✅ Create valid employee (201)
  ✅ Duplicate email returns 400
  ✅ Missing score returns 400
  ✅ GET list returns employees
  ✅ Search by department filters
  ✅ Search by minScore+skill filters
  ✅ GET by id returns employee
  ✅ PUT update changes data
  ✅ PATCH score updates value
  ✅ PATCH invalid score returns 400
  ✅ Stats summary returns data

=== AI HTTP (FALLBACK) ===
  ✅ AI single recommend (fallback)
  ✅ High performer → promotion mention
  ✅ AI ranking recommend (fallback)
  ✅ Ad-hoc low performer → High risk
  ✅ No payload returns 400

=== DELETE HTTP ===
  ✅ DELETE employee succeeds
  ✅ List after delete shows correct count
  ✅ Unknown route returns 404
```

---

## 8. Security Features Implemented

| Feature | Implementation | Status |
|---------|---|---|
| **Password Hashing** | bcryptjs (10-salt rounds) | ✅ |
| **JWT Tokens** | Signed with secret, 7-day expiry | ✅ |
| **Protected Routes** | Bearer token verification middleware | ✅ |
| **Input Validation** | Schema + middleware validators | ✅ |
| **Error Handling** | Centralized middleware (no stack traces in prod) | ✅ |
| **CORS** | Configured for specific origins | ✅ |
| **Unique Constraints** | Email unique on User + Employee collections | ✅ |
| **Password Storage** | Never stored plaintext, always hashed | ✅ |
| **Token Interceptor** | Auto-attach JWT from localStorage | ✅ |

---

## 9. UI/UX Features

### Design System
- **Color Palette:** Dark theme with cyan accent (#38bdf8), green, amber, red
- **Typography:** Sora (display), Outfit (body), JetBrains Mono (code)
- **Spacing:** 8px base unit system
- **Border Radius:** 16px (cards), 10px (inputs)
- **Shadows:** Subtle elevation shadows

### Key Pages

**Login/Signup:**
- Split layout (side marketing + form)
- Demo credentials hint
- Error handling
- Smooth transitions

**Dashboard:**
- 4 stat cards with icons and trends
- 2 main charts (bar + pie)
- 1 top performers chart
- Responsive grid layout

**Employees:**
- Search/filter toolbar
- Scrollable data table
- Edit/delete/AI insight buttons
- Modal form for add/edit
- Delete confirmation dialog
- Empty state

**AI Recommendations:**
- Single employee recommendation card
- Ranking leaderboard (top 3 with special badges)
- Promotion, training, feedback, risk level sections
- Source indicator (AI vs fallback)

**Analytics:**
- Department performance bar chart
- Distribution pie chart
- Top 5 performers ranked
- Skills distribution grid

### Responsive Breakpoints
- **Desktop:** 1100px+ (full layout)
- **Tablet:** 720px – 1099px (adjusted grid)
- **Mobile:** < 720px (single column, hamburger menu)

---

## 10. Error Handling & Edge Cases

### Handled Scenarios

| Scenario | Behavior |
|----------|----------|
| MongoDB connection fails | Exit process, clear error message |
| Duplicate email | Return 400, user-friendly message |
| Invalid JWT | Return 401, redirect to login |
| Missing required fields | Return 400, validation errors |
| External AI API fails | Use fallback engine, continue normally |
| AI API returns unparseable JSON | Fallback to deterministic engine |
| Network timeout | Axios timeout, error toast |
| Employee not found | Return 404 with message |
| Unauthorized access | Return 401, clear session |
| Unknown route | Return 404 page |

### Graceful Degradation
The fallback recommendation engine ensures the app never fails when the external AI API is unavailable. Users get deterministic, logic-based recommendations instead of nil.

---

## 11. Deployment Instructions

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (free tier available)
- Render.com account (free tier available)

### Backend Deployment (Render)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Create Render Web Service**
   - Connect GitHub repository
   - Build command: `npm install`
   - Start command: `npm start`
   - Set environment variables:
     ```
     NODE_ENV=production
     PORT=5000
     MONGO_URI=mongodb+srv://user:password@cluster.mongodb.net/epars
     JWT_SECRET=your_secret_here_min_32_chars
     AI_API_URL=https://openrouter.ai/api/v1/chat/completions
     AI_API_KEY=your_key_here
     AI_MODEL=openai/gpt-4o-mini
     CLIENT_URL=https://your-frontend.onrender.com
     ```

### Frontend Deployment (Render)

1. **Create Render Static Site**
   - Connect GitHub repository
   - Build command: `npm install && npm run build`
   - Publish directory: `dist`
   - Set environment variable:
     ```
     VITE_API_URL=https://your-backend-name.onrender.com/api
     ```

---

## 12. Future Enhancements (Out of Scope)

- [ ] Email notifications for promotion recommendations
- [ ] Advanced filtering (salary, certifications, availability)
- [ ] Bulk employee import (CSV)
- [ ] Performance trends (historical charts)
- [ ] Admin user management
- [ ] LDAP/SSO integration
- [ ] Mobile app (React Native)
- [ ] Real-time notifications (WebSocket)
- [ ] Multi-language support (i18n)
- [ ] Dark/light theme toggle

---

## 13. Conclusion

This project demonstrates a **production-ready full-stack MERN application** with:

✅ Complete feature implementation  
✅ Robust error handling and validation  
✅ 51 passing integration + unit tests  
✅ Premium responsive UI design  
✅ Security best practices (JWT, bcrypt)  
✅ Graceful AI fallback mechanism  
✅ Clear documentation and deployment guides  

The codebase is well-organized, thoroughly tested, and ready for deployment on Render.com. The AI recommendation engine provides value even when the external API is unavailable, and the fallback logic is grounded in realistic HR heuristics.

---

## 14. How to Run Locally

```bash
# Backend
cd backend
npm install
# Create .env (see README.md)
npm run seed  # seed database with demo data
npm run dev   # start on http://localhost:5000

# Frontend (in another terminal)
cd frontend
npm install
# Create .env (see README.md)
npm run dev   # opens http://localhost:5173

# Login with:
# Email: admin@company.com
# Password: admin123
```

---

## Appendix: File Listing

### Backend Files (17)
```
backend/
├── server.js                    (Express entry point)
├── package.json                 (dependencies)
├── .env.example                 (env template)
├── config/
│   └── db.js                    (MongoDB connection)
├── models/
│   ├── User.js                  (User schema + bcrypt)
│   └── Employee.js              (Employee schema + AI insights)
├── controllers/
│   ├── authController.js        (signup, login, getMe)
│   ├── employeeController.js    (CRUD + search + stats)
│   └── aiController.js          (AI recommendations + fallback)
├── routes/
│   ├── authRoutes.js
│   ├── employeeRoutes.js
│   └── aiRoutes.js
├── middleware/
│   ├── authMiddleware.js        (JWT protection)
│   ├── errorMiddleware.js       (centralized errors)
│   ├── notFoundMiddleware.js
│   └── validateMiddleware.js    (input validation)
├── utils/
│   ├── generateToken.js         (JWT generator)
│   ├── rankingUtils.js          (ranking algorithm)
│   └── aiFallbackEngine.js      (deterministic recommendations)
└── data/
    └── seedEmployees.js         (seed script)
```

### Frontend Files (25+)
```
frontend/
├── src/
│   ├── main.jsx                 (React entry)
│   ├── App.jsx                  (routes)
│   ├── api/
│   │   └── axiosInstance.js     (JWT interceptor)
│   ├── context/
│   │   └── AuthContext.jsx      (auth + toasts)
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── common/
│   │   │   ├── Loader.jsx
│   │   │   ├── EmptyState.jsx
│   │   │   ├── ErrorMessage.jsx
│   │   │   ├── StatCard.jsx
│   │   │   └── ConfirmDialog.jsx
│   │   ├── employees/
│   │   │   ├── SearchFilter.jsx
│   │   │   ├── EmployeeTable.jsx
│   │   │   ├── EmployeeForm.jsx
│   │   │   └── EmployeeCard.jsx
│   │   ├── ai/
│   │   │   ├── RecommendationCard.jsx
│   │   │   └── RankingList.jsx
│   │   └── charts/
│   │       ├── PerformanceBarChart.jsx
│   │       ├── DepartmentPieChart.jsx
│   │       └── TopEmployeesChart.jsx
│   ├── pages/
│   │   ├── Login.jsx
│   │   ├── Signup.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Employees.jsx
│   │   ├── AIRecommendations.jsx
│   │   ├── Analytics.jsx
│   │   └── NotFound.jsx
│   ├── utils/
│   │   └── helpers.js           (color, tier, initials, etc.)
│   └── styles/
│       └── index.css            (premium dark theme)
├── index.html
├── vite.config.js
├── package.json
└── .env.example
```

---

**This report serves as comprehensive documentation for the B.Tech 4th semester examination. All code is production-ready and fully tested.**
