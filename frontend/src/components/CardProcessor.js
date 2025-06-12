import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CardProcessor = ({ user, onBack, onBalanceUpdate }) => {
  const [cards, setCards] = useState([]);
  const [showAddCard, setShowAddCard] = useState(false);
  const [showFundAccount, setShowFundAccount] = useState(false);
  const [showRemoveCard, setShowRemoveCard] = useState(null);
  const [selectedCard, setSelectedCard] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [fundAmount, setFundAmount] = useState('');
  const [cardBalances, setCardBalances] = useState({});

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

  const backendUrl = process.env.REACT_APP_BACKEND_URL || import.meta.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    fetchCards();
  }, []);

  const fetchCards = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/cards`);
      setCards(response.data);
    } catch (error) {
      console.error('Error fetching cards:', error);
      setError('Error cargando tarjetas');
    }
  };

  const handleCardInputChange = (field, value) => {
    if (field === 'card_number') {
      value = value.replace(/\s/g, '').replace(/(.{4})/g, '$1 ').trim();
      if (value.length > 19) return;
    }
    
    if (field === 'expiry_month' || field === 'expiry_year') {
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
    setError('');
    
    try {
      const cardData = {
        card_number: cardForm.card_number.replace(/\s/g, ''),
        card_type: detectCardType(cardForm.card_number),
        expiry_month: parseInt(cardForm.expiry_month),
        expiry_year: parseInt(cardForm.expiry_year),
        cvv: cardForm.cvv,
        cardholder_name: cardForm.cardholder_name,
        billing_address: cardForm.billing_address
      };

      const response = await axios.post(`${backendUrl}/api/cards`, cardData);
      
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
      setError('');
      setSuccess('¡Tarjeta agregada exitosamente! 🎉');
      await fetchCards();
      
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Card addition error:', error);
      setError(error.response?.data?.detail || 'Error agregando tarjeta. Verifica los datos e inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveCard = async (cardId) => {
    setLoading(true);
    setError('');
    
    try {
      await axios.delete(`${backendUrl}/api/cards/${cardId}`);
      
      setShowRemoveCard(null);
      setSuccess('Tarjeta removida exitosamente 🗑️');
      await fetchCards();
      
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Card removal error:', error);
      setError(error.response?.data?.detail || 'Error removiendo tarjeta');
    } finally {
      setLoading(false);
    }
  };

  // SIMPLIFIED AND DEBUGGED FUND ACCOUNT FUNCTION
  const handleFundAccount = async () => {
    console.log('🔧 DEBUG: handleFundAccount called');
    console.log('🔧 DEBUG: fundAmount:', fundAmount);
    console.log('🔧 DEBUG: selectedCard:', selectedCard);
    
    // Clear previous messages
    setError('');
    setSuccess('');
    
    // Validation
    if (!fundAmount || parseFloat(fundAmount) <= 0) {
      setError('Ingresa una cantidad válida');
      return;
    }

    if (parseFloat(fundAmount) > 10000) {
      setError('Límite máximo: $10,000 por transacción');
      return;
    }

    if (parseFloat(fundAmount) < 1) {
      setError('Monto mínimo: $1');
      return;
    }

    if (!selectedCard) {
      setError('Selecciona una tarjeta');
      return;
    }

    setLoading(true);
    
    try {
      console.log('🔧 DEBUG: Making API call to fund account');
      
      const fundData = {
        card_id: selectedCard.id,
        amount: parseFloat(fundAmount)
      };

      console.log('🔧 DEBUG: Fund data:', fundData);
      console.log('🔧 DEBUG: Backend URL:', backendUrl);

      const response = await axios.post(`${backendUrl}/api/fund-account`, fundData);
      
      console.log('🔧 DEBUG: API Response:', response.data);
      
      // Show success with transaction details
      const { amount, fee, net_amount, new_balance, card_available_balance } = response.data;
      
      setSuccess(`¡DINERO AGREGADO GRATIS! 🎉💰
