import React, { useState, useEffect } from 'react';
import LoginSystem from './LoginSystem';

const ProductionHomepage = ({ onLogin, darkMode, onToggleDarkMode }) => {
  const [showLogin, setShowLogin] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [isVisible, setIsVisible] = useState({});

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsVisible((prev) => ({
            ...prev,
            [entry.target.id]: entry.isIntersecting,
          }));
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll('[id]').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  if (showLogin) {
    return (
      <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-md mx-auto">
            <button
              onClick={() => setShowLogin(false)}
              className={`mb-6 flex items-center space-x-2 ${
                darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'
              } transition-colors`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span>Back to Home</span>
            </button>
            <LoginSystem onLogin={onLogin} darkMode={darkMode} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrollY > 50
          ? darkMode
            ? 'bg-gray-900/95 border-gray-700'
            : 'bg-white/95 border-gray-200'
          : 'bg-transparent'
      } backdrop-blur-lg border-b`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">$</span>
              </div>
              <div>
                <h1 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  DalePay™
                </h1>
                <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  FinCEN Licensed
                </p>
              </div>
            </div>

            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className={`${darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors`}>
                Features
              </a>
              <a href="#security" className={`${darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors`}>
                Security
              </a>
              <a href="#compliance" className={`${darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors`}>
                Compliance
              </a>
              <button
                onClick={onToggleDarkMode}
                className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}
              >
                {darkMode ? (
                  <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd"/>
                  </svg>
                ) : (
                  <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"/>
                  </svg>
                )}
              </button>
              <button
                onClick={() => setShowLogin(true)}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-xl font-medium hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section with Parallax */}
      <section 
        id="hero"
        className={`relative min-h-screen flex items-center justify-center overflow-hidden ${
          darkMode ? 'bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900' : 'bg-gradient-to-br from-blue-600 via-purple-600 to-green-600'
        }`}
        style={{
          transform: `translateY(${scrollY * 0.5}px)`,
        }}
      >
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-green-500/20 rounded-full blur-3xl animate-pulse delay-500"></div>
        </div>

        <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
          <div className={`transform transition-all duration-1000 ${
            isVisible.hero ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}>
            {/* Trust Badges */}
            <div className="flex items-center justify-center space-x-6 mb-8">
              <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-lg rounded-full px-4 py-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-white text-sm font-medium">FinCEN Licensed</span>
              </div>
              <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-lg rounded-full px-4 py-2">
                <svg className="w-4 h-4 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                </svg>
                <span className="text-white text-sm font-medium">FDIC Insured</span>
              </div>
              <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-lg rounded-full px-4 py-2">
                <span className="text-white text-lg">🇵🇷</span>
                <span className="text-white text-sm font-medium">Made in PR</span>
              </div>
            </div>

            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-6 leading-tight">
              <span className="bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent">
                Banking
              </span>
              <br />
              <span className="text-white">Reimagined</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-white/80 mb-8 max-w-3xl mx-auto leading-relaxed">
              Puerto Rico's first FinCEN-licensed digital wallet. Send, receive, and manage money with 
              <span className="font-semibold text-yellow-300"> bank-level security</span> and 
              <span className="font-semibold text-green-300"> instant transfers</span>.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 mb-12">
              <button
                onClick={() => setShowLogin(true)}
                className="w-full sm:w-auto bg-white text-gray-900 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-gray-100 transition-all transform hover:scale-105 shadow-2xl"
              >
                Start Banking Today
              </button>
              <button className="w-full sm:w-auto border-2 border-white text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-white hover:text-gray-900 transition-all transform hover:scale-105">
                Watch Demo
              </button>
            </div>

            {/* Social Proof */}
            <div className="text-center">
              <p className="text-white/60 text-sm mb-4">Trusted by thousands of Puerto Ricans</p>
              <div className="flex items-center justify-center space-x-8 text-white/40">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">50K+</div>
                  <div className="text-sm">Active Users</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">$10M+</div>
                  <div className="text-sm">Transferred</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">99.9%</div>
                  <div className="text-sm">Uptime</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <svg className="w-6 h-6 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* Features Section */}
      <section 
        id="features" 
        className={`py-24 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`text-center mb-16 transform transition-all duration-1000 ${
            isVisible.features ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}>
            <h2 className={`text-4xl md:text-5xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-6`}>
              Everything You Need
            </h2>
            <p className={`text-xl ${darkMode ? 'text-gray-300' : 'text-gray-600'} max-w-3xl mx-auto`}>
              Professional banking features designed for modern Puerto Ricans who demand security, speed, and simplicity.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: "⚡",
                title: "Instant Transfers",
                description: "Send money to anyone in Puerto Rico instantly. No waiting, no delays, just fast transfers.",
                color: "from-yellow-400 to-orange-500"
              },
              {
                icon: "🔒",
                title: "Bank-Level Security",
                description: "End-to-end encryption, biometric authentication, and fraud protection keep your money safe.",
                color: "from-blue-400 to-purple-500"
              },
              {
                icon: "🏛️",
                title: "FDIC Insured",
                description: "Your deposits are protected up to $250,000 through our partnership with FDIC-insured banks.",
                color: "from-green-400 to-blue-500"
              },
              {
                icon: "📱",
                title: "Mobile First",
                description: "Beautifully designed mobile app that makes banking a pleasure, not a chore.",
                color: "from-purple-400 to-pink-500"
              },
              {
                icon: "💳",
                title: "Real Debit Cards",
                description: "Physical and virtual debit cards that work everywhere Visa is accepted worldwide.",
                color: "from-red-400 to-pink-500"
              },
              {
                icon: "📊",
                title: "Smart Analytics",
                description: "Track your spending, set budgets, and get insights into your financial habits.",
                color: "from-indigo-400 to-purple-500"
              }
            ].map((feature, index) => (
              <div
                key={index}
                className={`transform transition-all duration-1000 hover:scale-105 ${
                  isVisible.features ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className={`p-8 rounded-3xl ${
                  darkMode ? 'bg-gray-700 border border-gray-600' : 'bg-gray-50 border border-gray-100'
                } hover:shadow-2xl transition-all duration-300`}>
                  <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center text-2xl mb-6`}>
                    {feature.icon}
                  </div>
                  <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4`}>
                    {feature.title}
                  </h3>
                  <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} leading-relaxed`}>
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Security Section */}
      <section 
        id="security" 
        className={`py-24 ${darkMode ? 'bg-gray-900' : 'bg-gray-900'} text-white`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className={`transform transition-all duration-1000 ${
              isVisible.security ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'
            }`}>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Military-Grade Security
              </h2>
              <p className="text-xl text-gray-300 mb-8">
                Your financial data is protected by the same encryption standards used by the U.S. military and major banks worldwide.
              </p>

              <div className="space-y-6">
                {[
                  {
                    title: "256-bit AES Encryption",
                    description: "All data encrypted in transit and at rest"
                  },
                  {
                    title: "Multi-Factor Authentication",
                    description: "Biometric and SMS verification for ultimate security"
                  },
                  {
                    title: "Real-time Fraud Detection",
                    description: "AI-powered monitoring prevents unauthorized access"
                  },
                  {
                    title: "Zero Liability Protection",
                    description: "100% protection against unauthorized transactions"
                  }
                ].map((item, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg mb-1">{item.title}</h4>
                      <p className="text-gray-400">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className={`transform transition-all duration-1000 ${
              isVisible.security ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'
            }`}>
              <div className="relative">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-8 transform rotate-3 hover:rotate-0 transition-transform duration-300">
                  <div className="bg-white rounded-2xl p-6 text-gray-900">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="font-bold text-lg">Security Dashboard</h3>
                      <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Encryption Status</span>
                        <span className="text-green-600 font-medium">Active</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Last Security Scan</span>
                        <span className="text-gray-600">2 minutes ago</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Threat Level</span>
                        <span className="text-green-600 font-medium">Low</span>
                      </div>
                      <div className="bg-green-100 rounded-lg p-3">
                        <div className="flex items-center space-x-2">
                          <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                          <span className="text-sm font-medium text-green-800">All systems secure</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Compliance Section */}
      <section 
        id="compliance" 
        className={`py-24 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`text-center mb-16 transform transition-all duration-1000 ${
            isVisible.compliance ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}>
            <h2 className={`text-4xl md:text-5xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-6`}>
              Fully Compliant & Licensed
            </h2>
            <p className={`text-xl ${darkMode ? 'text-gray-300' : 'text-gray-600'} max-w-3xl mx-auto`}>
              We meet all federal and local regulatory requirements to operate as a licensed financial institution.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: "FinCEN Registered",
                subtitle: "Money Services Business",
                description: "Registered with the Financial Crimes Enforcement Network",
                badge: "MSB License",
                color: "blue"
              },
              {
                title: "FDIC Insured",
                subtitle: "Up to $250,000",
                description: "Your deposits are protected by federal insurance",
                badge: "FDIC Member",
                color: "green"
              },
              {
                title: "AML Compliant",
                subtitle: "Anti-Money Laundering",
                description: "Full compliance with federal AML regulations",
                badge: "BSA Compliant",
                color: "purple"
              },
              {
                title: "KYC Verified",
                subtitle: "Know Your Customer",
                description: "Identity verification meets federal standards",
                badge: "ID Verified",
                color: "orange"
              }
            ].map((item, index) => (
              <div
                key={index}
                className={`transform transition-all duration-1000 hover:scale-105 ${
                  isVisible.compliance ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className={`p-6 rounded-2xl ${
                  darkMode ? 'bg-gray-700 border border-gray-600' : 'bg-gray-50 border border-gray-100'
                } text-center hover:shadow-xl transition-all duration-300`}>
                  <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium mb-4 ${
                    item.color === 'blue' ? 'bg-blue-100 text-blue-800' :
                    item.color === 'green' ? 'bg-green-100 text-green-800' :
                    item.color === 'purple' ? 'bg-purple-100 text-purple-800' :
                    'bg-orange-100 text-orange-800'
                  }`}>
                    {item.badge}
                  </div>
                  <h3 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
                    {item.title}
                  </h3>
                  <p className={`text-sm font-medium ${
                    item.color === 'blue' ? 'text-blue-600' :
                    item.color === 'green' ? 'text-green-600' :
                    item.color === 'purple' ? 'text-purple-600' :
                    'text-orange-600'
                  } mb-3`}>
                    {item.subtitle}
                  </p>
                  <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={`py-24 ${darkMode ? 'bg-gradient-to-r from-blue-900 to-purple-900' : 'bg-gradient-to-r from-blue-600 to-purple-600'} text-white`}>
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Transform Your Banking?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of Puerto Ricans who've already made the switch to modern, secure digital banking.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            <button
              onClick={() => setShowLogin(true)}
              className="w-full sm:w-auto bg-white text-gray-900 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-gray-100 transition-all transform hover:scale-105 shadow-2xl"
            >
              Open Your Account
            </button>
            <button className="w-full sm:w-auto border-2 border-white text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-white hover:text-gray-900 transition-all">
              Schedule a Demo
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProductionHomepage;
