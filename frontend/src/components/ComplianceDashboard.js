import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ComplianceDashboard = ({ user, onBack, darkMode }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [complianceLogs, setComplianceLogs] = useState([]);
  const [kycData, setKycData] = useState([]);
  const [amlScreenings, setAmlScreenings] = useState([]);
  const [sarReports, setSarReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchComplianceData();
  }, [activeTab]);

  const fetchComplianceData = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/admin/compliance-logs?limit=50');
      setComplianceLogs(response.data.logs || []);
    } catch (error) {
      console.error('Error fetching compliance data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const getComplianceColor = (action) => {
    const colors = {
      kyc_verification: 'text-blue-600',
      aml_screening: 'text-purple-600',
      user_registration: 'text-green-600',
      suspicious_activity: 'text-red-600',
      sar_generated: 'text-orange-600',
      account_frozen: 'text-red-600',
      manual_review: 'text-yellow-600'
    };
    return colors[action] || 'text-gray-600';
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'} py-8`}>
      <div className="max-w-6xl mx-auto px-4">
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
            <span>Back to Admin</span>
          </button>
        </div>

        <div className={`${
          darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        } rounded-2xl border shadow-xl overflow-hidden`}>
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold">Compliance Dashboard</h1>
                <p className="text-indigo-100">FinCEN & AML Monitoring Center</p>
              </div>
            </div>
          </div>

          <div className="p-6">
            {/* Compliance Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className={`p-4 rounded-lg ${darkMode ? 'bg-blue-900/20' : 'bg-blue-50'} border border-blue-200`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-600 text-sm font-medium">KYC Pending</p>
                    <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>23</p>
                  </div>
                  <span className="text-2xl">📋</span>
                </div>
              </div>

              <div className={`p-4 rounded-lg ${darkMode ? 'bg-purple-900/20' : 'bg-purple-50'} border border-purple-200`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-600 text-sm font-medium">AML Alerts</p>
                    <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>7</p>
                  </div>
                  <span className="text-2xl">🚨</span>
                </div>
              </div>

              <div className={`p-4 rounded-lg ${darkMode ? 'bg-green-900/20' : 'bg-green-50'} border border-green-200`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-600 text-sm font-medium">SAR Reports</p>
                    <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>2</p>
                  </div>
                  <span className="text-2xl">📊</span>
                </div>
              </div>

              <div className={`p-4 rounded-lg ${darkMode ? 'bg-red-900/20' : 'bg-red-50'} border border-red-200`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-red-600 text-sm font-medium">Frozen Accounts</p>
                    <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>1</p>
                  </div>
                  <span className="text-2xl">🔒</span>
                </div>
              </div>
            </div>

            {/* Tab Navigation */}
            <div className={`border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'} mb-6`}>
              <nav className="flex space-x-8">
                {['overview', 'kyc', 'aml', 'reporting'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`py-2 px-1 border-b-2 font-medium text-sm uppercase tracking-wide transition-colors ${
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

            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div>
                  <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4`}>
                    Recent Compliance Activity
                  </h2>
                  
                  {loading ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {complianceLogs.slice(0, 10).map((log, index) => (
                        <div key={index} className={`flex items-center justify-between p-4 rounded-lg ${
                          darkMode ? 'bg-gray-700' : 'bg-gray-50'
                        }`}>
                          <div>
                            <p className={`font-medium ${getComplianceColor(log.action)} capitalize`}>
                              {log.action.replace(/_/g, ' ')}
                            </p>
                            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                              User: {log.user_id || 'System'} • {formatDateTime(log.timestamp)}
                            </p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            log.result === 'approved' ? 'bg-green-100 text-green-800' :
                            log.result === 'rejected' ? 'bg-red-100 text-red-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {log.result || 'Logged'}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Regulatory Status */}
                <div className={`p-6 rounded-lg ${darkMode ? 'bg-green-900/20 border-green-700' : 'bg-green-50 border-green-200'} border`}>
                  <h3 className="text-green-600 font-bold text-lg mb-4">Regulatory Compliance Status</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-2xl mb-2">🏛️</div>
                      <h4 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>FinCEN MSB</h4>
                      <p className="text-green-600 text-sm">Registered & Active</p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl mb-2">🔍</div>
                      <h4 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>AML Program</h4>
                      <p className="text-green-600 text-sm">Compliant</p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl mb-2">📊</div>
                      <h4 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>Reporting</h4>
                      <p className="text-green-600 text-sm">Up to Date</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* KYC Tab */}
            {activeTab === 'kyc' && (
              <div className="space-y-6">
                <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Know Your Customer (KYC) Management
                </h2>
                
                <div className={`p-4 rounded-lg ${darkMode ? 'bg-blue-900/20' : 'bg-blue-50'} border border-blue-200`}>
                  <h3 className="text-blue-600 font-medium mb-2">KYC Requirements</h3>
                  <ul className={`text-sm space-y-1 ${darkMode ? 'text-blue-300' : 'text-blue-700'}`}>
                    <li>• Government-issued photo ID verification</li>
                    <li>• Address verification (utility bill or bank statement)</li>
                    <li>• SSN verification for US persons</li>
                    <li>• Enhanced due diligence for high-risk customers</li>
                  </ul>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                    <h4 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
                      Pending Review
                    </h4>
                    <p className="text-2xl font-bold text-yellow-600">23</p>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Awaiting verification
                    </p>
                  </div>

                  <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                    <h4 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
                      Approved Today
                    </h4>
                    <p className="text-2xl font-bold text-green-600">15</p>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Successfully verified
                    </p>
                  </div>

                  <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                    <h4 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
                      Rejected
                    </h4>
                    <p className="text-2xl font-bold text-red-600">3</p>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Require resubmission
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* AML Tab */}
            {activeTab === 'aml' && (
              <div className="space-y-6">
                <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Anti-Money Laundering (AML) Monitoring
                </h2>
                
                <div className={`p-4 rounded-lg ${darkMode ? 'bg-purple-900/20' : 'bg-purple-50'} border border-purple-200`}>
                  <h3 className="text-purple-600 font-medium mb-2">AML Monitoring Rules</h3>
                  <ul className={`text-sm space-y-1 ${darkMode ? 'text-purple-300' : 'text-purple-700'}`}>
                    <li>• Transactions over $3,000 trigger enhanced monitoring</li>
                    <li>• Velocity checking for rapid successive transfers</li>
                    <li>• Pattern analysis for structuring detection</li>
                    <li>• Real-time sanctions screening (OFAC, EU, UN)</li>
                    <li>• PEP (Politically Exposed Person) screening</li>
                  </ul>
                </div>

                <div>
                  <h3 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'} mb-4`}>
                    Recent AML Alerts
                  </h3>
                  <div className="space-y-3">
                    {[
                      {
                        id: 'AML-001',
                        type: 'High Velocity',
                        user: 'user_12345',
                        amount: '$8,500',
                        status: 'Under Review',
                        time: '2 hours ago'
                      },
                      {
                        id: 'AML-002',
                        type: 'Round Amount Pattern',
                        user: 'user_67890',
                        amount: '$10,000',
                        status: 'Cleared',
                        time: '1 day ago'
                      }
                    ].map((alert, index) => (
                      <div key={index} className={`p-4 rounded-lg border ${
                        darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'
                      }`}>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                              {alert.id} - {alert.type}
                            </p>
                            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                              User: {alert.user} • Amount: {alert.amount} • {alert.time}
                            </p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            alert.status === 'Cleared' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {alert.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Reporting Tab */}
            {activeTab === 'reporting' && (
              <div className="space-y-6">
                <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Regulatory Reporting
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className={`p-6 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                    <h3 className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4`}>
                      Suspicious Activity Reports (SAR)
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>This Month:</span>
                        <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>2 Filed</span>
                      </div>
                      <div className="flex justify-between">
                        <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>This Year:</span>
                        <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>18 Filed</span>
                      </div>
                      <div className="flex justify-between">
                        <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Pending:</span>
                        <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>1 Draft</span>
                      </div>
                    </div>
                    <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700">
                      Generate SAR
                    </button>
                  </div>

                  <div className={`p-6 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                    <h3 className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4`}>
                      Currency Transaction Reports (CTR)
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>This Month:</span>
                        <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>0 Filed</span>
                      </div>
                      <div className="flex justify-between">
                        <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>This Year:</span>
                        <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>5 Filed</span>
                      </div>
                      <div className="flex justify-between">
                        <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Auto-Generated:</span>
                        <span className="text-green-600 font-medium">Enabled</span>
                      </div>
                    </div>
                    <button className="mt-4 bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700">
                      View CTRs
                    </button>
                  </div>
                </div>

                <div className={`p-4 rounded-lg ${darkMode ? 'bg-green-900/20' : 'bg-green-50'} border border-green-200`}>
                  <h3 className="text-green-600 font-medium mb-2">Compliance Certificate</h3>
                  <p className={`text-sm ${darkMode ? 'text-green-300' : 'text-green-700'}`}>
                    DalePay is fully compliant with all FinCEN requirements. Last audit: January 2024. Next audit: January 2025.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComplianceDashboard;
