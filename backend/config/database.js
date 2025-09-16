const sqlite3 = require('sqlite3').verbose();

const DB_PATH = process.env.DB_PATH || './database.db';

class Database {
  constructor() {
    this.db = new sqlite3.Database(DB_PATH, (err) => {
      if (err) console.error('❌ Error opening database:', err.message);
      else {
        console.log('✅ Connected to SQLite database');
        console.log(`📊 Database: ${DB_PATH}`);
      }
    });
  }

  initializeDB() {
    this.createTables()
      .then(() => this.createIndexes())
      .then(() => this.seedData())
      .catch(console.error);
  }

  createTables() {
    return new Promise((resolve, reject) => {
      this.db.serialize(() => {
        this.db.run(`
          CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
          )
        `);

        this.db.run(`
          CREATE TABLE IF NOT EXISTS questions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            quiz_id TEXT NOT NULL,
            question_text TEXT NOT NULL,
            options TEXT NOT NULL,
            correct_answer INTEGER NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
          )
        `);

        this.db.run(`
          CREATE TABLE IF NOT EXISTS results (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            quiz_id TEXT NOT NULL,
            attempt_id TEXT UNIQUE NOT NULL,
            total_questions INTEGER NOT NULL,
            correct_answers INTEGER NOT NULL,
            score INTEGER NOT NULL,
            pass BOOLEAN NOT NULL,
            answers TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users (id)
          )
        `, (err) => {
          if (err) return reject(err);
          console.log('✅ Database tables created/verified');
          resolve();
        });
      });
    });
  }

  // Ensure the UPSERT target exists even on old DBs
  createIndexes() {
    return new Promise((resolve, reject) => {
      this.db.run(`
        CREATE UNIQUE INDEX IF NOT EXISTS idx_questions_quizid_question
        ON questions(quiz_id, question_text)
      `, (err) => {
        if (err) return reject(err);
        resolve();
      });
    });
  }

  seedData() {
    const questions = [
      {
        quiz_id: 'react-basics',
        question_text: 'Which hook is used for state in functional components?',
        options: JSON.stringify(['useFetch', 'useState', 'useClass', 'useData']),
        correct_answer: 1
      },
      {
        quiz_id: 'react-basics',
        question_text: 'What does JSX stand for?',
        options: JSON.stringify(['JavaScript XML', 'Java Syntax Extension', 'JSON XML', 'JavaScript Extension']),
        correct_answer: 0
      },
      {
        quiz_id: 'react-basics',
        question_text: 'Which method is used to render a React component?',
        options: JSON.stringify(['render()', 'display()', 'show()', 'component()']),
        correct_answer: 0
      },
      {
        quiz_id: 'react-basics',
        question_text: 'Which hook is used to perform side effects like data fetching or subscriptions?',
        options: JSON.stringify(['useMemo', 'useEffect', 'useState', 'useReducer']),
        correct_answer: 1
      },
      {
        quiz_id: 'react-basics',
        question_text: 'What is the correct way to update state when it depends on the previous value?',
        options: JSON.stringify([
          'setCount(count + 1)',
          'setCount(prev => prev + 1)',
          'count++ and setCount(count)',
          'setCount(...count, 1)'
        ]),
        correct_answer: 1
      }
    ];

    const upsertSql = `
      INSERT INTO questions (quiz_id, question_text, options, correct_answer)
      VALUES (?, ?, ?, ?)
      ON CONFLICT(quiz_id, question_text) DO UPDATE SET
        options = excluded.options,
        correct_answer = excluded.correct_answer
    `;

    const stmt = this.db.prepare(upsertSql);
    questions.forEach(q => stmt.run(q.quiz_id, q.question_text, q.options, q.correct_answer));
    stmt.finalize((err) => {
      if (err) {
        console.error('❌ Seeding error:', err.message);
        return;
      }
      console.log('✅ Questions upserted');
      this.db.get(
        'SELECT COUNT(*) AS count FROM questions WHERE quiz_id = ?',
        ['react-basics'],
        (e, row) => {
          if (e) console.error('Count check failed:', e.message);
          else console.log(`📊 react-basics question count: ${row.count}`);
        }
      );
    });
  }

  getDB() {
    return this.db;
  }
}

module.exports = new Database();
