# 🧪 STEP-BY-STEP TESTING GUIDE

## ✅ VERIFICATION COMPLETE

All file paths have been verified and are **CORRECT**. See these documents for details:
- `VERIFIED_FILE_PATHS.md` - Complete path verification
- `GAME_QUIZ_PATH_GUIDE.md` - Troubleshooting guide  
- `COMPLETE_FILE_REFERENCE.md` - Full file structure

---

## 🚀 Quick Start - Test Everything

### Step 1: Start Development Server
```bash
# Navigate to client directory
cd client

# Install dependencies (first time only)
npm install

# Start dev server
npm run dev
```

**Expected output:**
```
  ➜  Local:   http://localhost:5173/
  ➜  press h to show help
```

---

### Step 2: Open Dashboard
1. Open browser: `http://localhost:5173/dashboard`
2. Login with your credentials
3. You should see the main dashboard

---

### Step 3: Test Quiz Module
1. In Dashboard, look for the **Search popup** (press Cmd+K or Ctrl+K)
2. Click on **"Quiz"** or search for it
3. **Expected**: Should navigate to `/quiz` path
4. **Should see**: Quiz interface with modules and questions
5. **If not**: Check browser console (F12) for errors

**Alternative way to test:**
- Direct URL: `http://localhost:5173/quiz`

---

### Step 4: Test Game Module
1. In Dashboard, look for the **Search popup** (press Cmd+K or Ctrl+K)
2. Click on **"CyberGame"** or search for it
3. **Expected**: Should navigate to `/game` path
4. **Should see**: Game interface loaded in iframe
5. **If not**: Check browser console (F12) for iframe errors

**Alternative way to test:**
- Direct URL: `http://localhost:5173/game`

---

## 🔍 If Something Doesn't Work

### Symptom: Quiz Page Shows Blank/Error

**Diagnose:**
1. Open DevTools (F12)
2. Go to Console tab
3. Look for red errors
4. Check if they mention:
   - `Quiz` or `App` import issues
   - File not found errors
   - React component errors

**Fix:**
1. Verify file exists: `client/src/pages/Quiz/App.jsx` ✓
2. Check QuizPage.jsx import on line 5 is correct
3. Restart dev server: Stop (Ctrl+C) and run `npm run dev` again

---

### Symptom: Game Page Shows Blank/Error  

**Diagnose:**
1. Open DevTools (F12)
2. Go to Network tab
3. Look for requests to `/game-app/index.html`
4. Check the response status:
   - Green = 200 (success) ✓
   - Red = 404 (not found) ✗

**Fix:**
1. Verify game files exist:
   ```bash
   ls client/public/game-app/index.html
   ```
2. Check GamePage.jsx line 42 iframe src is: `/game-app/index.html`
3. Restart dev server: Stop (Ctrl+C) and run `npm run dev` again

---

### Symptom: Can't Navigate from Dashboard

**Diagnose:**
1. Check browser URL when clicking Quiz/Game
2. URL should change to `/quiz` or `/game`
3. If it doesn't, navigation might be broken

**Fix:**
1. Check Dashboard.jsx lines 326-327 have correct paths
2. Check App.jsx has routes for `/quiz` and `/game`
3. Verify no errors in browser console

---

## 📊 Full Testing Checklist

### Pre-Test
- [ ] Dev server running (`npm run dev`)
- [ ] No errors in terminal
- [ ] Browser pointed to `http://localhost:5173`
- [ ] Able to login to Dashboard

### Dashboard Launch
- [ ] Dashboard loads correctly
- [ ] All dashboard features visible
- [ ] Search menu accessible (Cmd+K / Ctrl+K)

### Quiz Module
- [ ] Can navigate to `/quiz` from Dashboard
- [ ] Quiz interface displays
- [ ] Quiz questions show
- [ ] Can attempt quiz
- [ ] Results display after completion
- [ ] No console errors

### Game Module
- [ ] Can navigate to `/game` from Dashboard
- [ ] Game iframe loads
- [ ] Game displays content
- [ ] Game is playable
- [ ] Sound/video works (if applicable)
- [ ] No console errors

### Navigation
- [ ] Back button works from Quiz
- [ ] Back button works from Game
- [ ] Can navigate between Dashboard/Quiz/Game smoothly
- [ ] Direct URLs work (`/quiz`, `/game`)

### Browser Console
- [ ] No red errors
- [ ] No import errors
- [ ] No 404 errors
- [ ] No CORS errors

---

## 🎯 Expected Behavior

### When You Click "Quiz" in Dashboard:
```
Dashboard
  ↓ (click Quiz)
Browser navigates to: /quiz
  ↓ (App.jsx route matches)
QuizPage.jsx renders
  ↓ (imports Quiz/App)
Quiz component displays
  ↓
You see quiz interface with modules
```

### When You Click "CyberGame" in Dashboard:
```
Dashboard
  ↓ (click CyberGame)
Browser navigates to: /game
  ↓ (App.jsx route matches)
GamePage.jsx renders
  ↓ (iframe loads)
Game component displays
  ↓
You see game interface
```

---

## 🔧 Terminal Commands for Troubleshooting

### Verify All Files Exist
```bash
# Game files
ls -la client/public/game-app/index.html
ls -la client/public/game-app/script.js

# Quiz files
ls -la client/src/pages/Quiz/App.jsx
ls -la client/src/pages/Quiz/quizData.js

# Route files
ls -la client/src/pages/Dashboard.jsx
ls -la client/src/pages/GamePage.jsx
ls -la client/src/pages/QuizPage.jsx
ls -la client/src/App.jsx
```

### Check for Syntax Errors in Critical Files
```bash
# Just try to start dev server - it will show errors:
npm run dev

# Errors will show in terminal and browser
```

### Rebuild if Needed
```bash
# Stop dev server first (Ctrl+C)

# Clear cache and rebuild
rm -rf node_modules/.vite
npm run dev
```

---

## 📋 Summary of Verified Paths

| Item | Path | File | Status |
|------|------|------|--------|
| Dashboard | `/dashboard` | Dashboard.jsx | ✓ |
| Quiz Route | `/quiz` | QuizPage.jsx | ✓ |
| Game Route | `/game` | GamePage.jsx | ✓ |
| Quiz App | `./Quiz/App` | pages/Quiz/App.jsx | ✓ |
| Game Assets | `/game-app/` | public/game-app/ | ✓ |
| Routes Config | - | App.jsx | ✓ |

---

## ⚡ Quick Test URLs

Copy and paste these into your browser (after `npm run dev`):

**Base URL**: `http://localhost:5173`

- Dashboard: `http://localhost:5173/dashboard`
- Quiz: `http://localhost:5173/quiz`
- Game: `http://localhost:5173/game`

---

## 💡 Pro Tips

1. **Use Cmd+K (Mac) or Ctrl+K (Windows)** in Dashboard to open search menu
2. **Type "Quiz"** or **"Game"** to quickly find them
3. **Check Console (F12)** first if something seems broken
4. **Refresh page (Ctrl+R)** if something looks stuck
5. **Clear browser cache** if old version loads (Settings → Clear browsing data)

---

## 🎉 Everything is Ready!

✅ **All paths are correct**
✅ **All files are in place**
✅ **Configuration is complete**

Just run:
```bash
cd client
npm run dev
```

Then test by:
1. Navigating to `/dashboard`
2. Clicking "Quiz" or "CyberGame"
3. Verifying they load properly

---

**Last Updated**: April 8, 2026 ✓  
**Status**: READY FOR TESTING ✓
