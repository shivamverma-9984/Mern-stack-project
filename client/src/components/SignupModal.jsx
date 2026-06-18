import React, { useState } from 'react';
import { X } from 'lucide-react';
import { signupUser } from '../utils/api';

export default function SignupModal({ isOpen, onClose, onSignupSuccess, onSwitchToLogin, showToast }) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!fullName.trim() || !email.trim() || !password.trim()) {
      showToast('Please fill in all fields', 'error');
      return;
    }

    if (password.length < 6) {
      showToast('Password must be at least 6 characters', 'error');
      return;
    }

    if (password !== confirmPassword) {
      showToast('Passwords do not match', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const data = await signupUser({
        fullName,
        email,
        password
      });

      // Save session in local storage
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      showToast(`Account created! Welcome, ${data.user.fullName}!`, 'success');
      onSignupSuccess(data.user);
      onClose();
    } catch (err) {
      showToast(err.message || 'Registration failed. Try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content-card">
        {/* Header */}
        <div className="modal-header-row">
          <h3>Create an Account</h3>
          <button className="close-modal-btn" onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="modal-body-panel">
          <form onSubmit={handleSubmit}>
            
            {/* Full Name */}
            <div className="form-field-group">
              <label htmlFor="signup-name">Full Name</label>
              <input
                type="text"
                id="signup-name"
                placeholder="e.g. John Doe"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>

            {/* Email */}
            <div className="form-field-group">
              <label htmlFor="signup-email">Email Address</label>
              <input
                type="email"
                id="signup-email"
                placeholder="e.g. john@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* Password */}
            <div className="form-field-group">
              <label htmlFor="signup-password">Password (min 6 chars)</label>
              <input
                type="password"
                id="signup-password"
                placeholder="Create password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {/* Confirm Password */}
            <div className="form-field-group">
              <label htmlFor="signup-confirm">Confirm Password</label>
              <input
                type="password"
                id="signup-confirm"
                placeholder="Re-enter password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px', marginBottom: '20px' }}>
              <button
                type="button"
                className="header-link"
                onClick={onSwitchToLogin}
                style={{ fontSize: '12px', padding: 0 }}
              >
                Already have an account? Login
              </button>
            </div>

            {/* Footer Row */}
            <div className="modal-footer-row" style={{ padding: '12px 0 0 0', borderTop: 'none' }}>
              <button type="button" className="btn-modal-cancel" onClick={onClose} disabled={isSubmitting}>
                Cancel
              </button>
              <button type="submit" className="btn-modal-submit" disabled={isSubmitting}>
                {isSubmitting ? 'Registering...' : 'Sign Up'}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}
