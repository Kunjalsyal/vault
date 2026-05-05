import { useState, useCallback } from 'react';
import { API } from '../context/AuthContext';

export const useTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTasks = useCallback(async (filters = {}) => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams(filters).toString();
      const [tasksRes, statsRes] = await Promise.all([
        API.get(`/tasks?${params}`),
        API.get('/tasks/stats')
      ]);
      setTasks(tasksRes.data.tasks);
      setStats(statsRes.data.stats);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load tasks');
    } finally {
      setLoading(false);
    }
  }, []);

  const createTask = async (taskData) => {
    const { data } = await API.post('/tasks', taskData);
    setTasks(prev => [data.task, ...prev]);
    return data.task;
  };

  const updateTask = async (id, updates) => {
    const { data } = await API.put(`/tasks/${id}`, updates);
    setTasks(prev => prev.map(t => t.id === id ? data.task : t));
    return data.task;
  };

  const deleteTask = async (id) => {
    await API.delete(`/tasks/${id}`);
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  return { tasks, stats, loading, error, fetchTasks, createTask, updateTask, deleteTask };
};
