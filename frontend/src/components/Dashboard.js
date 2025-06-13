import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SendMoney from './SendMoney';
import ReceiveMoney from './ReceiveMoney';
import TransactionHistory from './TransactionHistory';
import BankLinking from './BankLinking';
import DigitalWallet from './DigitalWallet';
import { useTranslation } from '../hooks/useLanguage';

const Dashboard = ({ user, onNavigate, darkMode, onToggleDarkMode }) => {
  const [activeView, setActiveView] = useState('dashboard');
  const [balance, setBalance] = useState(0);
  const [realBalance, setRealBalance] = useState(0);
  const [balanceSource, setBalanceSource] = useState('demo');
  const [linkedAccounts, setLinkedAccounts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [bankAccounts, setBankAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();
  const [accountLimits, setAccountLimits] = useState({
    daily_remaining: 0,
    monthly_remaining: 0
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch real wallet balance from production API
      const profileResponse = await axios.get('/user/profile');
      setBalance(profileResponse.data.wallet_balance || 0);
      
      // Calculate remaining limits
      setAccountLimits({
        daily_remaining: profileResponse.data.daily_limit || 0,
        monthly_remaining: profileResponse.data.monthly_limit || 0
      });

      // Fetch recent transactions
      const transactionsResponse = await axios.get('/transactions?limit=5');
      setTransactions(transactionsResponse.data || []);

      // Fetch linked bank accounts
      const bankResponse = await axios.get('/bank-accounts');
      setBankAccounts(bankResponse.data || []);

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getKYCStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return darkMode ? 'bg-green-900 text-green-300' : 'bg-green-100 text-green-800';
      case 'pending':
        return darkMode ? 'bg-yellow-900 text-yellow-300' : 'bg-yellow-100 text-yellow-800';
      case 'rejected':
        return darkMode ? 'bg-red-900 text-red-300' : 'bg-red-100 text-red-800';
      default:
        return darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-800';
    }
  };

  const quickActions = [
    {
      title: 'Real Banking',
      subtitle: 'Connect real accounts',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
        </svg>
      ),
      color: 'from-emerald-500 to-emerald-600',
      onClick: () => setActiveView('real-banking')
    },
    {
      title: 'Send Money',
      subtitle: 'To anyone instantly',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
        </svg>
      ),
      color: 'from-blue-500 to-blue-600',
      onClick: () => onNavigate('send')
    },
    {
      title: 'Receive Money',
      subtitle: 'Generate QR code',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
        </svg>
      ),
      color: 'from-green-500 to-green-600',
      onClick: () => onNavigate('receive')
    },
    {
      title: 'Link Bank',
      subtitle: 'Add bank account',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
        </svg>
      ),
      color: 'from-purple-500 to-purple-600',
      onClick: () => onNavigate('bank-linking')
    },
    {
      title: 'Transaction History',
      subtitle: 'View all activity',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
        </svg>
      ),
      color: 'from-orange-500 to-orange-600',
      onClick: () => onNavigate('transactions')
    }
  ];

  if (loading) {
    return (
      <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'} flex items-center justify-center`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'} py-8`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
            Welcome back, {user?.full_name?.split(' ')[0]}! 👋
          </h1>
          <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Here's your financial overview for today
          </p>
        </div>

        {/* Account Status Alert */}
        {user?.kyc_status !== 'approved' && (
          <div className={`mb-6 p-4 rounded-lg border-l-4 ${
            user?.kyc_status === 'pending' 
              ? 'border-yellow-400 bg-yellow-50 dark:bg-yellow-900/20' 
              : 'border-red-400 bg-red-50 dark:bg-red-900/20'
          }`}>
            <div className="flex items-center">
              <svg className={`w-5 h-5 mr-3 ${
                user?.kyc_status === 'pending' ? 'text-yellow-600' : 'text-red-600'
              }`} fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
              </svg>
              <div>
                <h3 className={`font-medium ${
                  user?.kyc_status === 'pending' ? 'text-yellow-800 dark:text-yellow-200' : 'text-red-800 dark:text-red-200'
                }`}>
                  {user?.kyc_status === 'pending' ? 'Verification In Progress' : 'Account Verification Required'}
                </h3>
                <p className={`text-sm ${
                  user?.kyc_status === 'pending' ? 'text-yellow-700 dark:text-yellow-300' : 'text-red-700 dark:text-red-300'
                }`}>
                  {user?.kyc_status === 'pending' 
                    ? 'Your identity verification is being processed. This usually takes 1-2 business days.'
                    : 'Please complete your identity verification to access all features.'
                  }
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Balance Card */}
            <div className={`${
              darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            } rounded-2xl border shadow-lg overflow-hidden`}>
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-blue-100 text-sm font-medium">Available Balance</p>
                    <h2 className="text-4xl font-bold">{formatCurrency(balance)}</h2>
                  </div>
                  <div className="text-right">
                    <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getKYCStatusColor(user?.kyc_status)}`}>
                      {user?.kyc_status === 'approved' ? '✓ Verified' : user?.kyc_status === 'pending' ? '⏳ Pending' : '❌ Unverified'}
                    </div>
                    <p className="text-blue-100 text-sm mt-2">
                      {user?.subscription_plan || 'Basic'} Account
                    </p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-blue-400">
                  <div>
                    <p className="text-blue-100 text-xs">Daily Limit Remaining</p>
                    <p className="text-white font-semibold">{formatCurrency(accountLimits.daily_remaining)}</p>
                  </div>
                  <div>
                    <p className="text-blue-100 text-xs">Monthly Limit Remaining</p>
                    <p className="text-white font-semibold">{formatCurrency(accountLimits.monthly_remaining)}</p>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => onNavigate('send')}
                    className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-4 rounded-xl font-medium hover:from-blue-700 hover:to-blue-800 transition-all transform hover:scale-105"
                  >
                    💸 Send Money
                  </button>
                  <button
                    onClick={() => onNavigate('bank-linking')}
                    className={`${
                      darkMode ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                    } py-3 px-4 rounded-xl font-medium transition-all transform hover:scale-105`}
                  >
                    🏦 Add Money
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className={`${
              darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            } rounded-2xl border shadow-lg p-6`}>
              <h3 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4`}>
                Quick Actions
              </h3>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {quickActions.map((action, index) => (
                  <button
                    key={index}
                    onClick={action.onClick}
                    className={`bg-gradient-to-r ${action.color} p-4 rounded-xl text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 text-left`}
                  >
                    <div className="mb-3">{action.icon}</div>
                    <h4 className="font-bold text-sm">{action.title}</h4>
                    <p className="text-xs opacity-90">{action.subtitle}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Recent Transactions */}
            <div className={`${
              darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            } rounded-2xl border shadow-lg p-6`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Recent Activity
                </h3>
                <button
                  onClick={() => onNavigate('transactions')}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  View All
                </button>
              </div>

              {transactions.length > 0 ? (
                <div className="space-y-3">
                  {transactions.map((transaction, index) => (
                    <div key={index} className={`flex items-center justify-between p-3 rounded-lg ${
                      darkMode ? 'bg-gray-700' : 'bg-gray-50'
                    }`}>
                      <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          transaction.type === 'send' 
                            ? 'bg-red-100 text-red-600' 
                            : 'bg-green-100 text-green-600'
                        }`}>
                          {transaction.type === 'send' ? '↗️' : '↙️'}
                        </div>
                        <div>
                          <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'} text-sm`}>
                            {transaction.description || (transaction.type === 'send' ? 'Money Sent' : 'Money Received')}
                          </p>
                          <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            {new Date(transaction.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-bold text-sm ${
                          transaction.type === 'send' 
                            ? 'text-red-600' 
                            : 'text-green-600'
                        }`}>
                          {transaction.type === 'send' ? '-' : '+'}
                          {formatCurrency(transaction.amount)}
                        </p>
                        <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'} capitalize`}>
                          {transaction.status}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="text-4xl mb-3">💰</div>
                  <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-4`}>
                    No transactions yet
                  </p>
                  <button
                    onClick={() => onNavigate('send')}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                  >
                    Send Your First Payment
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Account Security */}
            <div className={`${
              darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            } rounded-2xl border shadow-lg p-6`}>
              <h3 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4`}>
                Account Security
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    Two-Factor Auth
                  </span>
                  <span className="text-green-600 text-sm font-medium">✓ Enabled</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    Device Verification
                  </span>
                  <span className="text-green-600 text-sm font-medium">✓ Active</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    Fraud Protection
                  </span>
                  <span className="text-green-600 text-sm font-medium">✓ Monitoring</span>
                </div>
              </div>
              <button
                onClick={() => onNavigate('security')}
                className={`w-full mt-4 ${
                  darkMode ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                } py-2 px-4 rounded-lg text-sm font-medium transition-colors`}
              >
                Security Settings
              </button>
            </div>

            {/* Connected Banks */}
            <div className={`${
              darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            } rounded-2xl border shadow-lg p-6`}>
              <h3 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4`}>
                Connected Banks
              </h3>
              {bankAccounts.length > 0 ? (
                <div className="space-y-3">
                  {bankAccounts.map((account, index) => (
                    <div key={index} className={`flex items-center space-x-3 p-3 rounded-lg ${
                      darkMode ? 'bg-gray-700' : 'bg-gray-50'
                    }`}>
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <span className="text-blue-600 font-bold text-sm">🏦</span>
                      </div>
                      <div>
                        <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'} text-sm`}>
                          {account.bank_name}
                        </p>
                        <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          •••• {account.account_number_last_4}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-3`}>
                    No banks connected
                  </p>
                  <button
                    onClick={() => onNavigate('bank-linking')}
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    Link Bank Account
                  </button>
                </div>
              )}
            </div>

            {/* Subscription Plan */}
            <div className={`${
              darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            } rounded-2xl border shadow-lg p-6`}>
              <h3 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4`}>
                Your Plan
              </h3>
              <div className="text-center">
                <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium mb-3 ${
                  user?.subscription_plan === 'premium' 
                    ? 'bg-yellow-100 text-yellow-800' 
                    : 'bg-blue-100 text-blue-800'
                }`}>
                  {user?.subscription_plan === 'premium' ? '👑 Premium' : '🏷️ Basic'}
                </div>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-4`}>
                  {user?.subscription_plan === 'premium' 
                    ? 'Higher limits, priority support, and exclusive features'
                    : 'Essential features for everyday banking'
                  }
                </p>
                {user?.subscription_plan !== 'premium' && (
                  <button
                    onClick={() => onNavigate('subscriptions')}
                    className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:from-yellow-600 hover:to-orange-600 transition-all"
                  >
                    Upgrade to Premium
                  </button>
                )}
              </div>
            </div>

            {/* Support */}
            <div className={`${
              darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            } rounded-2xl border shadow-lg p-6`}>
              <h3 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4`}>
                Need Help?
              </h3>
              <div className="space-y-3">
                <button
                  onClick={() => onNavigate('support')}
                  className={`w-full flex items-center space-x-3 p-3 rounded-lg ${
                    darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
                  } transition-colors`}
                >
                  <span className="text-lg">💬</span>
                  <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    Contact Support
                  </span>
                </button>
                <button className={`w-full flex items-center space-x-3 p-3 rounded-lg ${
                  darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
                } transition-colors`}>
                  <span className="text-lg">📚</span>
                  <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    Help Center
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Puerto Rican Footer */}
        <div className="text-center py-8">
          <div className="flex items-center justify-center space-x-2 text-gray-500 mb-2">
            <span className="text-2xl">🇵🇷</span>
            <span className="text-sm font-medium">Proudly serving Puerto Rico</span>
          </div>
          <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            DalePay™ • FinCEN Licensed MSB • FDIC Insured • Powered by Moov Financial
          </p>
        </div>
      </div>
      
      {/* Real Banking Modal/View */}
      {activeView === 'real-banking' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            <div className={`${darkMode ? 'bg-gray-900' : 'bg-white'} rounded-2xl shadow-2xl`}>
              <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  🏦 Real Banking Integration
                </h2>
                <button
                  onClick={() => setActiveView('dashboard')}
                  className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="p-0">
                <RealBanking 
                  user={user}
                  token={localStorage.getItem('token')}
                  darkMode={darkMode}
                  onAccountLinked={(accounts) => {
                    setLinkedAccounts(accounts);
                    // Refresh dashboard data after linking accounts
                    fetchDashboardData();
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
