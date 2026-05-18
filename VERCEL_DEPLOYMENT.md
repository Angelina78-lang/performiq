# PerformIQ Deployment Guide (Vercel)

This guide walks you through deploying the **PerformIQ** application using **Vercel**. 

Vercel is a premium serverless platform optimized for frontend websites. Because PerformIQ uses an **SQLite database** (which requires a persistent local disk to write records), we cannot run the backend database directly on Vercel's serverless functions (which are read-only and ephemeral).

### 🏆 Recommended Strategy: Hybrid Hosting (Free Tier)
- **Frontend (React)**: Hosted on **Vercel** (Global CDN, ultra-fast loading, automatic CI/CD).
- **Backend (Express + SQLite)**: Hosted on **Render** (Node.js web service).

---

## 🎨 Step 1: Deploy the React Frontend on Vercel

Vercel makes frontend deployment effortless:

1. Sign up/Log in to [Vercel](https://vercel.com/).
2. Click **Add New...** ➜ **Project**.
3. Import your GitHub repository: `https://github.com/Angelina78-lang/performiq`.
4. Configure the Project:
   - **Framework Preset**: `Vite` (Detected automatically).
   - **Root Directory**: `frontend` (Crucial! Click Edit and select the `frontend` folder).
5. Build and Development Settings (Leave as default):
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`
6. Click **Environment Variables** and add:
   - **Key**: `VITE_API_URL`
   - **Value**: `https://your-backend-render-domain.onrender.com/api` (Replace with your actual backend Render URL + `/api`)
7. Click **Deploy**.

Within 1-2 minutes, your frontend will be live on a premium `.vercel.app` domain!

---

## 🔌 Step 2: Handle Client-Side Routing in Vercel (Fix 404 Refresh Bug)

Vercel needs to know how to handle React's client-side routing. If you refresh the page on a subroute (e.g., `/dashboard` or `/employees`), Vercel will return a 404 unless we configure a rewrite.

To fix this, we have created a `vercel.json` file inside the `frontend` directory:
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/" }
  ]
}
```
Vercel reads this file automatically and redirects all route queries to `index.html` seamlessly!

---

## ⚙️ Step 3: Configure the Backend on Render (Web Service)

Deploy the Express API to Render (which supports the stateful SQLite database):

1. Go to **Render** ➜ **New +** ➜ **Web Service**.
2. Connect your repo: `https://github.com/Angelina78-lang/performiq`
3. Settings:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
4. Environment Variables:
   - `PORT`: `10000`
   - `NODE_ENV`: `production`
   - `JWT_SECRET`: `your_secure_secret_key`
   - `CLIENT_URL`: `https://your-frontend.vercel.app` (The Vercel frontend URL from Step 1)
5. Click **Create Web Service**.

*Once your Render backend is live, copy its URL and paste it back into your Vercel Project Settings ➜ Environment Variables ➜ `VITE_API_URL`.*

---

## ❓ Can I deploy the Backend on Vercel too?

Technically, yes! Vercel allows hosting Express servers via **Serverless Functions**. However, **SQLite will not work properly** because Vercel serverless functions are read-only and scale down to zero (deleting the database file changes on every request).

If you absolutely want to run the backend on Vercel, you would need to:
1. Replace SQLite with a hosted cloud database (such as **Supabase PostgreSQL** or **Neon Serverless Postgres**).
2. Configure a root `vercel.json` to route `/api/*` to the `backend/server.js` file wrapped in a serverless adapter.

The **Vercel (Frontend) + Render (Backend)** hybrid setup is the best, easiest, and fully functional free-tier configuration for SQLite!
