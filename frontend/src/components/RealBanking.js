import React, { useState, useEffect, useCallback } from 'react';
import { usePlaidLink } from 'react-plaid-link';

const RealBanking = ({ user, token, darkMode, onAccountLinked }) => {
  const [accounts, setAccounts] = useState([]);
  const [linkToken, setLinkToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const [totalBalance, setTotalBalance] = useState(0);
  const [transferAmount, setTransferAmount] = useState('');
  const [transferTo, setTransferTo] = useState('');
  const [showTransfer, setShowTransfer] = useState(false);

  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  // Create link token for Plaid
  useEffect(() => {
    const createLinkToken = async () => {
      try {
        const response = await fetch(`${backendUrl}/api/banking/create-link-token`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to create link token');
        }
        
        const data = await response.json();
        setLinkToken(data.link_token);
      } catch (error) {
        console.error('Error creating link token:', error);
      }
    };

    if (token) {
      createLinkToken();
    }
  }, [token, backendUrl]);

  // Plaid Link success handler
  const onSuccess = useCallback(async (public_token, metadata) => {
    try {
      setLoading(true);
      const response = await fetch(`${backendUrl}/api/banking/exchange-public-token`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ public_token })
      });

      if (!response.ok) {
        throw new Error('Failed to link bank account');
      }

      const data = await response.json();
      if (data.success) {
        fetchAccounts();
        if (onAccountLinked) {
          onAccountLinked(data.accounts);
        }
        alert(`Successfully linked ${data.accounts_linked} bank account(s)!`);
      }
    } catch (error) {
      console.error('Error linking account:', error);
      alert('Failed to link bank account. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [token, backendUrl, onAccountLinked]);

  // Initialize Plaid Link
  const { open, ready } = usePlaidLink({
    token: linkToken,
    onSuccess,
    onEvent: (eventName, metadata) => {
      console.log('Plaid event:', eventName, metadata);
    },
    onExit: (err, metadata) => {
      if (err) {
        console.error('Plaid error:', err);
      }
    },
  });

  // Fetch linked accounts
  const fetchAccounts = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${backendUrl}/api/banking/accounts`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setAccounts(data.accounts || []);
        
        // Fetch total balance
        const balanceResponse = await fetch(`${backendUrl}/api/banking/total-balance`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (balanceResponse.ok) {
          const balanceData = await balanceResponse.json();
          setTotalBalance(balanceData.total_balance || 0);
        }
      }
    } catch (error) {
      console.error('Error fetching accounts:', error);
    } finally {
      setLoading(false);
    }
  };

  // Load accounts on component mount
  useEffect(() => {
    if (token) {
      fetchAccounts();
    }
  }, [token]);

  // Handle money transfer
  const handleTransfer = async (e) => {
    e.preventDefault();
    
    if (!transferAmount || !transferTo || accounts.length === 0) {
      alert('Please fill in all fields and ensure you have linked bank accounts');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`${backendUrl}/api/banking/transfer`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from_account_id: accounts[0].account_id, // Use first account
          to_email: transferTo,
          amount: parseFloat(transferAmount),
          description: 'DalePay Real Money Transfer'
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Transfer failed');
      }

      const data = await response.json();
      alert(`Transfer successful! Transaction ID: ${data.transfer_id}`);
      setTransferAmount('');
      setTransferTo('');
      setShowTransfer(false);
      fetchAccounts(); // Refresh balances
    } catch (error) {
      console.error('Transfer error:', error);
      alert(`Transfer failed: ${error.message}`);
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
      <div className="text-center mb-8">
        <h2 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
          🏦 Real Banking
        </h2>
        <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          Connect your real bank accounts and manage your money
        </p>
      </div>

      {/* Total Balance Display */}
      {accounts.length > 0 && (
        <div className={`${darkMode ? 'bg-gradient-to-r from-blue-900 to-purple-900' : 'bg-gradient-to-r from-blue-600 to-purple-600'} rounded-2xl p-6 mb-6 text-white text-center`}>
          <h3 className="text-lg font-medium opacity-90 mb-2">Total Balance</h3>
          <p className="text-4xl font-bold">{formatCurrency(totalBalance)}</p>
          <p className="text-sm opacity-75 mt-2">Across {accounts.length} linked account{accounts.length !== 1 ? 's' : ''}</p>
        </div>
      )}

      {/* Link Bank Account Button */}
      {!accounts.length && (
        <div className="text-center mb-8">
          <button
            onClick={() => open()}
            disabled={!ready || loading}
            className={`px-8 py-4 rounded-2xl font-bold text-lg transition-all transform hover:scale-105 shadow-lg ${
              loading || !ready
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white'
            }`}
          >
            {loading ? '🔄 Linking...' : '🔗 Link Your Bank Account'}
          </button>
          
          <div className={`mt-4 p-4 ${darkMode ? 'bg-blue-900/20' : 'bg-blue-50'} rounded-lg`}>
            <p className={`text-sm ${darkMode ? 'text-blue-300' : 'text-blue-800'}`}>
              🔒 <strong>Secure Banking:</strong> We use Plaid's bank-level security to connect your accounts safely. 
              Your login credentials are encrypted and never stored by DalePay.
            </p>
          </div>
        </div>
      )}

      {/* Linked Accounts */}
      {accounts.length > 0 && (
        <div className="space-y-4 mb-8">
          <div className="flex items-center justify-between">
            <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Linked Accounts
            </h3>
            <button
              onClick={() => open()}
              disabled={!ready || loading}
              className={`px-4 py-2 rounded-lg font-medium ${
                darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              } transition-colors`}
            >
              + Add Account
            </button>
          </div>

          {accounts.map((account, index) => (
            <div key={account.account_id} className={`p-4 rounded-xl border ${
              darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'
            }`}>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {account.account_name}
                  </h4>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {account.account_type.charAt(0).toUpperCase() + account.account_type.slice(1)} 
                    {account.mask && ` •••• ${account.mask}`}
                  </p>
                </div>
                <div className="text-right">
                  <p className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {formatCurrency(account.balance_current)}
                  </p>
                  {account.balance_available !== account.balance_current && (
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Available: {formatCurrency(account.balance_available)}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Transfer Money Section */}
      {accounts.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              💸 Send Real Money
            </h3>
            <button
              onClick={() => setShowTransfer(!showTransfer)}
              className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-4 py-2 rounded-lg font-medium hover:from-green-600 hover:to-blue-600 transition-all"
            >
              {showTransfer ? 'Cancel' : 'Send Money'}
            </button>
          </div>

          {showTransfer && (
            <form onSubmit={handleTransfer} className={`p-6 rounded-xl border ${
              darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'
            }`}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                    Send To (Email)
                  </label>
                  <input
                    type="email"
                    value={transferTo}
                    onChange={(e) => setTransferTo(e.target.value)}
                    placeholder="recipient@example.com"
                    className={`w-full px-3 py-2 rounded-lg border ${
                      darkMode ? 'bg-gray-600 border-gray-500 text-white' : 'bg-white border-gray-300 text-gray-900'
                    } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    required
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                    Amount ($)
                  </label>
                  <input
                    type="number"
                    value={transferAmount}
                    onChange={(e) => setTransferAmount(e.target.value)}
                    placeholder="0.00"
                    min="0.01"
                    step="0.01"
                    className={`w-full px-3 py-2 rounded-lg border ${
                      darkMode ? 'bg-gray-600 border-gray-500 text-white' : 'bg-white border-gray-300 text-gray-900'
                    } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    required
                  />
                </div>
              </div>

              {transferAmount && (
                <div className={`mb-4 p-3 rounded-lg ${darkMode ? 'bg-yellow-900/20' : 'bg-yellow-50'}`}>
                  <p className={`text-sm ${darkMode ? 'text-yellow-300' : 'text-yellow-800'}`}>
                    💰 <strong>Transfer Details:</strong><br/>
                    Amount: {formatCurrency(parseFloat(transferAmount || 0))}<br/>
                    Fee (1.5%): {formatCurrency((parseFloat(transferAmount || 0)) * 0.015)}<br/>
                    <strong>Total: {formatCurrency((parseFloat(transferAmount || 0)) * 1.015)}</strong>
                  </p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading || !transferAmount || !transferTo}
                className={`w-full py-3 rounded-lg font-bold transition-all ${
                  loading || !transferAmount || !transferTo
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white'
                }`}
              >
                {loading ? '🔄 Processing...' : '💸 Send Real Money'}
              </button>
            </form>
          )}
        </div>
      )}

      {/* Information Footer */}
      <div className={`mt-8 p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
        <h4 className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
          🔐 Security & Privacy
        </h4>
        <ul className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'} space-y-1`}>
          <li>• Your bank credentials are encrypted and never stored by DalePay</li>
          <li>• All transactions are monitored for fraud and compliance</li>
          <li>• Funds are transferred through secure banking networks</li>
          <li>• Real-time balance updates from your bank</li>
        </ul>
      </div>
    </div>
  );
};

export default RealBanking;