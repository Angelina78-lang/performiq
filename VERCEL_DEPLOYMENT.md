# PerformIQ Deployment Guide (100% Vercel)

This guide walks you through deploying **both the frontend and backend** of **PerformIQ** entirely on [Vercel](https://vercel.com/)! 

We have added robust, custom compatibility layers to make SQLite run seamlessly inside Vercel's serverless functions by dynamically copying the database file to a writable `/tmp` directory on startup.

We will deploy them as two separate projects on your free Vercel account:
1. **Backend API**: Serverless Node.js/Express App.
2. **Frontend Website**: Vite/React Static Site.

---

## 🔌 Step 1: Deploy the Express Backend on Vercel

1. Sign up/Log in to **Vercel** and click **Add New...** ➜ **Project**.
2. Connect your GitHub repository: `https://github.com/Angelina78-lang/performiq`.
3. Configure the Project Settings:
   - **Name**: `performiq-backend`
   - **Framework Preset**: Select **Other** (or Leave as default).
   - **Root Directory**: `backend` *(Crucial! Click Edit and select the `backend` folder).*
4. Build and Development Settings (Leave as default):
   - Vercel will automatically read the `backend/vercel.json` file we created and compile the Express app into serverless functions.
5. Click **Environment Variables** and add:
   - **Key**: `JWT_SECRET`
   - **Value**: `your_secure_random_string`
   - **Key**: `CLIENT_URL`
   - **Value**: `https://your-frontend-vercel-project.vercel.app` *(You can update this after deploying the frontend to allow CORS access).*
6. Click **Deploy**.

Once finished, Vercel will give you a live backend URL (e.g., `https://performiq-backend.vercel.app`). **Copy this URL!**

---

## 🎨 Step 2: Deploy the React Frontend on Vercel

1. Go back to your Vercel Dashboard and click **Add New...** ➜ **Project**.
2. Connect the same repository: `https://github.com/Angelina78-lang/performiq`.
3. Configure the Project Settings:
   - **Name**: `performiq-frontend`
   - **Framework Preset**: `Vite` (Detected automatically).
   - **Root Directory**: `frontend` *(Crucial! Click Edit and select the `frontend` folder).*
4. Build and Development Settings (Leave as default):
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`
5. Click **Environment Variables** and add:
   - **Key**: `VITE_API_URL`
   - **Value**: `https://your-backend-vercel-project.vercel.app/api` *(Paste your live Vercel backend URL here and append `/api`!).*
6. Click **Deploy**.

Within 60 seconds, your frontend will be live on a premium `.vercel.app` domain!

---

## 🔄 Step 3: Link CORS Origins

To make sure the frontend and backend can communicate securely, update the CORS settings in your backend:
1. Go to your **Backend Project Settings** in Vercel.
2. Select **Environment Variables**.
3. Update `CLIENT_URL` with your exact live Vercel frontend URL: `https://your-frontend-vercel-project.vercel.app`.
4. Trigger a **Redeploy** on the backend deployment tab so the CORS origin is updated!

---

## 💾 How SQLite Works in Vercel Serverless (Behind the Scenes)

Vercel's standard hosting environment is read-only. To make SQLite run perfectly:
1. On start, the backend automatically detects it is running in Vercel (`process.env.VERCEL`).
2. It dynamically copies your pre-seeded SQLite database file (`epars.db`) from your workspace into Vercel's writable `/tmp` directory.
3. It connects to the database inside `/tmp`, allowing you to add, edit, or delete employees smoothly.

*(Note: In serverless environments, the `/tmp` folder is temporarily cleared whenever Vercel puts the serverless functions to sleep after a period of inactivity. This means changes will eventually reset back to the 8 sample employees on cold starts, which is perfect for portfolio demonstrations!)*
