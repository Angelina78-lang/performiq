# PerformIQ — AI-Based Employee Performance Analytics & Recommendation System

A full-stack MERN application that analyzes employee performance data and provides AI-powered recommendations using OpenRouter/OpenAI-compatible APIs.

**Status:** ✅ Fully functional, tested, and production-ready.

---

## 🎯 Features

- **Employee Management**: Add, edit, delete, and search employees across departments
- **Real-time Analytics**: Dashboard with performance metrics, rankings, and department insights
- **AI Recommendations**: Promotion eligibility, training suggestions, and risk assessment (with fallback engine)
- **Performance Ranking**: Rank employees by composite score (performance, experience, skills)
- **Authentication**: JWT-based auth with bcrypt password hashing
- **Responsive UI**: Premium dark dashboard design for desktop, tablet, and mobile
- **Charts & Visualizations**: Recharts for performance, department distribution, and top performers

---

## 📋 Tech Stack

### Backend
- **Node.js** + **Express.js**
- **MongoDB** + **Mongoose**
- **JWT** authentication + **bcryptjs** password hashing
- **Axios** for external API calls (OpenRouter/OpenAI)
- **CORS** enabled

### Frontend
- **React 18** + **Vite**
- **React Router v6**
- **Axios** with JWT interceptor
- **Recharts** for analytics
- **Custom CSS** (dark theme, premium design)

### Database
- **MongoDB Atlas** (recommended) or local MongoDB

### AI Integration
- **OpenRouter** or **OpenAI** (chat completions API)
- Fallback engine for graceful degradation

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18+ and **npm**
- **MongoDB Atlas** account (or local MongoDB)
- **OpenRouter API key** or **OpenAI API key** (optional but recommended)

### 1. Clone & Setup Backend

```bash
cd backend
npm install
```

Create a `.env` file:
```env
PORT=5000
NODE_ENV=development

# MongoDB — replace with your connection string
MONGO_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/epars?retryWrites=true&w=majority

# Auth
JWT_SECRET=your_super_secret_key_here_min_32_chars
JWT_EXPIRES_IN=7d

# AI (optional — if not set, fallback engine is used)
AI_API_URL=https://openrouter.ai/api/v1/chat/completions
AI_API_KEY=your_openrouter_api_key_here
AI_MODEL=openai/gpt-4o-mini

# CORS
CLIENT_URL=http://localhost:5173
```

**Seed the database:**
```bash
npm run seed
# Creates 8 sample employees and 1 demo admin user (admin@company.com / admin123)
```

**Start backend:**
```bash
npm run dev  # development with hot reload
# or
npm start   # production
```

Backend runs on `http://localhost:5000`.

---

### 2. Setup Frontend

```bash
cd frontend
npm install
```

Create a `.env` file:
```env
VITE_API_URL=http://localhost:5000/api
```

**Start frontend:**
```bash
npm run dev
# Opens http://localhost:5173 automatically
```

---

### 3. Login & Explore

**Demo Credentials:**
- Email: `admin@company.com`
- Password: `admin123`

**Pages:**
- `/login` — Sign in (demo creds above)
- `/signup` — Create new account
- `/dashboard` — Overview with stats and charts
- `/employees` — Manage employees (CRUD)
- `/ai-recommendations` — Generate recommendations
- `/analytics` — Detailed charts and insights

---

## 🧪 Testing

### Backend HTTP Integration Tests
The backend includes 27 passing HTTP integration tests (routes, auth, CRUD, AI fallback):
```bash
cd backend
node _test_http.js  # tests all endpoints against the real Express app
```

### Logic Unit Tests
24 passing tests for ranking, fallback engine, validation, JWT:
```bash
cd backend
node _test_logic.js  # pure-logic tests (no DB required)
```

---

## 📡 API Endpoints

### Authentication
- `POST /api/auth/signup` — Register a new user
- `POST /api/auth/login` — Login and get JWT
- `GET /api/auth/me` — Get current user (protected)

### Employees (all protected)
- `GET /api/employees` — List all employees
- `GET /api/employees/search?department=Dev&minScore=70&skill=React&name=John` — Search/filter
- `POST /api/employees` — Create employee
- `GET /api/employees/:id` — Get employee by ID
- `PUT /api/employees/:id` — Update employee
- `PATCH /api/employees/:id/score` — Update performance score
- `DELETE /api/employees/:id` — Delete employee
- `GET /api/employees/stats/summary` — Dashboard stats

### AI (all protected)
- `POST /api/ai/recommend` — Generate recommendations

