# FineTube — Education-Only Video Platform

Engineered from the **Education Video Platform Product & Engineering Blueprint**.
Built with a clear separation of concerns:
- **`frontend/`**: Minimalist, distraction-free Next.js web application.
- **`backend/`**: Node.js & Express REST API with MongoDB/Mongoose models and Bayesian ranking engine.

---

## 📁 Project Architecture

```
finetube/
├── frontend/                     # Next.js 14 App Router + Tailwind CSS
│   ├── src/
│   │   ├── app/                 # Routes: /, /topics, /watch/[id], /playlists, /library, /search
│   │   ├── components/          # VideoCard, Navbar, and Workspace components
│   │   └── lib/                 # Types, Bayesian scoring formulas, in-memory state
│   ├── package.json
│   └── tsconfig.json
│
├── backend/                      # Node.js + Express + TypeScript REST API
│   ├── src/
│   │   ├── config/              # MongoDB connection
│   │   ├── models/              # Topic, Video, Playlist, Note, Rating schemas
│   │   ├── services/            # Bayesian ranking & scoring service
│   │   └── server.ts            # REST API endpoints (/api/v1/feed, /topics, /videos, /notes)
│   ├── package.json
│   └── tsconfig.json
│
└── education_video_platform_product_and_engineering_blueprint.pdf
```

---

## 🚀 Running the Project

### 1. Frontend
```bash
cd frontend
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 2. Backend
```bash
cd backend
npm run dev
```
API runs on [http://localhost:5000](http://localhost:5000).

---

## 🎨 UI Refinement
The user interface has been streamlined for pure focus:
- Removed noisy promotional banners, oversized badges, and repetitive explanatory paragraphs.
- Clean, dark minimalist aesthetic inspired by modern productivity tools (e.g., Linear / Vercel).
- Streamlined video cards showing only thumbnail, duration, title, channel, and community star rating.
- Distraction-free two-column learning workspace: video player alongside clean tabs for Notes, Code, AI Summary, and Chapters.
