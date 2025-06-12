import React, { useState } from 'react';

const UserSettings = ({ user, onLogout, onBack }) => {
  const [activeTab, setActiveTab] = useState('profile');
  const [notifications, setNotifications] = useState({
    transfers: true,
    marketing: false,
    security: true
  });

  const ProfileTab = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
        <div className="text-center mb-6">
          <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center">
            <span className="text-white text-2xl font-bold">
              {user?.full_name?.charAt(0) || 'U'}
            </span>
          </div>
          <h3 className="text-xl font-bold text-gray-800">{user?.full_name}</h3>
          <p className="text-gray-600">{user?.email}</p>
          <div className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm mt-2">
            ✅ Cuenta verificada
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium text-gray-800">Email</p>
              <p className="text-sm text-gray-600">{user?.email}</p>
            </div>
            <button className="text-blue-600 text-sm font-medium">Editar</button>
          </div>

          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium text-gray-800">Teléfono</p>
              <p className="text-sm text-gray-600">{user?.phone || 'No agregado'}</p>
            </div>
            <button className="text-blue-600 text-sm font-medium">
              {user?.phone ? 'Editar' : 'Agregar'}
            </button>
          </div>

          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium text-gray-800">ID de Moov</p>
              <p className="text-sm text-gray-600 font-mono">
                {user?.moov_account_id ? user.moov_account_id.substring(0, 8) + '...' : 'No disponible'}
              </p>
            </div>
            <div className="text-green-600 text-sm">✅ Activo</div>
          </div>
        </div>
      </div>
    </div>
  );

  const SecurityTab = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Seguridad de la cuenta</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600">🔒</span>
              </div>
              <div>
                <p className="font-medium text-gray-800">Contraseña</p>
                <p className="text-sm text-gray-600">Última actualización: hace 30 días</p>
              </div>
            </div>
            <button className="text-blue-600 text-sm font-medium">Cambiar</button>
          </div>

          <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600">📱</span>
              </div>
              <div>
                <p className="font-medium text-gray-800">Autenticación 2FA</p>
                <p className="text-sm text-gray-600">Protección adicional</p>
              </div>
            </div>
            <button className="text-blue-600 text-sm font-medium">Configurar</button>
          </div>

          <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                <span className="text-orange-600">📋</span>
              </div>
              <div>
                <p className="font-medium text-gray-800">Historial de inicio de sesión</p>
                <p className="text-sm text-gray-600">Ver actividad reciente</p>
              </div>
            </div>
            <button className="text-blue-600 text-sm font-medium">Ver</button>
          </div>
        </div>
      </div>

      <div className="bg-red-50 rounded-xl p-4 border border-red-200">
        <h4 className="font-medium text-red-800 mb-2">Zona de peligro</h4>
        <p className="text-red-700 text-sm mb-3">
          Estas acciones son irreversibles. Úsalas con precaución.
        </p>
        <button className="w-full bg-red-600 text-white py-2 rounded-lg font-medium text-sm">
          Eliminar cuenta
        </button>
      </div>
    </div>
  );

  const NotificationsTab = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Notificaciones</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
            <div>
              <p className="font-medium text-gray-800">Transferencias</p>
              <p className="text-sm text-gray-600">Recibir notificaciones de pagos</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notifications.transfers}
                onChange={(e) => setNotifications({...notifications, transfers: e.target.checked})}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
            <div>
              <p className="font-medium text-gray-800">Seguridad</p>
              <p className="text-sm text-gray-600">Alertas de actividad sospechosa</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notifications.security}
                onChange={(e) => setNotifications({...notifications, security: e.target.checked})}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
            <div>
              <p className="font-medium text-gray-800">Marketing</p>
              <p className="text-sm text-gray-600">Ofertas y promociones</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notifications.marketing}
                onChange={(e) => setNotifications({...notifications, marketing: e.target.checked})}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </div>
    </div>
  );

  const SupportTab = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Centro de ayuda</h3>
        
        <div className="space-y-3">
          <button className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">❓</span>
              <div>
                <p className="font-medium text-gray-800">Preguntas frecuentes</p>
                <p className="text-sm text-gray-600">Encuentra respuestas rápidas</p>
              </div>
            </div>
          </button>

          <button className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">💬</span>
              <div>
                <p className="font-medium text-gray-800">Chat en vivo</p>
                <p className="text-sm text-gray-600">Habla con nuestro equipo</p>
              </div>
            </div>
          </button>

          <button className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">📧</span>
              <div>
                <p className="font-medium text-gray-800">Enviar ticket</p>
                <p className="text-sm text-gray-600">Soporte por email</p>
              </div>
            </div>
          </button>

          <button className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">📱</span>
              <div>
                <p className="font-medium text-gray-800">WhatsApp</p>
                <p className="text-sm text-gray-600">+1 787-555-DALE</p>
              </div>
            </div>
          </button>

          <button className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">📋</span>
              <div>
                <p className="font-medium text-gray-800">Términos y Condiciones</p>
                <p className="text-sm text-gray-600">Lee nuestros términos legales</p>
              </div>
            </div>
          </button>

          <button className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">🇵🇷</span>
              <div>
                <p className="font-medium text-gray-800">Herencia Taína</p>
                <p className="text-sm text-gray-600">Conoce nuestra historia y misión</p>
              </div>
            </div>
          </button>
        </div>
      </div>

      <div className="bg-blue-50 rounded-xl p-4">
        <h4 className="font-medium text-blue-800 mb-2">Soporte 24/7 en español</h4>
        <p className="text-blue-700 text-sm">
          Nuestro equipo de soporte está disponible las 24 horas para ayudarte con cualquier problema.
        </p>
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
        <h1 className="text-xl font-bold text-gray-800">Configuración</h1>
        <div className="w-10 h-10 flex items-center justify-center">
          <span className="text-2xl">⚙️</span>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="grid grid-cols-4 bg-gray-100 rounded-xl p-1 mb-6">
        <button
          onClick={() => setActiveTab('profile')}
          className={`py-2 px-2 rounded-lg text-xs font-medium transition-colors ${
            activeTab === 'profile'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600'
          }`}
        >
          Perfil
        </button>
        <button
          onClick={() => setActiveTab('security')}
          className={`py-2 px-2 rounded-lg text-xs font-medium transition-colors ${
            activeTab === 'security'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600'
          }`}
        >
          Seguridad
        </button>
        <button
          onClick={() => setActiveTab('notifications')}
          className={`py-2 px-2 rounded-lg text-xs font-medium transition-colors ${
            activeTab === 'notifications'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600'
          }`}
        >
          Avisos
        </button>
        <button
          onClick={() => setActiveTab('support')}
          className={`py-2 px-2 rounded-lg text-xs font-medium transition-colors ${
            activeTab === 'support'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600'
          }`}
        >
          Ayuda
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'profile' && <ProfileTab />}
      {activeTab === 'security' && <SecurityTab />}
      {activeTab === 'notifications' && <NotificationsTab />}
      {activeTab === 'support' && <SupportTab />}

      {/* Logout Button */}
      <div className="mt-8">
        <button
          onClick={onLogout}
          className="w-full bg-red-600 text-white py-4 rounded-2xl font-bold"
        >
          Cerrar sesión
        </button>
      </div>

      {/* App Info */}
      <div className="mt-6 text-center">
        <div className="flex items-center justify-center space-x-2 text-gray-500 mb-2">
          <span className="text-lg">🇵🇷</span>
          <span className="text-sm">DalePay™ v1.0</span>
        </div>
        <p className="text-xs text-gray-500">
          Licenciado por FinCEN • Powered by Moov
        </p>
      </div>
    </div>
  );
};

export default UserSettings;
