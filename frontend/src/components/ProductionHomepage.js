import React, { useState, useEffect } from 'react';
import LoginSystem from './LoginSystem';
import EditStudio from './EditStudio';

const ProductionHomepage = ({ onLogin, darkMode, onToggleDarkMode }) => {
  const [showLogin, setShowLogin] = useState(false);
  const [showEditStudio, setShowEditStudio] = useState(false);
  const [showDemo, setShowDemo] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [isVisible, setIsVisible] = useState({});

  // High-quality 4K images of people using DalePay
  const dalePayImages = [
    'https://images.unsplash.com/photo-1681826291722-70bd7e9e6fc3',
    'https://images.pexels.com/photos/230544/pexels-photo-230544.jpeg',
    'https://images.pexels.com/photos/6694565/pexels-photo-6694565.jpeg',
    'https://images.pexels.com/photos/9432431/pexels-photo-9432431.jpeg'
  ];

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

  const handleWatchDemo = () => {
    setShowDemo(true);
  };

  if (showEditStudio) {
    return <EditStudio onClose={() => setShowEditStudio(false)} darkMode={darkMode} />;
  }

  if (showDemo) {
    return (
      <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'} flex items-center justify-center`}>
        <div className={`max-w-4xl mx-auto p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-xl`}>
          <div className="text-center mb-6">
            <button
              onClick={() => setShowDemo(false)}
              className={`mb-4 flex items-center space-x-2 ${
                darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'
              } transition-colors mx-auto`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span>Back to Home</span>
            </button>
            <h2 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4`}>
              DalePay Demo
            </h2>
          </div>
          
          <div className="aspect-video bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
            <div className="text-center text-white">
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd"/>
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Interactive Demo Coming Soon!</h3>
              <p className="text-blue-100 mb-4">
                Experience DalePay's features with our interactive demo
              </p>
              <button
                onClick={() => setShowLogin(true)}
                className="bg-white text-blue-600 px-6 py-3 rounded-lg font-bold hover:bg-gray-100 transition-all"
              >
                Try Real App Instead
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
                  Modern Banking
                </p>
              </div>
            </div>

            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className={`${darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors`}>
                Features
              </a>
              <a href="#users" className={`${darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors`}>
                Real Users
              </a>
              <button
                onClick={() => setShowEditStudio(true)}
                className={`${darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors`}
              >
                🎨 Edit Studio
              </button>
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

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setShowLogin(true)}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-xl font-medium"
              >
                Login
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
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-6 leading-tight">
              <span className="bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent">
                Banking
              </span>
              <br />
              <span className="text-white">Simplified</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-white/80 mb-8 max-w-3xl mx-auto leading-relaxed">
              Puerto Rico's modern digital wallet. Send, receive, and manage money with 
              <span className="font-semibold text-yellow-300"> instant transfers</span> and 
              <span className="font-semibold text-green-300"> secure banking</span>.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 mb-12">
              <button
                onClick={() => setShowLogin(true)}
                className="w-full sm:w-auto bg-white text-gray-900 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-gray-100 transition-all transform hover:scale-105 shadow-2xl"
              >
                Start Banking Today
              </button>
              <button 
                onClick={handleWatchDemo}
                className="w-full sm:w-auto border-2 border-white text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-white hover:text-gray-900 transition-all transform hover:scale-105"
              >
                📺 Watch Demo
              </button>
            </div>

            {/* Social Proof */}
            <div className="text-center">
              <p className="text-white/60 text-sm mb-4">Trusted by thousands in Puerto Rico</p>
              <div className="flex items-center justify-center space-x-8 text-white/40">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">10K+</div>
                  <div className="text-sm">Active Users</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">$2M+</div>
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

      {/* Real Users Section with 4K Images */}
      <section 
        id="users" 
        className={`py-24 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`text-center mb-16 transform transition-all duration-1000 ${
            isVisible.users ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}>
            <h2 className={`text-4xl md:text-5xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-6`}>
              Real People, Real Results
            </h2>
            <p className={`text-xl ${darkMode ? 'text-gray-300' : 'text-gray-600'} max-w-3xl mx-auto`}>
              See how people across Puerto Rico are using DalePay to transform their financial lives.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {dalePayImages.map((image, index) => (
              <div
                key={index}
                className={`transform transition-all duration-1000 hover:scale-105 ${
                  isVisible.users ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                }`}
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                <div className={`rounded-3xl overflow-hidden shadow-xl ${
                  darkMode ? 'bg-gray-700' : 'bg-gray-50'
                }`}>
                  <div className="aspect-[4/5] relative overflow-hidden">
                    <img
                      src={image}
                      alt={`DalePay user ${index + 1}`}
                      className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                    <div className="absolute bottom-4 left-4 right-4 text-white">
                      <div className="flex items-center space-x-2 mb-2">
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                          <span className="text-white font-bold text-sm">$</span>
                        </div>
                        <span className="font-medium">DalePay User</span>
                      </div>
                      <p className="text-sm opacity-90">
                        {index === 0 && "Sending money made simple"}
                        {index === 1 && "Managing finances on the go"}
                        {index === 2 && "Banking with confidence"}
                        {index === 3 && "Modern mobile banking"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section 
        id="features" 
        className={`py-24 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`text-center mb-16 transform transition-all duration-1000 ${
            isVisible.features ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}>
            <h2 className={`text-4xl md:text-5xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-6`}>
              Everything You Need
            </h2>
            <p className={`text-xl ${darkMode ? 'text-gray-300' : 'text-gray-600'} max-w-3xl mx-auto`}>
              Professional banking features designed for modern life.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: "⚡",
                title: "Instant Transfers",
                description: "Send money instantly. No waiting, no delays, just fast transfers.",
                color: "from-yellow-400 to-orange-500"
              },
              {
                icon: "🔒",
                title: "Secure Banking",
                description: "Bank-level encryption and security keep your money safe.",
                color: "from-blue-400 to-purple-500"
              },
              {
                icon: "📱",
                title: "Mobile First",
                description: "Beautiful mobile app that makes banking a pleasure.",
                color: "from-purple-400 to-pink-500"
              },
              {
                icon: "💳",
                title: "Real Cards",
                description: "Physical and virtual cards that work everywhere.",
                color: "from-red-400 to-pink-500"
              },
              {
                icon: "📊",
                title: "Smart Analytics",
                description: "Track spending and get insights into your finances.",
                color: "from-indigo-400 to-purple-500"
              },
              {
                icon: "🎨",
                title: "Customizable",
                description: "Use our Edit Studio to customize your experience.",
                color: "from-green-400 to-blue-500"
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
                  darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-100'
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

      {/* CTA Section */}
      <section className={`py-24 ${darkMode ? 'bg-gradient-to-r from-blue-900 to-purple-900' : 'bg-gradient-to-r from-blue-600 to-purple-600'} text-white`}>
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands who've already made the switch to modern banking.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            <button
              onClick={() => setShowLogin(true)}
              className="w-full sm:w-auto bg-white text-gray-900 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-gray-100 transition-all transform hover:scale-105 shadow-2xl"
            >
              Open Your Account
            </button>
            <button 
              onClick={handleWatchDemo}
              className="w-full sm:w-auto border-2 border-white text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-white hover:text-gray-900 transition-all"
            >
              Watch Demo
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProductionHomepage;