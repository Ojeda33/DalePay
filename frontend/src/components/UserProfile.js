import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UserProfile = ({ user, onBack, darkMode }) => {
  const [profile, setProfile] = useState(user);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeTab, setActiveTab] = useState('profile');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await axios.get('/user/profile');
      setProfile(response.data);
    } catch (error) {
      setError('Failed to load profile');
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getKYCStatusInfo = (status) => {
    switch (status) {
      case 'approved':
        return {
          color: 'text-green-600',
          bgColor: 'bg-green-100 dark:bg-green-900',
          icon: '✅',
          message: 'Your identity is verified'
        };
      case 'pending':
        return {
          color: 'text-yellow-600',
          bgColor: 'bg-yellow-100 dark:bg-yellow-900',
          icon: '⏳',
          message: 'Verification in progress'
        };
      case 'rejected':
        return {
          color: 'text-red-600',
          bgColor: 'bg-red-100 dark:bg-red-900',
          icon: '❌',
          message: 'Please contact support'
        };
      default:
        return {
          color: 'text-gray-600',
          bgColor: 'bg-gray-100 dark:bg-gray-700',
          icon: '📋',
          message: 'Verification required'
        };
    }
  };

  const kycInfo = getKYCStatusInfo(profile?.kyc_status);

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'} py-8`}>
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-6">
          <button
            onClick={onBack}
            className={`flex items-center space-x-2 ${
              darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'
            } transition-colors`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span>Back to Dashboard</span>
          </button>
        </div>

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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <div className={`${
              darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            } rounded-2xl border shadow-lg p-6`}>
              <div className="text-center">
                <div className="w-24 h-24 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold text-2xl">
                    {profile?.full_name?.charAt(0) || 'U'}
                  </span>
                </div>
                
                <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-1`}>
                  {profile?.full_name}
                </h2>
                
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-4`}>
                  {profile?.email}
                </p>

                {/* KYC Status */}
                <div className={`inline-flex items-center px-3 py-2 rounded-full text-sm font-medium ${kycInfo.bgColor} ${kycInfo.color} mb-4`}>
                  <span className="mr-2">{kycInfo.icon}</span>
                  {kycInfo.message}
                </div>

                {/* Account Stats */}
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="text-center">
                    <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {formatCurrency(profile?.wallet_balance || 0)}
                    </p>
                    <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Wallet Balance
                    </p>
                  </div>
                  <div className="text-center">
                    <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {profile?.subscription_plan || 'Basic'}
                    </p>
                    <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Plan
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className={`${
              darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            } rounded-2xl border shadow-lg p-6 mt-6`}>
              <h3 className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4`}>
                Quick Actions
              </h3>
              <div className="space-y-3">
                <button className={`w-full text-left p-3 rounded-lg ${
                  darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
                } transition-colors`}>
                  <div className="flex items-center space-x-3">
                    <span className="text-lg">🔒</span>
                    <span className={`${darkMode ? 'text-white' : 'text-gray-900'} font-medium`}>
                      Security Settings
                    </span>
                  </div>
                </button>
                
                <button className={`w-full text-left p-3 rounded-lg ${
                  darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
                } transition-colors`}>
                  <div className="flex items-center space-x-3">
                    <span className="text-lg">📱</span>
                    <span className={`${darkMode ? 'text-white' : 'text-gray-900'} font-medium`}>
                      Two-Factor Auth
                    </span>
                  </div>
                </button>
                
                <button className={`w-full text-left p-3 rounded-lg ${
                  darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
                } transition-colors`}>
                  <div className="flex items-center space-x-3">
                    <span className="text-lg">💳</span>
                    <span className={`${darkMode ? 'text-white' : 'text-gray-900'} font-medium`}>
                      Payment Methods
                    </span>
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className={`${
              darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            } rounded-2xl border shadow-lg overflow-hidden`}>
              {/* Tab Navigation */}
              <div className={`border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <nav className="flex">
                  {['profile', 'limits', 'preferences'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`flex-1 py-4 px-6 text-sm font-medium capitalize transition-colors ${
                        activeTab === tab
                          ? 'border-b-2 border-blue-500 text-blue-600'
                          : darkMode
                            ? 'text-gray-400 hover:text-gray-300'
                            : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </nav>
              </div>

              <div className="p-6">
                {/* Profile Tab */}
                {activeTab === 'profile' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4`}>
                        Personal Information
                      </h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                            Full Name
                          </label>
                          <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                            <span className={`${darkMode ? 'text-white' : 'text-gray-900'}`}>
                              {profile?.full_name}
                            </span>
                          </div>
                        </div>

                        <div>
                          <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                            Email Address
                          </label>
                          <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                            <span className={`${darkMode ? 'text-white' : 'text-gray-900'}`}>
                              {profile?.email}
                            </span>
                          </div>
                        </div>

                        <div>
                          <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                            Phone Number
                          </label>
                          <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                            <span className={`${darkMode ? 'text-white' : 'text-gray-900'}`}>
                              {profile?.phone || 'Not provided'}
                            </span>
                          </div>
                        </div>

                        <div>
                          <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                            Account Created
                          </label>
                          <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                            <span className={`${darkMode ? 'text-white' : 'text-gray-900'}`}>
                              {profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : 'N/A'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4`}>
                        Verification Status
                      </h3>
                      
                      <div className={`p-4 rounded-lg ${kycInfo.bgColor} border ${
                        profile?.kyc_status === 'approved' ? 'border-green-200' : 
                        profile?.kyc_status === 'pending' ? 'border-yellow-200' : 'border-red-200'
                      }`}>
                        <div className="flex items-center space-x-3">
                          <span className="text-2xl">{kycInfo.icon}</span>
                          <div>
                            <h4 className={`font-medium ${kycInfo.color} capitalize`}>
                              {profile?.kyc_status} Verification
                            </h4>
                            <p className={`text-sm ${kycInfo.color}`}>
                              {kycInfo.message}
                            </p>
                          </div>
                        </div>
                        
                        {profile?.kyc_status !== 'approved' && (
                          <div className="mt-3">
                            <button className={`text-sm font-medium ${kycInfo.color} hover:underline`}>
                              Complete Verification →
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Limits Tab */}
                {activeTab === 'limits' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4`}>
                        Account Limits
                      </h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                          <div className="flex items-center justify-between mb-2">
                            <h4 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                              Daily Limit
                            </h4>
                            <span className="text-2xl">📅</span>
                          </div>
                          <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            {formatCurrency(profile?.daily_limit || 0)}
                          </p>
                          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            Per day transfer limit
                          </p>
                        </div>

                        <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                          <div className="flex items-center justify-between mb-2">
                            <h4 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                              Monthly Limit
                            </h4>
                            <span className="text-2xl">📊</span>
                          </div>
                          <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            {formatCurrency(profile?.monthly_limit || 0)}
                          </p>
                          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            Per month transfer limit
                          </p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'} mb-3`}>
                        Increase Your Limits
                      </h4>
                      <div className={`p-4 rounded-lg ${darkMode ? 'bg-blue-900/20 border-blue-700' : 'bg-blue-50 border-blue-200'} border`}>
                        <p className={`text-sm ${darkMode ? 'text-blue-300' : 'text-blue-700'} mb-3`}>
                          Upgrade to Premium for higher limits and exclusive features:
                        </p>
                        <ul className={`text-sm space-y-1 ${darkMode ? 'text-blue-300' : 'text-blue-700'} mb-4`}>
                          <li>• Daily limit: {formatCurrency(25000)}</li>
                          <li>• Monthly limit: {formatCurrency(100000)}</li>
                          <li>• Priority customer support</li>
                          <li>• Advanced analytics</li>
                        </ul>
                        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                          Upgrade to Premium
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Preferences Tab */}
                {activeTab === 'preferences' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4`}>
                        Notification Preferences
                      </h3>
                      
                      <div className="space-y-4">
                        {[
                          { id: 'email_notifications', label: 'Email Notifications', description: 'Receive transaction alerts via email' },
                          { id: 'sms_notifications', label: 'SMS Notifications', description: 'Receive transaction alerts via SMS' },
                          { id: 'push_notifications', label: 'Push Notifications', description: 'Receive alerts in the app' },
                          { id: 'security_alerts', label: 'Security Alerts', description: 'Important security notifications' },
                        ].map((pref) => (
                          <div key={pref.id} className="flex items-center justify-between">
                            <div>
                              <h4 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                {pref.label}
                              </h4>
                              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                {pref.description}
                              </p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input type="checkbox" defaultChecked className="sr-only peer" />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4`}>
                        Privacy Settings
                      </h3>
                      
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                              Profile Visibility
                            </h4>
                            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                              Allow others to find you by email or phone
                            </p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" defaultChecked className="sr-only peer" />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                          </label>
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                              Transaction History
                            </h4>
                            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                              Show recent transactions to trusted contacts
                            </p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* FinCEN Notice */}
        <div className="text-center py-6">
          <div className="flex items-center justify-center space-x-2 text-gray-500 mb-2">
            <span className="text-lg">🛡️</span>
            <span className="text-sm font-medium">Protected by FinCEN regulations</span>
          </div>
          <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            DalePay™ • Licensed Money Services Business • Your data is encrypted and secure
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
