# 🚀 PerformIQ — Quick Setup Guide

**Time to first run: ~10 minutes**

---

## Prerequisites ✅

- **Node.js 18+** — [Download](https://nodejs.org)
- **MongoDB Atlas account** (free tier) — [Sign up](https://www.mongodb.com/cloud/atlas)
- **Git** (optional) — [Download](https://git-scm.com)

---

## Step 1: Setup Backend (Terminal 1)

```bash
cd backend
npm install
```

**Create `.env` file** (copy `.env.example` and edit):
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb+srv://USER:PASSWORD@CLUSTER.mongodb.net/epars?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_key_here_min_32_characters_long
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
```

**Get MongoDB connection string:**
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create free account
3. Create cluster (free tier)
4. Click "Connect" → "Drivers" → Copy connection string
5. Replace `<password>` and `<username>` in MONGO_URI

**Seed database:**
```bash
npm run seed
# ✅ Creates 8 sample employees + 1 demo admin user
```

**Start backend:**
```bash
npm run dev
# ✅ Backend runs on http://localhost:5000
```

---

## Step 2: Setup Frontend (Terminal 2)

```bash
cd frontend
npm install
```

**Create `.env` file**:
```env
VITE_API_URL=http://localhost:5000/api
```

**Start frontend:**
```bash
npm run dev
# ✅ Frontend opens at http://localhost:5173 automatically
```

---

## Step 3: Login & Test

Open **http://localhost:5173** in your browser.

**Demo Credentials:**
```
Email: admin@company.com
Password: admin123
```

---

## 🎯 Navigate to These Pages

- **Dashboard** — Overview with stats and charts
- **Employees** — Add, edit, delete, search employees
- **AI Insights** — Get AI recommendations for employees
- **Analytics** — Detailed charts and insights

---

## 🧪 Test the API (Optional)

### Option A: Postman
1. Open [Postman](https://www.postman.com/downloads/)
2. File → Import → Select `Postman.json`
3. Set `baseUrl` variable to `http://localhost:5000`
4. Click "Login" request to get JWT token
5. Run other requests

### Option B: cURL

```bash
# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@company.com","password":"admin123"}'

# Get token from response, then use it:
TOKEN="your_token_here"

# Get all employees
curl -X GET http://localhost:5000/api/employees \
  -H "Authorization: Bearer $TOKEN"

# Get AI recommendations for all employees
curl -X POST http://localhost:5000/api/ai/recommend \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"all":true}'
```

---

## ⚙️ Common Issues & Solutions

### ❌ "Cannot connect to MongoDB"
**Solution:**
1. Check MONGO_URI is correct (no spaces, proper format)
2. Go to MongoDB Atlas → Network Access
3. Add your IP address (or allow "0.0.0.0/0" for development)
4. Verify database user credentials

### ❌ "CORS error" or "Cannot reach backend"
**Solution:**
1. Ensure backend is running on port 5000
2. Check frontend `.env` has `VITE_API_URL=http://localhost:5000/api`
3. Refresh frontend browser (Ctrl+Shift+R)

### ❌ "JWT token expired or invalid"
**Solution:**
1. Open browser DevTools (F12)
2. Go to Application → LocalStorage
3. Delete `epars_token` and `epars_user`
4. Refresh and login again

### ❌ "seedEmployees.js fails"
**Solution:**
- Ensure backend `.env` has valid MONGO_URI
- Run: `npm run seed` from inside the `backend` folder
- Check console output for detailed error

### ❌ "npm install takes too long"
**Solution:**
- Check internet connection
- Try: `npm install --no-optional`
- Or clear npm cache: `npm cache clean --force`

---

## 📦 File Structure Quick Reference

```
backend/
├── server.js           — Express entry point
├── config/db.js        — MongoDB connection
├── models/             — Database schemas (User, Employee)
├── controllers/        — Business logic
├── routes/             — API endpoints
├── middleware/         — Auth, validation, errors
├── utils/              — Helpers (JWT, ranking, AI fallback)
└── data/seedEmployees.js — Demo data

frontend/
├── src/pages/          — Dashboard, Employees, AI, Analytics
├── src/components/     — Reusable React components
├── src/styles/         — Dark theme CSS
├── src/api/            — Axios with JWT
└── src/context/        — Auth state + toasts
```

---

## 🚀 Production Deployment (Render.com)

### Backend Deployment

1. **Create Render Account:** https://render.com
2. **Create Web Service:**
   - Connect GitHub repo
   - Build: `npm install`
   - Start: `npm start`
   - Environment variables:
     ```
     NODE_ENV=production
     PORT=5000
     MONGO_URI=your_mongodb_atlas_uri
     JWT_SECRET=your_secret_min_32_chars
     CLIENT_URL=https://your-frontend-url.onrender.com
     AI_API_URL=https://openrouter.ai/api/v1/chat/completions (optional)
     AI_API_KEY=your_key (optional)
     AI_MODEL=openai/gpt-4o-mini (optional)
     ```

### Frontend Deployment

1. **Create Static Site:**
   - Connect GitHub repo
   - Build: `npm install && npm run build`
   - Publish dir: `dist`
   - Environment:
     ```
     VITE_API_URL=https://your-backend-url.onrender.com/api
     ```

**Note:** After deploying frontend, update frontend `.env` to point to deployed backend URL.

---

## 📚 Documentation

- **README.md** — Complete setup, API docs, deployment guide
- **REPORT.md** — Exam submission report (B.Tech 4th semester)
- **PROJECT_CHECKLIST.md** — Feature checklist and verification status
- **Postman.json** — API testing collection

---

## 🎯 Key Features to Try

### 1. Create an Employee
- Go to `/employees`
- Click "+ Add Employee"
- Fill form and submit
- Employee appears in table

### 2. Search & Filter
- Use department dropdown
- Use performance score filter
- Type in search box and click "Search"

### 3. Get AI Recommendations
- Click "✨" button on any employee
- Or go to `/ai-recommendations` and click "📊 Rank All"
- See promotion eligibility, training suggestions, risk level

### 4. View Analytics
- Go to `/analytics`
- See department performance chart
- See employee distribution pie chart
- See top 5 performers ranked

### 5. Edit an Employee
- Click "✏️" button on employee row
- Modal opens with form
- Update and save

### 6. Delete an Employee
- Click "🗑️" button
- Confirm deletion
- Employee removed from list

---

## 💡 Tips & Tricks

- **Demo Data:** 8 sample employees already in database after `npm run seed`
- **Fast Logout:** Click user chip in top-right navbar
- **Clear Cache:** Press Ctrl+Shift+Delete to clear browser data
- **Check Network:** F12 → Network tab shows all API calls
- **Database View:** Use MongoDB Atlas UI to view/edit data directly
- **API Testing:** Use Postman collection for quick endpoint testing

---

## 🆘 Need Help?

1. **Check logs:** Look at terminal output (both backend and frontend)
2. **Browser console:** Press F12 in browser, go to Console tab
3. **Network errors:** F12 → Network → Check API responses
4. **Database issues:** Check MongoDB Atlas connection string format
5. **Read docs:** See README.md, REPORT.md for detailed explanations

---

## ✅ Verification Checklist

After setup, verify:
- [ ] Backend running on port 5000 without errors
- [ ] Frontend running on port 5173 without errors
- [ ] Can login with demo credentials
- [ ] Dashboard loads 4 stat cards + 3 charts
- [ ] Can create a new employee
- [ ] Can search/filter employees
- [ ] Can get AI recommendations
- [ ] Can view analytics charts
- [ ] Can edit and delete employees
- [ ] No errors in browser console (F12)

---

## 🎓 For Exam Submission

Everything is ready to submit:
- ✅ **Code:** Complete and tested
- ✅ **Docs:** README + REPORT + Checklist
- ✅ **Tests:** 51 passing (documented in REPORT.md)
- ✅ **Deployment:** Ready for Render.com

Simply run locally first, verify it works, then deploy and submit!

---

**Good luck! You've got a production-ready MERN app. 🚀**
