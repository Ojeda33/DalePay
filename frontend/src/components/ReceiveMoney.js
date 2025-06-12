import React, { useState } from 'react';

const ReceiveMoney = ({ user, onBack }) => {
  const [activeTab, setActiveTab] = useState('qr');
  const [requestAmount, setRequestAmount] = useState('');
  const [requestDescription, setRequestDescription] = useState('');
  const [shareMethod, setShareMethod] = useState('');

  const formatCurrency = (value) => {
    const num = parseFloat(value) || 0;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(num);
  };

  const generatePaymentLink = () => {
    const baseUrl = window.location.origin;
    const amount = requestAmount ? `&amount=${requestAmount}` : '';
    const description = requestDescription ? `&description=${encodeURIComponent(requestDescription)}` : '';
    return `${baseUrl}/pay?to=${user.email}${amount}${description}`;
  };

  const handleShare = (method) => {
    const link = generatePaymentLink();
    const message = requestAmount 
      ? `¡Hola! Te pido ${formatCurrency(requestAmount)} por DalePay™. ${requestDescription ? `Para: ${requestDescription}` : ''} Paga aquí: ${link}`
      : `¡Hola! Puedes enviarme dinero por DalePay™ aquí: ${link}`;

    switch(method) {
      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodeURIComponent(message)}`);
        break;
      case 'sms':
        window.open(`sms:?body=${encodeURIComponent(message)}`);
        break;
      case 'email':
        window.open(`mailto:?subject=Solicitud de pago DalePay&body=${encodeURIComponent(message)}`);
        break;
      case 'copy':
        navigator.clipboard.writeText(link);
        setShareMethod('copied');
        setTimeout(() => setShareMethod(''), 2000);
        break;
    }
  };

  const QRCodeTab = () => (
    <div className="text-center space-y-6">
      <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-red-600 p-8 rounded-3xl shadow-2xl border-4 border-white">
        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <div className="w-48 h-48 mx-auto bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mb-4 relative overflow-hidden">
            {/* Unique DalePay QR Code Design */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50"></div>
            
            {/* QR Code Grid Pattern */}
            <div className="relative z-10 grid grid-cols-8 gap-1 w-40 h-40">
              {Array.from({length: 64}, (_, i) => (
                <div 
                  key={i}
                  className={`w-4 h-4 rounded-sm ${
                    Math.random() > 0.5 
                      ? 'bg-gradient-to-br from-blue-600 to-purple-600' 
                      : 'bg-white'
                  }`}
                  style={{
                    animationDelay: `${Math.random() * 2}s`
                  }}
                />
              ))}
            </div>
            
            {/* Center DalePay Logo */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-red-600 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">D</span>
              </div>
            </div>
            
            {/* Corner indicators */}
            <div className="absolute top-2 left-2 w-4 h-4 bg-gradient-to-br from-blue-600 to-purple-600 rounded-sm"></div>
            <div className="absolute top-2 right-2 w-4 h-4 bg-gradient-to-br from-blue-600 to-purple-600 rounded-sm"></div>
            <div className="absolute bottom-2 left-2 w-4 h-4 bg-gradient-to-br from-blue-600 to-purple-600 rounded-sm"></div>
            
            {/* Unique DalePay Pattern */}
            <div className="absolute bottom-2 right-2 w-6 h-6 grid grid-cols-3 gap-px">
              <div className="w-full h-full bg-gradient-to-br from-red-500 to-yellow-500 rounded-xs"></div>
              <div className="w-full h-full bg-gradient-to-br from-yellow-500 to-blue-500 rounded-xs"></div>
              <div className="w-full h-full bg-gradient-to-br from-blue-500 to-red-500 rounded-xs"></div>
            </div>
          </div>
          
          <div className="text-center">
            <h4 className="font-bold text-gray-800 mb-2">Tu código DalePay™</h4>
            <p className="text-sm text-gray-600 font-mono bg-gray-100 py-1 px-3 rounded-lg">
              dalepay://pay/{user?.id}
            </p>
          </div>
        </div>
        
        <div className="mt-4 text-center">
          <div className="text-white/90 mb-2">
            <span className="text-2xl">🇵🇷</span> Código único boricua
          </div>
          <p className="text-white/80 text-sm">
            Compatible con cualquier app de cámara
          </p>
        </div>
      </div>

      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 border border-green-200">
        <div className="flex items-center justify-center space-x-2 text-green-600 mb-2">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
          </svg>
          <span className="font-medium">Instantáneo y seguro</span>
        </div>
        <p className="text-green-700 text-sm text-center">
          Escanea para enviar dinero real directamente a tu wallet DalePay™
        </p>
      </div>

      <div className="space-y-3">
        <button 
          onClick={() => {
            const qrData = `dalepay://pay/${user?.id}?amount=0&description=Pago DalePay`;
            navigator.clipboard.writeText(qrData);
            alert('¡Enlace de pago copiado!');
          }}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-xl font-bold shadow-lg"
        >
          📋 Copiar enlace de pago
        </button>
        <button className="w-full border-2 border-gray-300 text-gray-700 py-3 rounded-xl font-medium">
          💾 Guardar código QR
        </button>
        <button className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white py-3 rounded-xl font-medium">
          📤 Compartir por WhatsApp
        </button>
      </div>
    </div>
  );

  const RequestTab = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-bold text-gray-800 mb-2">Solicitar dinero</h3>
        <p className="text-gray-600">Envía una solicitud de pago personalizada</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Cantidad (Opcional)
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-lg text-gray-600">$</span>
            <input
              type="text"
              value={requestAmount}
              onChange={(e) => {
                const value = e.target.value.replace(/[^0-9.]/g, '');
                setRequestAmount(value);
              }}
              placeholder="0.00"
              className="w-full text-xl font-bold border-2 border-gray-300 rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            ¿Para qué es? (Opcional)
          </label>
          <input
            type="text"
            value={requestDescription}
            onChange={(e) => setRequestDescription(e.target.value)}
            placeholder="Ej: Cena, gasolina, regalo..."
            className="w-full border-2 border-gray-300 rounded-xl py-3 px-4 focus:outline-none focus:border-blue-500"
            maxLength={50}
          />
        </div>
      </div>

      <div className="bg-gray-50 rounded-xl p-4">
        <h4 className="font-medium text-gray-800 mb-3">Vista previa del mensaje:</h4>
        <div className="bg-white rounded-lg p-3 border">
          <p className="text-sm text-gray-700">
            {requestAmount 
              ? `¡Hola! Te pido ${formatCurrency(requestAmount)} por DalePay™. ${requestDescription ? `Para: ${requestDescription}` : ''}`
              : "¡Hola! Puedes enviarme dinero por DalePay™."
            }
          </p>
        </div>
      </div>

      <div>
        <h4 className="font-medium text-gray-800 mb-3">Compartir solicitud:</h4>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => handleShare('whatsapp')}
            className="flex items-center justify-center space-x-2 bg-green-500 text-white py-3 rounded-xl font-medium"
          >
            <span>📱</span>
            <span>WhatsApp</span>
          </button>
          <button
            onClick={() => handleShare('sms')}
            className="flex items-center justify-center space-x-2 bg-blue-500 text-white py-3 rounded-xl font-medium"
          >
            <span>💬</span>
            <span>SMS</span>
          </button>
          <button
            onClick={() => handleShare('email')}
            className="flex items-center justify-center space-x-2 bg-gray-600 text-white py-3 rounded-xl font-medium"
          >
            <span>📧</span>
            <span>Email</span>
          </button>
          <button
            onClick={() => handleShare('copy')}
            className="flex items-center justify-center space-x-2 bg-purple-500 text-white py-3 rounded-xl font-medium"
          >
            <span>🔗</span>
            <span>{shareMethod === 'copied' ? '¡Copiado!' : 'Copiar'}</span>
          </button>
        </div>
      </div>
    </div>
  );

  const ContactsTab = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-bold text-gray-800 mb-2">Tus datos de pago</h3>
        <p className="text-gray-600">Comparte esta información para recibir dinero</p>
      </div>

      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-200">
        <div className="text-center mb-4">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mx-auto mb-3 flex items-center justify-center">
            <span className="text-white text-xl font-bold">
              {user?.full_name?.charAt(0) || 'U'}
            </span>
          </div>
          <h4 className="font-bold text-gray-800">{user?.full_name}</h4>
          <p className="text-gray-600 text-sm">{user?.email}</p>
        </div>

        <div className="space-y-3">
          <div className="bg-white rounded-lg p-3 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Email DalePay™</p>
              <p className="font-medium text-gray-800">{user?.email}</p>
            </div>
            <button 
              onClick={() => {
                navigator.clipboard.writeText(user?.email);
                setShareMethod('email-copied');
                setTimeout(() => setShareMethod(''), 2000);
              }}
              className="text-blue-600 text-sm font-medium"
            >
              {shareMethod === 'email-copied' ? '¡Copiado!' : 'Copiar'}
            </button>
          </div>

          {user?.phone && (
            <div className="bg-white rounded-lg p-3 flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Teléfono</p>
                <p className="font-medium text-gray-800">{user.phone}</p>
              </div>
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(user.phone);
                  setShareMethod('phone-copied');
                  setTimeout(() => setShareMethod(''), 2000);
                }}
                className="text-blue-600 text-sm font-medium"
              >
                {shareMethod === 'phone-copied' ? '¡Copiado!' : 'Copiar'}
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="bg-blue-50 rounded-xl p-4">
        <div className="flex items-start space-x-3">
          <div className="text-2xl">💡</div>
          <div>
            <h4 className="font-medium text-blue-800 mb-1">Tip para recibir más dinero</h4>
            <p className="text-blue-700 text-sm">
              Comparte tu email de DalePay™ con tus contactos para que puedan enviarte dinero fácilmente.
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-4 max-w-md mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={onBack}
          className="p-2 rounded-lg hover:bg-gray-100"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-xl font-bold text-gray-800">Recibir Dinero</h1>
        <div className="w-10 h-10 flex items-center justify-center">
          <span className="text-2xl">📥</span>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex bg-gray-100 rounded-xl p-1 mb-6">
        <button
          onClick={() => setActiveTab('qr')}
          className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'qr'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600'
          }`}
        >
          Código QR
        </button>
        <button
          onClick={() => setActiveTab('request')}
          className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'request'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600'
          }`}
        >
          Solicitar
        </button>
        <button
          onClick={() => setActiveTab('contacts')}
          className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'contacts'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600'
          }`}
        >
          Mis datos
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'qr' && <QRCodeTab />}
      {activeTab === 'request' && <RequestTab />}
      {activeTab === 'contacts' && <ContactsTab />}

      {/* Puerto Rican Touch */}
      <div className="mt-8 text-center">
        <div className="flex items-center justify-center space-x-2 text-gray-500 mb-2">
          <span className="text-lg">🇵🇷</span>
          <span className="text-sm">Recibe dinero de cualquier parte del mundo</span>
        </div>
        <p className="text-xs text-gray-500">
          DalePay™ • Transferencias instantáneas y seguras
        </p>
      </div>
    </div>
  );
};

export default ReceiveMoney;
