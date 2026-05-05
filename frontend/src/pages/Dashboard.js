import React, { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTasks } from '../hooks/useTasks';
import TaskCard from '../components/TaskCard';
import TaskModal from '../components/TaskModal';
import './Dashboard.css';

const FILTERS = [
  { label: 'All', value: '' },
  { label: 'To Do', value: 'todo' },
  { label: 'In Progress', value: 'in_progress' },
  { label: 'Done', value: 'done' }
];

const Dashboard = () => {
  const { user, logout } = useAuth();
  const { tasks, stats, loading, error, fetchTasks, createTask, updateTask, deleteTask } = useTasks();
  const [filter, setFilter] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const load = useCallback(() => {
    fetchTasks(filter ? { status: filter } : {});
  }, [fetchTasks, filter]);

  useEffect(() => { load(); }, [load]);

  const handleSave = async (formData) => {
    if (editingTask) {
      await updateTask(editingTask.id, formData);
    } else {
      await createTask(formData);
    }
    load();
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditingTask(null);
  };

  const handleNewTask = () => {
    setEditingTask(null);
    setModalOpen(true);
  };

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const firstName = user?.name?.split(' ')[0] || 'there';

  return (
    <div className="dashboard">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar__logo">
          <span className="logo-mark">V</span>
          <span className="logo-text">ault</span>
        </div>

        <nav className="sidebar__nav">
          <div className="sidebar__nav-item sidebar__nav-item--active">
            <span className="nav-icon">◈</span>
            Tasks
          </div>
        </nav>

        {stats && (
          <div className="sidebar__stats">
            <div className="sidebar__stat-title mono">Overview</div>
            <div className="sidebar__stat">
              <span>Total</span>
              <span className="stat-val">{stats.total}</span>
            </div>
            <div className="sidebar__stat">
              <span>To Do</span>
              <span className="stat-val">{stats.todo}</span>
            </div>
            <div className="sidebar__stat">
              <span>In Progress</span>
              <span className="stat-val">{stats.in_progress}</span>
            </div>
            <div className="sidebar__stat">
              <span>Done</span>
              <span className="stat-val done">{stats.done}</span>
            </div>
            {stats.high_priority > 0 && (
              <div className="sidebar__stat sidebar__stat--urgent">
                <span>High priority</span>
                <span className="stat-val urgent">{stats.high_priority}</span>
              </div>
            )}
          </div>
        )}

        <div className="sidebar__user">
          <div className="user-avatar">
            {user?.name?.[0]?.toUpperCase() || 'U'}
          </div>
          <div className="user-info">
            <span className="user-name">{user?.name}</span>
            <span className="user-email mono">{user?.email}</span>
          </div>
          <button className="logout-btn" onClick={logout} title="Sign out">⏻</button>
        </div>
      </aside>

      {/* Main */}
      <main className="dashboard__main">
        <header className="dashboard__header">
          <div className="dashboard__greeting">
            <p className="greeting-sub mono">{greeting()},</p>
            <h1 className="greeting-name">{firstName}.</h1>
          </div>
          <button className="btn btn--primary" onClick={handleNewTask}>
            + New task
          </button>
        </header>

        {/* Filter tabs */}
        <div className="filter-tabs">
          {FILTERS.map(f => (
            <button
              key={f.value}
              className={`filter-tab ${filter === f.value ? 'filter-tab--active' : ''}`}
              onClick={() => setFilter(f.value)}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="task-area">
          {loading && (
            <div className="loading-state">
              <div className="loading-grid">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="skeleton-card" style={{ animationDelay: `${i * 0.1}s` }} />
                ))}
              </div>
            </div>
          )}

          {error && (
            <div className="empty-state">
              <p className="empty-state__icon">⚠</p>
              <p>{error}</p>
              <button className="btn btn--ghost" onClick={load}>Try again</button>
            </div>
          )}

          {!loading && !error && tasks.length === 0 && (
            <div className="empty-state animate-fade-up">
              <p className="empty-state__icon">◈</p>
              <h3>{filter ? `No ${filter.replace('_', ' ')} tasks` : 'Your vault is empty'}</h3>
              <p>
                {filter
                  ? 'No tasks match this filter.'
                  : 'Create your first task to get started.'}
              </p>
              {!filter && (
                <button className="btn btn--primary" onClick={handleNewTask}>
                  + Create a task
                </button>
              )}
            </div>
          )}

          {!loading && !error && tasks.length > 0 && (
            <div className="task-grid">
              {tasks.map((task, i) => (
                <div key={task.id} style={{ animationDelay: `${i * 0.05}s` }}>
                  <TaskCard
                    task={task}
                    onUpdate={updateTask}
                    onDelete={deleteTask}
                    onEdit={handleEdit}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {modalOpen && (
        <TaskModal
          task={editingTask}
          onSave={handleSave}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default Dashboard;
