import React, { useState } from 'react';
import { Star, Search, Sparkles } from 'lucide-react';
import CompanyList from './components/CompanyList';
import CompanyDetails from './components/CompanyDetails';
import AddCompanyModal from './components/AddCompanyModal';
import LoginModal from './components/LoginModal';
import SignupModal from './components/SignupModal';

export default function App() {
  const [activeCompanyId, setActiveCompanyId] = useState(null);
  const [isAddCompanyOpen, setIsAddCompanyOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [toasts, setToasts] = useState([]);
  
  // Auth States
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('user') || 'null');
    } catch (e) {
      return null;
    }
  });
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSignupOpen, setIsSignupOpen] = useState(false);

  // Toast System
  const showToast = (message, type = 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  const triggerListRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const handleCompanyAdded = () => {
    triggerListRefresh();
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    showToast('Logged out successfully', 'info');
  };

  // Helper to extract user initials for avatar
  const getInitials = (name) => {
    if (!name) return 'U';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name[0].toUpperCase();
  };

  return (
    <div>
      {/* Navbar Header from Figma */}
      <header className="app-header">
        {/* Left: Logo */}
        <div className="logo-container" onClick={() => { setActiveCompanyId(null); setSearchTerm(''); }} style={{ cursor: 'pointer' }}>
          <div className="logo-icon">
            <Star size={16} fill="white" color="white" />
          </div>
          <span className="logo-text">
            Review<strong>&RATE</strong>
          </span>
        </div>

        {/* Center: Search Bar */}
        <div className="header-search-wrapper">
          <input
            type="text"
            className="header-search-input"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search size={18} className="header-search-icon" />
        </div>

        {/* Right: Auth Links */}
        <div className="header-actions" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div
                className="reviewer-circle"
                style={{
                  width: '32px',
                  height: '32px',
                  fontSize: '12px',
                  backgroundColor: '#7c3aed',
                  color: 'white',
                  fontWeight: '600',
                  margin: 0
                }}
                title={user.fullName}
              >
                {getInitials(user.fullName)}
              </div>
              <span style={{ fontSize: '13px', color: '#333333', fontWeight: '500' }}>
                Hi, {user.fullName.split(' ')[0]}
              </span>
              <button
                className="header-link"
                onClick={handleLogout}
                style={{ fontSize: '13px', color: '#ef4444' }}
              >
                Logout
              </button>
            </div>
          ) : (
            <>
              <button className="header-link" onClick={() => setIsSignupOpen(true)}>
                SignUp
              </button>
              <button className="header-link" onClick={() => setIsLoginOpen(true)}>
                Login
              </button>
            </>
          )}
        </div>
      </header>

      {/* Main Content Area */}
      <main className="main-content">
        {activeCompanyId ? (
          <CompanyDetails
            companyId={activeCompanyId}
            user={user}
            onBack={() => {
              setActiveCompanyId(null);
              triggerListRefresh();
            }}
            showToast={showToast}
          />
        ) : (
          <CompanyList
            onCompanyClick={setActiveCompanyId}
            refreshTrigger={refreshTrigger}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            onAddCompanyClick={() => {
              if (!user) {
                showToast('Please sign in or register to add a company profile.', 'error');
                setIsLoginOpen(true);
              } else {
                setIsAddCompanyOpen(true);
              }
            }}
            showToast={showToast}
          />
        )}
      </main>

      {/* Global Add Company Modal */}
      <AddCompanyModal
        isOpen={isAddCompanyOpen}
        onClose={() => setIsAddCompanyOpen(false)}
        onCompanyAdded={handleCompanyAdded}
        showToast={showToast}
      />

      {/* Login Modal */}
      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onLoginSuccess={setUser}
        onSwitchToSignup={() => {
          setIsLoginOpen(false);
          setIsSignupOpen(true);
        }}
        showToast={showToast}
      />

      {/* Signup Modal */}
      <SignupModal
        isOpen={isSignupOpen}
        onClose={() => setIsSignupOpen(false)}
        onSignupSuccess={setUser}
        onSwitchToLogin={() => {
          setIsSignupOpen(false);
          setIsLoginOpen(true);
        }}
        showToast={showToast}
      />

      {/* Toast Notification Container */}
      <div className="toast-container">
        {toasts.map(toast => (
          <div key={toast.id} className="toast-item">
            <Sparkles size={14} style={{ color: '#10b981' }} />
            <span>{toast.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
