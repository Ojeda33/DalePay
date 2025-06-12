import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SendMoney = ({ user, onBack }) => {
  const [step, setStep] = useState(1);
  const [amount, setAmount] = useState('');
  const [recipient, setRecipient] = useState('');
  const [description, setDescription] = useState('');
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [userBalance, setUserBalance] = useState(0);

  useEffect(() => {
    fetchUserBalance();
    fetchContacts();
  }, []);

  const fetchUserBalance = async () => {
    try {
      const response = await axios.get(`/users/${user.id}/balance`);
      setUserBalance(response.data.balance);
    } catch (error) {
      console.error('Error fetching balance:', error);
    }
  };

  const fetchContacts = async () => {
    // For demo purposes, we'll use mock contacts
    // In a real app, this would fetch user's contacts
    setContacts([
      { name: 'María Rodriguez', email: 'maria@email.com', avatar: '👩‍💼' },
      { name: 'Carlos Vélez', email: 'carlos@email.com', avatar: '👨‍💻' },
      { name: 'Ana Torres', email: 'ana@email.com', avatar: '👩‍🎓' },
      { name: 'Luis Santiago', email: 'luis@email.com', avatar: '👨‍🎨' }
    ]);
  };

  const formatCurrency = (value) => {
    const num = parseFloat(value) || 0;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(num);
  };

  const handleAmountChange = (value) => {
    // Remove non-numeric characters except decimal point
    const cleanValue = value.replace(/[^0-9.]/g, '');
    // Ensure only one decimal point
    const parts = cleanValue.split('.');
    if (parts.length > 2) {
      return;
    }
    // Limit decimal places to 2
    if (parts[1] && parts[1].length > 2) {
      return;
    }
    setAmount(cleanValue);
    setError('');
  };

  const handleAmountButtonClick = (value) => {
    setAmount(value);
    setError('');
  };

  const validateAmount = () => {
    const numAmount = parseFloat(amount);
    if (!amount || numAmount <= 0) {
      setError('Ingresa una cantidad válida');
      return false;
    }
    if (numAmount > userBalance) {
      setError('Fondos insuficientes');
      return false;
    }
    if (numAmount > 10000) {
      setError('Cantidad máxima: $10,000');
      return false;
    }
    return true;
  };

  const validateRecipient = () => {
    if (!recipient) {
      setError('Selecciona o ingresa un destinatario');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(recipient)) {
      setError('Ingresa un email válido');
      return false;
    }
    if (recipient === user.email) {
      setError('No puedes enviarte dinero a ti mismo');
      return false;
    }
    return true;
  };

  const handleNext = () => {
    if (step === 1) {
      if (validateAmount()) {
        setStep(2);
      }
    } else if (step === 2) {
      if (validateRecipient()) {
        setStep(3);
      }
    }
  };

  const handleSendMoney = async () => {
    setLoading(true);
    setError('');

    try {
      const transferData = {
        to_email: recipient,
        amount: parseFloat(amount),
        description: description || 'Transferencia DalePay'
      };

      const response = await axios.post('/transfers', transferData);
      
      if (response.data.transfer_id) {
        setStep(4);
      }
    } catch (error) {
      console.error('Transfer error:', error);
      setError(
        error.response?.data?.detail || 
        'Error procesando la transferencia. Inténtalo de nuevo.'
      );
    } finally {
      setLoading(false);
    }
  };

  const quickAmounts = ['5', '10', '25', '50', '100'];

  // Step 1: Amount Input
  const AmountStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">¿Cuánto envías?</h2>
        <p className="text-gray-600">
          Balance disponible: {formatCurrency(userBalance)}
        </p>
      </div>

      <div className="text-center">
        <div className="relative">
          <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-2xl text-gray-600">$</span>
          <input
            type="text"
            value={amount}
            onChange={(e) => handleAmountChange(e.target.value)}
            placeholder="0.00"
            className="w-full text-4xl font-bold text-center border-2 border-gray-300 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:border-blue-500"
          />
        </div>
        {amount && (
          <p className="text-sm text-gray-600 mt-2">
            Recibirán: {formatCurrency(amount)}
            <br />
            <span className="text-xs">Fee: $0.00 (Gratis entre usuarios DalePay)</span>
          </p>
        )}
      </div>

      <div className="grid grid-cols-5 gap-2">
        {quickAmounts.map((quickAmount) => (
          <button
            key={quickAmount}
            onClick={() => handleAmountButtonClick(quickAmount)}
            className="bg-blue-50 text-blue-600 py-3 rounded-xl font-medium hover:bg-blue-100 transition-colors"
          >
            ${quickAmount}
          </button>
        ))}
      </div>

      {error && (
        <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-center">
          {error}
        </div>
      )}

      <button
        onClick={handleNext}
        disabled={!amount}
        className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold text-lg disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
      >
        Continuar
      </button>
    </div>
  );

  // Step 2: Recipient Selection
  const RecipientStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">¿A quién envías?</h2>
        <p className="text-gray-600">
          Enviarás {formatCurrency(amount)}
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Email del destinatario
        </label>
        <input
          type="email"
          value={recipient}
          onChange={(e) => {
            setRecipient(e.target.value);
            setError('');
          }}
          placeholder="destinatario@email.com"
          className="w-full border-2 border-gray-300 rounded-xl py-3 px-4 focus:outline-none focus:border-blue-500"
        />
      </div>

      {contacts.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-3">Contactos recientes</h3>
          <div className="space-y-2">
            {contacts.map((contact, index) => (
              <button
                key={index}
                onClick={() => {
                  setRecipient(contact.email);
                  setError('');
                }}
                className={`w-full p-3 rounded-xl border-2 transition-colors text-left ${
                  recipient === contact.email
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{contact.avatar}</span>
                  <div>
                    <p className="font-medium text-gray-800">{contact.name}</p>
                    <p className="text-sm text-gray-600">{contact.email}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {error && (
        <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-center">
          {error}
        </div>
      )}

      <div className="flex space-x-3">
        <button
          onClick={() => setStep(1)}
          className="flex-1 border-2 border-gray-300 text-gray-700 py-3 rounded-xl font-medium"
        >
          Atrás
        </button>
        <button
          onClick={handleNext}
          disabled={!recipient}
          className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-bold disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          Continuar
        </button>
      </div>
    </div>
  );

  // Step 3: Confirmation
  const ConfirmationStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Confirmar envío</h2>
        <p className="text-gray-600">Revisa los detalles antes de enviar</p>
      </div>

      <div className="bg-gray-50 rounded-2xl p-6 space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Cantidad:</span>
          <span className="text-xl font-bold text-gray-800">{formatCurrency(amount)}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Para:</span>
          <span className="font-medium text-gray-800">{recipient}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Fee:</span>
          <span className="font-medium text-green-600">Gratis</span>
        </div>
        <hr className="border-gray-300" />
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Total:</span>
          <span className="text-xl font-bold text-gray-800">{formatCurrency(amount)}</span>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Nota (Opcional)
        </label>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="¿Para qué es este envío?"
          className="w-full border-2 border-gray-300 rounded-xl py-3 px-4 focus:outline-none focus:border-blue-500"
          maxLength={50}
        />
      </div>

      {error && (
        <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-center">
          {error}
        </div>
      )}

      <div className="flex space-x-3">
        <button
          onClick={() => setStep(2)}
          className="flex-1 border-2 border-gray-300 text-gray-700 py-3 rounded-xl font-medium"
        >
          Atrás
        </button>
        <button
          onClick={handleSendMoney}
          disabled={loading}
          className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-bold disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Enviando...
            </div>
          ) : (
            'Enviar Dinero'
          )}
        </button>
      </div>
    </div>
  );

  // Step 4: Success
  const SuccessStep = () => (
    <div className="text-center space-y-6">
      <div className="w-20 h-20 bg-green-100 rounded-full mx-auto flex items-center justify-center">
        <svg className="w-10 h-10 text-green-600" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
        </svg>
      </div>
      
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">¡Enviado con éxito!</h2>
        <p className="text-gray-600">
          {formatCurrency(amount)} enviado a {recipient}
        </p>
      </div>

      <div className="bg-blue-50 rounded-2xl p-6">
        <div className="flex items-center justify-center space-x-2 text-blue-600 mb-3">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.293l-3-3a1 1 0 00-1.414-1.414L9 5.586 7.707 4.293a1 1 0 00-1.414 1.414L8.586 8H4a1 1 0 100 2h4.586l-2.293 2.293a1 1 0 101.414 1.414L9 12.414l.293.293a1 1 0 001.414-1.414L8.414 10H13a1 1 0 100-2H8.414l2.293-2.293z" clipRule="evenodd"/>
          </svg>
          <span className="font-medium">Transferencia instantánea</span>
        </div>
        <p className="text-sm text-blue-600">
          El dinero ya está disponible en la cuenta del destinatario
        </p>
      </div>

      <div className="space-y-3">
        <button
          onClick={() => {
            setStep(1);
            setAmount('');
            setRecipient('');
            setDescription('');
            setError('');
          }}
          className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold"
        >
          Enviar más dinero
        </button>
        <button
          onClick={onBack}
          className="w-full border-2 border-gray-300 text-gray-700 py-3 rounded-xl font-medium"
        >
          Volver al inicio
        </button>
      </div>
    </div>
  );

  return (
    <div className="p-4 max-w-md mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={step === 1 ? onBack : () => setStep(step - 1)}
          className="p-2 rounded-lg hover:bg-gray-100"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-xl font-bold text-gray-800">Enviar Dinero</h1>
        <div className="w-10 h-10 flex items-center justify-center">
          <span className="text-2xl">💸</span>
        </div>
      </div>

      {/* Progress Indicator */}
      {step < 4 && (
        <div className="flex items-center justify-between mb-8">
          {[1, 2, 3].map((stepNumber) => (
            <div key={stepNumber} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                step >= stepNumber 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 text-gray-600'
              }`}>
                {stepNumber}
              </div>
              {stepNumber < 3 && (
                <div className={`w-12 h-1 mx-2 ${
                  step > stepNumber ? 'bg-blue-600' : 'bg-gray-200'
                }`} />
              )}
            </div>
          ))}
        </div>
      )}

      {/* Render Current Step */}
      {step === 1 && <AmountStep />}
      {step === 2 && <RecipientStep />}
      {step === 3 && <ConfirmationStep />}
      {step === 4 && <SuccessStep />}
    </div>
  );
};

export default SendMoney;
