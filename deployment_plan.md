# Deployment Plan

This document outlines the steps to deploy the AI-Powered Discovery Engine. The architecture consists of a Next.js frontend and a FastAPI backend. We will deploy the backend on **Railway** and the frontend on **Vercel**.

## 1. Backend Deployment (Railway)

Railway provides a seamless deployment experience for Python FastAPI applications.

### Prerequisites
- Create an account on [Railway.app](https://railway.app/).
- Ensure your code is pushed to a GitHub repository.

### Deployment Steps
1. **New Project**: Go to the Railway dashboard and click **New Project** $\rightarrow$ **Deploy from GitHub repo**.
2. **Select Repository**: Choose your project's repository.
3. **Configure Build/Start Command**:
   - **Default Behavior**: On launch, the engine fetches live reviews into `live_playstore_reviews.csv` (or uses existing fetched files) if no custom dataset is provided, ensuring reviewers can evaluate the UI immediately with authentic data.
   - Go to the **Settings** of the newly created service.
   - Under **Deploy**, set the **Start Command** to:
     ```bash
     python -m uvicorn src.api.main:app --host 0.0.0.0 --port $PORT
     ```
4. **Environment Variables**:
   - Go to the **Variables** tab in Railway.
   - Add the necessary API keys from your `.env` file (refer to `.env.example`):
     - `OPENAI_API_KEY` or `GEMINI_API_KEY`
     - `EMBEDDING_MODEL_NAME=all-mpnet-base-v2`
     - `CHROMA_DB_DIR=./data/processed/chroma_db`
     - `RAW_DB_PATH=./data/raw/raw_feedback.sqlite`
5. **Persistent Storage (Crucial)**:
   - Because Railway containers are ephemeral, any SQLite database or ChromaDB files stored in `./data` will be lost when the service restarts or redeploys.
   - Go to the **Volumes** tab for your service in Railway.
   - Create a new Volume and mount it to `/app/data` (if your working directory is `/app`). You should include `/app/data/raw/live_multi_source_reviews.csv` - Built dynamically via the `/api/fetch-live-reviews` endpoint. Update the `CHROMA_DB_DIR` and `RAW_DB_PATH` environment variables to point to the mounted volume path.
6. **Generate Domain**: Go to the **Networking** tab and click **Generate Domain** to get a public URL for your backend (e.g., `https://discovery-backend.up.railway.app`).
7. **CORS Configuration**: Your FastAPI backend currently has CORS set to `allow_origins=["*"]`, which will safely allow requests from your Vercel frontend. 

---

## 2. Frontend Pre-Deployment Code Changes

Before deploying the frontend to Vercel, we need to make the Next.js app aware of the production backend URL instead of hardcoding `localhost:8000`.

### Update `frontend/src/app/page.tsx`
*Note: This change has already been implemented in the codebase.*
```typescript
const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
```

---

## 3. Frontend Deployment (Vercel)

Vercel is the native deployment platform for Next.js applications and requires zero configuration.

### Prerequisites
- Create an account on [Vercel.com](https://vercel.com/).
- Connect your GitHub account.

### Deployment Steps
1. **Add New Project**: In the Vercel dashboard, click **Add New...** $\rightarrow$ **Project**.
2. **Import Repository**: Select your GitHub repository.
3. **Configure Project Settings**:
   - **Framework Preset**: Vercel will automatically detect **Next.js**.
   - **Root Directory**: Click "Edit" and set the root directory to `frontend` (since the Next.js app is inside the `frontend/` folder).
4. **Environment Variables**:
   - Expand the **Environment Variables** section.
   - Add a new environment variable:
     - **Name**: `NEXT_PUBLIC_API_URL`
     - **Value**: `[Your Railway Backend URL]` (e.g., `https://discovery-backend.up.railway.app`)
5. **Deploy**: Click **Deploy**. Vercel will build the frontend and provide you with a live, production-ready URL (e.g., `https://discovery-engine.vercel.app`).

---

## 4. Post-Deployment Verification
1. Open your Vercel deployment URL.
2. The dashboard should load and successfully connect to the Railway backend.
3. Test the application functionalities (like uploading a CSV or auto-generating data) to verify that the FastAPI backend successfully executes the data pipeline in the cloud and that storage works correctly.
