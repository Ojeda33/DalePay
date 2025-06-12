import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CardProcessor = ({ user, onBack }) => {
  const [cards, setCards] = useState([]);
  const [showAddCard, setShowAddCard] = useState(false);
  const [showFundAccount, setShowFundAccount] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [cardForm, setCardForm] = useState({
    card_number: '',
    expiry_month: '',
    expiry_year: '',
    cvv: '',
    cardholder_name: '',
    billing_address: {
      street: '',
      city: '',
      state: '',
      zip: '',
      country: 'US'
    }
  });

  const [fundAmount, setFundAmount] = useState('');

  useEffect(() => {
    fetchCards();
  }, []);

  const fetchCards = async () => {
    try {
      const response = await axios.get('/cards');
      setCards(response.data);
    } catch (error) {
      console.error('Error fetching cards:', error);
    }
  };

  const handleCardInputChange = (field, value) => {
    if (field === 'card_number') {
      // Format card number with spaces
      value = value.replace(/\s/g, '').replace(/(.{4})/g, '$1 ').trim();
      if (value.length > 19) return;
    }
    
    if (field === 'expiry_month' || field === 'expiry_year') {
      // Only allow numbers
      value = value.replace(/\D/g, '');
      if (field === 'expiry_month' && value.length > 2) return;
      if (field === 'expiry_year' && value.length > 4) return;
    }

    if (field === 'cvv') {
      value = value.replace(/\D/g, '');
      if (value.length > 4) return;
    }

    setCardForm({
      ...cardForm,
      [field]: value
    });
    setError('');
  };

  const handleAddressChange = (field, value) => {
    setCardForm({
      ...cardForm,
      billing_address: {
        ...cardForm.billing_address,
        [field]: value
      }
    });
  };

  const detectCardType = (number) => {
    const cleanNumber = number.replace(/\s/g, '');
    if (cleanNumber.startsWith('4')) return 'Visa';
    if (cleanNumber.startsWith('5') || cleanNumber.startsWith('2')) return 'Mastercard';
    if (cleanNumber.startsWith('3')) return 'American Express';
    if (cleanNumber.startsWith('6')) return 'Discover';
    return 'Unknown';
  };

  const validateCard = () => {
    const cleanNumber = cardForm.card_number.replace(/\s/g, '');
    
    if (cleanNumber.length < 13 || cleanNumber.length > 19) {
      setError('Número de tarjeta inválido');
      return false;
    }

    if (!cardForm.expiry_month || !cardForm.expiry_year) {
      setError('Fecha de vencimiento requerida');
      return false;
    }

    const month = parseInt(cardForm.expiry_month);
    const year = parseInt(cardForm.expiry_year);
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;

    if (month < 1 || month > 12) {
      setError('Mes inválido');
      return false;
    }

    if (year < currentYear || (year === currentYear && month < currentMonth)) {
      setError('Tarjeta vencida');
      return false;
    }

    if (!cardForm.cvv || cardForm.cvv.length < 3) {
      setError('CVV inválido');
      return false;
    }

    if (!cardForm.cardholder_name.trim()) {
      setError('Nombre del titular requerido');
      return false;
    }

    return true;
  };

  const handleAddCard = async () => {
    if (!validateCard()) return;

    setLoading(true);
    try {
      const cardData = {
        ...cardForm,
        card_type: detectCardType(cardForm.card_number)
      };

      await axios.post('/cards', cardData);
      
      setShowAddCard(false);
      setCardForm({
        card_number: '',
        expiry_month: '',
        expiry_year: '',
        cvv: '',
        cardholder_name: '',
        billing_address: {
          street: '',
          city: '',
          state: '',
          zip: '',
          country: 'US'
        }
      });
      fetchCards();
    } catch (error) {
      setError(error.response?.data?.detail || 'Error agregando tarjeta');
    } finally {
      setLoading(false);
    }
  };

  const handleFundAccount = async () => {
    if (!fundAmount || parseFloat(fundAmount) <= 0) {
      setError('Ingresa una cantidad válida');
      return;
    }

    if (!selectedCard) {
      setError('Selecciona una tarjeta');
      return;
    }

    setLoading(true);
    try {
      const fundData = {
        card_id: selectedCard.id,
        amount: parseFloat(fundAmount)
      };

      await axios.post('/fund-account', fundData);
      setShowFundAccount(false);
      setFundAmount('');
      setSelectedCard(null);
    } catch (error) {
      setError(error.response?.data?.detail || 'Error procesando el pago');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const quickAmounts = ['20', '50', '100', '200'];

  if (showAddCard) {
    return (
      <div className="p-4 max-w-md mx-auto">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => setShowAddCard(false)}
            className="p-2 rounded-lg hover:bg-gray-100"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-xl font-bold text-gray-800">Agregar Tarjeta</h1>
          <div className="w-6"></div>
        </div>

        <div className="space-y-6">
          {/* Card Preview */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 text-white">
            <div className="flex justify-between items-start mb-8">
              <div className="text-sm opacity-90">DalePay™ Card</div>
              <div className="text-2xl">💳</div>
            </div>
            <div className="text-xl font-mono tracking-wider mb-4">
              {cardForm.card_number || '**** **** **** ****'}
            </div>
            <div className="flex justify-between items-end">
              <div>
                <div className="text-xs opacity-75">VÁLIDA HASTA</div>
                <div className="font-mono">
                  {cardForm.expiry_month || 'MM'}/{cardForm.expiry_year || 'YYYY'}
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs opacity-75">TITULAR</div>
                <div className="text-sm">
                  {cardForm.cardholder_name || 'NOMBRE COMPLETO'}
                </div>
              </div>
            </div>
          </div>

          {/* Card Form */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Número de tarjeta
              </label>
              <input
                type="text"
                value={cardForm.card_number}
                onChange={(e) => handleCardInputChange('card_number', e.target.value)}
                placeholder="1234 5678 9012 3456"
                className="w-full border-2 border-gray-300 rounded-xl py-3 px-4 font-mono focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mes
                </label>
                <input
                  type="text"
                  value={cardForm.expiry_month}
                  onChange={(e) => handleCardInputChange('expiry_month', e.target.value)}
                  placeholder="12"
                  maxLength="2"
                  className="w-full border-2 border-gray-300 rounded-xl py-3 px-4 font-mono focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Año
                </label>
                <input
                  type="text"
                  value={cardForm.expiry_year}
                  onChange={(e) => handleCardInputChange('expiry_year', e.target.value)}
                  placeholder="2028"
                  maxLength="4"
                  className="w-full border-2 border-gray-300 rounded-xl py-3 px-4 font-mono focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                CVV
              </label>
              <input
                type="text"
                value={cardForm.cvv}
                onChange={(e) => handleCardInputChange('cvv', e.target.value)}
                placeholder="123"
                maxLength="4"
                className="w-full border-2 border-gray-300 rounded-xl py-3 px-4 font-mono focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre del titular
              </label>
              <input
                type="text"
                value={cardForm.cardholder_name}
                onChange={(e) => handleCardInputChange('cardholder_name', e.target.value)}
                placeholder="Juan Pérez"
                className="w-full border-2 border-gray-300 rounded-xl py-3 px-4 focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Billing Address */}
            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-3">Dirección de facturación</h3>
              <div className="space-y-3">
                <input
                  type="text"
                  value={cardForm.billing_address.street}
                  onChange={(e) => handleAddressChange('street', e.target.value)}
                  placeholder="Dirección"
                  className="w-full border-2 border-gray-300 rounded-xl py-3 px-4 focus:outline-none focus:border-blue-500"
                />
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    value={cardForm.billing_address.city}
                    onChange={(e) => handleAddressChange('city', e.target.value)}
                    placeholder="Ciudad"
                    className="w-full border-2 border-gray-300 rounded-xl py-3 px-4 focus:outline-none focus:border-blue-500"
                  />
                  <input
                    type="text"
                    value={cardForm.billing_address.state}
                    onChange={(e) => handleAddressChange('state', e.target.value)}
                    placeholder="Estado"
                    className="w-full border-2 border-gray-300 rounded-xl py-3 px-4 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <input
                  type="text"
                  value={cardForm.billing_address.zip}
                  onChange={(e) => handleAddressChange('zip', e.target.value)}
                  placeholder="Código postal"
                  className="w-full border-2 border-gray-300 rounded-xl py-3 px-4 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          <button
            onClick={handleAddCard}
            disabled={loading}
            className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Agregando tarjeta...
              </div>
            ) : (
              'Agregar tarjeta'
            )}
          </button>

          <div className="bg-blue-50 rounded-xl p-4">
            <div className="flex items-start space-x-3">
              <div className="text-lg">🔒</div>
              <div>
                <h4 className="font-medium text-blue-800 mb-1">100% Seguro</h4>
                <p className="text-blue-700 text-sm">
                  Tus datos están protegidos con encriptación de nivel bancario.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (showFundAccount) {
    return (
      <div className="p-4 max-w-md mx-auto">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => setShowFundAccount(false)}
            className="p-2 rounded-lg hover:bg-gray-100"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-xl font-bold text-gray-800">Agregar Dinero</h1>
          <div className="w-6"></div>
        </div>

        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">¿Cuánto agregas?</h2>
            <p className="text-gray-600">Se cobrará un fee de 2.9%</p>
          </div>

          <div className="text-center">
            <div className="relative">
              <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-2xl text-gray-600">$</span>
              <input
                type="text"
                value={fundAmount}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^0-9.]/g, '');
                  setFundAmount(value);
                  setError('');
                }}
                placeholder="0.00"
                className="w-full text-4xl font-bold text-center border-2 border-gray-300 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:border-blue-500"
              />
            </div>
            {fundAmount && (
              <div className="mt-3 text-sm">
                <p className="text-gray-600">
                  Fee (2.9%): {formatCurrency(parseFloat(fundAmount) * 0.029)}
                </p>
                <p className="font-medium text-gray-800">
                  Total a cobrar: {formatCurrency(parseFloat(fundAmount))}
                </p>
              </div>
            )}
          </div>

          <div className="grid grid-cols-4 gap-2">
            {quickAmounts.map((amount) => (
              <button
                key={amount}
                onClick={() => setFundAmount(amount)}
                className="bg-blue-50 text-blue-600 py-3 rounded-xl font-medium hover:bg-blue-100 transition-colors"
              >
                ${amount}
              </button>
            ))}
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-800 mb-3">Selecciona tarjeta</h3>
            <div className="space-y-3">
              {cards.map((card) => (
                <button
                  key={card.id}
                  onClick={() => {
                    setSelectedCard(card);
                    setError('');
                  }}
                  className={`w-full p-4 rounded-xl border-2 transition-colors text-left ${
                    selectedCard?.id === card.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-800">
                        {card.card_type} •••• {card.card_number_last4}
                      </p>
                      <p className="text-sm text-gray-600">{card.cardholder_name}</p>
                    </div>
                    <div className="text-2xl">
                      {card.card_type === 'Visa' && '💳'}
                      {card.card_type === 'Mastercard' && '💳'}
                      {card.card_type === 'American Express' && '💳'}
                      {card.card_type === 'Discover' && '💳'}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-center">
              {error}
            </div>
          )}

          <button
            onClick={handleFundAccount}
            disabled={loading || !fundAmount || !selectedCard}
            className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Procesando...
              </div>
            ) : (
              'Agregar dinero'
            )}
          </button>
        </div>
      </div>
    );
  }

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
        <h1 className="text-xl font-bold text-gray-800">Mis Tarjetas</h1>
        <div className="w-10 h-10 flex items-center justify-center">
          <span className="text-2xl">💳</span>
        </div>
      </div>

      {/* Cards List */}
      <div className="space-y-4 mb-6">
        {cards.length > 0 ? (
          cards.map((card) => (
            <div key={card.id} className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-2xl p-6 text-white">
              <div className="flex justify-between items-start mb-4">
                <div className="text-sm opacity-75">DalePay™</div>
                <div className="text-2xl">💳</div>
              </div>
              <div className="text-xl font-mono tracking-wider mb-4">
                •••• •••• •••• {card.card_number_last4}
              </div>
              <div className="flex justify-between items-end">
                <div>
                  <div className="text-xs opacity-75">VÁLIDA HASTA</div>
                  <div className="font-mono">
                    {String(card.expiry_month).padStart(2, '0')}/{card.expiry_year}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs opacity-75">TITULAR</div>
                  <div className="text-sm">{card.cardholder_name}</div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">💳</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">No tienes tarjetas</h3>
            <p className="text-gray-600 mb-6">
              Agrega una tarjeta para financiar tu cuenta DalePay™
            </p>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        {cards.length > 0 && (
          <button
            onClick={() => setShowFundAccount(true)}
            className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold"
          >
            💰 Agregar dinero
          </button>
        )}
        
        <button
          onClick={() => setShowAddCard(true)}
          className="w-full border-2 border-blue-600 text-blue-600 py-4 rounded-2xl font-bold"
        >
          + Agregar nueva tarjeta
        </button>
      </div>

      {/* Info Section */}
      <div className="mt-8 bg-blue-50 rounded-2xl p-6">
        <div className="text-center">
          <div className="text-3xl mb-3">🔒</div>
          <h3 className="text-lg font-bold text-blue-800 mb-2">Súper Seguro</h3>
          <p className="text-blue-700 text-sm mb-4">
            Procesamos pagos a través de Moov, un transmisor de dinero licenciado. 
            Tus datos están protegidos con encriptación de nivel bancario.
          </p>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-lg mb-1">🏦</div>
              <p className="text-xs text-blue-700">Licenciado</p>
            </div>
            <div>
              <div className="text-lg mb-1">🛡️</div>
              <p className="text-xs text-blue-700">Encriptado</p>
            </div>
            <div>
              <div className="text-lg mb-1">✅</div>
              <p className="text-xs text-blue-700">PCI DSS</p>
            </div>
          </div>
        </div>
      </div>

      {/* Fee Structure */}
      <div className="mt-6 bg-gray-50 rounded-xl p-4">
        <h4 className="font-medium text-gray-800 mb-3">Tarifas transparentes</h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Agregar dinero con tarjeta:</span>
            <span className="font-medium">2.9%</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Transferencias entre usuarios:</span>
            <span className="font-medium text-green-600">Gratis</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Retiros a banco:</span>
            <span className="font-medium text-green-600">Gratis</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardProcessor;
