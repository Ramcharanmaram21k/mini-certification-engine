// backend/api/index.js
const express = require('express');
const cors = require('cors');

const database = require('../config/database');
const authRoutes = require('../routes/auth');
const quizRoutes = require('../routes/quizzes');
const resultsRoutes = require('../routes/results');
const certificateRoutes = require('../routes/certificate');

const app = express();
app.use(cors());
app.use(express.json());

// Initialize DB (idempotent)
if (typeof database.initializeDB === 'function') {
  database.initializeDB();
}

// Health
app.get('/api/health', (_req, res) => res.json({ ok: true }));

// Mount API
app.use('/api/auth', authRoutes);
app.use('/api/quizzes', quizRoutes);
app.use('/api/results', resultsRoutes);
app.use('/api/certificates', certificateRoutes);

// IMPORTANT: export app for Vercel Functions
module.exports = app;
