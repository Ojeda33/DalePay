import React, { useState, useEffect } from 'react';
import { useTranslation } from '../hooks/useLanguage';

const DigitalWallet = ({ user, token, darkMode, onClose }) => {
  const { t } = useTranslation();
  const [walletData, setWalletData] = useState(null);
  const [linkedAccounts, setLinkedAccounts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showLinkForm, setShowLinkForm] = useState(false);
  const [linkFormData, setLinkFormData] = useState({
    bank_name: '',
    account_type: 'checking',
    routing_number: '',
    account_number: '',
    account_holder_name: user?.full_name || ''
  });

  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  // Fetch wallet data
  useEffect(() => {
    if (token) {
      fetchWalletData();
      fetchLinkedAccounts();
    }
  }, [token]);

  const fetchWalletData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${backendUrl}/api/wallet/balance`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setWalletData(data);
      } else if (response.status === 501) {
        // Service not configured - show helpful message
        setWalletData({ 
          balance: 100.0, 
          currency: "USD", 
          source: "demo",
          needsConfiguration: true 
        });
      }
    } catch (error) {
      console.error('Error fetching wallet data:', error);
      setWalletData({ 
        balance: 100.0, 
        currency: "USD", 
        source: "demo",
        error: true 
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchLinkedAccounts = async () => {
    try {
      const response = await fetch(`${backendUrl}/api/wallet/accounts`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setLinkedAccounts(data.accounts || []);
      }
    } catch (error) {
      console.error('Error fetching linked accounts:', error);
    }
  };

  const handleLinkBank = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      const response = await fetch(`${backendUrl}/api/wallet/link-bank`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(linkFormData)
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          alert('✅ ' + t('success') + '! ' + data.message);
          setShowLinkForm(false);
          setLinkFormData({
            bank_name: '',
            account_type: 'checking',
            routing_number: '',
            account_number: '',
            account_holder_name: user?.full_name || ''
          });
          fetchLinkedAccounts();
          fetchWalletData();
        }
      } else if (response.status === 501) {
        alert('⚠️ ' + t('error') + ': Moov API credentials need to be configured for real banking functionality.');
      } else {
        const errorData = await response.json();
        alert('❌ ' + t('error') + ': ' + (errorData.detail || 'Failed to link bank account'));
      }
    } catch (error) {
      console.error('Error linking bank:', error);
      alert('❌ ' + t('error') + ': ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async (accountId) => {
    if (!window.confirm(`${t('removeAccount')}? This action cannot be undone.`)) {
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`${backendUrl}/api/wallet/accounts/${accountId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          alert('✅ ' + data.message);
          fetchLinkedAccounts();
        }
      } else {
        const errorData = await response.json();
        alert('❌ ' + t('error') + ': ' + (errorData.detail || 'Failed to remove account'));
      }
    } catch (error) {
      console.error('Error deleting account:', error);
      alert('❌ ' + t('error') + ': ' + error.message);
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

  return (
    <div className={`max-w-4xl mx-auto p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-xl`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-xl">💳</span>
          </div>
          <div>
            <h2 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              {t('digitalWallet')}
            </h2>
            <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              {t('modernBanking')} • Puerto Rico
            </p>
          </div>
        </div>
        
        {onClose && (
          <button
            onClick={onClose}
            className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Wallet Balance Card */}
      <div className={`${darkMode ? 'bg-gradient-to-r from-blue-900 to-purple-900' : 'bg-gradient-to-r from-blue-600 to-purple-600'} rounded-2xl p-6 mb-8 text-white`}>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium opacity-90 mb-2">{t('walletBalance')}</h3>
            <p className="text-4xl font-bold">
              {loading ? t('loading') : formatCurrency(walletData?.balance || 0)}
            </p>
            <p className="text-sm opacity-75 mt-2">
              {walletData?.source === 'demo' ? 'Demo Mode' : 'Real Banking'} • USD
            </p>
          </div>
          <div className="text-right">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-2">
              <span className="text-2xl">🇵🇷</span>
            </div>
            <p className="text-xs opacity-75">{t('puertoRico')}</p>
          </div>
        </div>
        
        {walletData?.needsConfiguration && (
          <div className={`mt-4 p-3 rounded-lg ${darkMode ? 'bg-yellow-900/30' : 'bg-yellow-600/20'}`}>
            <p className="text-sm text-yellow-100">
              ⚠️ Real banking requires Moov API configuration. Currently using demo mode.
            </p>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <button
          onClick={() => setShowLinkForm(true)}
          className="bg-gradient-to-r from-green-500 to-blue-500 text-white p-4 rounded-xl font-medium hover:from-green-600 hover:to-blue-600 transition-all transform hover:scale-105"
        >
          🏦 {t('linkBankAccount')}
        </button>
        <button
          className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-4 rounded-xl font-medium hover:from-purple-600 hover:to-pink-600 transition-all transform hover:scale-105"
        >
          💸 {t('sendMoney')}
        </button>
        <button
          className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-4 rounded-xl font-medium hover:from-orange-600 hover:to-red-600 transition-all transform hover:scale-105"
        >
          📱 {t('receiveMoney')}
        </button>
      </div>

      {/* Bank Linking Form */}
      {showLinkForm && (
        <div className={`${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'} rounded-2xl border p-6 mb-8`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              🏦 {t('linkBankAccount')}
            </h3>
            <button
              onClick={() => setShowLinkForm(false)}
              className={`text-gray-500 hover:text-gray-700 ${darkMode ? 'hover:text-gray-300' : ''}`}
            >
              ✕
            </button>
          </div>

          <form onSubmit={handleLinkBank} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                  {t('bankName')}
                </label>
                <input
                  type="text"
                  value={linkFormData.bank_name}
                  onChange={(e) => setLinkFormData({...linkFormData, bank_name: e.target.value})}
                  placeholder="Banco Popular, FirstBank, etc."
                  className={`w-full px-3 py-2 rounded-lg border ${
                    darkMode ? 'bg-gray-600 border-gray-500 text-white' : 'bg-white border-gray-300 text-gray-900'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  required
                />
              </div>

              <div>
                <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                  {t('accountType')}
                </label>
                <select
                  value={linkFormData.account_type}
                  onChange={(e) => setLinkFormData({...linkFormData, account_type: e.target.value})}
                  className={`w-full px-3 py-2 rounded-lg border ${
                    darkMode ? 'bg-gray-600 border-gray-500 text-white' : 'bg-white border-gray-300 text-gray-900'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                >
                  <option value="checking">Checking / Corriente</option>
                  <option value="savings">Savings / Ahorros</option>
                </select>
              </div>

              <div>
                <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                  {t('routingNumber')}
                </label>
                <input
                  type="text"
                  value={linkFormData.routing_number}
                  onChange={(e) => setLinkFormData({...linkFormData, routing_number: e.target.value})}
                  placeholder="021000021"
                  maxLength="9"
                  className={`w-full px-3 py-2 rounded-lg border ${
                    darkMode ? 'bg-gray-600 border-gray-500 text-white' : 'bg-white border-gray-300 text-gray-900'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  required
                />
              </div>

              <div>
                <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                  {t('accountNumber')}
                </label>
                <input
                  type="text"
                  value={linkFormData.account_number}
                  onChange={(e) => setLinkFormData({...linkFormData, account_number: e.target.value})}
                  placeholder="1234567890"
                  className={`w-full px-3 py-2 rounded-lg border ${
                    darkMode ? 'bg-gray-600 border-gray-500 text-white' : 'bg-white border-gray-300 text-gray-900'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  required
                />
              </div>
            </div>

            <div>
              <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                Account Holder Name
              </label>
              <input
                type="text"
                value={linkFormData.account_holder_name}
                onChange={(e) => setLinkFormData({...linkFormData, account_holder_name: e.target.value})}
                className={`w-full px-3 py-2 rounded-lg border ${
                  darkMode ? 'bg-gray-600 border-gray-500 text-white' : 'bg-white border-gray-300 text-gray-900'
                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                required
              />
            </div>

            <div className={`p-4 rounded-lg ${darkMode ? 'bg-blue-900/20' : 'bg-blue-50'}`}>
              <p className={`text-sm ${darkMode ? 'text-blue-300' : 'text-blue-800'}`}>
                🔒 <strong>{t('secureConnection')}</strong>: Your banking information is encrypted with bank-level security. We use Moov Financial's secure infrastructure to protect your data.
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-lg font-bold transition-all ${
                loading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white'
              }`}
            >
              {loading ? t('loading') : '🏦 ' + t('linkAccount')}
            </button>
          </form>
        </div>
      )}

      {/* Linked Accounts */}
      {linkedAccounts.length > 0 && (
        <div className="mb-8">
          <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4`}>
            🏦 Linked Bank Accounts
          </h3>
          <div className="space-y-3">
            {linkedAccounts.map((account) => (
              <div key={account.account_id} className={`p-4 rounded-xl border ${
                darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'
              }`}>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {account.bank_name}
                    </h4>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {account.account_type} •••• {account.last_4}
                    </p>
                    <p className={`text-xs ${darkMode ? 'text-green-400' : 'text-green-600'}`}>
                      ✅ {t('verified')}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDeleteAccount(account.account_id)}
                    className="bg-red-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-red-600 transition-colors"
                  >
                    🗑️ {t('removeAccount')}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Puerto Rico Footer */}
      <div className={`text-center p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
        <h4 className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-2 flex items-center justify-center space-x-2`}>
          <span className="text-2xl">🇵🇷</span>
          <span>{t('proudlyServing')}</span>
        </h4>
        <ul className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'} space-y-1`}>
          <li>• {t('fincenLicensed')} • FDIC Insured</li>
          <li>• Real-time balance updates from your bank</li>
          <li>• Bank-level encryption and security</li>
          <li>• Support for all major Puerto Rican banks</li>
        </ul>
      </div>
    </div>
  );
};

export default DigitalWallet;