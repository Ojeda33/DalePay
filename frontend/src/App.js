import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import './App.css';

// Import components
import LoginSystem from './components/LoginSystem';
import Homepage from './components/Homepage';
import Dashboard from './components/Dashboard';
import SendMoney from './components/SendMoney';
import ReceiveMoney from './components/ReceiveMoney';
import CardProcessor from './components/CardProcessor';
import CryptoWallet from './components/CryptoWallet';
import BusinessPortal from './components/BusinessPortal';
import AdminDashboard from './components/AdminDashboard';
import UserSettings from './components/UserSettings';
import TermsConditions from './components/TermsConditions';
import JorgeTourGuide from './components/JorgeTourGuide';
import AppSecurity from './components/AppSecurity';
import NotificationSystem, { NotificationBell } from './components/NotificationSystem';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Configure axios defaults
axios.defaults.baseURL = API;

function App() {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [showJorgeTour, setShowJorgeTour] = useState(false);
  const [isAppUnlocked, setIsAppUnlocked] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [hasNotifications, setHasNotifications] = useState({
    home: false,
    dashboard: false,
    send: false,
    receive: false,
    crypto: false,
    settings: false
  });

  useEffect(() => {
    checkAuthStatus();
    // Check for first-time user to show Jorge tour
    const hasSeenTour = localStorage.getItem('dalepay_tour_completed');
    if (!hasSeenTour && isAuthenticated) {
      setTimeout(() => setShowJorgeTour(true), 2000);
    }
  }, [isAuthenticated]);

  // Check for notifications (only show when actually needed)
  useEffect(() => {
    if (isAuthenticated && user) {
      // Notification checking is now handled by NotificationSystem component
    }
  }, [isAuthenticated, user]);

  const handleNotificationsUpdate = (notifications) => {
    setHasNotifications(notifications);
  };

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    const token = localStorage.getItem('dalepay_token');
    if (token) {
      try {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        const response = await axios.get('/users/me');
        setUser(response.data);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Auth check failed:', error);
        localStorage.removeItem('dalepay_token');
        delete axios.defaults.headers.common['Authorization'];
      }
    }
    setLoading(false);
  };

  const handleLogin = (userData, token) => {
    localStorage.setItem('dalepay_token', token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    setUser(userData);
    setIsAuthenticated(true);
    
    // Show Jorge tour for new users
    const hasSeenTour = localStorage.getItem('dalepay_tour_completed');
    if (!hasSeenTour) {
      setTimeout(() => setShowJorgeTour(true), 2000);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('dalepay_token');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
    setIsAuthenticated(false);
    setCurrentPage('dashboard');
    setShowJorgeTour(false);
  };

  const handleJorgeTourComplete = () => {
    setShowJorgeTour(false);
    localStorage.setItem('dalepay_tour_completed', 'true');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-red-600 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold text-white">DalePay™</h2>
          <p className="text-white/80">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Homepage onShowLogin={handleLogin} />;
  }

  // Show app security lock screen if not unlocked
  if (!isAppUnlocked) {
    return <AppSecurity onUnlock={() => setIsAppUnlocked(true)} />;
  }

  const BottomNavigation = () => (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2">
      <div className="flex justify-around items-center max-w-md mx-auto">
        <button
          onClick={() => setCurrentPage('home')}
          className={`flex flex-col items-center py-1 px-3 rounded-lg transition-colors ${
            currentPage === 'home' 
              ? 'text-blue-600 bg-blue-50' 
              : 'text-gray-600'
          }`}
        >
          <div className="relative">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
            </svg>
            {hasNotifications.home && (
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></div>
            )}
          </div>
          <span className="text-xs mt-1 font-medium">Home</span>
        </button>
        
        <button
          onClick={() => setCurrentPage('dashboard')}
          className={`flex flex-col items-center py-1 px-3 rounded-lg transition-colors ${
            currentPage === 'dashboard' 
              ? 'text-blue-600 bg-blue-50' 
              : 'text-gray-600'
          }`}
        >
          <div className="relative">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M21 18v1c0 1.1-.9 2-2 2H5c-1.1 0-2-.9-2-2V5c0-1.1.9-2 2-2h14c1.1 0 2 .9 2 2v1h-9c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h9zm0-2v-8c0-.55-.45-1-1-1h-7v10h7c.55 0 1-.45 1-1zM16 13.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/>
            </svg>
            {hasNotifications.dashboard && (
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-500 rounded-full"></div>
            )}
          </div>
          <span className="text-xs mt-1 font-medium">Wallet</span>
        </button>
        
        <button
          onClick={() => setCurrentPage('send')}
          className={`flex flex-col items-center py-1 px-3 rounded-lg transition-colors ${
            currentPage === 'send' 
              ? 'text-blue-600 bg-blue-50' 
              : 'text-gray-600'
          }`}
        >
          <div className="relative">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M2,21L23,12L2,3V10L17,12L2,14V21Z" />
            </svg>
            {hasNotifications.send && (
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full"></div>
            )}
          </div>
          <span className="text-xs mt-1 font-medium">Enviar</span>
        </button>
        
        <button
          onClick={() => setCurrentPage('receive')}
          className={`flex flex-col items-center py-1 px-3 rounded-lg transition-colors ${
            currentPage === 'receive' 
              ? 'text-blue-600 bg-blue-50' 
              : 'text-gray-600'
          }`}
        >
          <div className="relative">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M22,3L1,12L22,21V14L7,12L22,10V3Z" />
            </svg>
            {hasNotifications.receive && (
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full"></div>
            )}
          </div>
          <span className="text-xs mt-1 font-medium">Recibir</span>
        </button>
        
        <button
          onClick={() => setCurrentPage('crypto')}
          className={`flex flex-col items-center py-1 px-3 rounded-lg transition-colors ${
            currentPage === 'crypto' 
              ? 'text-blue-600 bg-blue-50' 
              : 'text-gray-600'
          }`}
        >
          <div className="relative">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4M12,6A6,6 0 0,0 6,12A6,6 0 0,0 12,18A6,6 0 0,0 18,12A6,6 0 0,0 12,6M12,8A4,4 0 0,1 16,12A4,4 0 0,1 12,16A4,4 0 0,1 8,12A4,4 0 0,1 12,8Z" />
            </svg>
            {hasNotifications.crypto && (
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-orange-500 rounded-full"></div>
            )}
          </div>
          <span className="text-xs mt-1 font-medium">Crypto</span>
        </button>
        
        <button
          onClick={() => setCurrentPage('settings')}
          className={`flex flex-col items-center py-1 px-3 rounded-lg transition-colors ${
            currentPage === 'settings' 
              ? 'text-blue-600 bg-blue-50' 
              : 'text-gray-600'
          }`}
        >
          <div className="relative">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12,15.5A3.5,3.5 0 0,1 8.5,12A3.5,3.5 0 0,1 12,8.5A3.5,3.5 0 0,1 15.5,12A3.5,3.5 0 0,1 12,15.5M19.43,12.98C19.47,12.66 19.5,12.34 19.5,12C19.5,11.66 19.47,11.34 19.43,11.02L21.54,9.37C21.73,9.22 21.78,8.95 21.66,8.73L19.66,5.27C19.54,5.05 19.27,4.96 19.05,5.05L16.56,6.05C16.04,5.65 15.48,5.32 14.87,5.07L14.5,2.42C14.46,2.18 14.25,2 14,2H10C9.75,2 9.54,2.18 9.5,2.42L9.13,5.07C8.52,5.32 7.96,5.66 7.44,6.05L4.95,5.05C4.73,4.96 4.46,5.05 4.34,5.27L2.34,8.73C2.22,8.95 2.27,9.22 2.46,9.37L4.57,11.02C4.53,11.34 4.5,11.67 4.5,12C4.5,12.33 4.53,12.66 4.57,12.98L2.46,14.63C2.27,14.78 2.22,15.05 2.34,15.27L4.34,18.73C4.46,18.95 4.73,19.03 4.95,18.95L7.44,17.94C7.96,18.34 8.52,18.68 9.13,18.93L9.5,21.58C9.54,21.82 9.75,22 10,22H14C14.25,22 14.46,21.82 14.5,21.58L14.87,18.93C15.48,18.68 16.04,18.34 16.56,17.94L19.05,18.95C19.27,19.03 19.54,18.95 19.66,18.73L21.66,15.27C21.78,15.05 21.73,14.78 21.54,14.63L19.43,12.98Z" />
            </svg>
            {hasNotifications.settings && (
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-purple-500 rounded-full"></div>
            )}
          </div>
          <span className="text-xs mt-1 font-medium">Config</span>
        </button>
      </div>
    </div>
  );

  const renderCurrentPage = () => {
    switch(currentPage) {
      case 'home':
        return <Homepage onShowLogin={handleLogin} />;
      case 'dashboard':
        return <Dashboard user={user} onNavigate={setCurrentPage} />;
      case 'send':
        return <SendMoney user={user} onBack={() => setCurrentPage('dashboard')} />;
      case 'receive':
        return <ReceiveMoney user={user} onBack={() => setCurrentPage('dashboard')} />;
      case 'cards':
        return <CardProcessor user={user} onBack={() => setCurrentPage('dashboard')} onBalanceUpdate={checkAuthStatus} />;
      case 'crypto':
        return <CryptoWallet user={user} onBack={() => setCurrentPage('dashboard')} />;
      case 'business':
        return <BusinessPortal user={user} onBack={() => setCurrentPage('dashboard')} />;
      case 'settings':
        return <UserSettings user={user} onBack={() => setCurrentPage('dashboard')} onLogout={handleLogout} />;
      case 'admin':
        return user?.role === 'admin' ? (
          <AdminDashboard user={user} onBack={() => setCurrentPage('dashboard')} />
        ) : (
          <Dashboard user={user} onNavigate={setCurrentPage} />
        );
      case 'terms':
        return <TermsConditions onBack={() => setCurrentPage('dashboard')} />;
      default:
        return <Dashboard user={user} onNavigate={setCurrentPage} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Jorge Tour Guide */}
      {showJorgeTour && (
        <JorgeTourGuide 
          user={user}
          currentPage={currentPage}
          onClose={handleJorgeTourComplete}
          onNavigate={setCurrentPage}
        />
      )}

      {/* Notification System */}
      {showNotifications && (
        <NotificationSystem 
          user={user}
          onNotificationsUpdate={handleNotificationsUpdate}
        />
      )}

      {/* Top Header */}
      <header className="bg-gradient-to-r from-blue-600 via-purple-600 to-red-600 text-white p-4 shadow-lg">
        <div className="flex items-center justify-between max-w-md mx-auto">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
              <span className="text-blue-600 font-bold text-sm">D</span>
            </div>
            <h1 className="text-xl font-bold">DalePay™</h1>
          </div>
          <div className="flex items-center space-x-3">
            {/* Notification Bell */}
            <NotificationBell 
              notificationCount={Object.values(hasNotifications).filter(Boolean).length}
              onClick={() => setShowNotifications(true)}
            />
            {/* Jorge Help Button */}
            <button 
              onClick={() => setShowJorgeTour(true)}
              className="bg-white/20 p-2 rounded-full hover:bg-white/30 transition-colors"
              title="Ayuda con Jorge"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"/>
              </svg>
            </button>
            <div className="text-right">
              <p className="text-sm opacity-90">¡Hola, {user?.full_name?.split(' ')[0]}!</p>
              <p className="text-xs opacity-75">Puerto Rico Digital Wallet</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pb-20">
        {renderCurrentPage()}
      </main>

      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
}

export default App;
