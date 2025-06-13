import React, { useState, useEffect } from 'react';
import LoginSystem from './LoginSystem';
import EditStudio from './EditStudio';
import { useLanguage, useTranslation } from '../hooks/useLanguage';

const ProductionHomepage = ({ onLogin, darkMode, onToggleDarkMode }) => {
  const [showLogin, setShowLogin] = useState(false);
  const [showEditStudio, setShowEditStudio] = useState(false);
  const [showDemo, setShowDemo] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [isVisible, setIsVisible] = useState({});
  const { language, toggleLanguage } = useLanguage();
  const { t } = useTranslation();

  // Premium high-quality converting images
  const premiumImages = [
    'https://images.unsplash.com/photo-1681826292838-c37fbd22263a',
    'https://images.unsplash.com/photo-1681826291722-70bd7e9e6fc3',
    'https://images.pexels.com/photos/6994855/pexels-photo-6994855.jpeg',
    'https://images.pexels.com/photos/7621136/pexels-photo-7621136.jpeg',
    'https://images.pexels.com/photos/7534377/pexels-photo-7534377.jpeg',
    'https://images.pexels.com/photos/6693652/pexels-photo-6693652.jpeg'
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
        <div className={`max-w-4xl mx-auto p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-3xl shadow-2xl`}>
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
              <span>{t('home')}</span>
            </button>
            <h2 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4`}>
              DalePay {t('watchDemo')}
            </h2>
          </div>
          
          <div className="aspect-video bg-gradient-to-br from-emerald-500 via-blue-600 to-purple-700 rounded-2xl flex items-center justify-center shadow-2xl">
            <div className="text-center text-white">
              <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-lg">
                <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd"/>
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-3">{t('watchDemo')} - Coming Soon!</h3>
              <p className="text-blue-100 mb-6 max-w-md mx-auto">
                Experience DalePay's secure banking features with our interactive demo
              </p>
              <button
                onClick={() => setShowLogin(true)}
                className="bg-white text-emerald-600 px-8 py-3 rounded-xl font-bold hover:bg-gray-100 transition-all transform hover:scale-105 shadow-lg"
              >
                {t('getStarted')}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (showLogin) {
    return (
      <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-emerald-50 to-blue-50'}`}>
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
              <span>{t('home')}</span>
            </button>
            <LoginSystem onLogin={onLogin} darkMode={darkMode} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
      {/* Language Toggle - Fixed position top-right */}
      <div className="fixed top-4 right-4 z-50">
        <button
          onClick={toggleLanguage}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-medium transition-all transform hover:scale-105 shadow-lg ${
            darkMode 
              ? 'bg-gray-800 text-white border border-gray-600 hover:bg-gray-700' 
              : 'bg-white text-gray-900 border border-gray-200 hover:bg-gray-50'
          }`}
        >
          <span className="text-xl">{language === 'en' ? '🇺🇸' : '🇵🇷'}</span>
          <span className="text-sm font-bold">
            {language === 'en' ? 'ES' : 'EN'}
          </span>
        </button>
      </div>

      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrollY > 50
          ? darkMode
            ? 'bg-gray-900/95 border-gray-700'
            : 'bg-white/95 border-gray-200'
          : 'bg-transparent'
      } backdrop-blur-xl border-b`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Premium Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 via-blue-600 to-purple-700 rounded-2xl flex items-center justify-center shadow-lg transform hover:scale-105 transition-all">
                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                  <span className="text-emerald-600 font-black text-lg">$</span>
                </div>
              </div>
              <div>
                <h1 className={`text-2xl font-black bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-700 bg-clip-text text-transparent`}>
                  DalePay™
                </h1>
                <p className={`text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  {t('modernBanking')} • {t('puertoRico')}
                </p>
              </div>
            </div>

            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className={`font-medium ${darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-emerald-600'} transition-colors`}>
                {t('features') || 'Features'}
              </a>
              <a href="#security" className={`font-medium ${darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-emerald-600'} transition-colors`}>
                {t('secureConnection')}
              </a>
              <button
                onClick={() => setShowEditStudio(true)}
                className={`font-medium ${darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-emerald-600'} transition-colors`}
              >
                🎨 {t('editStudio')}
              </button>
              <button
                onClick={onToggleDarkMode}
                className={`p-2 rounded-xl ${darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'} transition-all`}
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
                className="bg-gradient-to-r from-emerald-500 to-blue-600 text-white px-6 py-2.5 rounded-xl font-bold hover:from-emerald-600 hover:to-blue-700 transition-all transform hover:scale-105 shadow-lg"
              >
                {t('getStarted')}
              </button>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setShowLogin(true)}
                className="bg-gradient-to-r from-emerald-500 to-blue-600 text-white px-4 py-2 rounded-xl font-bold"
              >
                {t('login')}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section 
        id="hero"
        className={`relative min-h-screen flex items-center justify-center overflow-hidden ${
          darkMode ? 'bg-gradient-to-br from-gray-900 via-emerald-900 to-blue-900' : 'bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50'
        }`}
        style={{
          transform: `translateY(${scrollY * 0.3}px)`,
        }}
      >
        {/* Premium Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-500"></div>
        </div>

        <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
          <div className={`transform transition-all duration-1000 ${
            isVisible.hero ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}>
            {/* Trust Badges */}
            <div className="flex items-center justify-center space-x-6 mb-8">
              <div className={`flex items-center space-x-2 px-4 py-2 rounded-full ${darkMode ? 'bg-gray-800/60' : 'bg-white/80'} backdrop-blur-lg`}>
                <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
                <span className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>🔒 {t('bankLevelSecurity')}</span>
              </div>
              <div className={`flex items-center space-x-2 px-4 py-2 rounded-full ${darkMode ? 'bg-gray-800/60' : 'bg-white/80'} backdrop-blur-lg`}>
                <span className="text-xl">🇵🇷</span>
                <span className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{t('fincenLicensed')}</span>
              </div>
            </div>

            <h1 className={`text-6xl md:text-8xl lg:text-9xl font-black mb-8 leading-tight ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              <span className="bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-700 bg-clip-text text-transparent">
                {t('modernBanking')}
              </span>
              <br />
              <span className={`${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {language === 'es' ? 'Confiable' : 'Secured'}
              </span>
            </h1>
            
            <p className={`text-2xl md:text-3xl mb-12 max-w-4xl mx-auto leading-relaxed font-medium ${
              darkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>
              {t('digitalWalletDesc')}
              <br />
              <span className="bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent font-bold">
                {language === 'es' ? 'Banca digital del futuro' : 'The future of digital banking'}
              </span>
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 mb-16">
              <button
                onClick={() => setShowLogin(true)}
                className="w-full sm:w-auto bg-gradient-to-r from-emerald-500 to-blue-600 text-white px-10 py-4 rounded-2xl font-bold text-xl hover:from-emerald-600 hover:to-blue-700 transition-all transform hover:scale-105 shadow-2xl"
              >
                💰 {t('getStarted')}
              </button>
              <button 
                onClick={handleWatchDemo}
                className={`w-full sm:w-auto border-2 px-10 py-4 rounded-2xl font-bold text-xl transition-all transform hover:scale-105 ${
                  darkMode 
                    ? 'border-white text-white hover:bg-white hover:text-gray-900' 
                    : 'border-emerald-600 text-emerald-600 hover:bg-emerald-600 hover:text-white'
                }`}
              >
                🎬 {t('watchDemo')}
              </button>
            </div>

            {/* Social Proof */}
            <div className="text-center">
              <p className={`text-lg mb-6 font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {language === 'es' ? 'Confiado por miles en Puerto Rico' : 'Trusted by thousands in Puerto Rico'}
              </p>
              <div className="flex items-center justify-center space-x-12 text-center">
                <div>
                  <div className={`text-4xl font-black ${darkMode ? 'text-white' : 'text-gray-900'}`}>25K+</div>
                  <div className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {language === 'es' ? 'Usuarios Activos' : 'Active Users'}
                  </div>
                </div>
                <div>
                  <div className={`text-4xl font-black ${darkMode ? 'text-white' : 'text-gray-900'}`}>$15M+</div>
                  <div className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {language === 'es' ? 'Transferido' : 'Transferred'}
                  </div>
                </div>
                <div>
                  <div className={`text-4xl font-black ${darkMode ? 'text-white' : 'text-gray-900'}`}>99.9%</div>
                  <div className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {language === 'es' ? 'Tiempo Activo' : 'Uptime'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <svg className={`w-6 h-6 ${darkMode ? 'text-white/60' : 'text-gray-600/60'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* Premium Users Section */}
      <section 
        id="users" 
        className={`py-24 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`text-center mb-16 transform transition-all duration-1000 ${
            isVisible.users ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}>
            <h2 className={`text-5xl md:text-6xl font-black ${darkMode ? 'text-white' : 'text-gray-900'} mb-6`}>
              {language === 'es' ? 'Personas Reales, Resultados Reales' : 'Real People, Real Results'}
            </h2>
            <p className={`text-xl ${darkMode ? 'text-gray-300' : 'text-gray-600'} max-w-3xl mx-auto font-medium`}>
              {language === 'es' 
                ? 'Ve cómo personas en Puerto Rico usan DalePay para transformar sus vidas financieras.' 
                : 'See how people across Puerto Rico use DalePay to transform their financial lives.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {premiumImages.map((image, index) => (
              <div
                key={index}
                className={`transform transition-all duration-1000 hover:scale-105 ${
                  isVisible.users ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                }`}
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                <div className={`rounded-3xl overflow-hidden shadow-2xl ${
                  darkMode ? 'bg-gray-700' : 'bg-white'
                } hover:shadow-3xl transition-all duration-500`}>
                  <div className="aspect-[4/5] relative overflow-hidden">
                    <img
                      src={image}
                      alt={`DalePay user ${index + 1}`}
                      className="w-full h-full object-cover hover:scale-110 transition-transform duration-700"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
                    <div className="absolute bottom-6 left-6 right-6 text-white">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                          <span className="text-white font-bold">$</span>
                        </div>
                        <span className="font-bold text-lg">DalePay User</span>
                      </div>
                      <p className="text-sm opacity-90 font-medium">
                        {language === 'es' ? [
                          "Envío de dinero simplificado",
                          "Administración de finanzas móvil", 
                          "Banca con confianza",
                          "Banca móvil moderna",
                          "Seguridad financiera",
                          "Transferencias instantáneas"
                        ][index] : [
                          "Sending money made simple",
                          "Managing finances on the go",
                          "Banking with confidence", 
                          "Modern mobile banking",
                          "Financial security",
                          "Instant transfers"
                        ][index]}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Security Section */}
      <section 
        id="security" 
        className={`py-24 ${darkMode ? 'bg-gray-900' : 'bg-emerald-50'}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`text-center mb-16 transform transition-all duration-1000 ${
            isVisible.security ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}>
            <h2 className={`text-5xl md:text-6xl font-black ${darkMode ? 'text-white' : 'text-gray-900'} mb-6`}>
              🔒 {t('bankLevelSecurity')}
            </h2>
            <p className={`text-xl ${darkMode ? 'text-gray-300' : 'text-gray-600'} max-w-3xl mx-auto font-medium`}>
              {language === 'es'
                ? 'Tu dinero está protegido con la misma seguridad que usan los bancos más grandes del mundo.'
                : 'Your money is protected with the same security used by the world\'s largest banks.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: "🔒",
                title: language === 'es' ? "Encriptación 256-bit" : "256-bit Encryption",
                description: language === 'es' ? "Protección militar" : "Military-grade protection"
              },
              {
                icon: "🏦",
                title: language === 'es' ? "FDIC Asegurado" : "FDIC Insured",
                description: language === 'es' ? "Hasta $250,000" : "Up to $250,000"
              },
              {
                icon: "🇺🇸",
                title: language === 'es' ? "FinCEN Registrado" : "FinCEN Registered",
                description: language === 'es' ? "Legalmente cumpliente" : "Legally compliant"
              },
              {
                icon: "🔐",
                title: language === 'es' ? "Autenticación Biométrica" : "Biometric Auth",
                description: language === 'es' ? "Face ID y huellas" : "Face ID & fingerprint"
              }
            ].map((feature, index) => (
              <div
                key={index}
                className={`transform transition-all duration-1000 hover:scale-105 ${
                  isVisible.security ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className={`p-8 rounded-3xl text-center ${
                  darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-emerald-100'
                } hover:shadow-2xl transition-all duration-300`}>
                  <div className="text-6xl mb-6">{feature.icon}</div>
                  <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-3`}>
                    {feature.title}
                  </h3>
                  <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} font-medium`}>
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={`py-24 ${darkMode ? 'bg-gradient-to-br from-emerald-900 via-blue-900 to-purple-900' : 'bg-gradient-to-br from-emerald-500 via-blue-600 to-purple-700'} text-white relative overflow-hidden`}>
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full"
               style={{
                 backgroundImage: `radial-gradient(circle at 25% 25%, white 2px, transparent 2px)`,
                 backgroundSize: '50px 50px'
               }}>
          </div>
        </div>
        
        <div className="relative max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-5xl md:text-6xl font-black mb-8">
            {language === 'es' ? '¿Listo para Comenzar?' : 'Ready to Get Started?'}
          </h2>
          <p className="text-2xl text-blue-100 mb-12 font-medium">
            {language === 'es' 
              ? 'Únete a miles que ya han hecho el cambio a la banca moderna.'
              : 'Join thousands who\'ve already made the switch to modern banking.'}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            <button
              onClick={() => setShowLogin(true)}
              className="w-full sm:w-auto bg-white text-emerald-600 px-10 py-4 rounded-2xl font-bold text-xl hover:bg-gray-100 transition-all transform hover:scale-105 shadow-2xl"
            >
              💳 {language === 'es' ? 'Abrir Tu Cuenta' : 'Open Your Account'}
            </button>
            <button 
              onClick={handleWatchDemo}
              className="w-full sm:w-auto border-2 border-white text-white px-10 py-4 rounded-2xl font-bold text-xl hover:bg-white hover:text-emerald-600 transition-all transform hover:scale-105"
            >
              🎬 {t('watchDemo')}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProductionHomepage;