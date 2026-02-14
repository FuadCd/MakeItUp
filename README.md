# MakeItUp — Time To Get Noticed By Everyone... But A Recruiter

Turn mundane activities into satirical, exaggerated LinkedIn-style posts. Generate absurd job listings and tech-news headlines. A tongue-in-cheek take on grind culture, performative professionalism, and LinkedIn culture.

## Features

### Posts
- **Generate Post** — Enter a normal activity (e.g. “Made coffee”, “Replied to an email”) and get an over-the-top LinkedIn-style post with corporate buzzwords, emojis, and **exactly 3 hashtags** (with `#` formatting).
- **Author** — Posts are attributed to **Mr. Chronic Delusion** with the headline *“On a growth journey. Mostly downward.”*
- **Comments** — Each post shows **3 comments**. One is always **“The Always-Commenter”**; the other **2** are chosen at random from a pool of **19** satirical archetypes (e.g. “The Hustle Bro”, “The Thought Leader”, “The Crypto Bro”). All three comments are AI-generated in character.
- **Generate New Variation** — Get a fresh take on the same activity (new body, hashtags, and comments) without re-typing.

### Jobs
- **Satirical job postings** — Each refresh returns **3** listings. One is always **“The Job Posting That Is Always There”**; the other **2** are chosen at random from a pool of **16** job archetypes (e.g. “Job That Was Filled 3 Months Ago”, “15 Years Experience for Entry-Level Role”, “Rockstar Ninja Unicorn”). **Refresh Jobs** fetches a new set from the API (OpenAI).

### News
- **Headlines** — The News tab fetches **3** absurd one-line headlines per request (e.g. “ChatGPT Applies to Y Combinator and Gets In”, “3-Year-Old Launches 5th Unicorn Startup”). A loading message (*“Measuring your replaceability…”*) is shown while the API runs. **Refresh Headlines** loads a new set of 3.

### UI & branding
- **MakeItUp logo** — Dashboard uses a full wordmark (`/logo.png`); browser tab uses a briefcase icon (`/favicon.png`). Both support transparent backgrounds (script: `frontend/scripts/remove-white-bg.mjs`, using **sharp**).
- **Navigation** — **Posts**, **Jobs**, and **News** with larger tap targets and a hover overlay (light blue background, slight lift).
- **Layout** — Responsive layout with a clear header (logo + tagline), input section for Posts, and card-based feeds.

## Tech stack

- **Frontend:** React 18, Vite 5
- **Backend:** Node.js, Express
- **AI:** OpenAI GPT (gpt-4o-mini) for **Posts**, **Jobs**, and **News**
- **Assets:** sharp (for logo/favicon background removal and trim)

## Setup

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env
```

Edit `backend/.env` and set your OpenAI API key:

```
OPENAI_API_KEY=sk-your-key-here
PORT=3001
```

Start the API:

```bash
npm run dev
```

The API runs at **http://localhost:3001**.

### 2. Frontend

In a new terminal:

```bash
cd frontend
npm install
npm run dev
```

The app runs at **http://localhost:5173**. The dev server proxies `/api` to `http://localhost:3001`; the backend must be running for **Posts**, **Jobs**, and **News** to work.

### 3. OpenAI API key

Create an API key at [platform.openai.com/api-keys](https://platform.openai.com/api-keys) and add it to `backend/.env`. The key is used for all three features (Posts, Jobs, News).

### 4. Logo / favicon (optional)

- **Dashboard logo:** Replace `frontend/public/logo.png`.
- **Tab icon:** Replace `frontend/public/favicon.png`.
- To remove black (or dark) backgrounds and trim transparent edges:

```bash
cd frontend && node scripts/remove-white-bg.mjs
```

This processes both `logo.png` and `favicon.png` (requires **sharp** in `frontend`).

## Usage

1. **Posts** — On the default tab, enter an activity (e.g. “Made coffee”, “Took a nap”), click **Generate Post**. Open **Comment** on a card to see the 3 comments. Use **Generate New Variation** on a post for another version.
2. **Jobs** — Open the **Jobs** tab. The app loads 3 satirical job postings (1 fixed + 2 random from 16); use **Refresh Jobs** to load a new set.
3. **News** — Open the **News** tab. The app fetches 3 absurd headlines; use **Refresh Headlines** for a new set of 3.

## Project structure

```
MakeItUp/
├── backend/
│   ├── server.js          # Express API: /generate, /generate-jobs, /generate-headlines
│   ├── package.json
│   └── .env.example
├── frontend/
│   ├── public/
│   │   ├── logo.png       # Dashboard/header logo
│   │   └── favicon.png    # Browser tab icon
│   ├── scripts/
│   │   └── remove-white-bg.mjs   # Removes dark background from logo/favicon (sharp)
│   ├── src/
│   │   ├── App.jsx        # Main app, nav (Posts / Jobs / News), post feed
│   │   ├── api.js         # API client (generatePost, generateVariation, generateJobs, generateHeadlines)
│   │   ├── LinkedInCard.jsx / .css
│   │   ├── JobsPage.jsx   / .css
│   │   ├── HeadlinesPage.jsx / .css
│   │   ├── App.css
│   │   ├── index.css
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js     # Dev proxy: /api → http://localhost:3001
│   └── package.json
└── README.md
```

## API

All routes use `Content-Type: application/json`. The frontend uses a single base URL (in dev, `/api` is proxied to the backend).

| Method | Route                 | Body                    | Response |
|--------|------------------------|-------------------------|----------|
| POST   | `/generate`           | `{ "activity": string }`| `{ body, hashtags, comments }` — **3** comments (1 fixed archetype + 2 random from 19). Each comment: `{ archetype, text }`. |
| POST   | `/generate-jobs`      | `{}`                    | `{ jobs }` — **3** jobs (1 fixed + 2 random from 16). Each job: `{ archetype, title, description, requirements, location, posted }`. |
| POST   | `/generate-headlines` | `{}`                    | `{ headlines }` — **3** headline strings (AI-generated). |

- **Production:** Set `VITE_API_URL` to your backend URL when building the frontend (e.g. `VITE_API_URL=https://your-api.com npm run build`). Otherwise the app uses `/api` as the base path.

No database or authentication is required.
