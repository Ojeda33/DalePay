import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import { LanguageProvider, useLanguage, useTranslation } from './hooks/useLanguage';
import './App.css';

// Import components
import ProductionHomepage from './components/ProductionHomepage';
import LoginSystem from './components/LoginSystem';
import Dashboard from './components/Dashboard';
import AdminPanel from './components/AdminPanel';
import ComplianceDashboard from './components/ComplianceDashboard';
import UserProfile from './components/UserProfile';
import TransactionHistory from './components/TransactionHistory';
import SendMoney from './components/SendMoney';
import ReceiveMoney from './components/ReceiveMoney';
import BankLinking from './components/BankLinking';
import SubscriptionPlans from './components/SubscriptionPlans';
import SecurityCenter from './components/SecurityCenter';
import SupportCenter from './components/SupportCenter';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Configure axios defaults
axios.defaults.baseURL = API;

function AppContent() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem('darkMode') === 'true' || false
  );
  const [currentView, setCurrentView] = useState('homepage');
  const { language, toggleLanguage } = useLanguage();
  const { t } = useTranslation();

  useEffect(() => {
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  const handleLogin = (userData, userToken) => {
    setUser(userData);
    setToken(userToken);
    localStorage.setItem('token', userToken);
    setCurrentView('dashboard');
  };

  const handleLogout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    setCurrentView('homepage');
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const handleNavigation = (view) => {
    setCurrentView(view);
  };

  // Language Toggle Component
  const LanguageToggle = () => (
    <div className="fixed top-4 right-4 z-50">
      <button
        onClick={toggleLanguage}
        className={`flex items-center space-x-2 px-3 py-2 rounded-lg font-medium transition-all ${
          darkMode 
            ? 'bg-gray-800 text-white border border-gray-600 hover:bg-gray-700' 
            : 'bg-white text-gray-900 border border-gray-300 hover:bg-gray-50'
        } shadow-lg`}
      >
        <span className="text-xl">{language === 'en' ? '🇺🇸' : '🇵🇷'}</span>
        <span className="text-sm font-bold">
          {language === 'en' ? 'ES' : 'EN'}
        </span>
      </button>
    </div>
  );

  const renderCurrentView = () => {
    if (!user) {
      return (
        <>
          <LanguageToggle />
          <ProductionHomepage 
            onLogin={handleLogin} 
            darkMode={darkMode} 
            onToggleDarkMode={toggleDarkMode} 
          />
        </>
      );
    }

    switch (currentView) {
      case 'dashboard':
        return (
          <>
            <LanguageToggle />
            <Dashboard 
              user={user} 
              onLogout={handleLogout} 
              onNavigate={handleNavigation} 
              darkMode={darkMode} 
              onToggleDarkMode={toggleDarkMode}
            />
          </>
        );
      case 'send':
        return (
          <>
            <LanguageToggle />
            <SendMoney 
              user={user} 
              onBack={() => setCurrentView('dashboard')} 
              darkMode={darkMode} 
            />
          </>
        );
      case 'receive':
        return (
          <>
            <LanguageToggle />
            <ReceiveMoney 
              user={user} 
              onBack={() => setCurrentView('dashboard')} 
              darkMode={darkMode} 
            />
          </>
        );
      case 'transactions':
        return (
          <>
            <LanguageToggle />
            <TransactionHistory 
              user={user} 
              onBack={() => setCurrentView('dashboard')} 
              darkMode={darkMode} 
            />
          </>
        );
      case 'bank-linking':
        return (
          <>
            <LanguageToggle />
            <BankLinking 
              user={user} 
              onBack={() => setCurrentView('dashboard')} 
              darkMode={darkMode} 
            />
          </>
        );
      default:
        return (
          <>
            <LanguageToggle />
            <Dashboard 
              user={user} 
              onLogout={handleLogout} 
              onNavigate={handleNavigation} 
              darkMode={darkMode} 
              onToggleDarkMode={toggleDarkMode}
            />
          </>
        );
    }
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {renderCurrentView()}
    </div>
  );
}

function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}
}

export default App;
