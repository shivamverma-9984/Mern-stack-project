import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { X } from 'lucide-react';
import { loginAsync } from '../redux/slices/authSlice';

export default function LoginModal({ isOpen, onClose, onSwitchToSignup, showToast }) {
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      showToast('Please enter both email and password', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const data = await dispatch(loginAsync({ email, password })).unwrap();
      showToast(`Welcome back, ${data.user.fullName}!`, 'success');
      onClose();
    } catch (err) {
      showToast(err || 'Login failed. Check details.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content-card">
        {/* Header */}
        <div className="modal-header-row">
          <h3>Login to ReviewRadar</h3>
          <button className="close-modal-btn" onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="modal-body-panel">
          <form onSubmit={handleSubmit}>
            
            {/* Email */}
            <div className="form-field-group">
              <label htmlFor="login-email">Email Address</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="email"
                  id="login-email"
                  placeholder="e.g. john@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{ width: '100%' }}
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="form-field-group">
              <label htmlFor="login-password">Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="password"
                  id="login-password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ width: '100%' }}
                  required
                />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px', marginBottom: '20px' }}>
              <button
                type="button"
                className="header-link"
                onClick={onSwitchToSignup}
                style={{ fontSize: '12px', padding: 0 }}
              >
                Don't have an account? Sign Up
              </button>
            </div>

            {/* Footer Row */}
            <div className="modal-footer-row" style={{ padding: '12px 0 0 0', borderTop: 'none' }}>
              <button type="button" className="btn-modal-cancel" onClick={onClose} disabled={isSubmitting}>
                Cancel
              </button>
              <button type="submit" className="btn-modal-submit" disabled={isSubmitting}>
                {isSubmitting ? 'Logging in...' : 'Login'}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}
