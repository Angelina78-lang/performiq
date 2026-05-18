# PerformIQ Unified One-Click Vercel Deployment Guide

We have engineered a **Unified Monorepo Deployment** configuration. 

You no longer need to deploy two separate projects, configure manual environment variables, or worry about CORS access restrictions! Everything builds and runs together on the **exact same Vercel project** out-of-the-box!

---

## 🚀 Unified Deployment Steps (Fastest & Easiest)

1. Log in to [Vercel](https://vercel.com/) and click **Add New...** ➜ **Project**.
2. Connect your GitHub repository: `https://github.com/Angelina78-lang/performiq`
3. Configure the Project Settings:
   - **Framework Preset**: Select **Other**.
   - **Root Directory**: **Leave blank (select the root of the repository)**. *(Vercel will read the root `vercel.json` file and automatically orchestrate both the Vite React frontend and the Express/SQLite serverless backend under your domain).*
4. Click **Deploy**.

**That’s it!** Within 60 seconds, your entire application (frontend + backend) will be live under a single unified URL (e.g. `https://performiq-opal.vercel.app`) with zero configuration!

---

## 🧠 Why this works flawlessly:
1. **Dynamic Routing**: The root `vercel.json` intercepts all traffic starting with `/api/*` and routes it to the Express backend serverless function, while routing all other traffic directly to your React SPA frontend.
2. **Relative API Requests**: In production, the frontend automatically makes relative API requests to `/api/...` instead of an absolute URL, completely eliminating the need for `VITE_API_URL` environment variables!
3. **No CORS Issues**: Because both the frontend and backend run on the *exact same domain*, there are absolutely zero CORS cross-origin blocks, securing and optimizing your request payloads.
4. **Writable SQLite**: On startup, the backend copies the pre-seeded SQLite database file (`epars.db`) into Vercel's writable `/tmp` directory, ensuring all admin logins and sample employee operations are immediately functional!
