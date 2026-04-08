# 🔧 SETUP & TROUBLESHOOTING GUIDE

## ✅ WHAT WAS FIXED

### Issue: `ReferenceError: loading is not defined`
**Location**: `client/src/pages/Quiz/App.jsx` line 171

**Problem**: The Quiz component was using variables (`loading`, `completedSectionsFromDB`) that were never defined

**Solution**: Added missing state variable declarations
```javascript
const [loading, setLoading] = useState(false);
const [completedSectionsFromDB, setCompletedSectionsFromDB] = useState([]);
```

**Status**: ✅ FIXED

---

## 📋 OTHER ISSUES IN CONSOLE

### 1. API 404 Errors
```
Failed to load resource: the server responded with a status of 404
- api/dashboard
- api/activity?limit=10
```

**Cause**: Backend server not running

**Solution**: Start the backend server (see below)

---

### 2. React Router Future Flag Warnings
```
React Router Future Flag Warning: React Router will begin wrapping state updates...
```

**Severity**: ⚠️ WARNING (not an error, app still works)

**Solution**: Optional - can be fixed by updating React Router config

---

### 3. Google OAuth Warning
```
[GSI_LOGGER]: google.accounts.id.initialize() is called multiple times
```

**Severity**: ⚠️ WARNING (not breaking)

**Cause**: Google Sign-In initialized multiple times

**Solution**: Optional cleanup (non-critical)

---

## 🚀 COMPLETE STARTUP PROCEDURE

### Step 1: Start Backend Server
```bash
# Open terminal 1 - Backend
cd server
npm install                    # If needed
npm run seed                   # Seed database
npm start                      # Or: node server.js
```

**Expected Output**:
```
Server running on port 5000
MongoDB connected
```

**Verify**: Open `http://localhost:5000/api/health` in browser or terminal:
```bash
curl http://localhost:5000/api/health
# Should return some response, not 404
```

---

### Step 2: Start Frontend
```bash
# Open terminal 2 - Frontend
cd client
npm install                    # If needed
npm run dev
```

**Expected Output**:
```
  ➜  Local:   http://localhost:5173/
  ➜  press h to show help
```

---

### Step 3: Open In Browser
```
http://localhost:5173
```

**Expected Flow**:
1. See landing page
2. Login is required
3. After login → navigate to dashboard
4. Click "Quiz" or "CyberGame" to test

---

## 📊 ERROR CHECKLIST

| Error | Status | Solution |
|-------|--------|----------|
| `loading is not defined` | ✅ FIXED | Added state variables |
| `api/dashboard 404` | ⚠️ NEEDS ACTION | Start backend server |
| `api/activity 404` | ⚠️ NEEDS ACTION | Start backend server |
| Router Future Flag warning | ⚠️ OPTIONAL | Can be ignored |
| Google OAuth warning | ⚠️ OPTIONAL | Can be ignored |

---

## 🧪 VERIFICATION STEPS

### Check 1: Backend Running
```bash
# Terminal 1 - Should show:
# Server running on port 5000
# MongoDB connected

# OR test with curl:
curl http://localhost:5000/api/health
```

### Check 2: Frontend Running
```bash
# Terminal 2 - Should show:
# ➜  Local:   http://localhost:5173/
```

### Check 3: Browser Console
```
After starting both servers, open browser console (F12 → Console)
Should NOT see:
  ❌ ReferenceError: loading is not defined
  
Should see at most:
  ⚠️ Future Flag warnings (not errors)
  
API calls should now work (check Network tab)
```

### Check 4: Test Quiz Module
1. Login to dashboard
2. Search "Quiz" or click quiz button
3. Should load quiz interface (not crash)

### Check 5: Test Game Module
1. Login to dashboard
2. Search "Game" or click game button
3. Should load game interface (not crash)

---

## 🎯 QUICK STARTUP COMMANDS

```bash
# Terminal 1 - Backend
cd server && npm start

# Terminal 2 - Frontend
cd client && npm run dev

# Then open browser:
# http://localhost:5173
```

---

## 💡 PORT REFERENCE

| Service | Port | URL | Health Check |
|---------|------|-----|---|
| Backend API | 5000 | http://localhost:5000 | `/api/health` |
| Frontend Dev | 5173 | http://localhost:5173 | Browse directly |
| Frontend Build | 4173 | http://localhost:4173 | After `npm run build` |

---

## 🔍 IF QUIZ STILL DOESN'T LOAD

### Diagnostic Steps:

**1. Check browser console (F12)**
```
Should NOT see: ReferenceError: loading is not defined
If you do, refresh the page - the file might not have reloaded
```

**2. Verify file was updated**
```bash
# Check if fix is in the file:
grep -n "const \[loading" client/src/pages/Quiz/App.jsx
# Should show the new line with loading state
```

**3. Try hard refresh**
```
Windows/Linux: Ctrl + Shift + R
Mac: Cmd + Shift + R
```

**4. Clear cache and rebuild**
```bash
# Stop dev server (Ctrl+C)
rm -rf client/node_modules/.vite
npm run dev
```

---

## 🔍 IF GAME STILL DOESN'T LOAD

Same steps as above for game module.

**Additional check:**
```bash
# Verify game files exist:
ls -la client/public/game-app/index.html
# Should show file exists
```

---

## 📝 EXPECTED BEHAVIOR AFTER FIX

### Before Fix
```
Dashboard loads
  → Click Quiz
  → ❌ ERROR: loading is not defined
  → App crashes
```

### After Fix
```
Dashboard loads
  → Click Quiz
  → ✅ Quiz interface loads
  → Can attempt quiz
  → Results display
```

---

## 🚀 PRODUCTION BUILD (Optional)

If you want to test production build:

```bash
# In client folder
npm run build

# Serve the build
npm run preview
# Opens on http://localhost:4173
```

---

## 📋 SUMMARY

✅ **Fixed**: ReferenceError in Quiz/App.jsx  
⚠️ **Needs Action**: Start backend server to fix 404 errors  
✅ **Ready**: Frontend can now run without crashing on quiz/game

**Next Step**: Start both servers and test!

---

**Last Updated**: April 8, 2026 ✓
