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

function App() {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState('home');
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    checkAuthStatus();
    // Check for dark mode preference
    const savedDarkMode = localStorage.getItem('dalepay_dark_mode');
    if (savedDarkMode) {
      setDarkMode(JSON.parse(savedDarkMode));
    }
  }, []);

  const checkAuthStatus = async () => {
    const token = localStorage.getItem('dalepay_token');
    if (token) {
      try {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        const response = await axios.get('/user/profile');
        setUser(response.data);
        setIsAuthenticated(true);
        
        // Check for any alerts or notifications
        fetchNotifications();
      } catch (error) {
        console.error('Auth check failed:', error);
        localStorage.removeItem('dalepay_token');
        delete axios.defaults.headers.common['Authorization'];
        setIsAuthenticated(false);
      }
    }
    setLoading(false);
  };

  const fetchNotifications = async () => {
    try {
      // In production, this would fetch real notifications
      setNotifications([
        {
          id: 1,
          type: 'security',
          message: 'Your account is secured with bank-level encryption',
          time: new Date(),
          read: false
        }
      ]);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const handleLogin = (userData, token) => {
    localStorage.setItem('dalepay_token', token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    setUser(userData);
    setIsAuthenticated(true);
    setCurrentPage('dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('dalepay_token');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
    setIsAuthenticated(false);
    setCurrentPage('home');
    setNotifications([]);
  };

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('dalepay_dark_mode', JSON.stringify(newDarkMode));
  };

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${
        darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-blue-600 via-purple-600 to-green-600'
      }`}>
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-20 w-20 border-4 border-white border-t-transparent mx-auto mb-6"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl font-bold text-white">$</span>
            </div>
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">DalePay™</h2>
          <p className="text-white/80">FinCEN Registered Financial Services</p>
          <div className="mt-4 flex items-center justify-center space-x-2 text-white/60 text-sm">
            <span>🔒 Bank-Level Security</span>
            <span>•</span>
            <span>🇵🇷 Puerto Rico Licensed</span>
          </div>
        </div>
      </div>
    );
  }

  // Show homepage for non-authenticated users
  if (!isAuthenticated) {
    return (
      <div className={darkMode ? 'dark' : ''}>
        <ProductionHomepage 
          onLogin={handleLogin} 
          darkMode={darkMode}
          onToggleDarkMode={toggleDarkMode}
        />
      </div>
    );
  }

  // Main Navigation Component
  const Navigation = () => (
    <nav className={`fixed top-0 left-0 right-0 z-50 ${
      darkMode 
        ? 'bg-gray-900/95 border-gray-700' 
        : 'bg-white/95 border-gray-200'
    } border-b backdrop-blur-lg`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              darkMode ? 'bg-blue-600' : 'bg-gradient-to-r from-blue-600 to-purple-600'
            }`}>
              <span className="text-white font-bold text-lg">$</span>
            </div>
            <div>
              <h1 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                DalePay™
              </h1>
              <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                FinCEN Licensed
              </p>
            </div>
          </div>

          {/* Navigation Items */}
          <div className="hidden md:flex items-center space-x-6">
            <button
              onClick={() => setCurrentPage('dashboard')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentPage === 'dashboard'
                  ? darkMode 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-blue-100 text-blue-600'
                  : darkMode
                    ? 'text-gray-300 hover:text-white'
                    : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setCurrentPage('send')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentPage === 'send'
                  ? darkMode 
                    ? 'bg-green-600 text-white' 
                    : 'bg-green-100 text-green-600'
                  : darkMode
                    ? 'text-gray-300 hover:text-white'
                    : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Send
            </button>
            <button
              onClick={() => setCurrentPage('receive')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentPage === 'receive'
                  ? darkMode 
                    ? 'bg-purple-600 text-white' 
                    : 'bg-purple-100 text-purple-600'
                  : darkMode
                    ? 'text-gray-300 hover:text-white'
                    : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Receive
            </button>
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <div className="relative">
              <button className={`p-2 rounded-lg ${
                darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
              }`}>
                <svg className={`w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z"/>
                </svg>
              </button>
              {notifications.filter(n => !n.read).length > 0 && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
              )}
            </div>

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className={`p-2 rounded-lg ${
                darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
              }`}
            >
              {darkMode ? (
                <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd"/>
                </svg>
              ) : (
                <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"/>
                </svg>
              )}
            </button>

            {/* User Profile */}
            <div className="flex items-center space-x-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                darkMode ? 'bg-blue-600' : 'bg-gradient-to-r from-blue-600 to-purple-600'
              }`}>
                <span className="text-white font-medium text-sm">
                  {user?.full_name?.charAt(0) || 'U'}
                </span>
              </div>
              <div className="hidden sm:block">
                <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {user?.full_name || 'User'}
                </p>
                <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  {user?.subscription_plan || 'Basic'} Plan
                </p>
              </div>
              <button
                onClick={handleLogout}
                className={`p-2 rounded-lg ${
                  darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
                }`}
              >
                <svg className={`w-4 h-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );

  // Render current page
  const renderCurrentPage = () => {
    switch(currentPage) {
      case 'dashboard':
        return <Dashboard user={user} onNavigate={setCurrentPage} darkMode={darkMode} />;
      case 'send':
        return <SendMoney user={user} onBack={() => setCurrentPage('dashboard')} darkMode={darkMode} />;
      case 'receive':
        return <ReceiveMoney user={user} onBack={() => setCurrentPage('dashboard')} darkMode={darkMode} />;
      case 'profile':
        return <UserProfile user={user} onBack={() => setCurrentPage('dashboard')} darkMode={darkMode} />;
      case 'transactions':
        return <TransactionHistory user={user} onBack={() => setCurrentPage('dashboard')} darkMode={darkMode} />;
      case 'bank-linking':
        return <BankLinking user={user} onBack={() => setCurrentPage('dashboard')} darkMode={darkMode} />;
      case 'subscriptions':
        return <SubscriptionPlans user={user} onBack={() => setCurrentPage('dashboard')} darkMode={darkMode} />;
      case 'security':
        return <SecurityCenter user={user} onBack={() => setCurrentPage('dashboard')} darkMode={darkMode} />;
      case 'support':
        return <SupportCenter user={user} onBack={() => setCurrentPage('dashboard')} darkMode={darkMode} />;
      case 'admin':
        return user?.email?.includes('admin') ? (
          <AdminPanel user={user} onBack={() => setCurrentPage('dashboard')} darkMode={darkMode} />
        ) : (
          <Dashboard user={user} onNavigate={setCurrentPage} darkMode={darkMode} />
        );
      case 'compliance':
        return user?.email?.includes('admin') ? (
          <ComplianceDashboard user={user} onBack={() => setCurrentPage('dashboard')} darkMode={darkMode} />
        ) : (
          <Dashboard user={user} onNavigate={setCurrentPage} darkMode={darkMode} />
        );
      default:
        return <Dashboard user={user} onNavigate={setCurrentPage} darkMode={darkMode} />;
    }
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      <Navigation />
      
      {/* Main Content */}
      <main className="pt-16">
        {renderCurrentPage()}
      </main>

      {/* Footer */}
      <footer className={`mt-auto ${
        darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      } border-t`}>
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Company Info */}
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  darkMode ? 'bg-blue-600' : 'bg-gradient-to-r from-blue-600 to-purple-600'
                }`}>
                  <span className="text-white font-bold">$</span>
                </div>
                <span className={`font-bold text-lg ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  DalePay™
                </span>
              </div>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-4`}>
                Puerto Rico's premier digital wallet. FinCEN registered and Moov powered for secure, instant money transfers.
              </p>
              <div className="flex items-center space-x-2 text-xs">
                <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>🔒 FDIC Insured</span>
                <span className={darkMode ? 'text-gray-600' : 'text-gray-300'}>•</span>
                <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>🏛️ FinCEN Licensed</span>
              </div>
            </div>

            {/* Legal */}
            <div>
              <h4 className={`font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Legal & Compliance
              </h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className={`${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors`}>
                    Terms & Conditions
                  </a>
                </li>
                <li>
                  <a href="#" className={`${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors`}>
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className={`${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors`}>
                    AML Policy
                  </a>
                </li>
                <li>
                  <a href="#" className={`${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors`}>
                    FinCEN Registration
                  </a>
                </li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className={`font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Support
              </h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className={`${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors`}>
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className={`${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors`}>
                    Contact Us
                  </a>
                </li>
                <li>
                  <a href="#" className={`${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors`}>
                    Security Center
                  </a>
                </li>
                <li>
                  <a href="#" className={`${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors`}>
                    Report Fraud
                  </a>
                </li>
              </ul>
            </div>

            {/* Certifications */}
            <div>
              <h4 className={`font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Certifications
              </h4>
              <div className="space-y-3">
                <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                  <div className="text-xs font-medium text-blue-600 mb-1">FinCEN MSB</div>
                  <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Registered Money Services Business
                  </div>
                </div>
                <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                  <div className="text-xs font-medium text-green-600 mb-1">Moov Partner</div>
                  <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    FDIC-Insured Banking Services
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className={`mt-8 pt-8 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'} flex flex-col md:flex-row items-center justify-between`}>
            <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              © 2024 DalePay Financial Services. All rights reserved. • Made in Puerto Rico 🇵🇷
            </div>
            <div className="flex items-center space-x-6 mt-4 md:mt-0">
              <span className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                Powered by Moov Financial
              </span>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  All systems operational
                </span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
