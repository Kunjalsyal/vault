import React, { useState, useEffect, useRef } from 'react';
import './TaskModal.css';

const EMPTY_FORM = {
  title: '',
  description: '',
  status: 'todo',
  priority: 'medium',
  due_date: ''
};

const TaskModal = ({ task, onSave, onClose }) => {
  const [form, setForm] = useState(EMPTY_FORM);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const titleRef = useRef(null);
  const isEditing = !!task;

  useEffect(() => {
    if (task) {
      setForm({
        title: task.title || '',
        description: task.description || '',
        status: task.status || 'todo',
        priority: task.priority || 'medium',
        due_date: task.due_date ? task.due_date.slice(0, 10) : ''
      });
    }
    titleRef.current?.focus();
  }, [task]);

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) { setError('Title is required'); return; }

    setLoading(true);
    try {
      await onSave(form);
      onClose();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save task');
    } finally {
      setLoading(false);
    }
  };

  const handleBackdrop = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div className="modal-backdrop" onClick={handleBackdrop} role="dialog" aria-modal="true">
      <div className="modal animate-fade-up">
        <div className="modal__header">
          <h3>{isEditing ? 'Edit task' : 'New task'}</h3>
          <button className="modal__close" onClick={onClose} aria-label="Close">×</button>
        </div>

        <form onSubmit={handleSubmit} className="modal__form" noValidate>
          <div className="form-field">
            <label htmlFor="title">Task title *</label>
            <input
              ref={titleRef}
              id="title"
              name="title"
              type="text"
              value={form.title}
              onChange={handleChange}
              placeholder="What needs to be done?"
              maxLength={200}
            />
          </div>

          <div className="form-field">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Add more context (optional)"
              rows={3}
            />
          </div>

          <div className="modal__row">
            <div className="form-field">
              <label htmlFor="priority">Priority</label>
              <select id="priority" name="priority" value={form.priority} onChange={handleChange}>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div className="form-field">
              <label htmlFor="status">Status</label>
              <select id="status" name="status" value={form.status} onChange={handleChange}>
                <option value="todo">To Do</option>
                <option value="in_progress">In Progress</option>
                <option value="done">Done</option>
              </select>
            </div>
          </div>

          <div className="form-field">
            <label htmlFor="due_date">Due date</label>
            <input
              id="due_date"
              name="due_date"
              type="date"
              value={form.due_date}
              onChange={handleChange}
              min={new Date().toISOString().split('T')[0]}
            />
          </div>

          {error && (
            <div className="auth-error" role="alert">
              <span className="error-icon">!</span>
              {error}
            </div>
          )}

          <div className="modal__footer">
            <button type="button" className="btn btn--ghost" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn--primary" disabled={loading}>
              {loading ? <span className="spinner" /> : isEditing ? 'Save changes' : 'Create task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskModal;
