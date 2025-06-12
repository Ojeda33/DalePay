import React, { useState, useEffect } from 'react';

const JorgeTourGuide = ({ user, currentPage, onClose, onNavigate }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [tourCompleted, setTourCompleted] = useState(false);

  // Jorge's personality responses
  const jorgeResponses = [
    "¡Qué tal! Soy Jorge, tu guía personal de DalePay™ 🇵🇷",
    "¡Wepa! Veo que estás explorando nuestra app boricua",
    "¡Dale que vamos bien! Te explico todo paso a paso",
    "¡Brutal! Ya estás dominando DalePay™ como un verdadero taíno",
    "¡Perfecto, pana! Ahora ya sabes cómo funciona todo"
  ];

  // Tour steps based on current page
  const getTourSteps = () => {
    switch(currentPage) {
      case 'dashboard':
        return [
          {
            title: "¡Bienvenido a tu Dashboard!",
            message: "Aquí ves tu balance y transacciones recientes. Este es tu centro de comando financiero.",
            highlight: ".balance-card",
            action: "next"
          },
          {
            title: "Acciones Rápidas",
            message: "Estos botones te permiten enviar dinero, recibir pagos, manejar crypto y más. ¡Todo al alcance de un toque!",
            highlight: ".quick-actions",
            action: "next"
          },
          {
            title: "Actividad Reciente",
            message: "Aquí ves todas tus transacciones. Puedes hacer click para ver más detalles de cada una.",
            highlight: ".recent-activity",
            action: "navigate",
            targetPage: "send"
          }
        ];
      case 'send':
        return [
          {
            title: "Enviar Dinero",
            message: "¡Aquí es donde la magia sucede! Puedes enviar dinero real a cualquier persona con DalePay™.",
            highlight: ".amount-input",
            action: "next"
          },
          {
            title: "Cantidades Rápidas",
            message: "Usa estos botones para cantidades comunes. ¡Súper conveniente para pagos rápidos!",
            highlight: ".quick-amounts",
            action: "navigate",
            targetPage: "receive"
          }
        ];
      case 'receive':
        return [
          {
            title: "Tu Código QR Personal",
            message: "¡Este código QR es único tuyo! Cualquier persona puede escanearlo para enviarte dinero al instante.",
            highlight: ".qr-code",
            action: "next"
          },
          {
            title: "Comparte tu Código",
            message: "Puedes copiar el enlace o compartirlo por WhatsApp, SMS o email. ¡Súper fácil!",
            highlight: ".share-buttons",
            action: "navigate",
            targetPage: "business"
          }
        ];
      case 'business':
        return [
          {
            title: "Portal de Negocios",
            message: "Si tienes un negocio, aquí puedes registrarlo para aceptar pagos con DalePay™. ¡Perfecto para colmados, restaurantes y más!",
            highlight: ".business-portal",
            action: "next"
          },
          {
            title: "Integraciones",
            message: "Conecta con Uber Eats, DoorDash, ATH Móvil y más. Tu negocio estará conectado con todo Puerto Rico.",
            highlight: ".integrations",
            action: "complete"
          }
        ];
      default:
        return [
          {
            title: "¡Hola! Soy Jorge",
            message: "Tu guía personal de DalePay™. ¿Te muestro cómo funciona todo? ¡Es súper fácil!",
            action: "start"
          }
        ];
    }
  };

  const steps = getTourSteps();

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      completeTour();
    }
  };

  const handleAction = (action, targetPage) => {
    switch(action) {
      case 'next':
        handleNext();
        break;
      case 'navigate':
        if (targetPage && onNavigate) {
          onNavigate(targetPage);
          setCurrentStep(0); // Reset for new page
        }
        break;
      case 'complete':
        completeTour();
        break;
      case 'start':
        setCurrentStep(1);
        break;
      default:
        handleNext();
    }
  };

  const completeTour = () => {
    setTourCompleted(true);
    setTimeout(() => {
      setIsVisible(false);
      onClose && onClose();
    }, 2000);
  };

  const skipTour = () => {
    setIsVisible(false);
    onClose && onClose();
  };

  if (!isVisible) return null;

  const currentStepData = steps[currentStep];

  if (tourCompleted) {
    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-6 max-w-md w-full">
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-blue-500 rounded-full mx-auto mb-4 flex items-center justify-center">
              <span className="text-3xl">🎉</span>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              ¡Brutal, {user?.full_name?.split(' ')[0]}!
            </h3>
            <p className="text-gray-600 mb-4">
              Ya dominas DalePay™ como un verdadero boricua. ¡Ahora a enviar dinero se ha dicho!
            </p>
            <div className="text-4xl mb-4">🇵🇷</div>
            <p className="text-sm text-gray-500">
              Tip: Puedes encontrarme en el dashboard si necesitas ayuda
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-6 max-w-md w-full relative">
        {/* Jorge's Avatar */}
        <div className="text-center mb-4">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mx-auto mb-3 flex items-center justify-center relative">
            <span className="text-2xl">👨‍💼</span>
            {/* Speech bubble indicator */}
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs">💬</span>
            </div>
          </div>
          <h3 className="text-lg font-bold text-gray-800">
            Jorge • Tu Guía DalePay™
          </h3>
          <div className="flex items-center justify-center space-x-1 mt-1">
            <span className="text-xs text-gray-500">100% Boricua</span>
            <span className="text-sm">🇵🇷</span>
          </div>
        </div>

        {/* Jorge's Message */}
        <div className="mb-6">
          <div className="bg-blue-50 rounded-2xl p-4 relative">
            <div className="absolute -top-2 left-6 w-4 h-4 bg-blue-50 transform rotate-45"></div>
            <h4 className="font-bold text-blue-800 mb-2">
              {currentStepData?.title || "¡Hola!"}
            </h4>
            <p className="text-blue-700 text-sm leading-relaxed">
              {currentStepData?.message || "¿Te ayudo a navegar por DalePay™?"}
            </p>
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs text-gray-500">Progreso del tour</span>
            <span className="text-xs text-gray-500">{currentStep + 1} de {steps.length}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button 
            onClick={() => handleAction(currentStepData?.action, currentStepData?.targetPage)}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-xl font-bold hover:from-blue-600 hover:to-purple-700 transition-all"
          >
            {currentStepData?.action === 'start' ? '¡Dale, empezamos!' :
             currentStepData?.action === 'navigate' ? `Ir a ${currentStepData?.targetPage}` :
             currentStepData?.action === 'complete' ? '¡Terminamos!' :
             currentStep === steps.length - 1 ? '¡Perfecto!' : 'Continuar'}
          </button>
          
          <div className="flex space-x-3">
            <button 
              onClick={skipTour}
              className="flex-1 border border-gray-300 text-gray-600 py-2 rounded-xl font-medium hover:bg-gray-50"
            >
              Saltar tour
            </button>
            {currentStep > 0 && (
              <button 
                onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                className="flex-1 border border-gray-300 text-gray-600 py-2 rounded-xl font-medium hover:bg-gray-50"
              >
                Atrás
              </button>
            )}
          </div>
        </div>

        {/* Easter egg - Jorge's personality */}
        <div className="mt-4 text-center">
          <p className="text-xs text-gray-400 italic">
            "{jorgeResponses[Math.min(currentStep, jorgeResponses.length - 1)]}"
          </p>
        </div>
      </div>
    </div>
  );
};

export default JorgeTourGuide;