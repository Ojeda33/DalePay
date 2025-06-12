import React, { useEffect, useState, useRef } from 'react';

const Homepage = ({ onShowLogin }) => {
  const [showLogin, setShowLogin] = useState(false);

  if (showLogin) {
    return <LoginSystem onLogin={onShowLogin} onBack={() => setShowLogin(false)} />;
  }
  const [coins, setCoins] = useState([]);
  const [scrollY, setScrollY] = useState(0);
  const [isVisible, setIsVisible] = useState({});
  const sectionsRef = useRef({});

  useEffect(() => {
    // Create floating coins animation
    const coinElements = [];
    for (let i = 0; i < 20; i++) {
      coinElements.push({
        id: i,
        left: Math.random() * 100,
        animationDelay: Math.random() * 5,
        size: Math.random() * 25 + 15,
        top: Math.random() * 100,
        duration: Math.random() * 10 + 10
      });
    }
    setCoins(coinElements);

    // Parallax scroll effect
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);

    // Intersection Observer for animations
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsVisible(prev => ({
            ...prev,
            [entry.target.id]: entry.isIntersecting
          }));
        });
      },
      { threshold: 0.1 }
    );

    // Observe all sections
    Object.values(sectionsRef.current).forEach(ref => {
      if (ref) observer.observe(ref);
    });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      observer.disconnect();
    };
  }, []);

  const features = [
    {
      icon: '💸',
      title: 'Transferencias Reales',
      description: 'Envía dinero real instantáneamente a cualquier usuario DalePay™ en Puerto Rico y el mundo',
      benefit: 'Sin esperas, sin complicaciones'
    },
    {
      icon: '💳',
      title: 'Wallet Digital Completo',
      description: 'Tu billetera digital con tecnología Moov licenciada y protegida por FDIC',
      benefit: 'Máxima seguridad garantizada'
    },
    {
      icon: '🏪',
      title: 'Pagos de Negocio',
      description: 'Paga en DoorDash, Uber Eats, ATH Móvil y miles de negocios locales',
      benefit: 'Todo en una sola app'
    },
    {
      icon: '₿',
      title: 'Crypto Integrado',
      description: 'Bitcoin, Ethereum, USDC y más con precios en tiempo real',
      benefit: 'El futuro del dinero, hoy'
    },
    {
      icon: '🔒',
      title: 'Súper Seguro',
      description: 'Licenciado por FinCEN, protegido por FDIC, encriptación nivel bancario',
      benefit: 'Tu dinero está protegido'
    },
    {
      icon: '🇵🇷',
      title: 'Hecho por Taínos',
      description: '100% propiedad de la Nación Maya-We, por boricuas para boricuas',
      benefit: 'Apoyando nuestra economía'
    }
  ];

  const securityFeatures = [
    {
      icon: '🏦',
      title: 'Licenciado FinCEN',
      description: 'Cumplimiento completo con regulaciones federales de transmisión de dinero'
    },
    {
      icon: '🛡️',
      title: 'Protección FDIC',
      description: 'Tus fondos están asegurados hasta los límites aplicables'
    },
    {
      icon: '🔐',
      title: 'Encriptación Militar',
      description: 'Protección de datos con estándares de seguridad nivel bancario'
    },
    {
      icon: '🎯',
      title: 'Anti-Fraude',
      description: 'Monitoreo 24/7 con inteligencia artificial para detectar actividad sospechosa'
    }
  ];

  const testimonials = [
    {
      name: 'María Rodríguez',
      location: 'San Juan',
      text: 'DalePay cambió mi vida. Ahora puedo enviar dinero a mi familia en segundos, sin filas ni esperas.',
      avatar: '👩‍💼',
      rating: 5
    },
    {
      name: 'Carlos Vélez',
      location: 'Bayamón',
      text: 'Perfecto para mi colmado. Los pagos llegan al instante y mis clientes están felices.',
      avatar: '👨‍💻',
      rating: 5
    },
    {
      name: 'Ana Torres',
      location: 'Ponce',
      text: 'El crypto wallet es increíble. Puedo manejar Bitcoin y dólares en la misma app.',
      avatar: '👩‍🎓',
      rating: 5
    },
    {
      name: 'Luis Santiago',
      location: 'Caguas',
      text: 'Como empresario, DalePay me ahorra tiempo y dinero. Las tarifas son justas y transparentes.',
      avatar: '👨‍🎨',
      rating: 5
    }
  ];

  const stats = [
    { number: '50K+', label: 'Usuarios Activos' },
    { number: '$2M+', label: 'Transferido Mensual' },
    { number: '1,200+', label: 'Negocios Registrados' },
    { number: '99.9%', label: 'Uptime Garantizado' }
  ];

  return (
    <div className="relative overflow-hidden bg-gray-900">
      {/* Floating Coins Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {coins.map(coin => (
          <div
            key={coin.id}
            className="absolute text-yellow-400 opacity-20"
            style={{
              left: `${coin.left}%`,
              top: `${coin.top}%`,
              fontSize: `${coin.size}px`,
              transform: `translateY(${Math.sin(scrollY * 0.01 + coin.id) * 20}px)`,
              animation: `float ${coin.duration}s ease-in-out infinite`
            }}
          >
            💰
          </div>
        ))}
      </div>

      {/* Hero Section with Parallax */}
      <section 
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
        style={{
          background: `linear-gradient(135deg, #1e3a8a 0%, #7c3aed 25%, #dc2626 50%, #ea580c 75%, #eab308 100%)`,
          transform: `translateY(${scrollY * 0.5}px)`
        }}
      >
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-64 h-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
          <div className="absolute top-40 right-10 w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
          <div className="absolute bottom-20 left-1/3 w-64 h-64 bg-red-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000"></div>
        </div>

        <div className="relative z-10 text-center px-4 max-w-6xl mx-auto">
          <div className="mb-8">
            <div className="w-32 h-32 bg-white rounded-full mx-auto mb-6 flex items-center justify-center shadow-2xl transform hover:scale-110 transition-transform duration-500">
              <span className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-red-600">
                D
              </span>
            </div>
            <h1 className="text-6xl md:text-8xl font-bold text-white mb-4 animate-fade-in-up">
              Dale<span className="text-yellow-300">Pay</span>™
            </h1>
            <p className="text-3xl md:text-4xl mb-2 text-blue-100 animate-fade-in-up animation-delay-500">
              El Cash App de Puerto Rico
            </p>
            <p className="text-xl md:text-2xl text-blue-200 mb-8 animate-fade-in-up animation-delay-1000">
              100% Taíno • Licenciado • Seguro • Instantáneo
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 animate-fade-in-up animation-delay-1500">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 transform hover:scale-105 transition-transform duration-300">
              <div className="text-4xl mb-4">🏆</div>
              <h3 className="text-2xl font-bold mb-3 text-white">Líder en PR</h3>
              <p className="text-blue-100">La app de pagos más confiable de Puerto Rico</p>
            </div>
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 transform hover:scale-105 transition-transform duration-300">
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-2xl font-bold mb-3 text-white">Instantáneo</h3>
              <p className="text-blue-100">Transferencias en tiempo real 24/7</p>
            </div>
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 transform hover:scale-105 transition-transform duration-300">
              <div className="text-4xl mb-4">🔐</div>
              <h3 className="text-2xl font-bold mb-3 text-white">Ultra Seguro</h3>
              <p className="text-blue-100">Licenciado FinCEN • Protegido FDIC</p>
            </div>
          </div>

          <div className="space-y-4 md:space-y-0 md:space-x-6 md:flex md:justify-center animate-fade-in-up animation-delay-2000">
            <button className="w-full md:w-auto bg-white text-blue-600 px-10 py-5 rounded-full text-xl font-bold hover:bg-blue-50 transition-all duration-300 shadow-2xl transform hover:scale-105">
              🇵🇷 Crear Cuenta Gratis
            </button>
            <button className="w-full md:w-auto border-2 border-white text-white px-10 py-5 rounded-full text-xl font-bold hover:bg-white hover:text-blue-600 transition-all duration-300">
              ▶️ Ver Demo
            </button>
          </div>

          {/* Stats Counter */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 animate-fade-in-up animation-delay-2500">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-yellow-300 mb-2">
                  {stat.number}
                </div>
                <div className="text-sm md:text-base text-blue-200">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white rounded-full mt-2"></div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section 
        id="features"
        ref={el => sectionsRef.current.features = el}
        className="py-20 px-4 bg-white relative z-10"
      >
        <div className="max-w-7xl mx-auto">
          <div className={`text-center mb-16 transition-all duration-1000 ${
            isVisible.features ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            <h2 className="text-5xl font-bold text-gray-800 mb-6">
              Todo lo que necesitas para ser libre financieramente
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              DalePay™ no es solo una app, es la revolución financiera que Puerto Rico necesitaba. 
              Creada por taínos, para nuestra gente.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className={`bg-gradient-to-br from-blue-50 to-purple-50 rounded-3xl p-8 text-center hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 border border-blue-100 ${
                  isVisible.features ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="text-6xl mb-6 transform hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600 mb-4 leading-relaxed">
                  {feature.description}
                </p>
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 px-4 rounded-full text-sm font-medium">
                  {feature.benefit}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Security Section */}
      <section 
        id="security"
        ref={el => sectionsRef.current.security = el}
        className="py-20 px-4 bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 text-white relative z-10"
      >
        <div className="max-w-6xl mx-auto">
          <div className={`text-center mb-16 transition-all duration-1000 ${
            isVisible.security ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            <h2 className="text-5xl font-bold mb-6">
              Tu dinero está más seguro que en un banco
            </h2>
            <p className="text-xl text-blue-200 max-w-3xl mx-auto">
              Utilizamos la misma tecnología que usan los bancos más grandes del mundo, 
              pero con la calidez y confianza de nuestra cultura taína.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {securityFeatures.map((feature, index) => (
              <div 
                key={index}
                className={`text-center p-6 rounded-2xl bg-white/10 backdrop-blur-lg border border-white/20 hover:bg-white/20 transition-all duration-300 ${
                  isVisible.security ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                <div className="text-5xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-blue-200 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>

          <div className={`mt-16 text-center transition-all duration-1000 delay-500 ${
            isVisible.security ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            <div className="bg-green-600 text-white py-4 px-8 rounded-full inline-flex items-center space-x-2 text-lg font-bold">
              <span>✅</span>
              <span>Certificado por FinCEN • Protegido por FDIC • Auditado Regularmente</span>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section 
        id="testimonials"
        ref={el => sectionsRef.current.testimonials = el}
        className="py-20 px-4 bg-gray-50 relative z-10"
      >
        <div className="max-w-7xl mx-auto">
          <div className={`text-center mb-16 transition-all duration-1000 ${
            isVisible.testimonials ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            <h2 className="text-5xl font-bold text-gray-800 mb-6">
              Lo que dice nuestra gente
            </h2>
            <p className="text-xl text-gray-600">
              Miles de boricuas ya confían en DalePay™ para manejar su dinero
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {testimonials.map((testimonial, index) => (
              <div 
                key={index}
                className={`bg-white rounded-3xl p-8 shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 ${
                  isVisible.testimonials ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="text-center mb-6">
                  <div className="text-5xl mb-3">{testimonial.avatar}</div>
                  <div className="flex justify-center space-x-1 mb-2">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <span key={i} className="text-yellow-400 text-xl">⭐</span>
                    ))}
                  </div>
                </div>
                <p className="text-gray-700 mb-6 leading-relaxed italic">
                  "{testimonial.text}"
                </p>
                <div className="text-center">
                  <h4 className="font-bold text-gray-800">{testimonial.name}</h4>
                  <p className="text-gray-500 text-sm">{testimonial.location}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Taíno Heritage Section */}
      <section 
        id="heritage"
        ref={el => sectionsRef.current.heritage = el}
        className="py-20 px-4 bg-gradient-to-r from-red-600 via-yellow-500 to-blue-600 text-white relative z-10"
      >
        <div className="max-w-4xl mx-auto text-center">
          <div className={`transition-all duration-1000 ${
            isVisible.heritage ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            <div className="text-8xl mb-8">🇵🇷</div>
            <h2 className="text-5xl font-bold mb-8">
              Orgullosamente Taíno • 100% Boricua
            </h2>
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 mb-8 border border-white/20">
              <p className="text-2xl mb-6 leading-relaxed">
                DalePay™ es propiedad intelectual de la <strong>Nación Maya-We</strong>, 
                creada humildemente por taínos para nuestra comunidad boricua y el mundo.
              </p>
              <p className="text-xl text-blue-200 leading-relaxed">
                Cada transacción que haces fortalece nuestra economía local y apoya 
                el crecimiento de negocios puertorriqueños. Juntos construimos el futuro financiero de Borinquen.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white/10 rounded-2xl p-6 border border-white/20">
                <h3 className="text-2xl font-bold mb-2">Económico</h3>
                <p className="text-blue-200">Tarifas justas y transparentes para nuestra gente</p>
              </div>
              <div className="bg-white/10 rounded-2xl p-6 border border-white/20">
                <h3 className="text-2xl font-bold mb-2">Local</h3>
                <p className="text-blue-200">Soporte en español 24/7 desde Puerto Rico</p>
              </div>
              <div className="bg-white/10 rounded-2xl p-6 border border-white/20">
                <h3 className="text-2xl font-bold mb-2">Confiable</h3>
                <p className="text-blue-200">Licenciado y regulado por el gobierno federal</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section 
        id="cta"
        ref={el => sectionsRef.current.cta = el}
        className="py-20 px-4 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white relative z-10"
      >
        <div className="max-w-4xl mx-auto text-center">
          <div className={`transition-all duration-1000 ${
            isVisible.cta ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            <h2 className="text-6xl font-bold mb-8">
              ¿Listo para la revolución financiera?
            </h2>
            <p className="text-2xl mb-12 text-blue-200">
              Únete a la familia DalePay™ y toma control de tu futuro financiero hoy mismo
            </p>
            
            <div className="space-y-6 md:space-y-0 md:space-x-8 md:flex md:justify-center mb-12">
              <button className="w-full md:w-auto bg-white text-blue-600 px-12 py-6 rounded-full text-xl font-bold hover:bg-blue-50 transition-all duration-300 shadow-2xl transform hover:scale-105">
                🚀 Crear Cuenta Gratis
              </button>
              <button className="w-full md:w-auto border-2 border-white text-white px-12 py-6 rounded-full text-xl font-bold hover:bg-white hover:text-blue-600 transition-all duration-300">
                📱 Descargar App
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center mb-12">
              <div>
                <div className="text-3xl font-bold text-yellow-300">🆓</div>
                <div className="text-sm">Gratis para siempre</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-yellow-300">⚡</div>
                <div className="text-sm">Configuración en 2 min</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-yellow-300">🔒</div>
                <div className="text-sm">100% Seguro</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-yellow-300">🇵🇷</div>
                <div className="text-sm">Hecho en PR</div>
              </div>
            </div>

            <div className="text-center">
              <p className="text-blue-200 mb-4">Confiado por:</p>
              <div className="flex justify-center items-center space-x-8 text-white/80">
                <span className="font-bold text-lg">FinCEN</span>
                <span>•</span>
                <span className="font-bold text-lg">Moov</span>
                <span>•</span>
                <span className="font-bold text-lg">FDIC</span>
                <span>•</span>
                <span className="font-bold text-lg">Maya-We Nation</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CSS for animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fade-in-up 1s ease-out forwards;
        }
        .animation-delay-500 {
          animation-delay: 0.5s;
        }
        .animation-delay-1000 {
          animation-delay: 1s;
        }
        .animation-delay-1500 {
          animation-delay: 1.5s;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-2500 {
          animation-delay: 2.5s;
        }
      `}</style>
    </div>
  );
};

export default Homepage;
