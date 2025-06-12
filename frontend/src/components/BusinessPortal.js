import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BusinessPortal = ({ user, onBack }) => {
  const [businesses, setBusinesses] = useState([]);
  const [showCreateBusiness, setShowCreateBusiness] = useState(false);
  const [showBusinessDashboard, setShowBusinessDashboard] = useState(false);
  const [selectedBusiness, setSelectedBusiness] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [businessForm, setBusinessForm] = useState({
    name: '',
    business_type: '',
    description: '',
    address: '',
    phone: '',
    website: ''
  });

  useEffect(() => {
    fetchBusinesses();
  }, []);

  const fetchBusinesses = async () => {
    try {
      const response = await axios.get('/businesses');
      setBusinesses(response.data);
    } catch (error) {
      console.error('Error fetching businesses:', error);
    }
  };

  const handleCreateBusiness = async () => {
    if (!businessForm.name || !businessForm.business_type) {
      setError('Nombre y tipo de negocio son requeridos');
      return;
    }

    setLoading(true);
    try {
      await axios.post('/register-business', businessForm);
      setShowCreateBusiness(false);
      setBusinessForm({
        name: '',
        business_type: '',
        description: '',
        address: '',
        phone: '',
        website: ''
      });
      fetchBusinesses();
    } catch (error) {
      setError(error.response?.data?.detail || 'Error creando negocio');
    } finally {
      setLoading(false);
    }
  };

  const businessTypes = [
    { value: 'restaurant', label: 'Restaurante', icon: '🍽️' },
    { value: 'retail', label: 'Tienda', icon: '🛍️' },
    { value: 'service', label: 'Servicio', icon: '🔧' },
    { value: 'beauty', label: 'Belleza', icon: '💄' },
    { value: 'health', label: 'Salud', icon: '🏥' },
    { value: 'education', label: 'Educación', icon: '📚' },
    { value: 'entertainment', label: 'Entretenimiento', icon: '🎭' },
    { value: 'other', label: 'Otro', icon: '🏢' }
  ];

  if (showCreateBusiness) {
    return (
      <div className="p-4 max-w-md mx-auto">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => setShowCreateBusiness(false)}
            className="p-2 rounded-lg hover:bg-gray-100"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-xl font-bold text-gray-800">Registrar Negocio</h1>
          <div className="w-6"></div>
        </div>

        <div className="space-y-6">
          <div className="text-center">
            <div className="text-6xl mb-4">🏪</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              ¡Comienza a recibir pagos!
            </h2>
            <p className="text-gray-600">
              Registra tu negocio y acepta pagos con DalePay™
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre del negocio *
              </label>
              <input
                type="text"
                value={businessForm.name}
                onChange={(e) => setBusinessForm({...businessForm, name: e.target.value})}
                placeholder="Mi Negocio"
                className="w-full border-2 border-gray-300 rounded-xl py-3 px-4 focus:outline-none focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de negocio *
              </label>
              <div className="grid grid-cols-2 gap-2">
                {businessTypes.map((type) => (
                  <button
                    key={type.value}
                    onClick={() => setBusinessForm({...businessForm, business_type: type.value})}
                    className={`p-3 rounded-xl border-2 transition-colors text-left ${
                      businessForm.business_type === type.value
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">{type.icon}</span>
                      <span className="text-sm font-medium">{type.label}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descripción
              </label>
              <textarea
                value={businessForm.description}
                onChange={(e) => setBusinessForm({...businessForm, description: e.target.value})}
                placeholder="Describe tu negocio..."
                rows="3"
                className="w-full border-2 border-gray-300 rounded-xl py-3 px-4 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Dirección
              </label>
              <input
                type="text"
                value={businessForm.address}
                onChange={(e) => setBusinessForm({...businessForm, address: e.target.value})}
                placeholder="Calle 123, San Juan, PR"
                className="w-full border-2 border-gray-300 rounded-xl py-3 px-4 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Teléfono
              </label>
              <input
                type="tel"
                value={businessForm.phone}
                onChange={(e) => setBusinessForm({...businessForm, phone: e.target.value})}
                placeholder="+1 787-123-4567"
                className="w-full border-2 border-gray-300 rounded-xl py-3 px-4 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sitio web
              </label>
              <input
                type="url"
                value={businessForm.website}
                onChange={(e) => setBusinessForm({...businessForm, website: e.target.value})}
                placeholder="https://minegocio.com"
                className="w-full border-2 border-gray-300 rounded-xl py-3 px-4 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          <button
            onClick={handleCreateBusiness}
            disabled={loading}
            className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Registrando...
              </div>
            ) : (
              'Registrar Negocio'
            )}
          </button>

          <div className="bg-blue-50 rounded-xl p-4">
            <div className="flex items-start space-x-3">
              <div className="text-lg">✅</div>
              <div>
                <h4 className="font-medium text-blue-800 mb-1">¿Qué obtienes?</h4>
                <ul className="text-blue-700 text-sm space-y-1">
                  <li>• Código QR personalizado</li>
                  <li>• Dashboard de ventas</li>
                  <li>• Reportes en tiempo real</li>
                  <li>• Retiros instantáneos</li>
                </ul>
              </div>
            </div>
          </div>
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
        <h1 className="text-xl font-bold text-gray-800">Portal de Negocios</h1>
        <div className="w-10 h-10 flex items-center justify-center">
          <span className="text-2xl">🏪</span>
        </div>
      </div>

      {businesses.length > 0 ? (
        <div className="space-y-6">
          {/* Business Cards */}
          <div className="space-y-4">
            {businesses.map((business, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-800 mb-1">
                      {business.name}
                    </h3>
                    <p className="text-sm text-gray-600 capitalize">
                      {businessTypes.find(t => t.value === business.business_type)?.label}
                    </p>
                    <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs mt-2 ${
                      business.is_approved 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {business.is_approved ? '✅ Aprobado' : '⏳ Pendiente'}
                    </div>
                  </div>
                  <div className="text-3xl">
                    {businessTypes.find(t => t.value === business.business_type)?.icon}
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="bg-gray-50 rounded-xl p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-600 text-sm">Balance:</span>
                      <span className="text-xl font-bold text-gray-800">
                        ${business.balance?.toFixed(2) || '0.00'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 text-sm">Ventas hoy:</span>
                      <span className="text-green-600 font-medium">+$0.00</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <button className="bg-blue-50 text-blue-600 py-2 px-4 rounded-lg font-medium text-sm">
                      📊 Dashboard
                    </button>
                    <button className="bg-purple-50 text-purple-600 py-2 px-4 rounded-lg font-medium text-sm">
                      📱 Código QR
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Add Another Business */}
          <button
            onClick={() => setShowCreateBusiness(true)}
            className="w-full border-2 border-dashed border-blue-300 text-blue-600 py-6 rounded-2xl font-bold hover:border-blue-400 hover:bg-blue-50 transition-colors"
          >
            + Registrar otro negocio
          </button>
        </div>
      ) : (
        <div className="text-center space-y-6">
          {/* Empty State */}
          <div className="py-12">
            <div className="text-8xl mb-6">🏪</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              ¡Comienza tu negocio digital!
            </h2>
            <p className="text-gray-600 mb-8">
              Registra tu negocio y acepta pagos con DalePay™. 
              Es gratis y solo toma unos minutos.
            </p>
          </div>

          {/* Features */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-blue-50 rounded-xl p-4 text-center">
              <div className="text-3xl mb-2">📱</div>
              <h4 className="font-medium text-blue-800">Código QR</h4>
              <p className="text-sm text-blue-600">Personalizados</p>
            </div>
            <div className="bg-green-50 rounded-xl p-4 text-center">
              <div className="text-3xl mb-2">💰</div>
              <h4 className="font-medium text-green-800">Sin fees</h4>
              <p className="text-sm text-green-600">Primeros $1K</p>
            </div>
            <div className="bg-purple-50 rounded-xl p-4 text-center">
              <div className="text-3xl mb-2">📊</div>
              <h4 className="font-medium text-purple-800">Analytics</h4>
              <p className="text-sm text-purple-600">Tiempo real</p>
            </div>
            <div className="bg-orange-50 rounded-xl p-4 text-center">
              <div className="text-3xl mb-2">⚡</div>
              <h4 className="font-medium text-orange-800">Instantáneo</h4>
              <p className="text-sm text-orange-600">Retiros al día</p>
            </div>
          </div>

          <button
            onClick={() => setShowCreateBusiness(true)}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-2xl font-bold text-lg"
          >
            Registrar mi negocio gratis
          </button>
        </div>
      )}

      {/* Partner Integrations */}
      <div className="mt-8 bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-6">
        <div className="text-center">
          <h3 className="text-lg font-bold text-gray-800 mb-3">
            Integración con plataformas
          </h3>
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="bg-white rounded-lg p-3 text-center">
              <div className="text-2xl mb-1">🚗</div>
              <p className="text-xs font-medium">Uber Eats</p>
            </div>
            <div className="bg-white rounded-lg p-3 text-center">
              <div className="text-2xl mb-1">🍕</div>
              <p className="text-xs font-medium">DoorDash</p>
            </div>
            <div className="bg-white rounded-lg p-3 text-center">
              <div className="text-2xl mb-1">💳</div>
              <p className="text-xs font-medium">ATH Móvil</p>
            </div>
          </div>
          <p className="text-sm text-gray-600">
            Conecta DalePay™ con tus plataformas favoritas
          </p>
        </div>
      </div>

      {/* Puerto Rican Business Support */}
      <div className="mt-6 bg-gradient-to-r from-red-50 to-blue-50 rounded-xl p-4">
        <div className="flex items-center space-x-3">
          <div className="text-2xl">🇵🇷</div>
          <div>
            <h4 className="font-medium text-gray-800 mb-1">Apoyo local</h4>
            <p className="text-gray-600 text-sm">
              DalePay™ apoya el crecimiento de negocios puertorriqueños
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessPortal;
