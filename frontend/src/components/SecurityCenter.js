import React, { useState } from 'react';

const SecurityCenter = ({ user, onBack, darkMode }) => {
  const [activeTab, setActiveTab] = useState('overview');

  const securityFeatures = [
    {
      icon: '🔐',
      title: '256-bit Encryption',
      description: 'All data encrypted in transit and at rest',
      status: 'active'
    },
    {
      icon: '📱',
      title: 'Two-Factor Authentication',
      description: 'Extra layer of security for your account',
      status: 'active'
    },
    {
      icon: '🛡️',
      title: 'Fraud Monitoring',
      description: 'AI-powered real-time fraud detection',
      status: 'active'
    },
    {
      icon: '🔍',
      title: 'Device Verification',
      description: 'Verify new devices before access',
      status: 'active'
    }
  ];

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
          <div className="bg-gradient-to-r from-red-600 to-purple-600 p-6 text-white">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold">Security Center</h1>
                <p className="text-red-100">Your financial security dashboard</p>
              </div>
            </div>
          </div>

          <div className="p-6">
            {/* Security Status */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Security Status
                </h2>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-green-600 font-medium">Secure</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {securityFeatures.map((feature, index) => (
                  <div key={index} className={`p-4 rounded-lg border ${
                    darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'
                  }`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{feature.icon}</span>
                        <div>
                          <h3 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            {feature.title}
                          </h3>
                          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            {feature.description}
                          </p>
                        </div>
                      </div>
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tab Navigation */}
            <div className={`border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'} mb-6`}>
              <nav className="flex space-x-8">
                {['overview', 'devices', 'activity'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`py-2 px-1 border-b-2 font-medium text-sm capitalize transition-colors ${
                      activeTab === tab
                        ? 'border-blue-500 text-blue-600'
                        : darkMode
                          ? 'border-transparent text-gray-400 hover:text-gray-300'
                          : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </nav>
            </div>

            {/* Tab Content */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Account Security Score */}
                <div className={`p-6 rounded-lg ${darkMode ? 'bg-green-900/20 border-green-700' : 'bg-green-50 border-green-200'} border`}>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-green-600 font-bold text-lg">Security Score</h3>
                    <span className="text-3xl font-bold text-green-600">95/100</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
                    <div className="bg-green-600 h-3 rounded-full" style={{ width: '95%' }}></div>
                  </div>
                  <p className={`text-sm ${darkMode ? 'text-green-300' : 'text-green-700'}`}>
                    Excellent! Your account has strong security measures in place.
                  </p>
                </div>

                {/* Security Recommendations */}
                <div>
                  <h3 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4`}>
                    Security Recommendations
                  </h3>
                  <div className="space-y-3">
                    <div className={`flex items-center justify-between p-4 rounded-lg ${
                      darkMode ? 'bg-blue-900/20' : 'bg-blue-50'
                    }`}>
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">✅</span>
                        <span className={`font-medium ${darkMode ? 'text-blue-300' : 'text-blue-700'}`}>
                          Enable biometric login
                        </span>
                      </div>
                      <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                        Set up →
                      </button>
                    </div>
                  </div>
                </div>

                {/* Recent Security Events */}
                <div>
                  <h3 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4`}>
                    Recent Security Events
                  </h3>
                  <div className="space-y-3">
                    <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            Successful login
                          </p>
                          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            Today at 2:30 PM • Chrome on macOS
                          </p>
                        </div>
                        <span className="text-green-600">✅</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Compliance Information */}
            <div className={`mt-8 p-6 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
              <h3 className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4`}>
                Regulatory Compliance
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl mb-2">🏛️</div>
                  <h4 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>FinCEN Licensed</h4>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Money Services Business
                  </p>
                </div>
                <div>
                  <div className="text-2xl mb-2">🔒</div>
                  <h4 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>PCI DSS Compliant</h4>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Payment Card Industry Standards
                  </p>
                </div>
                <div>
                  <div className="text-2xl mb-2">🛡️</div>
                  <h4 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>SOC 2 Certified</h4>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Security & Availability
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

export default SecurityCenter;
