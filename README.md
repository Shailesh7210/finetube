# FineTube — Education-Only Video Learning Platform

> Engineered from the **Education Video Platform Product & Engineering Blueprint**.
> Designed for deep, intentional concept mastery with **zero entertainment recommendation rabbit holes**.

---

## 🌟 Distinctive Value & Key Architectural Principles

1. **Explicit Topic Governance (No Distraction)**
   - Feeds are strictly populated by explicit subject & topic follows (e.g. *React Hooks*, *Binary Search Trees*, *System Design*).
   - Casual clicks or passive background watch duration do **not** hijack the user's recommendations.
2. **Bayesian Confidence-Adjusted Scoring (Section 5.3 & 5.4)**
   - Ranks educational explanations using:
     $$\text{TopicScore} = w_{\text{user}} \cdot \text{AdjustedRating} + w_{\text{ai}} \cdot \text{AIQuality} + w_{\text{coverage}} \cdot \text{Coverage} + w_{\text{fresh}} + w_{\text{trust}}$$
   - Uses Bayesian priors ($\frac{v}{v+m} \cdot A + \frac{m}{v+m} \cdot C$) so newly uploaded high-quality content is not buried by legacy vanity view counts.
   - Transparent reason codes on every card (*"Top community-rated explanation"*, *"Strong practical code examples"*, *"Comprehensive topic coverage"*).
3. **In-Context Learning Workspace (`/watch/[videoId]`)**
   - **Embedded Player**: YouTube IFrame API integration with precision time tracking.
   - **Personal Timestamped Notes**: Click-to-seek notes, autosaved directly into user study folders.
   - **Code Practice Sandbox**: In-browser client sandbox with console capture and execution time profiling.
   - **AI-Generated Structured Notes**: Evidenced notes linked directly to authorized transcript segments and timestamps.
   - **Bayesian Rating Modal**: 5-star evaluation with multi-criteria feedback (Clarity, Code Examples, Concept Fulfillment).
4. **Curated Learning Paths (`/playlists`)**
   - Non-redundant concept progressions with transparent disclosure of uncovered gaps.
   - Fork & customize paths into personal learning sequences.
5. **Personal Study Library (`/library`)**
   - Organized folders (*My Personal Notes*, *AI Study Notes*, *Code Snippets & Practice*, *Saved Learning Paths*).

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js**: v18+ (tested on Node v24)
- **npm**: v10+

### 2. Run the Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to start exploring FineTube.

### 3. Production Build
```bash
npm run build
npm start
```

---

## 🗺️ Application Routes

| Route | Purpose | Important UI Elements |
|---|---|---|
| `/` | **Focused Home Feed** | Explicitly followed topics, Bayesian score badges, reason codes |
| `/topics` | **Subject Taxonomy** | Subject hierarchy, aliases search, follow/mute controls |
| `/topics/[slug]` | **Topic Detail Page** | Concept checklist, top ranked explanations, curated paths |
| `/watch/[videoId]` | **Learning Workspace** | Embedded player, notes, code sandbox, AI notes, chapters |
| `/playlists` | **Learning Paths** | AI & learner playlists, concept progression, honest gap notes |
| `/playlists/[id]` | **Playlist Detail** | Lesson sequence, reorder controls, fork to library |
| `/library` | **Study Library** | Folders, timestamped notes, code snippets, search |
| `/search` | **Catalog Search** | Cross-search across concepts, topics, and playlists |
| `/settings/interests` | **Feed & Distraction Controls** | Explicit topic follow/mute, recommendation reset |

---

## 🔌 API Endpoints (`/api/v1`)

- `GET /api/v1/feed`: Fetches focused feed with calculated Bayesian ranking and reason codes.
- `GET /api/v1/topics`: Retrieves topic hierarchy and concept checklists.
- `GET /api/v1/notes`: Retrieves personal and AI notes with optional `folderId` filter.
- `POST /api/v1/notes`: Creates a new timestamped or AI-evidenced note.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router, React 18, TypeScript)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Database Ready**: MongoDB / Mongoose models & integrated in-memory seed store for instant local development.
