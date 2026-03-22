import User from "../models/User.js";

// @desc    Get leaderboard ranked by score / xp / quizzes / streak
// @route   GET /api/leaderboard?sort=score|xp|quiz|streak&limit=50
// @access  Private
const getLeaderboard = async (req, res) => {
  try {
    const { sort = "score", limit = 50 } = req.query;

    // Map frontend sort keys → MongoDB field names
    const sortMap = {
      score:  { score: -1 },
      xp:     { xp: -1 },
      quiz:   { quizzesDone: -1 },
      streak: { loginStreak: -1 },
    };

    const sortQuery = sortMap[sort] || sortMap.score;
    const cap = Math.min(parseInt(limit, 10) || 50, 200);

    // Only users who have done at least something appear on the board
    const users = await User.find({
      $or: [
        { score:       { $gt: 0 } },
        { xp:          { $gt: 0 } },
        { quizzesDone: { $gt: 0 } },
      ],
    })
      .sort(sortQuery)
      .limit(cap)
      .select(
        "fullName name username email avatar role level " +
        "score xp quizzesDone loginStreak badges createdAt"
      )
      .lean();

    const board = users.map((u, i) => ({
      rank:        i + 1,
      userId:      u._id.toString(),
      name:        u.fullName || u.name || u.username || (u.email ? u.email.split("@")[0] : "Anonymous"),
      avatar:      u.avatar       || "",
      role:        u.role         || "Learner",
      level:       u.level        || 1,
      score:       u.score        || 0,
      xp:          u.xp           || 0,
      quizzesDone: u.quizzesDone  || 0,
      loginStreak: u.loginStreak  || 0,
      badgeCount:  Array.isArray(u.badges) ? u.badges.length : 0,
    }));

    res.status(200).json(board);
  } catch (err) {
    console.error("Leaderboard error:", err);
    res.status(500).json({ message: "Server error loading leaderboard" });
  }
};

export { getLeaderboard };