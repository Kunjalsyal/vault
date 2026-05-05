import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

const Auth = () => {
  const location = useLocation();
  const isSignup = location.pathname === '/signup';
  const navigate = useNavigate();
  const { login, signup } = useAuth();

  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isSignup) {
        await signup(form.name, form.email, form.password);
      } else {
        await login(form.email, form.password);
      }
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-side">
        <div className="auth-brand">
          <Link to="/" className="auth-logo">
            <span className="logo-mark">V</span>
            <span className="logo-text">ault</span>
          </Link>
          <blockquote className="auth-quote">
            <p>"The secret of getting ahead is getting started."</p>
            <cite>— Mark Twain</cite>
          </blockquote>
          <div className="auth-decorative">
            <div className="dec-line" />
            <div className="dec-square" />
            <div className="dec-circle" />
          </div>
        </div>
      </div>

      <div className="auth-form-side">
        <div className="auth-form-container animate-fade-up">
          <div className="auth-form-header">
            <h2>{isSignup ? 'Create your account' : 'Welcome back'}</h2>
            <p>
              {isSignup
                ? 'Start organizing your work today.'
                : 'Sign in to continue to Vault.'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form" noValidate>
            {isSignup && (
              <div className="form-field">
                <label htmlFor="name">Full name</label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Jane Smith"
                  required
                  autoFocus
                  autoComplete="name"
                />
              </div>
            )}

            <div className="form-field">
              <label htmlFor="email">Email address</label>
              <input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="jane@example.com"
                required
                autoFocus={!isSignup}
                autoComplete="email"
              />
            </div>

            <div className="form-field">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                placeholder={isSignup ? 'Min. 6 characters' : '••••••••'}
                required
                autoComplete={isSignup ? 'new-password' : 'current-password'}
              />
            </div>

            {error && (
              <div className="auth-error" role="alert">
                <span className="error-icon">!</span>
                {error}
              </div>
            )}

            <button
              type="submit"
              className="btn btn--primary btn--full"
              disabled={loading}
            >
              {loading
                ? <span className="spinner" />
                : isSignup ? 'Create account' : 'Sign in'
              }
            </button>
          </form>

          <div className="auth-switch">
            {isSignup ? (
              <>Already have an account? <Link to="/login">Sign in</Link></>
            ) : (
              <>Don't have an account? <Link to="/signup">Sign up free</Link></>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