✅ Agregado: $${amount.toFixed(2)}
✅ Fee: $0.00 (GRATIS!)
✅ Nuevo balance: $${new_balance.toFixed(2)}
💳 Disponible: $${card_available_balance?.toFixed(2) || '5,000.00'}`);
      
      // Close the modal and reset form
      setShowFundAccount(false);
      setFundAmount('');
      setSelectedCard(null);
      
      // Update parent balance
      if (onBalanceUpdate) {
        console.log('🔧 DEBUG: Calling onBalanceUpdate');
        onBalanceUpdate();
      }
      
      // Clear success message after 5 seconds
      setTimeout(() => setSuccess(''), 5000);
      
    } catch (error) {
      console.error('🔧 DEBUG: Fund account error:', error);
      console.error('🔧 DEBUG: Error response:', error.response?.data);
      
      const errorMessage = error.response?.data?.detail || 'Error procesando el pago. Verifica que tu tarjeta tenga fondos suficientes.';
      setError(errorMessage);
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

  const quickAmounts = ['20', '50', '100', '200', '500'];

  const getCardIcon = (cardType) => {
    switch(cardType) {
      case 'Visa': return '💳';
      case 'Mastercard': return '💳';
      case 'American Express': return '💎';
      case 'Discover': return '🔍';
      default: return '💳';
    }
  };

  const getCardGradient = (cardType) => {
    switch(cardType) {
      case 'Visa': return 'from-blue-600 to-blue-800';
      case 'Mastercard': return 'from-red-600 to-red-800';
      case 'American Express': return 'from-green-600 to-green-800';
      case 'Discover': return 'from-orange-600 to-orange-800';
      default: return 'from-gray-600 to-gray-800';
    }
  };

  // Success/Error Messages Component
  const StatusMessage = () => {
    if (success) {
      return (
        <div className="fixed top-4 left-4 right-4 z-50 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg shadow-lg">
          <div className="flex items-start">
            <span className="text-green-600 mr-2 mt-1">✅</span>
            <span className="whitespace-pre-line text-sm">{success}</span>
          </div>
        </div>
      );
    }
    
    if (error) {
      return (
        <div className="fixed top-4 left-4 right-4 z-50 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg shadow-lg">
          <div className="flex items-center">
            <span className="text-red-600 mr-2">❌</span>
            <span>{error}</span>
          </div>
        </div>
      );
    }
    
    return null;
  };

  // Remove Card Confirmation Modal
  const RemoveCardModal = ({ card, onConfirm, onCancel }) => (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-6 max-w-sm w-full">
        <div className="text-center">
          <div className="text-4xl mb-4">🗑️</div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">¿Remover tarjeta?</h3>
          <p className="text-gray-600 mb-2">
            {card.card_type} •••• {card.card_number_last4}
          </p>
          <p className="text-gray-600 mb-6">
            Esta acción no se puede deshacer
          </p>
          <div className="space-y-3">
            <button
              onClick={onConfirm}
              disabled={loading}
              className="w-full bg-red-600 text-white py-3 rounded-xl font-medium hover:bg-red-700 disabled:bg-gray-300"
            >
              {loading ? 'Removiendo...' : 'Sí, remover'}
            </button>
            <button
              onClick={onCancel}
              className="w-full border border-gray-300 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-50"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // SIMPLIFIED ADD MONEY INTERFACE
  if (showFundAccount) {
    return (
      <div className="p-4 max-w-md mx-auto">
        <StatusMessage />
        
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => {
              setShowFundAccount(false);
              setFundAmount('');
              setSelectedCard(null);
              setError('');
            }}
            className="p-2 rounded-lg hover:bg-gray-100"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-xl font-bold text-gray-800">Agregar Dinero GRATIS</h1>
          <div className="w-6"></div>
        </div>

        <div className="space-y-6">
          {/* FREE Message */}
          <div className="text-center bg-green-50 rounded-2xl p-4 border-2 border-green-200">
            <div className="text-4xl mb-2">🎉</div>
            <h2 className="text-2xl font-bold text-green-800 mb-1">¡100% GRATIS!</h2>
            <p className="text-green-700">Sin fees, sin cargos ocultos</p>
          </div>

          {/* Amount Input */}
          <div className="text-center">
            <div className="relative">
              <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-2xl text-gray-600">$</span>
              <input
                type="number"
                value={fundAmount}
                onChange={(e) => {
                  setFundAmount(e.target.value);
                  setError('');
                }}
                placeholder="0.00"
                className="w-full text-4xl font-bold text-center border-2 border-gray-300 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:border-blue-500"
              />
            </div>
            {fundAmount && (
              <div className="mt-3 text-center">
                <p className="text-2xl font-bold text-green-600">
                  ✅ Recibirás: ${parseFloat(fundAmount).toFixed(2)}
                </p>
                <p className="text-green-600 text-sm">Fee: $0.00 - ¡TOTALMENTE GRATIS!</p>
              </div>
            )}
          </div>

          {/* Quick Amounts */}
          <div className="grid grid-cols-5 gap-2">
            {quickAmounts.map((amount) => (
              <button
                key={amount}
                onClick={() => {
                  setFundAmount(amount);
                  setError('');
                }}
                className="bg-blue-50 text-blue-600 py-3 rounded-xl font-medium hover:bg-blue-100 transition-colors"
              >
                ${amount}
              </button>
            ))}
          </div>

          {/* Card Selection */}
          <div>
            <h3 className="text-lg font-medium text-gray-800 mb-3">Selecciona tarjeta</h3>
            <div className="space-y-3">
              {cards.map((card) => (
                <button
                  key={card.id}
                  onClick={() => {
                    setSelectedCard(card);
                    setError('');
                    console.log('🔧 DEBUG: Card selected:', card);
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
                      <p className="text-sm text-green-600 font-medium">💰 Disponible: $5,000.00</p>
                    </div>
                    <div className="text-2xl">
                      {getCardIcon(card.card_type)}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* FUND BUTTON - DEBUGGED */}
          <button
            onClick={() => {
              console.log('🔧 DEBUG: Fund button clicked!');
              handleFundAccount();
            }}
            disabled={loading || !fundAmount || !selectedCard || parseFloat(fundAmount) <= 0}
            className="w-full bg-gradient-to-r from-green-600 to-blue-600 text-white py-4 rounded-2xl font-bold disabled:bg-gray-300 disabled:cursor-not-allowed hover:from-green-700 hover:to-blue-700 transition-all text-lg"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Procesando...
              </div>
            ) : (
              `🎉 AGREGAR ${fundAmount ? `$${parseFloat(fundAmount).toFixed(2)}` : 'DINERO'} GRATIS`
            )}
          </button>

          {/* Debug Info */}
          <div className="bg-gray-50 rounded-xl p-3 text-xs">
            <p>🔧 Debug: Amount: {fundAmount}, Card: {selectedCard?.id ? 'Selected' : 'None'}</p>
          </div>
        </div>
      </div>
    );
  }

  // ADD CARD FORM
  if (showAddCard) {
    return (
      <div className="p-4 max-w-md mx-auto">
        <StatusMessage />
        
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
          <div className={`bg-gradient-to-r ${getCardGradient(detectCardType(cardForm.card_number))} rounded-2xl p-6 text-white shadow-xl`}>
            <div className="flex justify-between items-start mb-8">
              <div className="text-sm opacity-90">DalePay™ Card</div>
              <div className="text-2xl">{getCardIcon(detectCardType(cardForm.card_number))}</div>
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
                  {cardForm.cardholder_name.toUpperCase() || 'NOMBRE COMPLETO'}
                </div>
              </div>
            </div>
          </div>

          {/* Card Form */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Número de tarjeta *
              </label>
              <input
                type="text"
                value={cardForm.card_number}
                onChange={(e) => handleCardInputChange('card_number', e.target.value)}
                placeholder="1234 5678 9012 3456"
                className="w-full border-2 border-gray-300 rounded-xl py-3 px-4 font-mono focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mes *
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
                  Año *
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
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  CVV *
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
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre del titular *
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

          <button
            onClick={handleAddCard}
            disabled={loading}
            className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Agregando tarjeta...
              </div>
            ) : (
              'Agregar tarjeta 💳'
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

  // MAIN CARD LIST VIEW
  return (
    <div className="p-4 max-w-md mx-auto">
      <StatusMessage />
      
      {/* Remove Card Modal */}
      {showRemoveCard && (
        <RemoveCardModal
          card={showRemoveCard}
          onConfirm={() => handleRemoveCard(showRemoveCard.id)}
          onCancel={() => setShowRemoveCard(null)}
        />
      )}

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
            <div key={card.id} className={`bg-gradient-to-r ${getCardGradient(card.card_type)} rounded-2xl p-6 text-white shadow-xl relative`}>
              {/* Remove button */}
              <button
                onClick={() => setShowRemoveCard(card)}
                className="absolute top-4 right-4 w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
                title="Remover tarjeta"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"/>
                </svg>
              </button>
              
              <div className="flex justify-between items-start mb-4">
                <div className="text-sm opacity-75">DalePay™</div>
                <div className="text-2xl">{getCardIcon(card.card_type)}</div>
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
                  <div className="text-sm">{card.cardholder_name.toUpperCase()}</div>
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
            onClick={() => {
              console.log('🔧 DEBUG: Agregar dinero button clicked');
              setShowFundAccount(true);
            }}
            className="w-full bg-gradient-to-r from-green-600 to-blue-600 text-white py-4 rounded-2xl font-bold hover:from-green-700 hover:to-blue-700 transition-all shadow-lg text-lg"
          >
            🎉 AGREGAR DINERO GRATIS
          </button>
        )}
        
        <button
          onClick={() => setShowAddCard(true)}
          className="w-full border-2 border-blue-600 text-blue-600 py-4 rounded-2xl font-bold hover:bg-blue-50 transition-colors"
        >
          + Agregar nueva tarjeta
        </button>
      </div>

      {/* Fee Structure */}
      <div className="mt-6 bg-gray-50 rounded-xl p-4">
        <h4 className="font-medium text-gray-800 mb-3">Tarifas transparentes</h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Agregar dinero:</span>
            <span className="font-medium text-green-600">GRATIS 🎉</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Transferencias entre usuarios:</span>
            <span className="font-medium text-green-600">Gratis</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Retiro estándar (1-3 días):</span>
            <span className="font-medium text-green-600">Gratis</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Retiro instantáneo:</span>
            <span className="font-medium">1.40%</span>
          </div>
        </div>
      </div>

      {/* Info Section */}
      <div className="mt-6 bg-green-50 rounded-2xl p-6">
        <div className="text-center">
          <div className="text-3xl mb-3">🎉</div>
          <h3 className="text-lg font-bold text-green-800 mb-2">¡Agregar dinero es GRATIS!</h3>
          <p className="text-green-700 text-sm mb-4">
            Sin fees, sin cargos ocultos. Tu dinero completo va directo a tu DalePay.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CardProcessor;