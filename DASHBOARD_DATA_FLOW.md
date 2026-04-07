# Dashboard Data Flow & Real Data Integration

## Overview
The refactored CyberShield Dashboard now displays 100% real user data from the MongoDB database. All statistics, scores, and metrics are fetched from authenticated API endpoints and displayed in real-time.

---

## Data Sources & Endpoints

### 1. **User Profile Data** - `/api/auth/me`
**Purpose**: Fetch current user with all stats and quiz history

**Response Structure**:
```javascript
{
  success: true,
  user: {
    _id: "ObjectId",
    fullName: "User Name",
    email: "user@example.com",
    avatar: "URL or empty",
    
    // ✅ Scores & Metrics
    score: 4500,          // Total XP (quiz + game + phishing)
    xp: 4500,             // Same as score
    level: 10,            // Calculated: Math.floor(score / 500) + 1
    loginStreak: 7,       // Days consecutive login
    lastLoginDate: "ISO",
    
    // ✅ Quiz Metrics
    quizzesDone: 12,                    // Number of quizzes attempted
    avgScore: 78,                       // Average percentage across all quizzes
    
    // ✅ Game Metrics  
    gameScore: 1200,                    // Total game points
    gamesPlayed: 5,                     // Number of game sessions
    gameHighScore: 450,                 // Best single game score
    
    // ✅ Phishing Simulator Metrics
    phishingSimCorrect: 47,             // Number of correct identifications
    phishingSimTotal: 60,               // Total phishing attempts made
    
    // ✅ Domain/Course Scores
    phishingScore: 78,      // 0-100
    malwareScore: 65,       // 0-100
    networkScore: 72,       // 0-100
    privacyScore: 80,       // 0-100
    cloudScore: 55,         // 0-100
    
    // ✅ Quiz History
    quizHistory: [
      {
        quiz: "Module Title",
        moduleTitle: "Module Title",
        moduleId: 1,
        score: 85,              // Percentage
        percentage: 85,
        grade: "A",
        totalCorrect: 17,       // Out of 20
        totalQuestions: 20,
        timeSpent: 1240,        // Seconds
        date: "ISO date",
        updatedAt: "ISO date"
      },
      // ... more quiz results
    ],
    
    // ✅ Achievements
    badges: [
      {
        emoji: "🎓",
        label: "Quiz Master",
        badgeName: "Quiz Master",
        earnedAt: "ISO date"
      }
    ],
    
    // ✅ Activity Tracking
    weeklyActivity: [
      { day: "Mon", score: 100 },
      // ... week data
    ],
    recentActivity: [
      {
        type: "quiz",
        score: 85,
        result: "pass",
        createdAt: "ISO date"
      }
    ]
  }
}
```

---

## Dashboard Components & Real Data Display

### **Overview Page** (Main Dashboard)
Displays comprehensive statistics and performance metrics with real data:

#### Stats Cards (Row 1):
| Component | Data Source | Display |
|-----------|-------------|---------|
| Total Score | `user.score` | Animated counter showing total XP |
| Avg Quiz Score | `user.avgScore` | Percentage (0-100%) from all quiz attempts |
| Game Score | `user.gameScore` | Total game points earned |
| Phishing Accuracy | `(user.phishingSimCorrect / user.phishingSimTotal) * 100` | Percentage with fraction (e.g., "47/60") |

#### Charts:
1. **Weekly Progress** - Bar chart from `dashData.weeklyProgress` or `user.weeklyActivity`
2. **Domain Mastery** - Radar chart from `user.phishingScore`, `malwareScore`, `networkScore`, etc.

#### Quiz History Table:
- Shows last 8 quiz attempts from `user.quizHistory`
- Each row: Module Name, Score (%), Grade, Date Taken
- Color coding: Green (A: 80+%), Blue (B-C: 60-79%), Amber (D: <60%)

#### Badges:
- Displays earned badges from `user.badges`
- Shows emoji, label, and earned date

---

### **Phishing Simulator Page**
Real phishing training with session tracking:

**Data Flow**:
- Fetches emails from: `/api/phishing/emails`
- On each answer: 
  - Session score: `sessionScore++` (if correct)
  - Sync to server: POST `/api/activity`
  - Update callback: `onUserUpdate({ phishingSimCorrect, phishingSimTotal })`

**Display**:
- Session accuracy: `sessionScore / sessionTotal` with percentage
- All-time accuracy: `user.phishingSimCorrect / user.phishingSimTotal`
- Progress bar: `(currentEmail / totalEmails) * 100%`

---

### **Reports Page**
Performance analytics with quiz history export:

**Real Data Display**:
```javascript
1. Export Button - Downloads user performance report
2. Summary Stats:
   - Total Score: user.score
   - Level: computeLevel(user.score).level
   - Phishing Accuracy: Math.round((user.phishingSimCorrect / user.phishingSimTotal) * 100)
   - Login Streak: user.loginStreak

3. Quiz History Table:
   - MODULE | SCORE | GRADE | DATE
   - Data from user.quizHistory (slice 0-8)
   - Color by score: Green (A), Blue (B/C), Amber (D)
```

---

### **Threats Page**
Real threat intelligence (if backend exists):

**Data Source**: `/api/threats` endpoint
- Live threat count
- Severity breakdown (Critical, High, Medium)
- 24-hour timeline chart
- Real threat listing with filtering

---

### **Leaderboard Page**
Real user rankings:

