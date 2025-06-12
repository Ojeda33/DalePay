import React, { useState } from 'react';
import QRCode from 'qrcode.react';
import EnhancedQRCode from './EnhancedQRCode';

const ReceiveMoney = ({ user, onBack }) => {
  const [activeTab, setActiveTab] = useState('qr');
  const [requestAmount, setRequestAmount] = useState('');
  const [requestDescription, setRequestDescription] = useState('');
  const [shareMethod, setShareMethod] = useState('');
  const [showEnhancedQR, setShowEnhancedQR] = useState(false);

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

  const QRCodeTab = () => {
    const paymentURL = `https://dalepay.app/pay?user=${user?.id}&name=${encodeURIComponent(user?.full_name || 'DalePay User')}`;
    
    return (
      <div className="text-center space-y-6">
        <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-red-600 p-8 rounded-3xl shadow-2xl border-4 border-white">
          <div className="bg-white p-8 rounded-2xl shadow-lg">
            <div className="mb-4">
              <h4 className="font-bold text-gray-800 mb-2 text-lg">🇵🇷 Tu Código DalePay™</h4>
              <p className="text-sm text-gray-600">Escanea para enviar dinero</p>
            </div>
            
            {/* Real Scannable QR Code */}
            <div className="flex justify-center mb-4">
              <div className="relative">
                <QRCode
                  value={paymentURL}
                  size={200}
                  level="H"
                  includeMargin={true}
                  fgColor="#1e40af"
                  bgColor="#ffffff"
                  imageSettings={{
                    src: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMjAiIGZpbGw9InVybCgjZ3JhZGllbnQwX2xpbmVhcl8xXzEpIi8+CjxwYXRoIGQ9Ik0yMCAxMEM2IDE0IDE0IDYgMjAgMTBaTTIwIDMwQzM0IDI2IDI2IDM0IDIwIDMwWiIgZmlsbD0id2hpdGUiLz4KPHA+CiAgPGZvbnQgZmFtaWx5PSJBcmlhbCIgc2l6ZT0iMTQiIGZpbGw9IndoaXRlIj5EPC9mb250Pgo8L3A+CjxkZWZzPgo8bGluZWFyR3JhZGllbnQgaWQ9ImdyYWRpZW50MF9saW5lYXJfMV8xIiB4MT0iMCIgeTE9IjAiIHgyPSI0MCIgeTI9IjQwIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+CjxzdG9wIHN0b3AtY29sb3I9IiMzQjgyRjYiLz4KPHN0b3Agb2Zmc2V0PSIwLjUiIHN0b3AtY29sb3I9IiM4QjVDRjYiLz4KPHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjRUY0NDQ0Ii8+CjwvbGluZWFyR3JhZGllbnQ+CjwvZGVmcz4KPHN2Zz4K",
                    x: undefined,
                    y: undefined,
                    height: 24,
                    width: 24,
                    excavate: true,
                  }}
                />
                
                {/* Decorative corners */}
                <div className="absolute -top-2 -left-2 w-6 h-6 border-l-4 border-t-4 border-blue-600 rounded-tl-lg"></div>
                <div className="absolute -top-2 -right-2 w-6 h-6 border-r-4 border-t-4 border-purple-600 rounded-tr-lg"></div>
                <div className="absolute -bottom-2 -left-2 w-6 h-6 border-l-4 border-b-4 border-red-600 rounded-bl-lg"></div>
                <div className="absolute -bottom-2 -right-2 w-6 h-6 border-r-4 border-b-4 border-yellow-500 rounded-br-lg"></div>
              </div>
            </div>
            
            <div className="text-center">
              <p className="text-xs text-gray-600 font-mono bg-gray-100 py-2 px-3 rounded-lg break-all">
                {paymentURL}
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
              navigator.clipboard.writeText(paymentURL);
              alert('¡Enlace de pago copiado!');
            }}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-xl font-bold shadow-lg"
          >
            📋 Copiar enlace de pago
          </button>
          <button 
            onClick={() => {
              const canvas = document.querySelector('canvas');
              const link = document.createElement('a');
              link.download = 'dalepay-qr.png';
              link.href = canvas.toDataURL();
              link.click();
            }}
            className="w-full border-2 border-gray-300 text-gray-700 py-3 rounded-xl font-medium"
          >
            💾 Guardar código QR
          </button>
          <button 
            onClick={() => {
              const message = `¡Envíame dinero por DalePay™! Escanea mi código QR o usa este enlace: ${paymentURL}`;
              window.open(`https://wa.me/?text=${encodeURIComponent(message)}`);
            }}
            className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white py-3 rounded-xl font-medium"
          >
            📤 Compartir por WhatsApp
          </button>
        </div>
      </div>
    );
  };

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
