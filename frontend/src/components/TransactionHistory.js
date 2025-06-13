import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TransactionHistory = ({ user, onBack, darkMode }) => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all'); // all, sent, received
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchTransactions();
  }, [filter, currentPage]);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage,
        limit: 20
      });
      
      if (filter !== 'all') {
        params.append('type', filter);
      }

      const response = await axios.get(`/transactions?${params}`);
      setTransactions(response.data.transactions || []);
      setTotalPages(response.data.pages || 1);
    } catch (error) {
      setError('Failed to load transaction history');
      setTransactions([]);
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

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
  };

  const getTransactionIcon = (type, status) => {
    if (status === 'failed') return '❌';
    if (status === 'pending') return '⏳';
    if (type === 'sent') return '↗️';
    if (type === 'received') return '↙️';
    return '💰';
  };

  const getStatusBadge = (status) => {
    const colors = {
      completed: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
      failed: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
    };

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
        colors[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
      }`}>
        {status}
      </span>
    );
  };

  const exportTransactions = () => {
    // Create CSV content
    const headers = ['Date', 'Type', 'Amount', 'Description', 'Status', 'Transaction ID'];
    const csvContent = [
      headers.join(','),
      ...transactions.map(transaction => [
        formatDateTime(transaction.created_at).date,
        transaction.type,
        transaction.amount,
        transaction.description || '',
        transaction.status,
        transaction.id
      ].join(','))
    ].join('\n');

    // Download CSV file
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dalepay-transactions-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

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

        <div className={`${
          darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        } rounded-2xl border shadow-xl overflow-hidden`}>
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-6 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-2xl font-bold">Transaction History</h1>
                  <p className="text-purple-100">All your payment activity</p>
                </div>
              </div>
              
              <button
                onClick={exportTransactions}
                className="bg-white/20 text-white px-4 py-2 rounded-lg font-medium hover:bg-white/30 transition-colors"
              >
                📊 Export
              </button>
            </div>
          </div>

          <div className="p-6">
            {/* Error Message */}
            {error && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Filters */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex space-x-2">
                {[
                  { value: 'all', label: 'All Transactions', icon: '💰' },
                  { value: 'sent', label: 'Sent', icon: '↗️' },
                  { value: 'received', label: 'Received', icon: '↙️' }
                ].map((filterOption) => (
                  <button
                    key={filterOption.value}
                    onClick={() => {
                      setFilter(filterOption.value);
                      setCurrentPage(1);
                    }}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                      filter === filterOption.value
                        ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300'
                        : darkMode
                          ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <span>{filterOption.icon}</span>
                    <span className="text-sm">{filterOption.label}</span>
                  </button>
                ))}
              </div>

              <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {transactions.length} transactions
              </div>
            </div>

            {/* Transaction List */}
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className={`ml-3 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Loading transactions...</span>
              </div>
            ) : transactions.length > 0 ? (
              <div className="space-y-4">
                {transactions.map((transaction) => {
                  const dateTime = formatDateTime(transaction.created_at);
                  const isReceived = transaction.type === 'received';
                  const isSent = transaction.type === 'sent';
                  
                  return (
                    <div
                      key={transaction.id}
                      className={`flex items-center justify-between p-4 rounded-lg border transition-colors ${
                        darkMode 
                          ? 'bg-gray-700 border-gray-600 hover:bg-gray-600' 
                          : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                      }`}
                    >
                      <div className="flex items-center space-x-4">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                          isReceived 
                            ? 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300'
                            : isSent
                              ? 'bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300'
                              : 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300'
                        }`}>
                          <span className="text-xl">
                            {getTransactionIcon(transaction.type, transaction.status)}
                          </span>
                        </div>
                        
                        <div>
                          <div className="flex items-center space-x-2">
                            <h3 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                              {transaction.description || 
                                (isReceived ? 'Money Received' : 
                                 isSent ? 'Money Sent' : 
                                 'Transaction')}
                            </h3>
                            {getStatusBadge(transaction.status)}
                          </div>
                          
                          <div className="flex items-center space-x-4 mt-1">
                            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                              {dateTime.date} at {dateTime.time}
                            </p>
                            {transaction.fee && transaction.fee > 0 && (
                              <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                                Fee: {formatCurrency(transaction.fee)}
                              </p>
                            )}
                          </div>
                          
                          <p className={`text-xs mt-1 font-mono ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                            ID: {transaction.id}
                          </p>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <p className={`font-bold text-lg ${
                          isReceived 
                            ? 'text-green-600' 
                            : isSent 
                              ? 'text-red-600' 
                              : darkMode ? 'text-white' : 'text-gray-900'
                        }`}>
                          {isReceived ? '+' : isSent ? '-' : ''}
                          {formatCurrency(transaction.amount)}
                        </p>
                        
                        {transaction.transfer_type && (
                          <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'} capitalize`}>
                            {transaction.transfer_type}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📋</div>
                <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
                  No transactions yet
                </h3>
                <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-6`}>
                  Your transaction history will appear here once you start sending or receiving money.
                </p>
                <div className="flex justify-center space-x-4">
                  <button
                    onClick={() => window.history.back()}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                  >
                    Send Money
                  </button>
                  <button
                    onClick={() => window.history.back()}
                    className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                      darkMode 
                        ? 'bg-gray-700 text-white hover:bg-gray-600' 
                        : 'bg-gray-200 text-gray-900 hover:bg-gray-300'
                    }`}
                  >
                    Request Money
                  </button>
                </div>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                    darkMode 
                      ? 'bg-gray-700 text-white hover:bg-gray-600' 
                      : 'bg-gray-200 text-gray-900 hover:bg-gray-300'
                  }`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  <span>Previous</span>
                </button>
                
                <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Page {currentPage} of {totalPages}
                </span>

                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                    darkMode 
                      ? 'bg-gray-700 text-white hover:bg-gray-600' 
                      : 'bg-gray-200 text-gray-900 hover:bg-gray-300'
                  }`}
                >
                  <span>Next</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Compliance Notice */}
        <div className="text-center py-6">
          <div className="flex items-center justify-center space-x-2 text-gray-500 mb-2">
            <span className="text-lg">🔒</span>
            <span className="text-sm font-medium">All transactions are encrypted and monitored</span>
          </div>
          <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            DalePay™ • FinCEN Licensed • Transaction records maintained for compliance
          </p>
        </div>
      </div>
    </div>
  );
};

export default TransactionHistory;