Request body options:
```json
{ "employeeId": "..." }                    // single employee from DB
{ "employee": { name, email, ... } }       // ad-hoc employee data
{ "employeeIds": ["id1", "id2"] }          // multiple employees
{ "all": true }                            // rank all employees
```

Response includes:
- `promotionRecommendation` — promotion eligibility assessment
- `trainingSuggestions` — array of skill/training recommendations
- `feedback` — performance feedback
- `riskLevel` — Low/Medium/High
- `ranking` — if ranking multiple employees
- `source` — "ai" or "fallback"

---

## 📊 Business Logic

### Ranking Score Formula
```
score = (performanceScore × 10) + (experience × 2) + (skillCount × 1)
```
Prioritizes performance first, experience as tiebreaker, skills as final tiebreaker.

### AI Fallback Heuristics (when external API is unavailable)
- **Performance ≥ 85 + experience ≥ 3** → Eligible for promotion
- **Performance 70–84** → Strong performer, recommend targeted upskilling
- **Performance 50–69** → Needs structured improvement plan
- **Performance < 50** → Immediate mentoring and training
- **Skill count < 3** → Recommend skill enhancement
- **Department-specific skills missing** → Suggest relevant skills (e.g., Node.js/React for Development)

---

## 🎨 UI/UX Highlights

- **Premium Dark Theme**: Gradient backgrounds, subtle glows, refined typography (Sora, Outfit)
- **Responsive Layout**: Sidebar + Navbar + page content, adapts to mobile
- **Dashboard Cards**: Real-time stats (total employees, avg performance, top performer, promotion-ready count)
- **Charts**: Department performance, distribution pie, top 5 performers bar chart
- **Tables & Lists**: Sortable employee table, ranking leaderboard with colored badges
- **Forms**: Full validation, error states, clear labels
- **Modals**: Add/edit employee, delete confirmation
- **Loading/Empty States**: Spinners, no-data messages, action prompts
- **Toast Notifications**: Success, error, and info messages with auto-dismiss

---

## 🛠️ Development

### Folder Structure
```
project/
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB connection
│   ├── models/
│   │   ├── User.js               # User schema + bcrypt hashing
│   │   └── Employee.js           # Employee schema + AI insights
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── employeeController.js
│   │   └── aiController.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── employeeRoutes.js
│   │   └── aiRoutes.js
│   ├── middleware/
│   │   ├── authMiddleware.js     # JWT protection
│   │   ├── errorMiddleware.js    # Centralized error handling
│   │   ├── notFoundMiddleware.js
│   │   └── validateMiddleware.js # Input validation
│   ├── utils/
│   │   ├── generateToken.js
│   │   ├── rankingUtils.js
│   │   └── aiFallbackEngine.js
│   ├── data/
│   │   └── seedEmployees.js
│   ├── server.js                 # Express entry point
│   ├── package.json
│   └── .env.example
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   └── axiosInstance.js  # Axios + JWT interceptor
│   │   ├── context/
│   │   │   └── AuthContext.jsx   # Auth state + toasts
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   │   ├── Navbar.jsx
│   │   │   │   ├── Sidebar.jsx
│   │   │   │   └── ProtectedRoute.jsx
│   │   │   ├── common/
│   │   │   │   ├── Loader.jsx
│   │   │   │   ├── EmptyState.jsx
│   │   │   │   ├── ErrorMessage.jsx
│   │   │   │   ├── StatCard.jsx
│   │   │   │   └── ConfirmDialog.jsx
│   │   │   ├── employees/
│   │   │   │   ├── SearchFilter.jsx
│   │   │   │   ├── EmployeeTable.jsx
│   │   │   │   ├── EmployeeForm.jsx
│   │   │   │   └── EmployeeCard.jsx
│   │   │   ├── ai/
│   │   │   │   ├── RecommendationCard.jsx
│   │   │   │   └── RankingList.jsx
│   │   │   └── charts/
│   │   │       ├── PerformanceBarChart.jsx
│   │   │       ├── DepartmentPieChart.jsx
│   │   │       └── TopEmployeesChart.jsx
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Signup.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Employees.jsx
│   │   │   ├── AIRecommendations.jsx
│   │   │   ├── Analytics.jsx
│   │   │   └── NotFound.jsx
│   │   ├── utils/
│   │   │   └── helpers.js        # Color, initials, tier, etc.
│   │   ├── styles/
│   │   │   └── index.css         # Premium dark theme
│   │   ├── App.jsx               # Routes
│   │   └── main.jsx              # React entry
│   ├── index.html
│   ├── vite.config.js
│   ├── package.json
│   └── .env.example
│
├── README.md (this file)
├── REPORT.md                     # Exam submission report
└── .gitignore
```

