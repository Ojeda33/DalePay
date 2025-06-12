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

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Configure axios defaults
axios.defaults.baseURL = API;

function App() {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState('dashboard');

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
  };

  const handleLogout = () => {
    localStorage.removeItem('dalepay_token');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
    setIsAuthenticated(false);
    setCurrentPage('dashboard');
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
    return (
      <Router>
        <Routes>
          <Route path="/terms" element={<TermsConditions />} />
          <Route 
            path="/*" 
            element={<LoginSystem onLogin={handleLogin} />} 
          />
        </Routes>
      </Router>
    );
  }

  const BottomNavigation = () => (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2">
      <div className="flex justify-around items-center max-w-md mx-auto">
        <button
          onClick={() => setCurrentPage('dashboard')}
          className={`flex flex-col items-center py-1 px-3 rounded-lg transition-colors ${
            currentPage === 'dashboard' 
              ? 'text-blue-600 bg-blue-50' 
              : 'text-gray-600'
          }`}
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"/>
          </svg>
          <span className="text-xs mt-1">Inicio</span>
        </button>
        
        <button
          onClick={() => setCurrentPage('send')}
          className={`flex flex-col items-center py-1 px-3 rounded-lg transition-colors ${
            currentPage === 'send' 
              ? 'text-blue-600 bg-blue-50' 
              : 'text-gray-600'
          }`}
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.293l-3-3a1 1 0 00-1.414-1.414L9 5.586 7.707 4.293a1 1 0 00-1.414 1.414L8.586 8H4a1 1 0 100 2h4.586l-2.293 2.293a1 1 0 101.414 1.414L9 12.414l.293.293a1 1 0 001.414-1.414L8.414 10H13a1 1 0 100-2H8.414l2.293-2.293z" clipRule="evenodd"/>
          </svg>
          <span className="text-xs mt-1">Enviar</span>
        </button>
        
        <button
          onClick={() => setCurrentPage('receive')}
          className={`flex flex-col items-center py-1 px-3 rounded-lg transition-colors ${
            currentPage === 'receive' 
              ? 'text-blue-600 bg-blue-50' 
              : 'text-gray-600'
          }`}
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd"/>
          </svg>
          <span className="text-xs mt-1">Recibir</span>
        </button>
        
        <button
          onClick={() => setCurrentPage('crypto')}
          className={`flex flex-col items-center py-1 px-3 rounded-lg transition-colors ${
            currentPage === 'crypto' 
              ? 'text-blue-600 bg-blue-50' 
              : 'text-gray-600'
          }`}
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path d="M8 6a2 2 0 114 0v.075c0 .522.194 1.025.546 1.41L14 8.989V9a2 2 0 11-4 0v-.075c0-.522-.194-1.025-.546-1.41L8 6.011V6zm2-2a4 4 0 100 8 4 4 0 000-8z"/>
          </svg>
          <span className="text-xs mt-1">Crypto</span>
        </button>
        
        <button
          onClick={() => setCurrentPage('settings')}
          className={`flex flex-col items-center py-1 px-3 rounded-lg transition-colors ${
            currentPage === 'settings' 
              ? 'text-blue-600 bg-blue-50' 
              : 'text-gray-600'
          }`}
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd"/>
          </svg>
          <span className="text-xs mt-1">Config</span>
        </button>
      </div>
    </div>
  );

  const renderCurrentPage = () => {
    switch(currentPage) {
      case 'home':
        return <Homepage onNavigate={setCurrentPage} />;
      case 'dashboard':
        return <Dashboard user={user} onNavigate={setCurrentPage} />;
      case 'send':
        return <SendMoney user={user} onBack={() => setCurrentPage('dashboard')} />;
      case 'receive':
        return <ReceiveMoney user={user} onBack={() => setCurrentPage('dashboard')} />;
      case 'crypto':
        return <CryptoWallet user={user} onBack={() => setCurrentPage('dashboard')} />;
      case 'cards':
        return <CardProcessor user={user} onBack={() => setCurrentPage('dashboard')} />;
      case 'business':
        return <BusinessPortal user={user} onBack={() => setCurrentPage('dashboard')} />;
      case 'admin':
        return <AdminDashboard user={user} onBack={() => setCurrentPage('dashboard')} />;
      case 'settings':
        return <UserSettings user={user} onLogout={handleLogout} onBack={() => setCurrentPage('dashboard')} />;
      case 'terms':
        return <TermsConditions onBack={() => setCurrentPage('settings')} />;
      default:
        return <Dashboard user={user} onNavigate={setCurrentPage} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Header */}
      <header className="bg-gradient-to-r from-blue-600 via-purple-600 to-red-600 text-white p-4 shadow-lg">
        <div className="flex items-center justify-between max-w-md mx-auto">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
              <span className="text-blue-600 font-bold text-sm">D</span>
            </div>
            <h1 className="text-xl font-bold">DalePay™</h1>
          </div>
          <div className="text-right">
            <p className="text-sm opacity-90">¡Hola, {user?.full_name?.split(' ')[0]}!</p>
            <p className="text-xs opacity-75">Puerto Rico Digital Wallet</p>
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
