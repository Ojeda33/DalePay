import React, { useState, useEffect } from 'react';

const AppSecurity = ({ onUnlock }) => {
  const [isLocked, setIsLocked] = useState(true);
  const [pin, setPin] = useState('');
  const [biometricAvailable, setBiometricAvailable] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [lockoutTime, setLockoutTime] = useState(0);
  const [showSecurityTip, setShowSecurityTip] = useState(false);

  const CORRECT_PIN = '1234'; // In production, this would be stored securely
  const MAX_ATTEMPTS = 3;
  const LOCKOUT_DURATION = 30000; // 30 seconds

  useEffect(() => {
    // Check if biometric authentication is available
    if (navigator.credentials && navigator.credentials.create) {
      setBiometricAvailable(true);
    }

    // Check if app should be locked
    const lastActiveTime = localStorage.getItem('dalepay_last_active');
    const lockThreshold = 5 * 60 * 1000; // 5 minutes
    
    if (lastActiveTime) {
      const timeSinceLastActive = Date.now() - parseInt(lastActiveTime);
      if (timeSinceLastActive < lockThreshold) {
        setIsLocked(false);
        onUnlock();
      }
    }

    // Update last active time
    const updateLastActive = () => {
      localStorage.setItem('dalepay_last_active', Date.now().toString());
    };

    // Listen for user activity
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    events.forEach(event => {
      document.addEventListener(event, updateLastActive, true);
    });

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, updateLastActive, true);
      });
    };
  }, [onUnlock]);

  useEffect(() => {
    if (lockoutTime > 0) {
      const timer = setTimeout(() => {
        setLockoutTime(lockoutTime - 1000);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [lockoutTime]);

  const handlePinSubmit = () => {
    if (pin === CORRECT_PIN) {
      setIsLocked(false);
      setAttempts(0);
      localStorage.setItem('dalepay_last_active', Date.now().toString());
      onUnlock();
    } else {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      setPin('');
      
      if (newAttempts >= MAX_ATTEMPTS) {
        setLockoutTime(LOCKOUT_DURATION);
        setShowSecurityTip(true);
      }
    }
  };

  const handleBiometricAuth = async () => {
    try {
      if (navigator.credentials) {
        // Simulate biometric authentication
        // In a real app, you'd use WebAuthn API
        const result = await new Promise((resolve) => {
          setTimeout(() => resolve(true), 1000);
        });
        
        if (result) {
          setIsLocked(false);
          setAttempts(0);
          localStorage.setItem('dalepay_last_active', Date.now().toString());
          onUnlock();
        }
      }
    } catch (error) {
      console.error('Biometric authentication failed:', error);
    }
  };

  if (!isLocked) {
    return null;
  }

  const isLockedOut = lockoutTime > 0;

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-blue-900 via-purple-900 to-red-900 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50"></div>
      
      <div className="relative bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center">
            <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"/>
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">DalePay™ Bloqueado</h2>
          <p className="text-gray-600">
            {isLockedOut 
              ? `Demasiados intentos. Espera ${Math.ceil(lockoutTime / 1000)}s`
              : 'Ingresa tu PIN para continuar'
            }
          </p>
        </div>

        {!isLockedOut ? (
          <>
            {/* PIN Input */}
            <div className="mb-6">
              <div className="flex justify-center space-x-3 mb-4">
                {[0, 1, 2, 3].map((index) => (
                  <div
                    key={index}
                    className={`w-4 h-4 rounded-full border-2 ${
                      pin.length > index 
                        ? 'bg-blue-600 border-blue-600' 
                        : 'border-gray-300'
                    }`}
                  />
                ))}
              </div>
              
              {/* PIN Keypad */}
              <div className="grid grid-cols-3 gap-3 mb-4">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                  <button
                    key={num}
                    onClick={() => {
                      if (pin.length < 4) {
                        setPin(pin + num.toString());
                      }
                    }}
                    className="aspect-square bg-gray-100 rounded-xl text-xl font-bold text-gray-800 hover:bg-gray-200 transition-colors"
                  >
                    {num}
                  </button>
                ))}
                <div></div>
                <button
                  onClick={() => {
                    if (pin.length < 4) {
                      setPin(pin + '0');
                    }
                  }}
                  className="aspect-square bg-gray-100 rounded-xl text-xl font-bold text-gray-800 hover:bg-gray-200 transition-colors"
                >
                  0
                </button>
                <button
                  onClick={() => setPin(pin.slice(0, -1))}
                  className="aspect-square bg-gray-100 rounded-xl flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-colors"
                >
                  ⌫
                </button>
              </div>

              {pin.length === 4 && (
                <button
                  onClick={handlePinSubmit}
                  className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors"
                >
                  Desbloquear
                </button>
              )}
            </div>

            {/* Biometric Option */}
            {biometricAvailable && (
              <div className="mb-6">
                <div className="text-center mb-3">
                  <span className="text-gray-500 text-sm">o</span>
                </div>
                <button
                  onClick={handleBiometricAuth}
                  className="w-full border-2 border-gray-300 text-gray-700 py-3 rounded-xl font-medium hover:border-gray-400 transition-colors flex items-center justify-center space-x-2"
                >
                  <span>👆</span>
                  <span>Usar huella dactilar</span>
                </button>
              </div>
            )}

            {/* Error Display */}
            {attempts > 0 && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-center">
                PIN incorrecto. {MAX_ATTEMPTS - attempts} intento(s) restante(s)
              </div>
            )}
          </>
        ) : (
          <>
            {/* Lockout Screen */}
            <div className="text-center mb-6">
              <div className="text-6xl mb-4">⏰</div>
              <p className="text-gray-600">
                Por seguridad, DalePay™ está temporalmente bloqueado debido a múltiples intentos fallidos.
              </p>
            </div>

            {/* Security Tips */}
            {showSecurityTip && (
              <div className="bg-blue-50 rounded-xl p-4 mb-4">
                <h4 className="font-medium text-blue-800 mb-2">💡 Tip de Seguridad</h4>
                <p className="text-blue-700 text-sm">
                  Tu dinero está protegido. Si no recuerdas tu PIN, puedes restablecerlo desde la configuración una vez que ingreses con tu email y contraseña.
                </p>
              </div>
            )}
          </>
        )}

        {/* Emergency Access */}
        <div className="text-center">
          <button className="text-blue-600 text-sm font-medium hover:underline">
            ¿Olvidaste tu PIN?
          </button>
        </div>

        {/* Security Badge */}
        <div className="mt-6 text-center">
          <div className="inline-flex items-center space-x-2 text-xs text-gray-500">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
            </svg>
            <span>Protegido por seguridad bancaria</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppSecurity;