import { useState } from 'react';

export default function LoginPage({ onLogin, onNavigateToRegister }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password.trim()) {
      setError('Please enter both email and password.');
      return;
    }

    // Get registered users from localStorage
    const savedUsers = localStorage.getItem('registeredUsers');
    const users = savedUsers ? JSON.parse(savedUsers) : [];

    const foundUser = users.find(
      (u) => u.email.toLowerCase() === email.trim().toLowerCase() && u.password === password
    );

    if (foundUser) {
      onLogin(foundUser);
    } else {
      setError('Invalid email or password. Please check your credentials or create an account.');
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card-split">
        {/* Left Side Company Info / Features */}
        <div className="auth-left-promo">
          <div className="promo-header">
            <div className="logo-icon" style={{ marginBottom: '1rem', width: '48px', height: '48px', fontSize: '1.5rem' }}>A</div>
            <h2>ApexStore</h2>
            <p>Your one-stop modern destination for premium online shopping.</p>
          </div>

          <div className="promo-features-list">
            <div className="feature-item">
              <span className="feature-icon">🚀</span>
              <div className="feature-text">
                <h4>Fast Delivery</h4>
                <p>Express dispatch & doorstep delivery on all orders</p>
              </div>
            </div>

            <div className="feature-item">
              <span className="feature-icon">🔒</span>
              <div className="feature-text">
                <h4>Secure Payments</h4>
                <p>Encrypted checkout protection for every transaction</p>
              </div>
            </div>

            <div className="feature-item">
              <span className="feature-icon">📦</span>
              <div className="feature-text">
                <h4>Thousands of Products</h4>
                <p>Curated catalog across Electronics, Home & Fashion</p>
              </div>
            </div>

            <div className="feature-item">
              <span className="feature-icon">⭐</span>
              <div className="feature-text">
                <h4>Trusted by Customers</h4>
                <p>Over 50,000+ verified 5-star customer reviews</p>
              </div>
            </div>
          </div>

          <div style={{ fontSize: '0.8rem', opacity: 0.7 }}>
            © {new Date().getFullYear()} ApexStore. All rights reserved.
          </div>
        </div>

        {/* Right Side Login Form */}
        <div className="auth-right-form">
          <div className="form-header">
            <h3>Welcome Back 👋</h3>
            <p>Please enter your login details to access the application.</p>
          </div>

          <form onSubmit={handleSubmit}>
            {error && (
              <div style={{
                background: 'rgba(239, 68, 68, 0.1)',
                color: 'var(--danger-color)',
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.88rem',
                marginBottom: '1.25rem',
                border: '1px solid var(--danger-color)'
              }}>
                {error}
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                className="form-input"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn-primary" style={{ marginTop: '0.75rem' }}>
              Sign In 🔑
            </button>
          </form>

          <div className="auth-footer-link">
            Don't have an account?{' '}
            <span onClick={onNavigateToRegister}>Create Account</span>
          </div>
        </div>
      </div>
    </div>
  );
}
