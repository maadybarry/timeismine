import express from 'express';
import sqlite3 from 'sqlite3';
import bcrypt from 'bcrypt';
import cors from 'cors';
import bodyParser from 'body-parser';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

// Load environment variables
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET || 'changeme';

const app = express();
const PORT = 4000;

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(bodyParser.json());
app.use(cookieParser());

const db = new sqlite3.Database('./users.db', (err) => {
  if (err) {
    console.error('Could not connect to database', err);
  } else {
    db.run(`CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE,
      password TEXT
    )`);
    db.run(`CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      text TEXT,
      completed INTEGER DEFAULT 0,
      FOREIGN KEY(user_id) REFERENCES users(id)
    )`);
  }
});

function isStrongPassword(password) {
  // At least 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char
  return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/.test(password);
}

app.post('/api/signup', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' });
  if (!isStrongPassword(password)) {
    return res.status(400).json({ error: 'Password must be at least 8 characters and include uppercase, lowercase, number, and special character.' });
  }
  bcrypt.hash(password, 10, (err, hash) => {
    if (err) return res.status(500).json({ error: 'Internal server error' });
    db.run('INSERT INTO users (email, password) VALUES (?, ?)', [email, hash], function (err) {
      if (err) {
        if (err.code === 'SQLITE_CONSTRAINT') {
          res.status(409).json({ error: 'Email already exists' });
        } else {
          res.status(500).json({ error: 'Internal server error' });
        }
      } else {
        res.json({ success: true });
      }
    });
  });
});

app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' });
  db.get('SELECT * FROM users WHERE email = ?', [email], (err, user) => {
    if (err) return res.status(500).json({ error: 'Internal server error' });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });
    bcrypt.compare(password, user.password, (err, match) => {
      if (err) return res.status(500).json({ error: 'Internal server error' });
      if (!match) return res.status(401).json({ error: 'Invalid credentials' });
      // Issue JWT and set as httpOnly cookie
      const token = jwt.sign({ email: user.email, id: user.id }, JWT_SECRET, { expiresIn: '2h' });
      res.cookie('token', token, { httpOnly: true, sameSite: 'lax' });
      res.json({ success: true });
    });
  });
});

// Middleware to check JWT
function authenticateToken(req, res, next) {
  const token = req.cookies?.token || req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Not authenticated' });
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user;
    next();
  });
}

// Example protected route
app.get('/api/protected', authenticateToken, (req, res) => {
  res.json({ message: `Hello, user ${req.user.email}! This is protected data.` });
});

// Tasks API (all require authentication)
app.get('/api/tasks', authenticateToken, (req, res) => {
  db.all('SELECT id, text, completed FROM tasks WHERE user_id = ?', [req.user.id], (err, rows) => {
    if (err) return res.status(500).json({ error: 'Internal server error' });
    res.json({ tasks: rows.map(t => ({ ...t, completed: !!t.completed })) });
  });
});

app.post('/api/tasks', authenticateToken, (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ error: 'Task text required' });
  db.run('INSERT INTO tasks (user_id, text, completed) VALUES (?, ?, 0)', [req.user.id, text], function (err) {
    if (err) return res.status(500).json({ error: 'Internal server error' });
    res.json({ id: this.lastID, text, completed: false });
  });
});

app.patch('/api/tasks/:id', authenticateToken, (req, res) => {
  const { completed } = req.body;
  db.run('UPDATE tasks SET completed = ? WHERE id = ? AND user_id = ?', [completed ? 1 : 0, req.params.id, req.user.id], function (err) {
    if (err) return res.status(500).json({ error: 'Internal server error' });
    if (this.changes === 0) return res.status(404).json({ error: 'Task not found' });
    res.json({ success: true });
  });
});

app.delete('/api/tasks/:id', authenticateToken, (req, res) => {
  db.run('DELETE FROM tasks WHERE id = ? AND user_id = ?', [req.params.id, req.user.id], function (err) {
    if (err) return res.status(500).json({ error: 'Internal server error' });
    if (this.changes === 0) return res.status(404).json({ error: 'Task not found' });
    res.json({ success: true });
  });
});

app.post('/api/logout', (req, res) => {
  res.clearCookie('token', { httpOnly: true, sameSite: 'lax' });
  res.json({ success: true });
});

app.listen(PORT, () => {
  console.log(`Backend API running on http://localhost:${PORT}`);
});