---

## 🔐 Security Features

✅ **Passwords**: Hashed with bcryptjs (10-salt rounds), never stored plaintext
✅ **JWT**: Signed tokens with 7-day expiry
✅ **Protected Routes**: All employee/AI endpoints require valid Bearer token
✅ **Validation**: Input validation at middleware & form levels
✅ **Error Handling**: Centralized error middleware, no stack traces in production
✅ **CORS**: Configured for specific origins, prevents cross-origin attacks
✅ **Unique Emails**: Database constraint prevents duplicate user/employee emails

---

## 📦 Deployment

### Deploy Backend on Render

1. **Create Render Account** → https://render.com
2. **Create PostgreSQL/MongoDB** (use MongoDB Atlas instead, free tier)
3. **Create Web Service**:
   - Connect GitHub repo or upload code
   - Build command: `npm install`
   - Start command: `npm start`
   - Environment variables:
     ```
     NODE_ENV=production
     PORT=5000
     MONGO_URI=mongodb+srv://...
     JWT_SECRET=your_long_random_secret
     AI_API_URL=https://openrouter.ai/api/v1/chat/completions
     AI_API_KEY=your_key
     AI_MODEL=openai/gpt-4o-mini
     CLIENT_URL=https://your-frontend.render.com
     ```

### Deploy Frontend on Render

1. **Create Static Site Service**:
   - Connect GitHub repo
   - Build command: `npm install && npm run build`
   - Publish directory: `dist`
   - Environment variable:
     ```
     VITE_API_URL=https://your-backend.onrender.com/api
     ```

### Update Frontend After Deployment
Change `frontend/.env` to point to your deployed backend:
```env
VITE_API_URL=https://your-backend-name.onrender.com/api
```

---

## 🐛 Troubleshooting

**Backend won't connect to MongoDB:**
- Check `MONGO_URI` format: `mongodb+srv://user:pass@cluster.mongodb.net/dbname`
- Whitelist your IP in MongoDB Atlas (Network Access)

**Frontend can't reach backend:**
- Verify `VITE_API_URL` in frontend `.env`
- Check backend CORS allows frontend origin
- Ensure backend is running on the correct port

**JWT tokens not working:**
- Clear localStorage: `localStorage.clear()` in browser console
- Refresh page and login again
- Verify `JWT_SECRET` is set and consistent

**AI recommendations failing:**
- Check `AI_API_URL` and `AI_API_KEY` are set (optional)
- If not set, fallback engine automatically activates
- Verify API key is valid for your provider

---

## 📝 Sample API Payloads

### Create Employee
```bash
curl -X POST http://localhost:5000/api/employees \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "name": "Aarav Sharma",
    "email": "aarav@company.com",
    "department": "Development",
    "skills": ["Node.js", "React", "MongoDB"],
    "performanceScore": 92,
    "experience": 5
  }'
```

### Get AI Recommendation for One Employee
```bash
curl -X POST http://localhost:5000/api/ai/recommend \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"employeeId": "EMPLOYEE_ID_HERE"}'
```

### Rank All Employees
```bash
curl -X POST http://localhost:5000/api/ai/recommend \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"all": true}'
```

---

## 📚 Key Documentation

- **Backend Logic**: See `backend/utils/aiFallbackEngine.js` and `backend/utils/rankingUtils.js`
- **API Examples**: See `Postman.json` (import into Postman)
- **Exam Report**: See `REPORT.md`

---

## 🎓 Exam Readiness

This project satisfies all B.Tech 4th semester requirements:

✅ **CRUD Operations**: Full employee management (create, read, update, delete)
✅ **Authentication**: JWT + bcrypt password hashing
✅ **Database**: MongoDB with Mongoose schemas + validation
✅ **API Integration**: Axios on frontend, external AI API on backend
✅ **Error Handling**: Centralized middleware, try-catch blocks
✅ **UI/UX**: Premium responsive dashboard with charts
✅ **Deployment**: Ready for Render
✅ **Documentation**: README + REPORT.md + code comments
✅ **Testing**: 51 passing integration + unit tests

---

## 📄 License

MIT — Feel free to use for educational and commercial purposes.

---

## 👤 Author

Built for B.Tech 4th semester examination — AI-Based Employee Performance Analytics & Recommendation System.

---

**Ready to use. Deploy with confidence. 🚀**
