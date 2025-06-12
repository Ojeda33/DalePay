import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BusinessDashboard = ({ business, user, onBack }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [businessData, setBusinessData] = useState(business);
  const [integrations, setIntegrations] = useState({});
  const [loading, setLoading] = useState(false);
  const [cashoutAmount, setCashoutAmount] = useState('');
  const [showCashout, setShowCashout] = useState(false);

  useEffect(() => {
    fetchBusinessDetails();
    fetchIntegrations();
  }, []);

  const fetchBusinessDetails = async () => {
    try {
      const response = await axios.get(`/businesses/${business.id}`);
      setBusinessData(response.data);
    } catch (error) {
      console.error('Error fetching business details:', error);
    }
  };

  const fetchIntegrations = async () => {
    try {
      const response = await axios.get(`/businesses/${business.id}/integrations`);
      setIntegrations(response.data);
    } catch (error) {
      console.error('Error fetching integrations:', error);
    }
  };

  const setupIntegration = async (integrationType) => {
    setLoading(true);
    try {
      const response = await axios.post(`/businesses/${business.id}/integrations`, {
        type: integrationType
      });
      
      await fetchIntegrations();
      alert(`¡Integración con ${integrationType} configurada exitosamente!`);
    } catch (error) {
      console.error('Error setting up integration:', error);
      alert('Error configurando integración. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const handleCashout = async () => {
    if (!cashoutAmount || parseFloat(cashoutAmount) <= 0) {
      alert('Ingresa una cantidad válida');
      return;
    }

    if (parseFloat(cashoutAmount) > businessData.balance) {
      alert('Fondos insuficientes');
      return;
    }

    setLoading(true);
    try {
      await axios.post(`/businesses/${business.id}/cashout`, {
        amount: parseFloat(cashoutAmount),
        method: 'bank'
      });
      
      await fetchBusinessDetails();
      setShowCashout(false);
      setCashoutAmount('');
      alert('¡Retiro procesado exitosamente!');
    } catch (error) {
      console.error('Error processing cashout:', error);
      alert('Error procesando retiro. Inténtalo de nuevo.');
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

  const integrationOptions = [
    {
      id: 'uber_eats',
      name: 'Uber Eats',
      icon: '🚗',
      description: 'Recibe pagos de pedidos de Uber Eats directamente',
      color: 'bg-black text-white'
    },
    {
      id: 'doordash',
      name: 'DoorDash',
      icon: '🍕',
      description: 'Integra tu negocio con DoorDash para delivery',
      color: 'bg-red-600 text-white'
    },
    {
      id: 'ath_movil',
      name: 'ATH Móvil',
      icon: '💳',
      description: 'Acepta pagos con ATH Móvil Business',
      color: 'bg-blue-600 text-white'
    },
    {
      id: 'stripe',
      name: 'Stripe',
      icon: '💎',
      description: 'Procesa tarjetas de crédito y débito',
      color: 'bg-purple-600 text-white'
    }
  ];

  // Overview Tab
  const OverviewTab = () => (
    <div className="space-y-6">
      {/* Business Info Card */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold mb-1">{businessData.name}</h2>
            <p className="text-blue-100 capitalize">{businessData.business_type}</p>
            <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm mt-2 ${
              businessData.is_approved 
                ? 'bg-green-500 text-white' 
                : 'bg-yellow-500 text-black'
            }`}>
              {businessData.is_approved ? '✅ Aprobado' : '⏳ Pendiente'}
            </div>
          </div>
          <div className="text-right">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-2">
              <span className="text-2xl">🏪</span>
            </div>
            <button className="text-white/80 text-sm hover:text-white">
              Ver QR
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-100">
          <div className="text-center">
            <div className="text-2xl mb-2">💰</div>
            <h3 className="text-lg font-bold text-gray-800">
              {formatCurrency(businessData.balance || 0)}
            </h3>
            <p className="text-gray-600 text-sm">Balance Actual</p>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-100">
          <div className="text-center">
            <div className="text-2xl mb-2">📊</div>
            <h3 className="text-lg font-bold text-gray-800">
              {formatCurrency(businessData.monthly_revenue || 0)}
            </h3>
            <p className="text-gray-600 text-sm">Este Mes</p>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-100">
          <div className="text-center">
            <div className="text-2xl mb-2">🎯</div>
            <h3 className="text-lg font-bold text-gray-800">
              {businessData.total_transactions || 0}
            </h3>
            <p className="text-gray-600 text-sm">Transacciones</p>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-100">
          <div className="text-center">
            <div className="text-2xl mb-2">💎</div>
            <h3 className="text-lg font-bold text-gray-800">
              {formatCurrency(businessData.total_revenue || 0)}
            </h3>
            <p className="text-gray-600 text-sm">Total</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4">
        <button 
          onClick={() => setShowCashout(true)}
          className="bg-green-500 text-white py-4 rounded-xl font-bold flex items-center justify-center space-x-2"
        >
          <span>💸</span>
          <span>Retirar Fondos</span>
        </button>
        <button className="bg-blue-500 text-white py-4 rounded-xl font-bold flex items-center justify-center space-x-2">
          <span>📱</span>
          <span>Código QR</span>
        </button>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Actividad Reciente</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600">💰</span>
              </div>
              <div>
                <p className="font-medium text-gray-800">Pago recibido</p>
                <p className="text-sm text-gray-600">Uber Eats • Hace 2 horas</p>
              </div>
            </div>
            <div className="text-green-600 font-bold">+$45.50</div>
          </div>
          
          <div className="text-center py-4 text-gray-500">
            <p className="text-sm">No hay más actividad reciente</p>
          </div>
        </div>
      </div>
    </div>
  );

  // Integrations Tab
  const IntegrationsTab = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-bold text-gray-800 mb-2">Conecta tu negocio</h3>
        <p className="text-gray-600">Integra con plataformas populares para recibir más pagos</p>
      </div>

      <div className="space-y-4">
        {integrationOptions.map((integration) => {
          const isConnected = integrations[integration.id];
          
          return (
            <div key={integration.id} className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${integration.color}`}>
                    <span className="text-2xl">{integration.icon}</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800">{integration.name}</h4>
                    <p className="text-sm text-gray-600">{integration.description}</p>
                    {isConnected && (
                      <div className="inline-flex items-center px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs mt-1">
                        ✅ Conectado
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  {isConnected ? (
                    <button className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-medium">
                      Desconectar
                    </button>
                  ) : (
                    <button 
                      onClick={() => setupIntegration(integration.id)}
                      disabled={loading}
                      className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium disabled:bg-gray-300"
                    >
                      {loading ? 'Conectando...' : 'Conectar'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-blue-50 rounded-xl p-4">
        <h4 className="font-medium text-blue-800 mb-2">¿Necesitas ayuda?</h4>
        <p className="text-blue-700 text-sm mb-3">
          Nuestro equipo puede ayudarte a configurar estas integraciones
        </p>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium">
          Contactar Soporte
        </button>
      </div>
    </div>
  );

  // Settings Tab
  const SettingsTab = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Información del Negocio</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
            <input 
              type="text" 
              defaultValue={businessData.name}
              className="w-full border border-gray-300 rounded-lg py-2 px-3 focus:outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
            <textarea 
              defaultValue={businessData.description}
              className="w-full border border-gray-300 rounded-lg py-2 px-3 focus:outline-none focus:border-blue-500"
              rows="3"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Dirección</label>
            <input 
              type="text" 
              defaultValue={businessData.address}
              className="w-full border border-gray-300 rounded-lg py-2 px-3 focus:outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
            <input 
              type="tel" 
              defaultValue={businessData.phone}
              className="w-full border border-gray-300 rounded-lg py-2 px-3 focus:outline-none focus:border-blue-500"
            />
          </div>
          <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium">
            Guardar Cambios
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Configuración de Pagos</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
            <div>
              <p className="font-medium text-gray-800">Pagos automáticos</p>
              <p className="text-sm text-gray-600">Recibir pagos sin confirmación</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
          <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
            <div>
              <p className="font-medium text-gray-800">Notificaciones</p>
              <p className="text-sm text-gray-600">Recibir alertas de pagos</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </div>
    </div>
  );

  // Cashout Modal
  const CashoutModal = () => (
    showCashout && (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-6 max-w-md w-full">
          <div className="text-center mb-6">
            <h3 className="text-xl font-bold text-gray-800 mb-2">Retirar Fondos</h3>
            <p className="text-gray-600">
              Balance disponible: {formatCurrency(businessData.balance || 0)}
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cantidad a retirar
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600">$</span>
                <input
                  type="text"
                  value={cashoutAmount}
                  onChange={(e) => setCashoutAmount(e.target.value.replace(/[^0-9.]/g, ''))}
                  placeholder="0.00"
                  className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Método de retiro
              </label>
              <select className="w-full py-3 px-4 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500">
                <option value="bank">Cuenta bancaria</option>
                <option value="card">Tarjeta de débito</option>
              </select>
            </div>

            <div className="bg-gray-50 rounded-lg p-3">
              <div className="flex justify-between text-sm">
                <span>Cantidad:</span>
                <span>{formatCurrency(parseFloat(cashoutAmount) || 0)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Fee:</span>
                <span className="text-green-600">Gratis</span>
              </div>
              <hr className="my-2" />
              <div className="flex justify-between font-medium">
                <span>Total a recibir:</span>
                <span>{formatCurrency(parseFloat(cashoutAmount) || 0)}</span>
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => setShowCashout(false)}
                className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg font-medium"
              >
                Cancelar
              </button>
              <button
                onClick={handleCashout}
                disabled={loading || !cashoutAmount}
                className="flex-1 bg-green-600 text-white py-3 rounded-lg font-medium disabled:bg-gray-300"
              >
                {loading ? 'Procesando...' : 'Confirmar'}
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  );

  return (
    <div className="p-4 max-w-md mx-auto">
      <CashoutModal />
      
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
        <h1 className="text-xl font-bold text-gray-800">Dashboard Negocio</h1>
        <div className="w-6"></div>
      </div>

      {/* Tab Navigation */}
      <div className="flex bg-gray-100 rounded-xl p-1 mb-6">
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'overview'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600'
          }`}
        >
          Resumen
        </button>
        <button
          onClick={() => setActiveTab('integrations')}
          className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'integrations'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600'
          }`}
        >
          Integrar
        </button>
        <button
          onClick={() => setActiveTab('settings')}
          className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'settings'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600'
          }`}
        >
          Config
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && <OverviewTab />}
      {activeTab === 'integrations' && <IntegrationsTab />}
      {activeTab === 'settings' && <SettingsTab />}
    </div>
  );
};

export default BusinessDashboard;