**Data Source**: `/api/leaderboard?sort=score|xp|quiz|streak`
- Displays top 50 users real scores
- Shows current user highlighted
- Sortable by: Score, XP, Quizzes, Streak

---

## Real Data Calculations

### **Total Score (XP) Calculation**
```javascript
score = (avgScore * quizzesDone * 10) + gameScore + (phishingSimCorrect * 50)
```

**Example**:
- 12 quizzes with 78% avg = 12 * 78 * 10 = 9,360 XP
- Game score = 1,200 XP  
- Phishing (47 correct) = 47 * 50 = 2,350 XP
- **Total = 12,910 XP**

### **Level Calculation**
```javascript
level = Math.floor(score / 500) + 1
xpProgress = score % 500
xpProgressPercent = (xpProgress / 500) * 100
```

**Example**: 4,500 XP
- Level = Math.floor(4500 / 500) + 1 = 10
- XP in current level = 0 (exactly at level 10)
- Progress = 0%

### **Phishing Accuracy**
```javascript
accuracy = Math.round((phishingSimCorrect / phishingSimTotal) * 100)
```

**Example**: 47 correct out of 60 total
- Accuracy = (47 / 60) * 100 = **78.33%** → **78%**

---

## Data Fetching & Caching Strategy

### **Initial Load** (Component Mount):
```javascript
useEffect(() => {
  // Fetch user profile with quiz history
  API.get("/api/auth/me")
    .then(data => {
      setUser(data.user)  // Contains quizHistory, all stats, badges
      localStorage.setItem("user", JSON.stringify(data.user))
    })
}, [])
```

### **Auto-Refresh** (Every 60 seconds):
```javascript
useInterval(() => {
  API.get("/api/auth/me").then(updateUserData)
}, 60000)
```

### **On Activity** (Quiz/Game/Phishing):
```javascript
// Update locally first (optimistic)
setUser(prev => ({ ...prev, phishingSimCorrect: prev.phishingSimCorrect + 1 }))

// Sync to server
API.post("/api/auth/profile", updatedFields)

// Re-fetch full profile to ensure consistency
API.get("/api/auth/me").then(data => setUser(data.user))
```

---

## UI Indicators for Real Data

### **Loading States**:
- ⏳ `dashLoading` = true → Show spinner
- User data incomplete → Show empty states

### **Data Quality Indicators**:
- ✅ Green badge: Data is fresh (< 1 min old)
- ⚠️ Amber indicator: > 5 min without sync
- 🔄 Live indicator: Shows "● LIVE" when refreshing

### **Empty States**:
- No quizzes taken → "Take your first quiz"
- No games played → "No games yet"
- No phishing attempts → "Try the simulator"

---

## API Error Handling

### **401 Unauthorized**:
- Auto logout: `localStorage.clear()`
- Redirect to: `/` login page
- Show toast: "Session expired. Please log in again."

### **404 Not Found**:
- Quiz data missing → Show "No data available"
- User not found → Logout

### **Network Errors**:
- Persist existing data
- Show retry button
- Background retry every 10s

---

## JWT Token Management

### **Token Storage**:
```javascript
// Both locations checked for compatibility
localStorage.getItem('cl_token')  // Main token location
localStorage.getItem('token')     // Fallback location
```

### **Request Headers**:
```javascript
Authorization: `Bearer ${token}`
Content-Type: application/json
```

---

## Database Models Referenced

### **User Model** Fields Used:
```javascript
{
  fullName, email, avatar, score, xp, level,
  quizzesDone, avgScore,
  gameScore, gamesPlayed, gameHighScore,
  phishingSimCorrect, phishingSimTotal,
  phishingScore, malwareScore, networkScore, privacyScore, cloudScore,
  badges, loginStreak, lastLoginDate, weeklyActivity, recentActivity
}
```

### **QuizResult Model**:
```javascript
{
  user (ref), moduleId, moduleTitle,
  totalCorrect, totalQuestions, percentage, grade,
  timeSpent (seconds), sectionResults,
  timestamps: { createdAt, updatedAt }
}
```

---

## Testing Checklist

- [ ] **Overview**: All 4 stats cards show correct real values
- [ ] **Quiz History**: Shows actual quiz attempts with correct scores
- [ ] **Phishing**: Session and all-time accuracy match database
- [ ] **Game**: Game score and high score display correctly
- [ ] **Reports**: Export downloads with real user data
- [ ] **Leaderboard**: Rankings accurate, current user highlighted
- [ ] **Auto-Sync**: Changes reflect within 60 seconds
- [ ] **Auth**: Token refresh works, logout functional
- [ ] **Error Handling**: 401 redirects, network errors handled gracefully

---

## Performance Optimizations

1. **Caching**: localStorage user data for instant display
2. **Polling**: 60-second refresh interval (adjustable)
3. **Lazy Loading**: Charts render only if data exists
4. **Memoization**: Recompute only when actual data changes
5. **Batch Updates**: Collect activity logs before sync

---

## Future Enhancements

1. **Real-time WebSocket**: Replace polling with live updates
2. **Offline Mode**: Service worker caching
3. **Analytics**: Google Analytics integration for funnel tracking
4. **Export Formats**: PDF, CSV export options
5. **Data Visualization**: More advanced Recharts
6. **Mobile Optimization**: Responsive design improvements

---

**Last Updated**: 2026-04-07
**Status**: ✅ All real data integration complete
