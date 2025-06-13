import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SendMoney = ({ user, onBack, darkMode }) => {
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [transferType, setTransferType] = useState('instant');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [transferDetails, setTransferDetails] = useState(null);
  const [balance, setBalance] = useState(0);
  const [dailyLimitRemaining, setDailyLimitRemaining] = useState(0);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await axios.get('/user/profile');
      setBalance(response.data.wallet_balance || 0);
      setDailyLimitRemaining(response.data.daily_limit || 0);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const calculateFee = (amount, type) => {
    const numAmount = parseFloat(amount) || 0;
    if (type === 'instant') {
      return numAmount * 0.015; // 1.5% for instant transfers
    }
    return 0; // Free for standard transfers
  };

  const handleAmountChange = (value) => {
    // Remove any non-numeric characters except decimal point
    const cleanValue = value.replace(/[^0-9.]/g, '');
    
    // Ensure only one decimal point
    const parts = cleanValue.split('.');
    if (parts.length > 2) return;
    
    // Limit to 2 decimal places
    if (parts[1] && parts[1].length > 2) return;
    
    setAmount(cleanValue);
  };

  const validateTransfer = () => {
    const numAmount = parseFloat(amount);
    const fee = calculateFee(amount, transferType);
    const totalCost = numAmount + fee;

    if (!recipient) {
      setError('Please enter recipient email or phone number');
      return false;
    }

    if (!amount || numAmount <= 0) {
      setError('Please enter a valid amount');
      return false;
    }

    if (totalCost > balance) {
      setError(`Insufficient funds. You need $${totalCost.toFixed(2)} (including fees) but only have $${balance.toFixed(2)}`);
      return false;
    }

    if (numAmount > dailyLimitRemaining) {
      setError(`Transfer exceeds daily limit. Your remaining limit is $${dailyLimitRemaining.toFixed(2)}`);
      return false;
    }

    if (user?.kyc_status !== 'approved') {
      setError('Please complete identity verification to send money');
      return false;
    }

    return true;
  };

  const handleSendMoney = async () => {
    setError('');
    setSuccess('');

    if (!validateTransfer()) return;

    const numAmount = parseFloat(amount);
    const fee = calculateFee(amount, transferType);

    setTransferDetails({
      recipient,
      amount: numAmount,
      fee,
      total: numAmount + fee,
      transferType,
      description
    });

    setShowConfirmation(true);
  };

  const confirmTransfer = async () => {
    setLoading(true);
    setError('');

    try {
      // Determine recipient type (email or phone)
      const isEmail = recipient.includes('@');
      
      const transferData = {
        amount: parseFloat(amount),
        description: description || 'DalePay Transfer',
        transfer_type: transferType
      };

      if (isEmail) {
        transferData.recipient_email = recipient;
      } else {
        transferData.recipient_phone = recipient;
      }

      const response = await axios.post('/transfer/send', transferData);

      setSuccess(`$${amount} sent successfully! Transaction ID: ${response.data.transaction_id}`);
      setShowConfirmation(false);
      
      // Reset form
      setRecipient('');
      setAmount('');
      setDescription('');
      
      // Refresh balance
      fetchUserProfile();

    } catch (error) {
      setError(error.response?.data?.detail || 'Transfer failed. Please try again.');
      setShowConfirmation(false);
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

  const currentFee = calculateFee(amount, transferType);
  const totalCost = (parseFloat(amount) || 0) + currentFee;

  if (showConfirmation && transferDetails) {
    return (
      <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'} py-8`}>
        <div className="max-w-md mx-auto px-4">
          <div className={`${
            darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          } rounded-2xl border shadow-xl p-6`}>
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
                Confirm Transfer
              </h2>
              <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Please review your transfer details
              </p>
            </div>

            <div className={`space-y-4 p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'} mb-6`}>
              <div className="flex justify-between items-center">
                <span className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>To:</span>
                <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {transferDetails.recipient}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Amount:</span>
                <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {formatCurrency(transferDetails.amount)}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Fee:</span>
                <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {formatCurrency(transferDetails.fee)}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Speed:</span>
                <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {transferDetails.transferType === 'instant' ? '⚡ Instant' : '🕐 Standard (1-2 days)'}
                </span>
              </div>

              {transferDetails.description && (
                <div className="flex justify-between items-center">
                  <span className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Note:</span>
                  <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {transferDetails.description}
                  </span>
                </div>
              )}

              <div className={`flex justify-between items-center pt-3 border-t ${
                darkMode ? 'border-gray-600' : 'border-gray-300'
              }`}>
                <span className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Total:</span>
                <span className={`font-bold text-lg ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {formatCurrency(transferDetails.total)}
                </span>
              </div>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setShowConfirmation(false)}
                className={`py-3 px-4 rounded-lg font-medium transition-colors ${
                  darkMode ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-900'
                }`}
              >
                Cancel
              </button>
              <button
                onClick={confirmTransfer}
                disabled={loading}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {loading ? 'Sending...' : 'Send Money'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'} py-8`}>
      <div className="max-w-md mx-auto px-4">
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

        <div className={`${
          darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        } rounded-2xl border shadow-xl overflow-hidden`}>
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold">Send Money</h1>
                <p className="text-blue-100">Send to anyone instantly</p>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Available Balance</p>
                <p className="text-2xl font-bold">{formatCurrency(balance)}</p>
              </div>
              <div className="text-right">
                <p className="text-blue-100 text-sm">Daily Limit Remaining</p>
                <p className="font-bold">{formatCurrency(dailyLimitRemaining)}</p>
              </div>
            </div>
          </div>

          <div className="p-6">
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

            <form onSubmit={(e) => { e.preventDefault(); handleSendMoney(); }} className="space-y-6">
              {/* Recipient */}
              <div>
                <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                  Send to (Email or Phone) *
                </label>
                <input
                  type="text"
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  className={`w-full px-4 py-3 rounded-lg border ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-gray-50 border-gray-300 text-gray-900'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  placeholder="email@example.com or +1 787-123-4567"
                  required
                />
                <p className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Enter recipient's email address or phone number
                </p>
              </div>

              {/* Amount */}
              <div>
                <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                  Amount (USD) *
                </label>
                <div className="relative">
                  <span className={`absolute left-3 top-3 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>$</span>
                  <input
                    type="text"
                    value={amount}
                    onChange={(e) => handleAmountChange(e.target.value)}
                    className={`w-full pl-8 pr-4 py-3 rounded-lg border ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-gray-50 border-gray-300 text-gray-900'
                    } focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg font-medium`}
                    placeholder="0.00"
                    required
                  />
                </div>
                
                {/* Quick Amount Buttons */}
                <div className="grid grid-cols-4 gap-2 mt-2">
                  {[25, 50, 100, 200].map((quickAmount) => (
                    <button
                      key={quickAmount}
                      type="button"
                      onClick={() => setAmount(quickAmount.toString())}
                      className={`py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                        darkMode 
                          ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' 
                          : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                      }`}
                    >
                      ${quickAmount}
                    </button>
                  ))}
                </div>
              </div>

              {/* Transfer Type */}
              <div>
                <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-3`}>
                  Transfer Speed
                </label>
                <div className="space-y-3">
                  <label className={`flex items-center p-3 rounded-lg border cursor-pointer transition-colors ${
                    transferType === 'instant'
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : darkMode
                        ? 'border-gray-600 bg-gray-700 hover:bg-gray-600'
                        : 'border-gray-300 bg-gray-50 hover:bg-gray-100'
                  }`}>
                    <input
                      type="radio"
                      value="instant"
                      checked={transferType === 'instant'}
                      onChange={(e) => setTransferType(e.target.value)}
                      className="mr-3"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            ⚡ Instant Transfer
                          </p>
                          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            Money arrives in seconds
                          </p>
                        </div>
                        <div className="text-right">
                          <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            1.5% fee
                          </p>
                          {amount && (
                            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                              {formatCurrency(calculateFee(amount, 'instant'))}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </label>

                  <label className={`flex items-center p-3 rounded-lg border cursor-pointer transition-colors ${
                    transferType === 'standard'
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : darkMode
                        ? 'border-gray-600 bg-gray-700 hover:bg-gray-600'
                        : 'border-gray-300 bg-gray-50 hover:bg-gray-100'
                  }`}>
                    <input
                      type="radio"
                      value="standard"
                      checked={transferType === 'standard'}
                      onChange={(e) => setTransferType(e.target.value)}
                      className="mr-3"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            🕐 Standard Transfer
                          </p>
                          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            1-2 business days
                          </p>
                        </div>
                        <div className="text-right">
                          <p className={`font-medium text-green-600`}>FREE</p>
                          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            No fees
                          </p>
                        </div>
                      </div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                  Note (Optional)
                </label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className={`w-full px-4 py-3 rounded-lg border ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-gray-50 border-gray-300 text-gray-900'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  placeholder="What's this for?"
                  maxLength="100"
                />
              </div>

              {/* Summary */}
              {amount && parseFloat(amount) > 0 && (
                <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-blue-50'} border ${
                  darkMode ? 'border-gray-600' : 'border-blue-200'
                }`}>
                  <h4 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
                    Transfer Summary
                  </h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Amount:</span>
                      <span className={darkMode ? 'text-white' : 'text-gray-900'}>{formatCurrency(parseFloat(amount))}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Fee:</span>
                      <span className={darkMode ? 'text-white' : 'text-gray-900'}>{formatCurrency(currentFee)}</span>
                    </div>
                    <div className={`flex justify-between pt-1 border-t ${darkMode ? 'border-gray-600' : 'border-blue-300'}`}>
                      <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>Total:</span>
                      <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{formatCurrency(totalCost)}</span>
                    </div>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={loading || !amount || !recipient}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-lg font-bold text-lg hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105"
              >
                {loading ? 'Processing...' : 'Review Transfer'}
              </button>
            </form>

            {/* Security Notice */}
            <div className={`mt-6 p-4 rounded-lg ${
              darkMode ? 'bg-gray-700' : 'bg-green-50'
            } border border-green-200`}>
              <div className="flex items-start space-x-3">
                <svg className="w-5 h-5 text-green-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                </svg>
                <div>
                  <h4 className="text-green-600 font-medium text-sm">Secure Transfer</h4>
                  <p className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-green-600'}`}>
                    All transfers are encrypted and monitored for fraud protection.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SendMoney;
