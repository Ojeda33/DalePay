import React, { useState } from 'react';

const ReceiveMoney = ({ user, onBack, darkMode }) => {
  const [qrCodeData, setQrCodeData] = useState({
    user_id: user?.id,
    email: user?.email,
    name: user?.full_name,
    qr_code: `dalepay://pay/${user?.id}`
  });

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  const shareQRCode = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Send me money on DalePay',
        text: `Send me money instantly using DalePay: ${user?.email}`,
        url: qrCodeData.qr_code
      });
    } else {
      copyToClipboard(`Send me money on DalePay: ${user?.email}`);
    }
  };

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
          <div className="bg-gradient-to-r from-green-600 to-blue-600 p-6 text-white text-center">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold mb-2">Receive Money</h1>
            <p className="text-green-100">Share your payment details</p>
          </div>

          <div className="p-6 space-y-6">
            {/* QR Code Section */}
            <div className="text-center">
              <h3 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4`}>
                Your QR Code
              </h3>
              
              <div className={`inline-block p-8 rounded-2xl ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} mb-4`}>
                <div className="w-48 h-48 bg-white rounded-xl flex items-center justify-center mx-auto">
                  {/* QR Code Placeholder */}
                  <div className="grid grid-cols-8 gap-1">
                    {Array.from({ length: 64 }, (_, i) => (
                      <div
                        key={i}
                        className={`w-2 h-2 ${
                          Math.random() > 0.5 ? 'bg-black' : 'bg-white'
                        }`}
                      ></div>
                    ))}
                  </div>
                </div>
              </div>

              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-4`}>
                Anyone can scan this code to send you money instantly
              </p>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => copyToClipboard(qrCodeData.qr_code)}
                  className={`py-3 px-4 rounded-lg font-medium transition-colors ${
                    darkMode ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-900'
                  }`}
                >
                  📋 Copy Link
                </button>
                <button
                  onClick={shareQRCode}
                  className="bg-gradient-to-r from-green-600 to-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:from-green-700 hover:to-blue-700 transition-all"
                >
                  📱 Share
                </button>
              </div>
            </div>

            {/* Payment Details */}
            <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
              <h4 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'} mb-3`}>
                Your Payment Details
              </h4>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Email:</span>
                  <div className="flex items-center space-x-2">
                    <span className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {user?.email}
                    </span>
                    <button
                      onClick={() => copyToClipboard(user?.email)}
                      className={`p-1 rounded ${darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-200'}`}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </button>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Phone:</span>
                  <div className="flex items-center space-x-2">
                    <span className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {user?.phone || 'Not provided'}
                    </span>
                    {user?.phone && (
                      <button
                        onClick={() => copyToClipboard(user?.phone)}
                        className={`p-1 rounded ${darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-200'}`}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Name:</span>
                  <span className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {user?.full_name}
                  </span>
                </div>
              </div>
            </div>

            {/* Instructions */}
            <div className={`p-4 rounded-lg ${darkMode ? 'bg-blue-900/20 border-blue-700' : 'bg-blue-50 border-blue-200'} border`}>
              <h4 className="text-blue-600 font-medium text-sm mb-2">How to receive money</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-start">
                  <span className="mr-2">1️⃣</span>
                  <span className={darkMode ? 'text-blue-300' : 'text-blue-700'}>
                    Share your QR code or payment details with the sender
                  </span>
                </div>
                <div className="flex items-start">
                  <span className="mr-2">2️⃣</span>
                  <span className={darkMode ? 'text-blue-300' : 'text-blue-700'}>
                    They enter the amount and send money instantly
                  </span>
                </div>
                <div className="flex items-start">
                  <span className="mr-2">3️⃣</span>
                  <span className={darkMode ? 'text-blue-300' : 'text-blue-700'}>
                    You'll receive a notification when the money arrives
                  </span>
                </div>
              </div>
            </div>

            {/* Security Notice */}
            <div className={`p-4 rounded-lg ${darkMode ? 'bg-green-900/20 border-green-700' : 'bg-green-50 border-green-200'} border`}>
              <div className="flex items-start space-x-3">
                <svg className="w-5 h-5 text-green-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                </svg>
                <div>
                  <h4 className="text-green-600 font-medium text-sm">Secure & Protected</h4>
                  <p className={`text-xs mt-1 ${darkMode ? 'text-green-300' : 'text-green-700'}`}>
                    All payments are encrypted and monitored for fraud protection. Only share your details with trusted contacts.
                  </p>
                </div>
              </div>
            </div>

            {/* Recent Requests (Placeholder) */}
            <div>
              <h4 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'} mb-3`}>
                Recent Payment Requests
              </h4>
              <div className="text-center py-8">
                <div className="text-4xl mb-3">💰</div>
                <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} text-sm`}>
                  No recent payment requests
                </p>
                <p className={`${darkMode ? 'text-gray-500' : 'text-gray-500'} text-xs mt-1`}>
                  Payment requests will appear here
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Puerto Rican Pride */}
        <div className="text-center py-6">
          <div className="flex items-center justify-center space-x-2 text-gray-500 mb-2">
            <span className="text-2xl">🇵🇷</span>
            <span className="text-sm font-medium">Serving Puerto Rico with pride</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReceiveMoney;
