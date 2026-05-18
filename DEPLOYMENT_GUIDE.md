# PerformIQ Deployment Guide (Render)

This guide walks you through deploying the **PerformIQ** application on [Render](https://render.com/). PerformIQ consists of a React/Vite frontend and a Node.js/Express backend that communicates with an SQLite database.

We will deploy them as two separate services on Render's **Free Tier**:
1. **Backend API**: A Node.js Web Service.
2. **Frontend Website**: A Static Site.

---

## 💾 SQLite Database Persistence (Important Note)

Render's web service disks are **ephemeral** by default on the Free Tier, meaning any added/edited employees will be reset whenever the server restarts (e.g. daily, during new deploys, or when sleeping). 

### How to make it persistent:
To keep your data permanently, you can attach a **Persistent Disk** on Render:
1. When configuring the Web Service, scroll down to the **Disks** section.
2. Click **Add Disk**:
   - **Name**: `epars-db-disk`
   - **Mount Path**: `/var/data`
   - **Size**: `1 GB` (More than enough)
3. Set the Environment Variable `DATABASE_PATH` to `/var/data/epars.db` (see instructions below).

*(If you remain on the Free Tier without a paid disk, the app will work perfectly, but will occasionally reset the database to the seeded sample employees on restarts).*

---

## 🔌 Step 1: Deploy the Node/Express Backend (Web Service)

1. Log in to [Render](https://render.com/) and click **New +** ➜ **Web Service**.
2. Connect your GitHub repository: `https://github.com/Angelina78-lang/performiq`
3. Configure the service:
   - **Name**: `performiq-backend`
   - **Region**: Choose the closest region to your users.
   - **Branch**: `main`
   - **Root Directory**: `backend` (Crucial!)
   - **Runtime**: `Node`
4. Build and Start Settings:
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
5. Click **Advanced** and add the following **Environment Variables**:
   - `PORT`: `10000`
   - `NODE_ENV`: `production`
   - `JWT_SECRET`: `your_own_secure_random_string`
   - `CLIENT_URL`: `https://your-frontend-url.onrender.com` (You can update this after deploying the frontend!)
   - `DATABASE_PATH`: `/var/data/epars.db` *(Optional, only if attaching a Persistent Disk at `/var/data`)*
6. Click **Create Web Service**.

Once deployed, copy the service URL (e.g., `https://performiq-backend.onrender.com`). You will need this for the frontend!

---

## 🎨 Step 2: Deploy the React/Vite Frontend (Static Site)

1. Click **New +** ➜ **Static Site**.
2. Connect the same GitHub repository: `https://github.com/Angelina78-lang/performiq`
3. Configure the service:
   - **Name**: `performiq`
   - **Branch**: `main`
   - **Root Directory**: `frontend` (Crucial!)
4. Build and Publish Settings:
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`
5. Add the following **Environment Variables**:
   - `VITE_API_URL`: `https://your-backend-url.onrender.com/api` (Replace with your actual backend URL + `/api`)
6. Click **Create Static Site**.

---

## 🔄 Step 3: Enable Client Routing (SPA Rewrite Rule)

Because React uses client-side routing (React Router), you must tell Render to direct all subpages back to `index.html` to avoid `404 Not Found` page refreshes:

1. In your Render Frontend dashboard, go to **Redirects/Rewrites**.
2. Click **Add Rule**:
   - **Source**: `/*`
   - **Destination**: `/index.html`
   - **Action**: `Rewrite`
3. Click **Save Changes**.

---

## 🚀 Step 4: Seed the Database (Optional)

To start your live site with the 8 realistic sample employees and the default `admin@company.com` credentials:

1. In your backend Render dashboard, click the **Shell** tab on the left menu.
2. Run the following command directly in the shell:
   ```bash
   npm run seed
   ```
3. You can now log into your live site with:
   - **Email**: `admin@company.com`
   - **Password**: `admin123`

🎉 **Congratulations! Your PerformIQ application is now deployed and running in the cloud!**
