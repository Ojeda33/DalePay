import React, { useState, useEffect } from 'react';

const NotificationSystem = ({ user, onNotificationsUpdate }) => {
  const [notifications, setNotifications] = useState([]);
  const [showNotificationPanel, setShowNotificationPanel] = useState(false);

  useEffect(() => {
    if (user) {
      checkForNotifications();
      // Check for notifications every 30 seconds
      const interval = setInterval(checkForNotifications, 30000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const checkForNotifications = async () => {
    try {
      const activeNotifications = [];
      const notificationStates = {
        home: false,
        dashboard: false,
        send: false,
        receive: false,
        crypto: false,
        settings: false
      };

      // Check for low balance notification
      if (user?.balance < 10) {
        activeNotifications.push({
          id: 'low_balance',
          type: 'warning',
          title: 'Balance Bajo',
          message: 'Tu balance está por debajo de $10. Considera agregar fondos.',
          page: 'dashboard',
          action: 'add_funds'
        });
        notificationStates.dashboard = true;
      }

      // Check for unverified account
      if (!user?.phone || !user?.is_verified) {
        activeNotifications.push({
          id: 'unverified_account',
          type: 'info',
          title: 'Verifica tu cuenta',
          message: 'Verifica tu teléfono para mayor seguridad y límites más altos.',
          page: 'settings',
          action: 'verify_account'
        });
        notificationStates.settings = true;
      }

      // Check for pending payments (mock check)
      const hasPendingPayments = Math.random() > 0.8; // 20% chance for demo
      if (hasPendingPayments) {
        activeNotifications.push({
          id: 'pending_payment',
          type: 'success',
          title: 'Pago Pendiente',
          message: 'Tienes una solicitud de pago esperando.',
          page: 'receive',
          action: 'view_requests'
        });
        notificationStates.receive = true;
      }

      // Check for crypto price alerts (mock)
      const hasCryptoAlert = Math.random() > 0.9; // 10% chance for demo
      if (hasCryptoAlert) {
        activeNotifications.push({
          id: 'crypto_alert',
          type: 'info',
          title: 'Bitcoin +5%',
          message: 'Bitcoin ha subido 5% en las últimas 24 horas.',
          page: 'crypto',
          action: 'view_crypto'
        });
        notificationStates.crypto = true;
      }

      setNotifications(activeNotifications);
      onNotificationsUpdate && onNotificationsUpdate(notificationStates);
    } catch (error) {
      console.error('Error checking notifications:', error);
    }
  };

  const dismissNotification = (notificationId) => {
    setNotifications(notifications.filter(n => n.id !== notificationId));
    // Recalculate notification states
    checkForNotifications();
  };

  const handleNotificationClick = (notification) => {
    // Handle notification action
    switch(notification.action) {
      case 'add_funds':
        // Navigate to card processor
        break;
      case 'verify_account':
        // Navigate to settings
        break;
      case 'view_requests':
        // Navigate to receive money
        break;
      case 'view_crypto':
        // Navigate to crypto wallet
        break;
      default:
        break;
    }
    dismissNotification(notification.id);
    setShowNotificationPanel(false);
  };

  const getNotificationIcon = (type) => {
    switch(type) {
      case 'warning':
        return '⚠️';
      case 'success':
        return '✅';
      case 'info':
        return 'ℹ️';
      case 'error':
        return '❌';
      default:
        return '📱';
    }
  };

  const getNotificationColor = (type) => {
    switch(type) {
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'success':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'info':
        return 'bg-blue-50 border-blue-200 text-blue-800';
      case 'error':
        return 'bg-red-50 border-red-200 text-red-800';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  if (!showNotificationPanel) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-40 flex items-start justify-center pt-20 p-4">
      <div className="bg-white rounded-2xl p-6 max-w-md w-full max-h-[70vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-800">Notificaciones</h3>
          <button 
            onClick={() => setShowNotificationPanel(false)}
            className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200"
          >
            ✕
          </button>
        </div>

        {notifications.length > 0 ? (
          <div className="space-y-4">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 rounded-xl border-2 cursor-pointer hover:shadow-md transition-all ${getNotificationColor(notification.type)}`}
                onClick={() => handleNotificationClick(notification)}
              >
                <div className="flex items-start space-x-3">
                  <div className="text-2xl">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold mb-1">{notification.title}</h4>
                    <p className="text-sm opacity-90">{notification.message}</p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      dismissNotification(notification.id);
                    }}
                    className="text-gray-400 hover:text-gray-600 text-lg"
                  >
                    ×
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="text-6xl mb-4">🔔</div>
            <h4 className="text-lg font-bold text-gray-800 mb-2">Todo al día</h4>
            <p className="text-gray-600">No tienes notificaciones pendientes</p>
          </div>
        )}

        <div className="mt-6 text-center">
          <button
            onClick={() => setShowNotificationPanel(false)}
            className="text-blue-600 text-sm font-medium hover:underline"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

// Notification Bell Component
export const NotificationBell = ({ notificationCount, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="relative p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
    >
      <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
        <path d="M10 2C7.79 2 6 3.79 6 6v4l-2 2v1h12v-1l-2-2V6c0-2.21-1.79-4-4-4zm0 16c1.1 0 2-.9 2-2H8c0 1.1.9 2 2 2z"/>
      </svg>
      {notificationCount > 0 && (
        <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
          <span className="text-white text-xs font-bold">
            {notificationCount > 9 ? '9+' : notificationCount}
          </span>
        </div>
      )}
    </button>
  );
};

export default NotificationSystem;