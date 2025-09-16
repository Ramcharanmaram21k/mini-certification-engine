const express = require('express');
const db = require('../config/database').getDB();
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Get result by attempt ID
router.get('/:attemptId', authMiddleware, (req, res) => {
  const { attemptId } = req.params;
  const userId = req.user.id;

  db.get(
    `SELECT r.*, u.name as user_name 
     FROM results r 
     JOIN users u ON r.user_id = u.id 
     WHERE r.attempt_id = ? AND r.user_id = ?`,
    [attemptId, userId],
    (err, result) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Failed to fetch result' });
      }

      if (!result) {
        return res.status(404).json({ error: 'Result not found' });
      }

      res.json({
        attemptId: result.attempt_id,
        quizId: result.quiz_id,
        quizTitle: 'React Basics Quiz',
        total: result.total_questions,
        correct: result.correct_answers,
        score: result.score,
        pass: Boolean(result.pass),
        createdAt: result.created_at,
        userName: result.user_name
      });
    }
  );
});

// Get all user results
router.get('/', authMiddleware, (req, res) => {
  const userId = req.user.id;

  db.all(
    'SELECT * FROM results WHERE user_id = ? ORDER BY created_at DESC',
    [userId],
    (err, results) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to fetch results' });
      }

      const formattedResults = results.map(r => ({
        attemptId: r.attempt_id,
        quizId: r.quiz_id,
        quizTitle: 'React Basics Quiz',
        total: r.total_questions,
        correct: r.correct_answers,
        score: r.score,
        pass: Boolean(r.pass),
        createdAt: r.created_at
      }));

      res.json(formattedResults);
    }
  );
});

module.exports = router;
