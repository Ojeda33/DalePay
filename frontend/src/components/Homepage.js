import React, { useEffect, useState } from 'react';

const Homepage = () => {
  const [coins, setCoins] = useState([]);

  useEffect(() => {
    // Create floating coins animation
    const coinElements = [];
    for (let i = 0; i < 15; i++) {
      coinElements.push({
        id: i,
        left: Math.random() * 100,
        animationDelay: Math.random() * 5,
        size: Math.random() * 20 + 10
      });
    }
    setCoins(coinElements);
  }, []);

  const features = [
    {
      icon: '💸',
      title: 'Transferencias Reales',
      description: 'Envía y recibe dinero real instantáneamente'
    },
    {
      icon: '💳',
      title: 'Wallet Digital',
      description: 'Tu billetera digital con tecnología Moov'
    },
    {
      icon: '🏪',
      title: 'Pagos de Negocio',
      description: 'Paga en DoorDash, Uber Eats y más'
    },
    {
      icon: '₿',
      title: 'Crypto Integrado',
      description: 'Bitcoin, Ethereum y más criptomonedas'
    },
    {
      icon: '🔒',
      title: 'Súper Seguro',
      description: 'Licenciado y regulado por FinCEN'
    },
    {
      icon: '🇵🇷',
      title: 'Hecho en Borinquen',
      description: 'Por puertorriqueños, para puertorriqueños'
    }
  ];

  const testimonials = [
    {
      name: 'María Rodriguez',
      location: 'San Juan',
      text: 'DalePay cambió mi vida. Ahora envío dinero a mi familia en segundos.',
      avatar: '👩‍💼'
    },
    {
      name: 'Carlos Vélez',
      location: 'Bayamón',
      text: 'Perfecto para mi negocio. Los pagos llegan instantáneamente.',
      avatar: '👨‍💻'
    },
    {
      name: 'Ana Torres',
      location: 'Ponce',
      text: 'El crypto wallet es increíble. Todo en una sola app.',
      avatar: '👩‍🎓'
    }
  ];

  return (
    <div className="relative overflow-hidden">
      {/* Floating Coins Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {coins.map(coin => (
          <div
            key={coin.id}
            className="absolute text-yellow-400 opacity-20 animate-bounce"
            style={{
              left: `${coin.left}%`,
              animationDelay: `${coin.animationDelay}s`,
              fontSize: `${coin.size}px`,
              top: `${Math.random() * 100}%`
            }}
          >
            💰
          </div>
        ))}
      </div>

      {/* Hero Section */}
      <section className="relative z-10 bg-gradient-to-br from-blue-600 via-purple-600 to-red-600 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8">
            <div className="w-24 h-24 bg-white rounded-full mx-auto mb-6 flex items-center justify-center shadow-2xl">
              <span className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-red-600">
                D
              </span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-4">
              Dale<span className="text-yellow-300">Pay</span>™
            </h1>
            <p className="text-2xl md:text-3xl mb-2 text-blue-100">
              El Cash App de Puerto Rico
            </p>
            <p className="text-xl text-blue-200 mb-8">
              Transferencias reales • Wallet digital • Crypto
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <div className="text-3xl mb-2">🏆</div>
              <h3 className="text-xl font-bold mb-2">Líder en PR</h3>
              <p className="text-blue-100">La app de pagos #1 en Puerto Rico</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <div className="text-3xl mb-2">⚡</div>
              <h3 className="text-xl font-bold mb-2">Súper Rápido</h3>
              <p className="text-blue-100">Transferencias instantáneas 24/7</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <div className="text-3xl mb-2">🔐</div>
              <h3 className="text-xl font-bold mb-2">100% Seguro</h3>
              <p className="text-blue-100">Licenciado y regulado</p>
            </div>
          </div>

          <button className="bg-white text-blue-600 px-8 py-4 rounded-full text-xl font-bold hover:bg-blue-50 transition-all duration-300 shadow-2xl transform hover:scale-105">
            Comenzar Gratis 🇵🇷
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Todo lo que necesitas en una app
            </h2>
            <p className="text-xl text-gray-600">
              DalePay™ es más que una wallet digital
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8 text-center hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-blue-100"
              >
                <div className="text-5xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Puerto Rico Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-red-500 to-blue-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <div className="text-6xl mb-6">🇵🇷</div>
          <h2 className="text-4xl font-bold mb-6">
            Orgullosamente Boricua
          </h2>
          <p className="text-xl mb-8 leading-relaxed">
            DalePay™ nació en Puerto Rico, creado por puertorriqueños que entienden 
            nuestras necesidades financieras. Apoyamos la economía local y conectamos 
            a nuestra gente con el futuro de los pagos digitales.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/10 rounded-xl p-6">
              <h3 className="text-xl font-bold mb-2">Económico</h3>
              <p>Tarifas justas y transparentes</p>
            </div>
            <div className="bg-white/10 rounded-xl p-6">
              <h3 className="text-xl font-bold mb-2">Local</h3>
              <p>Soporte en español 24/7</p>
            </div>
            <div className="bg-white/10 rounded-xl p-6">
              <h3 className="text-xl font-bold mb-2">Confiable</h3>
              <p>Licenciado por el gobierno</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Lo que dice nuestra gente
            </h2>
            <p className="text-xl text-gray-600">
              Miles de puertorriqueños ya confían en DalePay™
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div 
                key={index}
                className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100"
              >
                <div className="text-4xl mb-4">{testimonial.avatar}</div>
                <p className="text-gray-700 mb-6 leading-relaxed">
                  "{testimonial.text}"
                </p>
                <div>
                  <h4 className="font-bold text-gray-800">{testimonial.name}</h4>
                  <p className="text-gray-500">{testimonial.location}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-purple-600 to-blue-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">
            ¿Listo para comenzar?
          </h2>
          <p className="text-xl mb-8">
            Únete a miles de puertorriqueños que ya usan DalePay™
          </p>
          <div className="space-y-4 md:space-y-0 md:space-x-4 md:flex md:justify-center">
            <button className="w-full md:w-auto bg-white text-blue-600 px-8 py-4 rounded-full text-lg font-bold hover:bg-blue-50 transition-all duration-300 shadow-xl">
              Crear Cuenta Gratis
            </button>
            <button className="w-full md:w-auto border-2 border-white text-white px-8 py-4 rounded-full text-lg font-bold hover:bg-white hover:text-blue-600 transition-all duration-300">
              Ver Demo
            </button>
          </div>

          <div className="mt-12 text-center">
            <p className="text-blue-200 mb-4">Confiado por:</p>
            <div className="flex justify-center items-center space-x-8 text-white/80">
              <span className="font-bold">FinCEN</span>
              <span>•</span>
              <span className="font-bold">Moov</span>
              <span>•</span>
              <span className="font-bold">FDIC</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Homepage;
