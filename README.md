# MakeItUp — Time To Get Noticed By Everyone... But A Recruiter

Turn mundane activities into satirical, exaggerated LinkedIn-style posts. Generate absurd job listings and tech-news headlines. A tongue-in-cheek take on grind culture, performative professionalism, and LinkedIn culture.

## Features

- **Posts** — Describe a normal activity; get an over-the-top LinkedIn post with AI-generated, archetype-based comments (e.g. “The Hustle Bro”, “The Thought Leader”). Generate new variations per post.
- **Jobs** — Satirical job postings (e.g. “Job That Was Filled 3 Months Ago”, “15 Years Experience for Entry-Level Role”). Refresh to load new batches.
- **News** — Absurd one-line headlines (e.g. “ChatGPT Applies to Y Combinator and Gets In”, “3-Year-Old Launches 5th Unicorn Startup”). Generate new headlines on demand.

## Tech Stack

- **Frontend:** React (Vite)
- **Backend:** Node.js + Express
- **AI:** OpenAI GPT (gpt-4o-mini)

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

The API runs at `http://localhost:3001`.

### 2. Frontend

In a new terminal:

```bash
cd frontend
npm install
npm run dev
```

The app runs at **http://localhost:5173**. The dev server proxies `/api` to `http://localhost:3001`, so the backend must be running for Posts, Jobs, and News to work.

### 3. OpenAI API Key

Create an API key at [platform.openai.com/api-keys](https://platform.openai.com/api-keys) and add it to `backend/.env`. The same key is used for all three features (Posts, Jobs, News).

## Usage

1. **Posts** — Enter a normal activity (e.g. “Made coffee”, “Replied to an email”), click **Generate Post**. View the LinkedIn-style card; click **Comment** to see AI-generated satirical comments. Use **Generate New Variation** for another take on the same activity.
2. **Jobs** — Open the **Jobs** tab. The app loads three satirical job postings; use **Refresh Jobs** to load a new set.
3. **News** — Open the **News** tab. The app loads three absurd headlines; use **Generate New Headlines** for a new set.

## Project Structure

```
Touch-Grass/
├── backend/
│   ├── server.js          # Express API: /generate, /generate-jobs, /generate-headlines
│   ├── package.json
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── App.jsx        # Main app, nav (Posts / Jobs / News), post feed
│   │   ├── api.js         # API client (shared base URL for all requests)
│   │   ├── LinkedInCard.jsx
│   │   ├── LinkedInCard.css
│   │   ├── JobsPage.jsx
│   │   ├── JobsPage.css
│   │   ├── HeadlinesPage.jsx
│   │   ├── HeadlinesPage.css
│   │   ├── App.css
│   │   ├── index.css
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js     # Dev proxy: /api → http://localhost:3001
│   └── package.json
└── README.md
```

## API

All routes require `Content-Type: application/json`. The frontend uses a single base URL (in dev, `/api` is proxied to the backend).

| Method | Route | Body | Response |
|--------|--------|------|----------|
| POST | `/generate` | `{ "activity": string }` | `{ body, hashtags, comments }` — `comments` is an array of `{ archetype, text }`. |
| POST | `/generate-jobs` | `{}` | `{ jobs }` — `jobs` is an array of `{ archetype, title, description, requirements, location, posted }`. |
| POST | `/generate-headlines` | `{}` | `{ headlines }` — `headlines` is an array of strings. |

- **Production:** Set `VITE_API_URL` to your backend URL when building the frontend (e.g. `VITE_API_URL=https://your-api.com npm run build`). Otherwise the app uses `/api` as the base path.

No database or authentication is required.
