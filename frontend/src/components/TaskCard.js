import React, { useState } from 'react';
import './TaskCard.css';

const PRIORITY_CONFIG = {
  high: { label: 'High', color: 'priority--high' },
  medium: { label: 'Medium', color: 'priority--medium' },
  low: { label: 'Low', color: 'priority--low' }
};

const STATUS_CONFIG = {
  todo: { label: 'To Do', next: 'in_progress', nextLabel: 'Start' },
  in_progress: { label: 'In Progress', next: 'done', nextLabel: 'Complete' },
  done: { label: 'Done', next: 'todo', nextLabel: 'Reopen' }
};

const formatDate = (dateStr) => {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

const isOverdue = (dateStr) => {
  if (!dateStr) return false;
  return new Date(dateStr) < new Date() && new Date(dateStr).toDateString() !== new Date().toDateString();
};

const TaskCard = ({ task, onUpdate, onDelete, onEdit }) => {
  const [deleting, setDeleting] = useState(false);
  const [advancing, setAdvancing] = useState(false);

  const priority = PRIORITY_CONFIG[task.priority] || PRIORITY_CONFIG.medium;
  const status = STATUS_CONFIG[task.status] || STATUS_CONFIG.todo;

  const handleAdvance = async () => {
    setAdvancing(true);
    try {
      await onUpdate(task.id, { status: status.next });
    } finally {
      setAdvancing(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this task? This cannot be undone.')) return;
    setDeleting(true);
    try {
      await onDelete(task.id);
    } catch {
      setDeleting(false);
    }
  };

  const overdue = isOverdue(task.due_date) && task.status !== 'done';

  return (
    <article className={`task-card task-card--${task.status} ${deleting ? 'task-card--deleting' : ''}`}>
      <div className="task-card__header">
        <div className="task-card__meta">
          <span className={`priority-badge ${priority.color}`}>{priority.label}</span>
          <span className="status-label mono">{status.label}</span>
        </div>
        <div className="task-card__actions">
          <button
            className="icon-btn"
            onClick={() => onEdit(task)}
            title="Edit task"
          >
            ✎
          </button>
          <button
            className="icon-btn icon-btn--danger"
            onClick={handleDelete}
            disabled={deleting}
            title="Delete task"
          >
            ×
          </button>
        </div>
      </div>

      <div className="task-card__body">
        <h3 className={task.status === 'done' ? 'task-card__title--done' : ''}>
          {task.title}
        </h3>
        {task.description && (
          <p className="task-card__desc">{task.description}</p>
        )}
      </div>

      <div className="task-card__footer">
        {task.due_date && (
          <span className={`due-date mono ${overdue ? 'due-date--overdue' : ''}`}>
            {overdue ? '⚠ ' : ''}
            {formatDate(task.due_date)}
          </span>
        )}
        {task.status !== 'done' ? (
          <button
            className="btn-advance"
            onClick={handleAdvance}
            disabled={advancing}
          >
            {advancing ? '...' : `→ ${status.nextLabel}`}
          </button>
        ) : (
          <button
            className="btn-advance btn-advance--reopen"
            onClick={handleAdvance}
            disabled={advancing}
          >
            ↺ Reopen
          </button>
        )}
      </div>
    </article>
  );
};

export default TaskCard;
