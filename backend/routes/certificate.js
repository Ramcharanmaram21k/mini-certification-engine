const express = require('express');
const db = require('../config/database').getDB();
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Generate certificate (placeholder for now)
router.post('/', authMiddleware, (req, res) => {
  const { attemptId } = req.body;
  const userId = req.user.id;

  if (!attemptId) {
    return res.status(400).json({ error: 'Attempt ID required' });
  }

  // Verify the attempt belongs to the user and they passed
  db.get(
    `SELECT r.*, u.name as user_name 
     FROM results r 
     JOIN users u ON r.user_id = u.id 
     WHERE r.attempt_id = ? AND r.user_id = ? AND r.pass = 1`,
    [attemptId, userId],
    (err, result) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }

      if (!result) {
        return res.status(404).json({ error: 'No passing result found for this attempt' });
      }

      // For now, return a placeholder URL
      // In Phase 3, we'll implement actual PDF generation
      const certificateUrl = `${req.protocol}://${req.get('host')}/api/certificate/download/${attemptId}`;

      res.json({
        url: certificateUrl,
        message: 'Certificate ready for download'
      });
    }
  );
});

// Download certificate (placeholder)
router.get('/download/:attemptId', authMiddleware, (req, res) => {
  const { attemptId } = req.params;
  
  // Placeholder response
  res.json({
    message: 'PDF certificate generation will be implemented in Phase 3',
    attemptId
  });
});

module.exports = router;
