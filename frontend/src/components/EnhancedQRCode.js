import React, { useState, useRef } from 'react';
import { QRCodeCanvas } from 'qrcode.react';

const EnhancedQRCode = ({ user, paymentData, onClose }) => {
  const [qrStyle, setQRStyle] = useState('default');
  const [showDownloadOptions, setShowDownloadOptions] = useState(false);
  const qrRef = useRef();

  const paymentURL = `https://dalepay.app/pay?user=${user?.id}&name=${encodeURIComponent(user?.full_name || 'DalePay User')}${paymentData?.amount ? `&amount=${paymentData.amount}` : ''}${paymentData?.description ? `&description=${encodeURIComponent(paymentData.description)}` : ''}`;

  const qrStyles = {
    default: {
      fgColor: "#1e40af",
      bgColor: "#ffffff",
      style: "squares"
    },
    gradient: {
      fgColor: "#8B5CF6",
      bgColor: "#F8FAFC",
      style: "dots"
    },
    puerto_rico: {
      fgColor: "#EF4444",
      bgColor: "#F0F9FF",
      style: "rounded"
    },
    gold: {
      fgColor: "#F59E0B",
      bgColor: "#FFFBEB",
      style: "squares"
    }
  };

  const downloadQR = (format) => {
    const canvas = qrRef.current?.querySelector('canvas');
    if (!canvas) return;

    const link = document.createElement('a');
    
    if (format === 'png') {
      link.download = `dalepay-qr-${user?.full_name?.replace(/\s+/g, '-').toLowerCase()}.png`;
      link.href = canvas.toDataURL('image/png');
    } else if (format === 'svg') {
      // For SVG, we'll create a simple SVG version
      const svgData = createSVGQR();
      const blob = new Blob([svgData], { type: 'image/svg+xml' });
      link.download = `dalepay-qr-${user?.full_name?.replace(/\s+/g, '-').toLowerCase()}.svg`;
      link.href = URL.createObjectURL(blob);
    }
    
    link.click();
    setShowDownloadOptions(false);
  };

  const createSVGQR = () => {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 250 250">
      <rect width="250" height="250" fill="${qrStyles[qrStyle].bgColor}"/>
      <text x="125" y="130" text-anchor="middle" font-family="Arial" font-size="14" fill="${qrStyles[qrStyle].fgColor}">
        DalePay™ QR Code
      </text>
      <text x="125" y="150" text-anchor="middle" font-family="Arial" font-size="10" fill="${qrStyles[qrStyle].fgColor}">
        ${user?.full_name || 'DalePay User'}
      </text>
    </svg>`;
  };

  const shareQR = (method) => {
    const text = paymentData?.amount 
      ? `¡Págame ${paymentData.amount} con DalePay™! ${paymentData.description || ''} Usa este código QR: ${paymentURL}`
      : `¡Envíame dinero con DalePay™! Escanea mi código QR: ${paymentURL}`;

    switch(method) {
      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodeURIComponent(text)}`);
        break;
      case 'telegram':
        window.open(`https://t.me/share/url?url=${encodeURIComponent(paymentURL)}&text=${encodeURIComponent(text)}`);
        break;
      case 'instagram':
        navigator.clipboard.writeText(text);
        alert('Texto copiado. Pégalo en tu historia de Instagram!');
        break;
      case 'copy':
        navigator.clipboard.writeText(paymentURL);
        alert('¡Enlace de pago copiado!');
        break;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-800">Mi Código DalePay™</h2>
          <button 
            onClick={onClose}
            className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200"
          >
            ✕
          </button>
        </div>

        {/* QR Code Styles */}
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Estilo del código</h3>
          <div className="grid grid-cols-4 gap-2">
            {Object.entries(qrStyles).map(([key, style]) => (
              <button
                key={key}
                onClick={() => setQRStyle(key)}
                className={`w-12 h-12 rounded-lg border-2 transition-all ${
                  qrStyle === key ? 'border-blue-500 scale-110' : 'border-gray-200'
                }`}
                style={{ backgroundColor: style.bgColor }}
              >
                <div 
                  className="w-6 h-6 mx-auto rounded-sm"
                  style={{ backgroundColor: style.fgColor }}
                ></div>
              </button>
            ))}
          </div>
          <div className="text-center mt-2">
            <span className="text-xs text-gray-500 capitalize">{qrStyle.replace('_', ' ')}</span>
          </div>
        </div>

        {/* Enhanced QR Code Display */}
        <div className="bg-gradient-to-br from-blue-50 via-purple-50 to-red-50 p-8 rounded-3xl shadow-lg border-4 border-white mb-6">
          <div className="bg-white p-6 rounded-2xl shadow-inner">
            {/* Header */}
            <div className="text-center mb-4">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">D</span>
                </div>
                <h4 className="font-bold text-gray-800">DalePay™</h4>
                <span className="text-lg">🇵🇷</span>
              </div>
              <p className="text-xs text-gray-600">La Cartera Digital de Puerto Rico</p>
            </div>
            
            {/* QR Code */}
            <div className="flex justify-center mb-4" ref={qrRef}>
              <div className="relative">
                <QRCode
                  value={paymentURL}
                  size={180}
                  level="H"
                  includeMargin={true}
                  fgColor={qrStyles[qrStyle].fgColor}
                  bgColor={qrStyles[qrStyle].bgColor}
                  imageSettings={{
                    src: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMjAiIGZpbGw9InVybCgjZ3JhZGllbnQwX2xpbmVhcl8xXzEpIi8+CjxwYXRoIGQ9Ik0yMCAxMEM2IDE0IDE0IDYgMjAgMTBaTTIwIDMwQzM0IDI2IDI2IDM0IDIwIDMwWiIgZmlsbD0id2hpdGUiLz4KPHA+CiAgPGZvbnQgZmFtaWx5PSJBcmlhbCIgc2l6ZT0iMTQiIGZpbGw9IndoaXRlIj5EPC9mb250Pgo8L3A+CjxkZWZzPgo8bGluZWFyR3JhZGllbnQgaWQ9ImdyYWRpZW50MF9saW5lYXJfMV8xIiB4MT0iMCIgeTE9IjAiIHgyPSI0MCIgeTI9IjQwIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+CjxzdG9wIHN0b3AtY29sb3I9IiMzQjgyRjYiLz4KPHN0b3Agb2Zmc2V0PSIwLjUiIHN0b3AtY29sb3I9IiM4QjVDRjYiLz4KPHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjRUY0NDQ0Ii8+CjwvbGluZWFyR3JhZGllbnQ+CjwvZGVmcz4KPHN2Zz4K",
                    x: undefined,
                    y: undefined,
                    height: 20,
                    width: 20,
                    excavate: true,
                  }}
                />
                
                {/* Animated corners */}
                <div className="absolute -top-3 -left-3 w-8 h-8 border-l-4 border-t-4 border-blue-500 rounded-tl-xl animate-pulse"></div>
                <div className="absolute -top-3 -right-3 w-8 h-8 border-r-4 border-t-4 border-purple-500 rounded-tr-xl animate-pulse"></div>
                <div className="absolute -bottom-3 -left-3 w-8 h-8 border-l-4 border-b-4 border-red-500 rounded-bl-xl animate-pulse"></div>
                <div className="absolute -bottom-3 -right-3 w-8 h-8 border-r-4 border-b-4 border-yellow-500 rounded-br-xl animate-pulse"></div>
              </div>
            </div>
            
            {/* User Info */}
            <div className="text-center">
              <p className="font-medium text-gray-800">{user?.full_name}</p>
              <p className="text-xs text-gray-600 font-mono bg-gray-100 py-1 px-2 rounded mt-2">
                ID: {user?.id?.slice(0, 8)}...
              </p>
              {paymentData?.amount && (
                <div className="mt-3 p-2 bg-green-50 rounded-lg border border-green-200">
                  <p className="text-green-800 font-bold">${paymentData.amount}</p>
                  {paymentData.description && (
                    <p className="text-green-600 text-xs">{paymentData.description}</p>
                  )}
                </div>
              )}
            </div>
          </div>
          
          {/* Footer */}
          <div className="text-center mt-4">
            <div className="text-white/90 text-sm">
              <span className="text-lg mr-2">⚡</span>
              Escanea para pagar al instante
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          {/* Download Options */}
          <div className="relative">
            <button 
              onClick={() => setShowDownloadOptions(!showDownloadOptions)}
              className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white py-3 rounded-xl font-bold flex items-center justify-center space-x-2"
            >
              <span>💾</span>
              <span>Descargar QR</span>
            </button>
            
            {showDownloadOptions && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-10">
                <button 
                  onClick={() => downloadQR('png')}
                  className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b border-gray-100"
                >
                  <span className="mr-3">🖼️</span>Imagen PNG
                </button>
                <button 
                  onClick={() => downloadQR('svg')}
                  className="w-full text-left px-4 py-3 hover:bg-gray-50"
                >
                  <span className="mr-3">📄</span>Vector SVG
                </button>
              </div>
            )}
          </div>

          {/* Share Options */}
          <div className="grid grid-cols-2 gap-3">
            <button 
              onClick={() => shareQR('whatsapp')}
              className="bg-green-500 text-white py-3 rounded-xl font-medium flex items-center justify-center space-x-2"
            >
              <span>📱</span>
              <span>WhatsApp</span>
            </button>
            <button 
              onClick={() => shareQR('copy')}
              className="bg-purple-500 text-white py-3 rounded-xl font-medium flex items-center justify-center space-x-2"
            >
              <span>🔗</span>
              <span>Copiar</span>
            </button>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <button 
              onClick={() => shareQR('telegram')}
              className="bg-blue-500 text-white py-3 rounded-xl font-medium flex items-center justify-center space-x-2"
            >
              <span>✈️</span>
              <span>Telegram</span>
            </button>
            <button 
              onClick={() => shareQR('instagram')}
              className="bg-gradient-to-r from-purple-400 to-pink-400 text-white py-3 rounded-xl font-medium flex items-center justify-center space-x-2"
            >
              <span>📸</span>
              <span>Instagram</span>
            </button>
          </div>
        </div>

        {/* Pro Tip */}
        <div className="mt-6 bg-blue-50 rounded-xl p-4">
          <div className="flex items-start space-x-3">
            <div className="text-lg">💡</div>
            <div>
              <h4 className="font-medium text-blue-800 mb-1">Tip Pro</h4>
              <p className="text-blue-700 text-sm">
                Tu código QR funciona con cualquier app de cámara. ¡Incluso funciona sin internet una vez escaneado!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedQRCode;