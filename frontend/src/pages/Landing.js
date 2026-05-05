import React from 'react';
import { Link } from 'react-router-dom';
import './Landing.css';

const Landing = () => {
  return (
    <div className="landing">
      <header className="landing__header">
        <div className="landing__logo">
          <span className="logo-mark">V</span>
          <span className="logo-text">ault</span>
        </div>
        <nav className="landing__nav">
          <Link to="/login" className="nav-link">Sign in</Link>
          <Link to="/signup" className="btn btn--primary">Get started</Link>
        </nav>
      </header>

      <main>
        <section className="hero">
          <div className="hero__label mono">Task management, redefined</div>
          <h1 className="hero__title">
            Work that<br />
            <em>actually</em><br />
            gets done.
          </h1>
          <p className="hero__subtitle">
            Vault gives your work a home — track tasks, set priorities,
            and hit deadlines without the noise.
          </p>
          <div className="hero__actions">
            <Link to="/signup" className="btn btn--large btn--primary">
              Start for free
            </Link>
            <Link to="/login" className="btn btn--large btn--ghost">
              I have an account →
            </Link>
          </div>

          <div className="hero__stats">
            <div className="stat">
              <span className="stat__number">∞</span>
              <span className="stat__label">Tasks</span>
            </div>
            <div className="stat__divider" />
            <div className="stat">
              <span className="stat__number">3</span>
              <span className="stat__label">Priority levels</span>
            </div>
            <div className="stat__divider" />
            <div className="stat">
              <span className="stat__number">0</span>
              <span className="stat__label">Clutter</span>
            </div>
          </div>
        </section>

        <section className="features">
          <div className="features__grid">
            <div className="feature-card feature-card--accent">
              <div className="feature-card__number mono">01</div>
              <h3>Clear priorities</h3>
              <p>Mark tasks as low, medium, or high priority. Know exactly where to focus your energy today.</p>
            </div>
            <div className="feature-card">
              <div className="feature-card__number mono">02</div>
              <h3>Status tracking</h3>
              <p>Move tasks from To Do → In Progress → Done. Simple, fast, satisfying.</p>
            </div>
            <div className="feature-card">
              <div className="feature-card__number mono">03</div>
              <h3>Your data, secure</h3>
              <p>Every account is isolated with bcrypt-hashed passwords and signed JWT tokens.</p>
            </div>
            <div className="feature-card feature-card--dark">
              <div className="feature-card__number mono">04</div>
              <h3>Built to last</h3>
              <p>No subscriptions, no paywalls, no distractions. Just a clean workspace.</p>
            </div>
          </div>
        </section>
      </main>

      <footer className="landing__footer">
        <div className="footer__left">
          <span className="logo-mark small">V</span>
          <span className="mono" style={{ fontSize: '0.75rem', color: 'var(--warm-gray)' }}>
            © 2024 Vault. All rights reserved.
          </span>
        </div>
        <div className="footer__right">
          <Link to="/signup" className="btn btn--ghost btn--small">Create account</Link>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
