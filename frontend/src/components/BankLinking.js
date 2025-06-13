import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BankLinking = ({ user, onBack, darkMode }) => {
  const [step, setStep] = useState(1); // 1: Choose method, 2: Manual entry, 3: Verification
  const [linkedAccounts, setLinkedAccounts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loadingAccounts, setLoadingAccounts] = useState(true);

  // Manual bank account form
  const [bankForm, setBankForm] = useState({
    bank_name: '',
    account_type: 'checking',
    routing_number: '',
    account_number: '',
    confirm_account_number: '',
    account_holder_name: user?.full_name || ''
  });

  // Plaid integration state
  const [plaidLinkToken, setPlaidLinkToken] = useState('');
  const [verificationAmounts, setVerificationAmounts] = useState(['', '']);
  const [pendingAccount, setPendingAccount] = useState(null);

  useEffect(() => {
    fetchLinkedAccounts();
  }, []);

  const fetchLinkedAccounts = async () => {
    try {
      const response = await axios.get('/linked-accounts');
      setLinkedAccounts(response.data || []);
    } catch (error) {
      console.error('Error fetching linked accounts:', error);
    } finally {
      setLoadingAccounts(false);
    }
  };

  const initializePlaidLink = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await axios.post('/plaid/create-link-token');
      setPlaidLinkToken(response.data.link_token);
      
      // Simulate Plaid Link flow
      setSuccess('Bank connection initialized. In production, this would open Plaid Link interface.');
      
    } catch (error) {
      setError('Failed to initialize bank connection. Please try manual entry.');
    } finally {
      setLoading(false);
    }
  };

  const validateBankForm = () => {
    if (!bankForm.bank_name) {
      setError('Please enter your bank name');
      return false;
    }

    if (bankForm.routing_number.length !== 9) {
      setError('Routing number must be 9 digits');
      return false;
    }

    if (bankForm.account_number.length < 8) {
      setError('Account number must be at least 8 digits');
      return false;
    }

    if (bankForm.account_number !== bankForm.confirm_account_number) {
      setError('Account numbers do not match');
      return false;
    }

    if (!bankForm.account_holder_name) {
      setError('Please enter the account holder name');
      return false;
    }

    return true;
  };

  const submitBankAccount = async () => {
    setError('');
    
    if (!validateBankForm()) return;

    setLoading(true);

    try {
      const response = await axios.post('/bank-accounts/link', {
        bank_name: bankForm.bank_name,
        account_type: bankForm.account_type,
        routing_number: bankForm.routing_number,
        account_number: bankForm.account_number,
        account_holder_name: bankForm.account_holder_name
      });

      setSuccess('Bank account linked successfully! You can now transfer money.');
      setPendingAccount(response.data);
      setStep(3);
      
      // Refresh linked accounts
      fetchLinkedAccounts();
      
      // Reset form
      setBankForm({
        bank_name: '',
        account_type: 'checking',
        routing_number: '',
        account_number: '',
        confirm_account_number: '',
        account_holder_name: user?.full_name || ''
      });

    } catch (error) {
      setError(error.response?.data?.detail || 'Failed to link bank account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const removeAccount = async (accountId) => {
    if (!confirm('Are you sure you want to remove this bank account?')) return;

    try {
      await axios.delete(`/bank-accounts/${accountId}`);
      setSuccess('Bank account removed successfully');
      fetchLinkedAccounts();
    } catch (error) {
      setError('Failed to remove bank account');
    }
  };

  const formatAccountNumber = (accountNumber) => {
    return `****${accountNumber.slice(-4)}`;
  };

  const formatRoutingNumber = (routingNumber) => {
    return `${routingNumber.slice(0, 3)}-${routingNumber.slice(3, 6)}-${routingNumber.slice(6)}`;
  };

  const handleRoutingNumberChange = (value) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length <= 9) {
      setBankForm({...bankForm, routing_number: cleaned});
    }
  };

  const handleAccountNumberChange = (value, field) => {
    const cleaned = value.replace(/\D/g, '');
    setBankForm({...bankForm, [field]: cleaned});
  };

  if (loadingAccounts) {
    return (
      <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'} flex items-center justify-center`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Loading your bank accounts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'} py-8`}>
      <div className="max-w-2xl mx-auto px-4">
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

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center">
            {[1, 2, 3].map((stepNumber) => (
              <React.Fragment key={stepNumber}>
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                  step >= stepNumber
                    ? 'bg-blue-600 border-blue-600 text-white'
                    : darkMode
                      ? 'border-gray-600 text-gray-400'
                      : 'border-gray-300 text-gray-500'
                }`}>
                  {stepNumber}
                </div>
                {stepNumber < 3 && (
                  <div className={`w-16 h-1 mx-2 ${
                    step > stepNumber
                      ? 'bg-blue-600'
                      : darkMode
                        ? 'bg-gray-600'
                        : 'bg-gray-300'
                  }`} />
                )}
              </React.Fragment>
            ))}
          </div>
          <div className="flex justify-center mt-4">
            <div className="grid grid-cols-3 gap-16 text-center">
              <span className={`text-sm ${step >= 1 ? 'text-blue-600' : darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Choose Method
              </span>
              <span className={`text-sm ${step >= 2 ? 'text-blue-600' : darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Enter Details
              </span>
              <span className={`text-sm ${step >= 3 ? 'text-blue-600' : darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Verify
              </span>
            </div>
          </div>
        </div>

        {/* Existing Accounts */}
        {linkedAccounts.length > 0 && (
          <div className={`${
            darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          } rounded-2xl border shadow-lg p-6 mb-6`}>
            <h3 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4`}>
              Your Connected Accounts
            </h3>
            <div className="space-y-3">
              {linkedAccounts.map((account, index) => (
                <div key={index} className={`flex items-center justify-between p-4 rounded-lg ${
                  darkMode ? 'bg-gray-700' : 'bg-gray-50'
                }`}>
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                      <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4zM18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z"/>
                      </svg>
                    </div>
                    <div>
                      <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {account.bank_name}
                      </p>
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {account.account_type} •••• {account.account_number_last_4}
                      </p>
                      <div className="flex items-center mt-1">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                        <span className="text-xs text-green-600 font-medium">Verified</span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => removeAccount(account.id)}
                    className={`text-red-600 hover:text-red-700 p-2 rounded-lg ${
                      darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-100'
                    }`}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className={`${
          darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        } rounded-2xl border shadow-xl overflow-hidden`}>
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4zM18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z"/>
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold">Connect Your Bank</h1>
                <p className="text-blue-100">Link your bank account to add and withdraw money</p>
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

            {/* Step 1: Choose Connection Method */}
            {step === 1 && (
              <div className="space-y-6">
                <div>
                  <h3 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4`}>
                    How would you like to connect your bank?
                  </h3>
                  <div className="grid gap-4">
                    {/* Instant Connection (Plaid) */}
                    <button
                      onClick={() => {
                        setStep(2);
                        initializePlaidLink();
                      }}
                      className={`p-6 rounded-lg border-2 text-left transition-all hover:scale-105 ${
                        darkMode 
                          ? 'border-gray-600 bg-gray-700 hover:border-blue-500' 
                          : 'border-gray-300 bg-gray-50 hover:border-blue-500 hover:bg-blue-50'
                      }`}
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                          </svg>
                        </div>
                        <div>
                          <h4 className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            ⚡ Instant Connection (Recommended)
                          </h4>
                          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            Connect securely in seconds using your online banking login
                          </p>
                          <div className="flex items-center mt-2 space-x-3">
                            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full font-medium">
                              Most Secure
                            </span>
                            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full font-medium">
                              Bank-Level Encryption
                            </span>
                          </div>
                        </div>
                      </div>
                    </button>

                    {/* Manual Entry */}
                    <button
                      onClick={() => setStep(2)}
                      className={`p-6 rounded-lg border-2 text-left transition-all hover:scale-105 ${
                        darkMode 
                          ? 'border-gray-600 bg-gray-700 hover:border-blue-500' 
                          : 'border-gray-300 bg-gray-50 hover:border-blue-500 hover:bg-blue-50'
                      }`}
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                          </svg>
                        </div>
                        <div>
                          <h4 className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            ✏️ Manual Entry
                          </h4>
                          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            Enter your routing and account numbers manually
                          </p>
                          <div className="flex items-center mt-2 space-x-3">
                            <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded-full font-medium">
                              Requires Verification
                            </span>
                          </div>
                        </div>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Security Notice */}
                <div className={`p-4 rounded-lg ${
                  darkMode ? 'bg-gray-700' : 'bg-blue-50'
                } border border-blue-200`}>
                  <div className="flex items-start space-x-3">
                    <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                    </svg>
                    <div>
                      <h4 className="text-blue-600 font-medium text-sm">Bank-Level Security</h4>
                      <p className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-blue-600'}`}>
                        We use 256-bit encryption and never store your banking credentials. All connections are FDIC insured.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Manual Bank Entry */}
            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <h3 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4`}>
                    Enter Your Bank Account Details
                  </h3>
                  
                  <form onSubmit={(e) => { e.preventDefault(); submitBankAccount(); }} className="space-y-4">
                    {/* Bank Name */}
                    <div>
                      <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                        Bank Name *
                      </label>
                      <input
                        type="text"
                        value={bankForm.bank_name}
                        onChange={(e) => setBankForm({...bankForm, bank_name: e.target.value})}
                        className={`w-full px-4 py-3 rounded-lg border ${
                          darkMode 
                            ? 'bg-gray-700 border-gray-600 text-white' 
                            : 'bg-gray-50 border-gray-300 text-gray-900'
                        } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        placeholder="e.g., Bank of America, Chase, Wells Fargo"
                        required
                      />
                    </div>

                    {/* Account Type */}
                    <div>
                      <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                        Account Type *
                      </label>
                      <select
                        value={bankForm.account_type}
                        onChange={(e) => setBankForm({...bankForm, account_type: e.target.value})}
                        className={`w-full px-4 py-3 rounded-lg border ${
                          darkMode 
                            ? 'bg-gray-700 border-gray-600 text-white' 
                            : 'bg-gray-50 border-gray-300 text-gray-900'
                        } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        required
                      >
                        <option value="checking">Checking Account</option>
                        <option value="savings">Savings Account</option>
                      </select>
                    </div>

                    {/* Routing Number */}
                    <div>
                      <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                        Routing Number *
                      </label>
                      <input
                        type="text"
                        value={bankForm.routing_number}
                        onChange={(e) => handleRoutingNumberChange(e.target.value)}
                        className={`w-full px-4 py-3 rounded-lg border ${
                          darkMode 
                            ? 'bg-gray-700 border-gray-600 text-white' 
                            : 'bg-gray-50 border-gray-300 text-gray-900'
                        } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        placeholder="9-digit routing number"
                        maxLength="9"
                        required
                      />
                      <p className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        Found on the bottom left of your check (9 digits)
                      </p>
                    </div>

                    {/* Account Number */}
                    <div>
                      <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                        Account Number *
                      </label>
                      <input
                        type="text"
                        value={bankForm.account_number}
                        onChange={(e) => handleAccountNumberChange(e.target.value, 'account_number')}
                        className={`w-full px-4 py-3 rounded-lg border ${
                          darkMode 
                            ? 'bg-gray-700 border-gray-600 text-white' 
                            : 'bg-gray-50 border-gray-300 text-gray-900'
                        } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        placeholder="Your account number"
                        required
                      />
                    </div>

                    {/* Confirm Account Number */}
                    <div>
                      <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                        Confirm Account Number *
                      </label>
                      <input
                        type="text"
                        value={bankForm.confirm_account_number}
                        onChange={(e) => handleAccountNumberChange(e.target.value, 'confirm_account_number')}
                        className={`w-full px-4 py-3 rounded-lg border ${
                          darkMode 
                            ? 'bg-gray-700 border-gray-600 text-white' 
                            : 'bg-gray-50 border-gray-300 text-gray-900'
                        } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        placeholder="Re-enter your account number"
                        required
                      />
                    </div>

                    {/* Account Holder Name */}
                    <div>
                      <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                        Account Holder Name *
                      </label>
                      <input
                        type="text"
                        value={bankForm.account_holder_name}
                        onChange={(e) => setBankForm({...bankForm, account_holder_name: e.target.value})}
                        className={`w-full px-4 py-3 rounded-lg border ${
                          darkMode 
                            ? 'bg-gray-700 border-gray-600 text-white' 
                            : 'bg-gray-50 border-gray-300 text-gray-900'
                        } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        placeholder="Name on the account"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-4">
                      <button
                        type="button"
                        onClick={() => setStep(1)}
                        className={`py-3 px-4 rounded-lg font-medium transition-colors ${
                          darkMode ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-900'
                        }`}
                      >
                        Back
                      </button>
                      <button
                        type="submit"
                        disabled={loading}
                        className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                      >
                        {loading ? 'Connecting...' : 'Connect Account'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Step 3: Verification Success */}
            {step === 3 && (
              <div className="text-center space-y-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>

                <div>
                  <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
                    Bank Account Connected!
                  </h3>
                  <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Your bank account has been successfully linked to your DalePay wallet.
                  </p>
                </div>

                {pendingAccount && (
                  <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-green-50'} border border-green-200`}>
                    <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
                      {pendingAccount.bank_name}
                    </p>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {pendingAccount.account_type} ending in {pendingAccount.last_4}
                    </p>
                  </div>
                )}

                <div className="space-y-3">
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    You can now:
                  </p>
                  <ul className={`text-sm space-y-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    <li className="flex items-center space-x-2">
                      <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                      </svg>
                      <span>Add money to your DalePay wallet</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                      </svg>
                      <span>Withdraw money to your bank account</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                      </svg>
                      <span>Check your real account balance</span>
                    </li>
                  </ul>
                </div>

                <button
                  onClick={onBack}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all"
                >
                  Back to Dashboard
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BankLinking;
