# FineTube Production Deployment & Operations Manual
> **Blueprint Reference**: Product & Engineering Blueprint (§10, §14, §17, §19, §20, §21, §22, §25 & §28)

---

## 1. Architecture Overview
FineTube is built as a **modular monolith** optimized for educational clarity, zero-distraction learning, and robust solo-developer maintainability:

- **Frontend**: Next.js 14 App Router (TypeScript, Tailwind CSS, Lucide icons, Dark Zinc `#09090b` aesthetic).
- **Backend API**: Express + TypeScript with versioned REST endpoints (`/api/v1/*`), dynamic CORS, and resilient fallbacks.
- **Database**: MongoDB 7.0 with automatic in-memory seed fallback if MongoDB is offline or in cold start.
- **Ranking Engine**: Confidence-adjusted Bayesian rating formula preventing low-volume manipulation.
- **Learning Workspace**: Contextual video player, rich timestamped notes, multi-language sandbox (`JS`, `Python`, `TS`), grounded Ask AI assistant, and concept quiz generator.
- **Disaster Recovery**: Automated point-in-time database snapshotting with SHA256 integrity checksums.

---

## 2. Quickstart: Running Locally

### Prerequisites
- Node.js >= 20.x
- npm >= 10.x

### 1. Start the Backend API (Port 5000)
```bash
cd backend
npm install
npm run dev
```
*The backend API will start on `http://localhost:5000`.*

### 2. Start the Frontend Web App (Port 3000)
```bash
cd frontend
npm install
npm run dev
```
*Open `http://localhost:3000` in your browser.*

---

## 3. Running with Docker Compose (One-Click Production Setup)

FineTube includes multi-stage production Docker configurations for instant containerized deployment:

```bash
docker compose up --build -d
```

### Services Launched:
| Container | Role | Port | Health Check |
| :--- | :--- | :--- | :--- |
| `finetube-mongodb` | Primary Data Store | `27017` | `mongosh --eval db.adminCommand("ping")` |
| `finetube-backend` | Express API Service | `5000` | `http://localhost:5000/api/v1/health` |
| `finetube-frontend` | Next.js Web App | `3000` | Prerendered production output |

To stop containers:
```bash
docker compose down
```

---

## 4. Environment Variables Configuration

Both services include pre-configured `.env.example` templates. Sensitive files (`.env`, `.env.local`) are strictly excluded by `.gitignore`.

### Backend (`backend/.env`)
```env
PORT=5000
NODE_ENV=production
MONGODB_URI=mongodb://127.0.0.1:27017/finetube
JWT_SECRET=your-32-character-random-secure-jwt-secret-key-here
CORS_ORIGIN=*
DAILY_SANDBOX_QUOTA=50
YOUTUBE_API_KEY=
OPENAI_API_KEY=
```
*Note: If `MONGODB_URI` is offline or invalid, the backend automatically uses its built-in in-memory seed store without throwing 500 errors.*

### Frontend (`frontend/.env.local`)
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
```
*Note: In production deployments, if `NEXT_PUBLIC_API_URL` is omitted, the frontend automatically defaults to relative `/api/v1` for reverse proxies (e.g. Nginx, Vercel rewrites).*

---

## 5. Automated Verification & Quality Gates Test Suite

FineTube includes 4 automated verification test suites:

```bash
cd backend
npm run test:all
```

### Included Test Suites:
1. **Quality Gates (`npm test`)**: 29 assertions verifying Bayesian ranking, grounded AI anti-hallucination, quiz quality, prompt injection defense, and unit economics.
2. **Pilot Learner Journey Simulation (`npm run test:simulation`)**: End-to-end 10-step simulation of interest selection, lecture watch, notes, code sandbox, AI assistant, quiz, custom playlist forking, and GDPR data export.
3. **Disaster Recovery (`npm run test:backup`)**: Validates point-in-time snapshot generation, SHA256 checksums, and atomic restoration.
4. **Offline Ranking Benchmark (`npm run test:ndcg`)**: Measures NDCG@3 and Precision@2 against gold-standard curricula.

---

## 6. Disaster Recovery & Snapshot Workflow

- **Create Manual Snapshot**: In Admin Console (`/admin` -> Disaster Recovery) click **"Create Snapshot"**, or run:
  ```bash
  curl -X POST http://localhost:5000/api/v1/admin/backups
  ```
- **Restore Snapshot**:
  ```bash
  curl -X POST http://localhost:5000/api/v1/admin/backups/<fileName>/restore
  ```
- All snapshots are saved to `backend/backups/` and protected with SHA256 hashes.

---

## 7. Cloud Deployment Checklist

### Deploying Frontend (Vercel / Netlify):
1. Connect Git repository (`frontend` as Root Directory).
2. Set Environment Variable: `NEXT_PUBLIC_API_URL=https://api.yourdomain.com/api/v1`.
3. Build Command: `npm run build`.

### Deploying Backend (Render / Railway / Fly.io / AWS):
1. Connect Git repository (`backend` as Root Directory).
2. Set Environment Variables: `PORT=5000`, `NODE_ENV=production`, `MONGODB_URI=...`, `CORS_ORIGIN=https://your-frontend.vercel.app`.
3. Build Command: `npm run build`, Start Command: `npm start`.

---
*FineTube Platform • Engineered to Product & Engineering Blueprint standards.*
