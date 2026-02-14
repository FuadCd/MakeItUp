# WorkforceBeast — AI-Powered Personal Brand Optimizer

Turn any mundane activity into a satirical, exaggerated LinkedIn-style “professional success story” using AI. A tongue-in-cheek take on grind culture and performative professionalism.

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

The app runs at `http://localhost:5173`. It proxies `/api` to the backend, so no CORS setup is needed in development.

### 3. Get an OpenAI API Key

Create an API key at [platform.openai.com/api-keys](https://platform.openai.com/api-keys) and add it to `backend/.env`.

## Usage

1. Enter a normal activity (e.g. “Made coffee”, “Replied to an email”).
2. Choose a tone: **Polite Professional**, **Hustle Culture Disciple**, or **Visionary Thought Leader**.
3. Click **Generate Post**.
4. View the result in the LinkedIn-style card, check the **Buzzword Density Meter**, and use **Generate New Variation** for another take.

## Project Structure

```
Touch-Grass/
├── backend/
│   ├── server.js       # Express server + POST /generate + OpenAI
│   ├── package.json
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── api.js
│   │   ├── LinkedInCard.jsx
│   │   └── BuzzwordMeter.jsx
│   ├── index.html
│   └── package.json
└── README.md
```

## API

- **POST /generate**  
  Body: `{ "activity": string, "tone": "polite-professional" | "hustle-culture" | "visionary-leader" }`  
  Returns: `{ title, body, keyTakeaways, hashtags }`

No database or authentication required.
