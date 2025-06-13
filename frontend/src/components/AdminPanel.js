import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminPanel = ({ user, onBack, darkMode }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Dashboard data
  const [dashboardData, setDashboardData] = useState(null);
  const [users, setUsers] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [aiScans, setAiScans] = useState([]);
  const [complianceLogs, setComplianceLogs] = useState([]);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Filters
  const [userFilter, setUserFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    if (activeTab === 'dashboard') {
      fetchDashboardData();
    } else if (activeTab === 'users') {
      fetchUsers();
    } else if (activeTab === 'transactions') {
      fetchTransactions();
    } else if (activeTab === 'alerts') {
      fetchAlerts();
    } else if (activeTab === 'ai-monitoring') {
      fetchAIScans();
    } else if (activeTab === 'compliance') {
      fetchComplianceLogs();
    }
  }, [activeTab, currentPage, userFilter, statusFilter]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/admin/dashboard');
      setDashboardData(response.data);
    } catch (error) {
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage,
        limit: 20
      });
      
      if (statusFilter) params.append('status', statusFilter);
      if (userFilter) params.append('kyc_status', userFilter);

      const response = await axios.get(`/admin/users?${params}`);
      setUsers(response.data.users || []);
      setTotalPages(response.data.pages || 1);
    } catch (error) {
      setError('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage,
        limit: 50
      });
      
      if (statusFilter) params.append('status', statusFilter);

      const response = await axios.get(`/admin/transactions?${params}`);
      setTransactions(response.data.transactions || []);
      setTotalPages(response.data.pages || 1);
    } catch (error) {
      setError('Failed to load transactions');
    } finally {
      setLoading(false);
    }
  };

  const fetchAlerts = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/admin/alerts?status=open&limit=50');
      setAlerts(response.data.alerts || []);
    } catch (error) {
      setError('Failed to load alerts');
    } finally {
      setLoading(false);
    }
  };

  const fetchAIScans = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/admin/ai-scans?limit=20');
      setAiScans(response.data.scans || []);
    } catch (error) {
      setError('Failed to load AI scans');
    } finally {
      setLoading(false);
    }
  };

  const fetchComplianceLogs = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage,
        limit: 50
      });

      const response = await axios.get(`/admin/compliance-logs?${params}`);
      setComplianceLogs(response.data.logs || []);
      setTotalPages(response.data.pages || 1);
    } catch (error) {
      setError('Failed to load compliance logs');
    } finally {
      setLoading(false);
    }
  };

  const freezeUser = async (userId) => {
    const reason = prompt('Enter reason for freezing this account:');
    if (!reason) return;

    try {
      await axios.post(`/admin/users/${userId}/freeze`, { reason });
      setSuccess('User account frozen successfully');
      fetchUsers();
    } catch (error) {
      setError('Failed to freeze user account');
    }
  };

  const unfreezeUser = async (userId) => {
    if (!confirm('Are you sure you want to unfreeze this account?')) return;

    try {
      await axios.post(`/admin/users/${userId}/unfreeze`);
      setSuccess('User account unfrozen successfully');
      fetchUsers();
    } catch (error) {
      setError('Failed to unfreeze user account');
    }
  };

  const triggerAIScan = async () => {
    setLoading(true);
    try {
      const response = await axios.post('/admin/ai-scan/trigger');
      setSuccess('AI system scan completed successfully');
      fetchAIScans();
    } catch (error) {
      setError('Failed to trigger AI scan');
    } finally {
      setLoading(false);
    }
  };

  const triggerFraudScan = async () => {
    setLoading(true);
    try {
      const response = await axios.post('/admin/fraud-scan');
      setSuccess('Fraud detection scan completed');
      fetchAlerts();
    } catch (error) {
      setError('Failed to trigger fraud scan');
    } finally {
      setLoading(false);
    }
  };

  const resolveAlert = async (alertId) => {
    const resolution = prompt('Enter resolution notes:');
    if (!resolution) return;

    try {
      await axios.post(`/admin/alerts/${alertId}/resolve`, { resolution });
      setSuccess('Alert resolved successfully');
      fetchAlerts();
    } catch (error) {
      setError('Failed to resolve alert');
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const getStatusBadge = (status) => {
    const colors = {
      active: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      frozen: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
      pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
      approved: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      rejected: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
      completed: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      failed: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
      open: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
      resolved: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
    };

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
        colors[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
      }`}>
        {status}
      </span>
    );
  };

  const tabs = [
    { id: 'dashboard', name: 'Dashboard', icon: '📊' },
    { id: 'users', name: 'Users', icon: '👥' },
    { id: 'transactions', name: 'Transactions', icon: '💸' },
    { id: 'alerts', name: 'Alerts', icon: '🚨' },
    { id: 'ai-monitoring', name: 'AI Monitoring', icon: '🤖' },
    { id: 'compliance', name: 'Compliance', icon: '📋' },
    { id: 'settings', name: 'Settings', icon: '⚙️' }
  ];

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Header */}
      <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b shadow-sm`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={onBack}
                className={`flex items-center space-x-2 ${
                  darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                } transition-colors`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span>Back</span>
              </button>
              
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-red-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">🛡️</span>
                </div>
                <div>
                  <h1 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    Admin Control Center
                  </h1>
                  <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    DalePay Financial Services Management
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  All Systems Operational
                </span>
              </div>
              
              <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                darkMode ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-800'
              }`}>
                Admin: {user?.email}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Messages */}
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg text-sm">
            {success}
          </div>
        )}

        {/* Tab Navigation */}
        <div className="mb-8">
          <div className={`border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <nav className="-mb-px flex space-x-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setCurrentPage(1);
                    setError('');
                    setSuccess('');
                  }}
                  className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : darkMode
                        ? 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && dashboardData && (
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <span className="text-2xl">👥</span>
                  </div>
                  <div className="ml-4">
                    <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Total Users</p>
                    <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {dashboardData.statistics.total_users.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <span className="text-2xl">💸</span>
                  </div>
                  <div className="ml-4">
                    <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Daily Volume</p>
                    <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {formatCurrency(dashboardData.statistics.daily_volume)}
                    </p>
                  </div>
                </div>
              </div>

              <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <div className="flex items-center">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <span className="text-2xl">💰</span>
                  </div>
                  <div className="ml-4">
                    <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Daily Revenue</p>
                    <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {formatCurrency(dashboardData.statistics.daily_revenue)}
                    </p>
                  </div>
                </div>
              </div>

              <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <div className="flex items-center">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <span className="text-2xl">⚠️</span>
                  </div>
                  <div className="ml-4">
                    <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Pending KYC</p>
                    <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {dashboardData.statistics.pending_kyc}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* System Health */}
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <h3 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4`}>
                System Health
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className={`w-3 h-3 rounded-full mx-auto mb-2 ${
                    dashboardData.system_health.status === 'healthy' ? 'bg-green-500' : 'bg-red-500'
                  }`}></div>
                  <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    System Status
                  </p>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} capitalize`}>
                    {dashboardData.system_health.status}
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mx-auto mb-2"></div>
                  <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    FinCEN Status
                  </p>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Registered
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mx-auto mb-2"></div>
                  <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    Moov API
                  </p>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Connected
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <h3 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4`}>
                Quick Actions
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                  onClick={triggerAIScan}
                  disabled={loading}
                  className="bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
                >
                  🤖 Trigger AI Scan
                </button>
                
                <button
                  onClick={triggerFraudScan}
                  disabled={loading}
                  className="bg-red-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-red-700 disabled:opacity-50 transition-colors"
                >
                  🔍 Fraud Detection
                </button>
                
                <button
                  onClick={() => setActiveTab('compliance')}
                  className="bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors"
                >
                  📋 View Compliance
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="space-y-6">
            {/* Filters */}
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                    Account Status
                  </label>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  >
                    <option value="">All Statuses</option>
                    <option value="active">Active</option>
                    <option value="frozen">Frozen</option>
                    <option value="suspended">Suspended</option>
                  </select>
                </div>

                <div>
                  <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                    KYC Status
                  </label>
                  <select
                    value={userFilter}
                    onChange={(e) => setUserFilter(e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  >
                    <option value="">All KYC Statuses</option>
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>

                <div className="flex items-end">
                  <button
                    onClick={() => {
                      setStatusFilter('');
                      setUserFilter('');
                      setCurrentPage(1);
                    }}
                    className={`px-4 py-2 border rounded-md ${
                      darkMode 
                        ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                        : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    Clear Filters
                  </button>
                </div>
              </div>
            </div>

            {/* Users Table */}
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} shadow border ${darkMode ? 'border-gray-700' : 'border-gray-200'} rounded-lg overflow-hidden`}>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className={darkMode ? 'bg-gray-700' : 'bg-gray-50'}>
                    <tr>
                      <th className={`px-6 py-3 text-left text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                        User
                      </th>
                      <th className={`px-6 py-3 text-left text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                        Status
                      </th>
                      <th className={`px-6 py-3 text-left text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                        KYC
                      </th>
                      <th className={`px-6 py-3 text-left text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                        Balance
                      </th>
                      <th className={`px-6 py-3 text-left text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                        Created
                      </th>
                      <th className={`px-6 py-3 text-left text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className={`${darkMode ? 'bg-gray-800' : 'bg-white'} divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
                    {users.map((user) => (
                      <tr key={user.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                              {user.full_name}
                            </div>
                            <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                              {user.email}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(user.account_status)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(user.kyc_status)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className={`text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            {formatCurrency(user.wallet_balance || 0)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            {formatDateTime(user.created_at)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            {user.account_status === 'active' ? (
                              <button
                                onClick={() => freezeUser(user.id)}
                                className="text-red-600 hover:text-red-900"
                              >
                                Freeze
                              </button>
                            ) : (
                              <button
                                onClick={() => unfreezeUser(user.id)}
                                className="text-green-600 hover:text-green-900"
                              >
                                Unfreeze
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className={`px-4 py-2 border rounded-md ${
                    darkMode 
                      ? 'border-gray-600 text-gray-300 hover:bg-gray-700 disabled:opacity-50' 
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50'
                  }`}
                >
                  Previous
                </button>
                
                <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Page {currentPage} of {totalPages}
                </span>

                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className={`px-4 py-2 border rounded-md ${
                    darkMode 
                      ? 'border-gray-600 text-gray-300 hover:bg-gray-700 disabled:opacity-50' 
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50'
                  }`}
                >
                  Next
                </button>
              </div>
            )}
          </div>
        )}

        {/* Alerts Tab */}
        {activeTab === 'alerts' && (
          <div className="space-y-6">
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} shadow border ${darkMode ? 'border-gray-700' : 'border-gray-200'} rounded-lg overflow-hidden`}>
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className={`text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Open Alerts ({alerts.length})
                </h3>
              </div>
              
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {alerts.length > 0 ? alerts.map((alert) => (
                  <div key={alert.id} className="px-6 py-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            alert.severity === 'high' 
                              ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                              : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                          }`}>
                            {alert.severity}
                          </span>
                          <span className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            {alert.type}
                          </span>
                        </div>
                        <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          {alert.description}
                        </p>
                        <p className={`text-xs mt-1 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                          {formatDateTime(alert.created_at)}
                        </p>
                      </div>
                      
                      <button
                        onClick={() => resolveAlert(alert.id)}
                        className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                      >
                        Resolve
                      </button>
                    </div>
                  </div>
                )) : (
                  <div className="px-6 py-8 text-center">
                    <span className="text-4xl mb-4 block">✅</span>
                    <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      No open alerts. All systems running smoothly.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className={`ml-3 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Loading...</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
