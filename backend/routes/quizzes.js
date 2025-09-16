const express = require('express');
const db = require('../config/database').getDB();
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Get quiz questions
router.get('/:quizId', authMiddleware, (req, res) => {
  const { quizId } = req.params;

  db.all(
    'SELECT id, question_text, options FROM questions WHERE quiz_id = ? ORDER BY id',
    [quizId],
    (err, questions) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Failed to fetch quiz' });
      }

      if (questions.length === 0) {
        return res.status(404).json({ error: 'Quiz not found' });
      }

      // Parse options JSON and format response
      const formattedQuestions = questions.map(q => ({
        id: q.id.toString(),
        quizId,
        questionText: q.question_text,
        options: JSON.parse(q.options),
        // Don't send correct answer to frontend
      }));

      res.json({
        id: quizId,
        title: 'React Basics Quiz',
        passScore: 70,
        questions: formattedQuestions
      });
    }
  );
});

// Submit quiz answers
router.post('/:quizId/submit', authMiddleware, (req, res) => {
  const { quizId } = req.params;
  const { answers } = req.body; // { "1": 0, "2": 1, "3": 2 }
  const userId = req.user.id;

  if (!answers || typeof answers !== 'object') {
    return res.status(400).json({ error: 'Invalid answers format' });
  }

  // Get all questions with correct answers
  db.all(
    'SELECT id, correct_answer FROM questions WHERE quiz_id = ?',
    [quizId],
    (err, questions) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }

      if (questions.length === 0) {
        return res.status(404).json({ error: 'Quiz not found' });
      }

      // Calculate score
      let correctAnswers = 0;
      const totalQuestions = questions.length;

      questions.forEach(question => {
        const questionId = question.id.toString();
        const userAnswer = answers[questionId];
        const correctAnswer = question.correct_answer;

        if (userAnswer === correctAnswer) {
          correctAnswers++;
        }
      });

      const score = Math.round((correctAnswers / totalQuestions) * 100);
      const pass = score >= 70;
      const attemptId = 'attempt-' + Date.now() + '-' + userId;

      // Save result to database
      db.run(
        `INSERT INTO results (user_id, quiz_id, attempt_id, total_questions, correct_answers, score, pass, answers)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [userId, quizId, attemptId, totalQuestions, correctAnswers, score, pass, JSON.stringify(answers)],
        function(err) {
          if (err) {
            console.error('Failed to save result:', err);
            return res.status(500).json({ error: 'Failed to save result' });
          }

          res.json({
            attemptId,
            quizId,
            quizTitle: 'React Basics Quiz',
            total: totalQuestions,
            correct: correctAnswers,
            score,
            pass,
            createdAt: new Date().toISOString()
          });
        }
      );
    }
  );
});

module.exports = router;
