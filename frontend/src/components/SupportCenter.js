import React, { useState } from 'react';

const SupportCenter = ({ user, onBack, darkMode }) => {
  const [activeTab, setActiveTab] = useState('help');
  const [ticketForm, setTicketForm] = useState({
    subject: '',
    category: '',
    priority: 'medium',
    description: ''
  });

  const faqs = [
    {
      question: "How do I send money to someone?",
      answer: "Go to the Send Money section, enter the recipient's email or phone number, specify the amount, and confirm the transfer. Money can be sent instantly or via standard transfer."
    },
    {
      question: "What are the transfer limits?",
      answer: "Basic accounts have a $2,500 daily limit and $10,000 monthly limit. Premium accounts have higher limits. Limits can be increased with identity verification."
    },
    {
      question: "How long do transfers take?",
      answer: "Instant transfers arrive in seconds with a 1.5% fee. Standard transfers are free and take 1-2 business days."
    },
    {
      question: "Is my money safe with DalePay?",
      answer: "Yes, DalePay is FinCEN licensed and uses bank-level security. All funds are FDIC insured through our banking partners."
    },
    {
      question: "How do I link my bank account?",
      answer: "Go to Settings > Bank Accounts and follow the secure linking process. You can link via instant connection or manual entry."
    }
  ];

  const submitTicket = () => {
    if (!ticketForm.subject || !ticketForm.description) {
      alert('Please fill in all required fields');
      return;
    }
    
    alert('Support ticket submitted successfully! We\'ll get back to you within 24 hours.');
    setTicketForm({
      subject: '',
      category: '',
      priority: 'medium',
      description: ''
    });
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
          <div className="bg-gradient-to-r from-blue-600 to-green-600 p-6 text-white">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold">Support Center</h1>
                <p className="text-blue-100">We're here to help you succeed</p>
              </div>
            </div>
          </div>

          <div className="p-6">
            {/* Contact Options */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className={`p-4 rounded-lg text-center ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                <div className="text-3xl mb-2">💬</div>
                <h3 className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-1`}>
                  Live Chat
                </h3>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-3`}>
                  Get instant help
                </p>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                  Start Chat
                </button>
              </div>

              <div className={`p-4 rounded-lg text-center ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                <div className="text-3xl mb-2">📧</div>
                <h3 className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-1`}>
                  Email Support
                </h3>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-3`}>
                  24 hour response
                </p>
                <a href="mailto:support@dalepay.com" className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors inline-block">
                  Send Email
                </a>
              </div>

              <div className={`p-4 rounded-lg text-center ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                <div className="text-3xl mb-2">📞</div>
                <h3 className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-1`}>
                  Phone Support
                </h3>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-3`}>
                  Mon-Fri 9AM-6PM EST
                </p>
                <a href="tel:+1-787-XXX-XXXX" className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors inline-block">
                  Call Now
                </a>
              </div>
            </div>

            {/* Tab Navigation */}
            <div className={`border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'} mb-6`}>
              <nav className="flex space-x-8">
                {['help', 'contact', 'status'].map((tab) => (
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
                    {tab === 'help' ? 'FAQ' : tab}
                  </button>
                ))}
              </nav>
            </div>

            {/* FAQ Tab */}
            {activeTab === 'help' && (
              <div className="space-y-4">
                <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4`}>
                  Frequently Asked Questions
                </h2>
                {faqs.map((faq, index) => (
                  <div key={index} className={`border rounded-lg ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    <details className="group">
                      <summary className={`flex items-center justify-between p-4 cursor-pointer ${
                        darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
                      }`}>
                        <h3 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          {faq.question}
                        </h3>
                        <svg className="w-5 h-5 text-gray-500 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </summary>
                      <div className={`p-4 pt-0 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        {faq.answer}
                      </div>
                    </details>
                  </div>
                ))}
              </div>
            )}

            {/* Contact Tab */}
            {activeTab === 'contact' && (
              <div className="space-y-6">
                <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Submit a Support Ticket
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                      Subject *
                    </label>
                    <input
                      type="text"
                      value={ticketForm.subject}
                      onChange={(e) => setTicketForm({...ticketForm, subject: e.target.value})}
                      className={`w-full px-4 py-3 rounded-lg border ${
                        darkMode 
                          ? 'bg-gray-700 border-gray-600 text-white' 
                          : 'bg-gray-50 border-gray-300 text-gray-900'
                      } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      placeholder="Brief description of your issue"
                    />
                  </div>

                  <div>
                    <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                      Category
                    </label>
                    <select
                      value={ticketForm.category}
                      onChange={(e) => setTicketForm({...ticketForm, category: e.target.value})}
                      className={`w-full px-4 py-3 rounded-lg border ${
                        darkMode 
                          ? 'bg-gray-700 border-gray-600 text-white' 
                          : 'bg-gray-50 border-gray-300 text-gray-900'
                      } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    >
                      <option value="">Select category</option>
                      <option value="account">Account Issues</option>
                      <option value="transfers">Transfers & Payments</option>
                      <option value="security">Security Concerns</option>
                      <option value="technical">Technical Problems</option>
                      <option value="billing">Billing Questions</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                    Priority
                  </label>
                  <div className="flex space-x-4">
                    {['low', 'medium', 'high'].map((priority) => (
                      <label key={priority} className="flex items-center">
                        <input
                          type="radio"
                          value={priority}
                          checked={ticketForm.priority === priority}
                          onChange={(e) => setTicketForm({...ticketForm, priority: e.target.value})}
                          className="mr-2"
                        />
                        <span className={`capitalize ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          {priority}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                    Description *
                  </label>
                  <textarea
                    value={ticketForm.description}
                    onChange={(e) => setTicketForm({...ticketForm, description: e.target.value})}
                    rows={6}
                    className={`w-full px-4 py-3 rounded-lg border ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-gray-50 border-gray-300 text-gray-900'
                    } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    placeholder="Please provide detailed information about your issue..."
                  />
                </div>

                <button
                  onClick={submitTicket}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  Submit Ticket
                </button>
              </div>
            )}

            {/* Status Tab */}
            {activeTab === 'status' && (
              <div className="space-y-6">
                <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  System Status
                </h2>
                
                <div className={`p-6 rounded-lg ${darkMode ? 'bg-green-900/20 border-green-700' : 'bg-green-50 border-green-200'} border`}>
                  <div className="flex items-center space-x-3">
                    <div className="w-4 h-4 bg-green-500 rounded-full animate-pulse"></div>
                    <h3 className="text-green-600 font-bold text-lg">All Systems Operational</h3>
                  </div>
                  <p className={`mt-2 ${darkMode ? 'text-green-300' : 'text-green-700'}`}>
                    All DalePay services are running normally.
                  </p>
                </div>

                <div className="space-y-4">
                  {[
                    { service: 'Payment Processing', status: 'operational' },
                    { service: 'Bank Connections', status: 'operational' },
                    { service: 'Mobile App', status: 'operational' },
                    { service: 'Customer Support', status: 'operational' },
                    { service: 'Security Systems', status: 'operational' }
                  ].map((service, index) => (
                    <div key={index} className={`flex items-center justify-between p-4 rounded-lg ${
                      darkMode ? 'bg-gray-700' : 'bg-gray-50'
                    }`}>
                      <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {service.service}
                      </span>
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span className="text-green-600 text-sm font-medium capitalize">
                          {service.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Additional Resources */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className={`p-6 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
            <h3 className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-3`}>
              📚 Knowledge Base
            </h3>
            <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-4`}>
              Browse our comprehensive guides and tutorials to get the most out of DalePay.
            </p>
            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
              Explore Articles →
            </button>
          </div>

          <div className={`p-6 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
            <h3 className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-3`}>
              🚨 Report Fraud
            </h3>
            <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-4`}>
              Suspicious activity? Report it immediately for investigation and protection.
            </p>
            <button className="text-red-600 hover:text-red-700 text-sm font-medium">
              Report Now →
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center py-6">
          <div className="flex items-center justify-center space-x-2 text-gray-500 mb-2">
            <span className="text-lg">🇵🇷</span>
            <span className="text-sm font-medium">Local support for Puerto Rico</span>
          </div>
          <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            DalePay™ Support • Available 24/7 • FinCEN Licensed MSB
          </p>
        </div>
      </div>
    </div>
  );
};

export default SupportCenter;
