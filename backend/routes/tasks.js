const express = require('express');
const { v4: uuidv4 } = require('uuid');
const db = require('../db');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// All routes require auth
router.use(authenticate);

// GET /api/tasks
router.get('/', (req, res) => {
  const { status, priority } = req.query;
  let query = 'SELECT * FROM tasks WHERE user_id = ?';
  const params = [req.user.id];

  if (status) { query += ' AND status = ?'; params.push(status); }
  if (priority) { query += ' AND priority = ?'; params.push(priority); }

  query += ' ORDER BY created_at DESC';

  db.all(query, params, (err, tasks) => {
    if (err) return res.status(500).json({ error: 'Failed to fetch tasks' });
    res.json({ tasks });
  });
});

// POST /api/tasks
router.post('/', (req, res) => {
  const { title, description, status, priority, due_date } = req.body;

  if (!title || !title.trim()) {
    return res.status(400).json({ error: 'Task title is required' });
  }

  const id = uuidv4();
  const now = new Date().toISOString();

  db.run(
    `INSERT INTO tasks (id, user_id, title, description, status, priority, due_date, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      id,
      req.user.id,
      title.trim(),
      description || null,
      status || 'todo',
      priority || 'medium',
      due_date || null,
      now,
      now
    ],
    function (err) {
      if (err) return res.status(500).json({ error: 'Failed to create task' });

      db.get('SELECT * FROM tasks WHERE id = ?', [id], (err, task) => {
        if (err) return res.status(500).json({ error: 'Task created but failed to retrieve' });
        res.status(201).json({ task });
      });
    }
  );
});

// PUT /api/tasks/:id
router.put('/:id', (req, res) => {
  const { title, description, status, priority, due_date } = req.body;
  const { id } = req.params;

  db.get('SELECT * FROM tasks WHERE id = ? AND user_id = ?', [id, req.user.id], (err, task) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    if (!task) return res.status(404).json({ error: 'Task not found' });

    const updatedTitle = title !== undefined ? title.trim() : task.title;
    const updatedDesc = description !== undefined ? description : task.description;
    const updatedStatus = status || task.status;
    const updatedPriority = priority || task.priority;
    const updatedDue = due_date !== undefined ? due_date : task.due_date;
    const now = new Date().toISOString();

    db.run(
      `UPDATE tasks SET title=?, description=?, status=?, priority=?, due_date=?, updated_at=?
       WHERE id=? AND user_id=?`,
      [updatedTitle, updatedDesc, updatedStatus, updatedPriority, updatedDue, now, id, req.user.id],
      function (err) {
        if (err) return res.status(500).json({ error: 'Failed to update task' });

        db.get('SELECT * FROM tasks WHERE id = ?', [id], (err, updated) => {
          res.json({ task: updated });
        });
      }
    );
  });
});

// DELETE /api/tasks/:id
router.delete('/:id', (req, res) => {
  const { id } = req.params;

  db.run(
    'DELETE FROM tasks WHERE id = ? AND user_id = ?',
    [id, req.user.id],
    function (err) {
      if (err) return res.status(500).json({ error: 'Failed to delete task' });
      if (this.changes === 0) return res.status(404).json({ error: 'Task not found' });
      res.json({ message: 'Task deleted successfully' });
    }
  );
});

// GET /api/tasks/stats
router.get('/stats', (req, res) => {
  db.all(
    `SELECT
      COUNT(*) as total,
      SUM(CASE WHEN status='todo' THEN 1 ELSE 0 END) as todo,
      SUM(CASE WHEN status='in_progress' THEN 1 ELSE 0 END) as in_progress,
      SUM(CASE WHEN status='done' THEN 1 ELSE 0 END) as done,
      SUM(CASE WHEN priority='high' THEN 1 ELSE 0 END) as high_priority
     FROM tasks WHERE user_id = ?`,
    [req.user.id],
    (err, rows) => {
      if (err) return res.status(500).json({ error: 'Failed to fetch stats' });
      res.json({ stats: rows[0] });
    }
  );
});

module.exports = router;
