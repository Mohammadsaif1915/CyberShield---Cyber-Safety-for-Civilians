# 🔐 Ransomware Level 3 — Full Stack Game

A cybersecurity simulation game with a Node.js/Express/MongoDB backend that stores gameplay data and serves a leaderboard.

---

## 📁 Project Structure

```
ransomware-level3/
├── backend/
│   ├── models/
│   │   └── Level3.js          ← Mongoose schema (database blueprint)
│   ├── controllers/
│   │   └── level3Controller.js ← API logic (save, fetch, leaderboard)
│   ├── routes/
│   │   └── level3Routes.js    ← URL path definitions
│   ├── server.js              ← Main Express server entry point
│   ├── package.json           ← Backend dependencies
│   └── .env.example           ← Copy this to .env and fill in values
│
├── frontend/
│   └── ransomware_level3.html ← Game (open in browser)
│
└── README.md                  ← This file
```

---

## ⚙️ Setup Instructions

### Step 1 — Prerequisites

Make sure you have installed:
- [Node.js](https://nodejs.org/) (v18 or higher)
- [MongoDB](https://www.mongodb.com/try/download/community) running locally  
  **OR** a free cloud cluster at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)

---

### Step 2 — Backend Setup

```bash
# Go into the backend folder
cd backend

# Install all dependencies
npm install

# Create your .env file from the example
cp .env.example .env
```

Now open `.env` and fill in your values:

```env
MONGO_URI=mongodb://localhost:27017/ransomware_game
PORT=5000
GAME_MODE=training
```

- **MONGO_URI**: Your MongoDB connection string  
  - Local: `mongodb://localhost:27017/ransomware_game`  
  - Atlas: `mongodb+srv://<user>:<password>@cluster.mongodb.net/ransomware_game`
- **PORT**: The port your server will run on (default: 5000)
- **GAME_MODE**: A custom label stored with every game record (e.g. "training", "competition")

---

### Step 3 — Start the Backend

```bash
# From inside the backend/ folder:

# Normal start:
npm start

# Development mode (auto-restarts on file changes):
npm run dev
```

You should see:
```
✅ MongoDB connected successfully
🚀 Server running on http://localhost:5000
🎮 Game Mode: training
📡 API base: http://localhost:5000/api
```

Test it's working: [http://localhost:5000/api/health](http://localhost:5000/api/health)

---

### Step 4 — Run the Frontend

Simply open `frontend/ransomware_level3.html` in your browser.

> **Important:** The frontend calls the API at `http://localhost:5000`. Make sure the backend is running before playing.

---

## 🌐 API Reference

### `POST /api/level3/save`
Save a player's game session.

**Request body (JSON):**
```json
{
  "username": "AGENT_007",
  "levelCompleted": true,
  "ransomwareChoice": "reported",
  "attempts": 3,
  "timeTaken": 187,
  "score": 2400,
  "difficulty": "normal"
}
```

**ransomwareChoice values:**
| Value | Meaning |
|-------|---------|
| `"reported"` | Player identified and neutralized the threat |
| `"paid"` | Player paid the ransom |
| `"ignored"` | Player ignored / dismissed the threat |
| `"incomplete"` | Game ended before a choice was made |

**Success response:**
```json
{
  "success": true,
  "message": "Level 3 progress saved successfully!",
  "data": { ...saved document }
}
```

---

### `GET /api/level3/:username`
Fetch all saved runs for a specific player.

**Example:** `GET /api/level3/AGENT_007`

**Success response:**
```json
{
  "success": true,
  "count": 2,
  "data": [ ...array of run records ]
}
```

---

### `GET /api/level3/leaderboard/top`
Get the top 10 fastest completions, sorted by `timeTaken` ascending.

**Example:** `GET /api/level3/leaderboard/top`

**Success response:**
```json
{
  "success": true,
  "count": 10,
  "data": [ ...top 10 player records ]
}
```

---

### `GET /api/health`
Check if the server is running.

---

## 🎮 Frontend Features Added

- **Username input** on the title screen — required before starting
- **Username shown in HUD** during gameplay
- **Save status indicator** in top-right HUD (⏳ SAVING... / ✓ SAVED / ✗ SAVE FAILED)
- **Automatic save** when game ends (win or lose)
- **"My Runs" button** on end screen — shows your personal history
- **"Leaderboard" button** on both title screen and end screen
- **PAY RANSOM button** on the ransom note (tracked as `"paid"` choice)

---

## 🗄️ Database Fields Stored

| Field | Type | Description |
|-------|------|-------------|
| `username` | String | Player's chosen name |
| `levelCompleted` | Boolean | true = won, false = lost |
| `ransomwareChoice` | String | paid / ignored / reported / incomplete |
| `attempts` | Number | Wrong actions + 1 |
| `timeTaken` | Number | Seconds from start to end |
| `environmentFile` | String | Value of GAME_MODE from .env |
| `score` | Number | Final score achieved |
| `difficulty` | String | normal / hard / nightmare |
| `createdAt` | Date | Auto-generated timestamp |

---

## 🛠️ Troubleshooting

**"Could not reach server"** in the game  
→ Make sure the backend is running (`npm start` in `/backend`)

**MongoDB connection error**  
→ Check your `MONGO_URI` in `.env`. If using local MongoDB, make sure `mongod` is running.

**CORS error in browser console**  
→ The backend already allows all origins. If you're hosting the frontend on a server, update `origin: '*'` in `server.js` to your actual domain.

**Port already in use**  
→ Change `PORT=5000` to another port (e.g. `5001`) in your `.env` file, and update `API_BASE_URL` in the frontend HTML to match.

---

## 🧠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Vanilla HTML/CSS/JS (Canvas game) |
| Backend | Node.js + Express.js |
| Database | MongoDB + Mongoose |
| Environment | dotenv |
| Dev tools | nodemon |
