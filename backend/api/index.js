// backend/api/index.js
const express = require('express');
const cors = require('cors');

const database = require('../config/database');
const authRoutes = require('../routes/auth');
const quizRoutes = require('../routes/quizzes');
const resultsRoutes = require('../routes/results');
const certificateRoutes = require('../routes/certificate');

const app = express();

// CORS: allow production frontend + vercel previews
const allowedOrigins = [
  'https://mini-certification-engine.vercel.app', // frontend production URL
  /\.vercel\.app$/, // allow Vercel preview deployments (optional)
];

app.use(cors({
  origin(origin, cb) {
    if (!origin) return cb(null, true);
    const ok = allowedOrigins.some((o) => (o instanceof RegExp ? o.test(origin) : o === origin));
    return ok ? cb(null, true) : cb(new Error(`CORS blocked: ${origin}`));
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: false,
  maxAge: 86400,
}));

app.use(express.json());

// Preflight
app.options('/api/*', cors());

// Initialize DB (idempotent)
if (typeof database.initializeDB === 'function') {
  database.initializeDB();
}

// Health
app.get('/api/health', (_req, res) => res.json({ ok: true }));

// Mount API routes
app.use('/api/auth', authRoutes);
app.use('/api/quizzes', quizRoutes);
app.use('/api/results', resultsRoutes);
app.use('/api/certificates', certificateRoutes);

// Export Express app for Vercel
module.exports = app;
