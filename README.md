ReadAble is an accessibility-focused AI web app that simplifies complex text, generates bullet summaries, estimates reading level, translates output, and supports text-to-speech controls.

## Tech Stack

- Frontend: React + Vite + Tailwind CSS
- Backend: Node.js + Express
- Database: MongoDB + Mongoose
- AI: OpenAI API with a mock fallback abstraction
- Auth: JWT + bcrypt
- Speech: Web Speech API (browser)

## Project Structure

```text
/backend
  /config
  /controllers
  /middleware
  /models
  /routes
  /services
  /utils
  server.js

/frontend
  /src
    /components
    /hooks
    /pages
    /services
    App.jsx
```

## Features (MVP)

- Text input with paste support, clear button, and 5000-character limit
- AI simplification endpoint returning:
  - plain-language rewrite
  - 5-bullet summary
  - reading-level estimate
  - adaptive reading profiles (`child`, `standard`, `neurodivergent`, `elderly`, `academic`)
- Translation into English, Spanish, Hindi, French
- Text-to-speech with listen, pause, resume, stop, and speed control
- Accessibility modes:
  - high contrast
  - large text
  - dyslexia-friendly font
  - low stimulation (reduces motion)
- JWT auth (register/login)
- Saved user history dashboard
- Input validation, sanitization, CORS, helmet, and rate-limited AI endpoints

## Environment Variables

### Backend (`backend/.env`)

Copy `backend/.env.example` and set:

```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://127.0.0.1:27017/readable
JWT_SECRET=replace-with-a-long-random-secret
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:5173
OPENAI_API_KEY=
OPENAI_MODEL=gpt-4.1-mini
OPENAI_MOCK=false
```

Notes:
- If `OPENAI_API_KEY` is missing or `OPENAI_MOCK=true`, backend uses mock AI behavior.

### Frontend (`frontend/.env`)

Copy `frontend/.env.example` and set:

```env
VITE_API_URL=http://localhost:5000/api
```

## Local Setup

### 1) Install dependencies

```bash
npm install
npm install --prefix backend
npm install --prefix frontend
```

### 2) Configure env files

- `backend/.env`
- `frontend/.env`

### 3) Run in development

```bash
npm run dev
```

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:5000`

## API Reference

### `POST /api/simplify`

Request:

```json
{
  "text": "string",
  "readingProfile": "child|standard|neurodivergent|elderly|academic"
}
```

Response:

```json
{
  "simplified": "string",
  "summary": "- bullet 1\n- bullet 2\n- bullet 3\n- bullet 4\n- bullet 5",
  "readingLevel": "string",
  "originalReadingLevel": "string",
  "simplifiedReadingLevel": "string",
  "improvementPercent": 42.5,
  "readingProfile": "string",
  "historyId": "optional MongoDB id"
}
```

### `POST /api/translate`

Request:

```json
{
  "text": "string",
  "targetLanguage": "english|spanish|hindi|french",
  "historyId": "optional"
}
```

Response:

```json
{
  "translated": "string",
  "targetLanguage": "string"
}
```

### `GET /api/history` (Auth Required)

Headers:

```text
Authorization: Bearer <jwt>
```

Response:

```json
{
  "history": []
}
```

### `DELETE /api/history/:id` (Auth Required)

Headers:

```text
Authorization: Bearer <jwt>
```

Response:

```json
{
  "message": "History item deleted",
  "id": "string"
}
```

### Auth Endpoints

- `POST /api/auth/register`
- `POST /api/auth/login`

Both return:

```json
{
  "token": "jwt",
  "user": {
    "id": "string",
    "name": "string",
    "email": "string"
  }
}
```

## Deployment

## Backend (Render or Railway)

1. Deploy `backend` as a Node service.
2. Set environment variables from `backend/.env.example`.
3. Build command: `npm install`
4. Start command: `npm start`
5. Set `FRONTEND_URL` to deployed frontend domain.

## Frontend (Vercel)

1. Deploy `frontend` as a Vite app.
2. Set `VITE_API_URL` to backend URL + `/api`.
3. Build command: `npm run build`
4. Output directory: `dist`

## Security Notes

- API keys are env-based only
- JWT auth on protected endpoints
- Request validation with `express-validator`
- Input sanitization via `sanitize-html`
- Rate limiting on `/api/simplify` and `/api/translate`
- Security headers via `helmet`

## Bonus Ideas

- PDF upload and extraction
- URL article scraper endpoint
- Shareable links for simplified content
- Export simplified output as PDF
