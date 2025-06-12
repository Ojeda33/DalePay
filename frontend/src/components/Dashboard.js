import React, { useState, useEffect } from 'react';
import axios from 'axios';
import EnhancedQRCode from './EnhancedQRCode';

const Dashboard = ({ user, onNavigate }) => {
  const [balance, setBalance] = useState(0);
  const [recentTransfers, setRecentTransfers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showEnhancedQR, setShowEnhancedQR] = useState(false);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      // Fetch balance
      const balanceResponse = await axios.get(`/users/${user.id}/balance`);
      setBalance(balanceResponse.data.balance);

      // Fetch recent transfers
      const transfersResponse = await axios.get('/transfers');
      setRecentTransfers(transfersResponse.data.slice(0, 5));
    } catch (error) {
      console.error('Error fetching user data:', error);
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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-PR', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const quickActions = [
    {
      title: 'Enviar',
      subtitle: 'Dinero',
      icon: '💸',
      color: 'from-blue-500 to-blue-600',
      onClick: () => onNavigate('send')
    },
    {
      title: 'Recibir',
      subtitle: 'Dinero',
      icon: '📥',
      color: 'from-green-500 to-green-600',
      onClick: () => onNavigate('receive')
    },
    {
      title: 'Crypto',
      subtitle: 'Wallet',
      icon: '₿',
      color: 'from-orange-500 to-yellow-500',
      onClick: () => onNavigate('crypto')
    },
    {
      title: 'Tarjetas',
      subtitle: 'Gestionar',
      icon: '💳',
      color: 'from-purple-500 to-purple-600',
      onClick: () => onNavigate('cards')
    }
  ];

  const JorgeTourGuide = () => (
    showJorgeTour && (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-6 max-w-md w-full">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center">
              <span className="text-2xl">👨‍💼</span>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              ¡Hola! Soy Jorge
            </h3>
            <p className="text-gray-600 mb-6">
              Tu guía personal de DalePay™. ¿Te ayudo a navegar por la app?
            </p>
            <div className="space-y-3">
              <button className="w-full bg-blue-500 text-white py-2 rounded-lg font-medium">
                Sí, enséñame todo
              </button>
              <button 
                onClick={() => setShowJorgeTour(false)}
                className="w-full border border-gray-300 text-gray-700 py-2 rounded-lg font-medium"
              >
                Ahora no
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-md mx-auto">
      <JorgeTourGuide />

      {/* Welcome Message */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-red-600 rounded-2xl p-6 text-white mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold mb-1">
              ¡Wepa, {user?.full_name?.split(' ')[0]}! 🇵🇷
            </h2>
            <p className="text-blue-100 text-sm">
              Tu wallet está lista para usar
            </p>
          </div>
          <button 
            onClick={() => setShowJorgeTour(true)}
            className="bg-white/20 p-2 rounded-full"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Balance Card */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 mb-6">
        <div className="text-center">
          <p className="text-gray-600 text-sm mb-1">Balance Disponible</p>
          <h3 className="text-3xl font-bold text-gray-800 mb-2">
            {formatCurrency(balance)}
          </h3>
          <p className="text-green-600 text-sm flex items-center justify-center">
            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.293l-3-3a1 1 0 00-1.414-1.414L9 5.586 7.707 4.293a1 1 0 00-1.414 1.414L8.586 8H4a1 1 0 100 2h4.586l-2.293 2.293a1 1 0 101.414 1.414L9 12.414l.293.293a1 1 0 001.414-1.414L8.414 10H13a1 1 0 100-2H8.414l2.293-2.293z" clipRule="evenodd"/>
            </svg>
            Actualizado en tiempo real
          </p>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-100">
          <button 
            onClick={() => onNavigate('cards')}
            className="w-full bg-blue-50 text-blue-600 py-2 px-4 rounded-lg font-medium hover:bg-blue-100 transition-colors"
          >
            + Agregar Dinero con Tarjeta
          </button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mb-6">
        <h4 className="text-lg font-bold text-gray-800 mb-4">Acciones Rápidas</h4>
        <div className="grid grid-cols-2 gap-4">
          {quickActions.map((action, index) => (
            <button
              key={index}
              onClick={action.onClick}
              className={`bg-gradient-to-r ${action.color} p-4 rounded-xl text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1`}
            >
              <div className="text-2xl mb-2">{action.icon}</div>
              <h5 className="font-bold text-sm">{action.title}</h5>
              <p className="text-xs opacity-90">{action.subtitle}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-bold text-gray-800">Actividad Reciente</h4>
          <button className="text-blue-600 text-sm font-medium">Ver todo</button>
        </div>

        {recentTransfers.length > 0 ? (
          <div className="space-y-3">
            {recentTransfers.map((transfer, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    transfer.from_user_id === user.id 
                      ? 'bg-red-100 text-red-600' 
                      : 'bg-green-100 text-green-600'
                  }`}>
                    {transfer.from_user_id === user.id ? '↗️' : '↙️'}
                  </div>
                  <div>
                    <p className="font-medium text-gray-800 text-sm">
                      {transfer.from_user_id === user.id ? 'Enviado' : 'Recibido'}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatDate(transfer.created_at)}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-bold text-sm ${
                    transfer.from_user_id === user.id 
                      ? 'text-red-600' 
                      : 'text-green-600'
                  }`}>
                    {transfer.from_user_id === user.id ? '-' : '+'}
                    {formatCurrency(transfer.amount)}
                  </p>
                  <p className="text-xs text-gray-500 capitalize">
                    {transfer.status}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="text-4xl mb-3">💰</div>
            <p className="text-gray-600 mb-4">No hay transacciones recientes</p>
            <button 
              onClick={() => onNavigate('send')}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium"
            >
              Envía tu primera transferencia
            </button>
          </div>
        )}
      </div>

      {/* Business Features */}
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-6 text-white mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-lg font-bold mb-1">¿Tienes un negocio?</h4>
            <p className="text-purple-100 text-sm">
              Acepta pagos con DalePay™
            </p>
          </div>
          <div className="text-3xl">🏪</div>
        </div>
        <button 
          onClick={() => onNavigate('business')}
          className="mt-4 bg-white text-purple-600 py-2 px-4 rounded-lg font-medium text-sm w-full"
        >
          Registrar Negocio
        </button>
      </div>

      {/* Admin Access (if applicable) */}
      {user?.email === 'admin@dalepay.com' && (
        <div className="bg-gradient-to-r from-red-500 to-orange-500 rounded-2xl p-6 text-white mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-lg font-bold mb-1">Panel de Admin</h4>
              <p className="text-red-100 text-sm">
                Gestionar usuarios y transacciones
              </p>
            </div>
            <div className="text-3xl">⚙️</div>
          </div>
          <button 
            onClick={() => onNavigate('admin')}
            className="mt-4 bg-white text-red-600 py-2 px-4 rounded-lg font-medium text-sm w-full"
          >
            Acceder al Admin
          </button>
        </div>
      )}

      {/* Puerto Rican Pride */}
      <div className="text-center py-6">
        <div className="flex items-center justify-center space-x-2 text-gray-600">
          <span className="text-2xl">🇵🇷</span>
          <span className="text-sm font-medium">Hecho en Borinquen con ❤️</span>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          DalePay™ • Licenciado por FinCEN • Powered by Moov
        </p>
      </div>
    </div>
  );
};

export default Dashboard;
