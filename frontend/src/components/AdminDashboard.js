import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminDashboard = ({ user, onBack }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [dashboardData, setDashboardData] = useState({
    total_users: 0,
    total_transfers: 0,
    total_businesses: 0
  });
  const [users, setUsers] = useState([]);
  const [flaggedAccounts, setFlaggedAccounts] = useState([]);
  const [systemLogs, setSystemLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);

  useEffect(() => {
    fetchDashboardData();
    fetchUsers();
    fetchSystemLogs();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await axios.get('/admin/dashboard');
      setDashboardData(response.data);
    } catch (error) {
      console.error('Error fetching admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      // Mock users data since we don't have a real endpoint yet
      setUsers([
        {
          id: '1',
          full_name: 'María Rodriguez',
          email: 'maria@email.com',
          balance: 245.50,
          status: 'active',
          created_at: '2024-01-15',
          last_login: '2024-06-12',
          total_transactions: 45,
          is_flagged: false
        },
        {
          id: '2',
          full_name: 'Carlos Vélez',
          email: 'carlos@email.com',
          balance: 1050.75,
          status: 'active',
          created_at: '2024-02-20',
          last_login: '2024-06-11',
          total_transactions: 123,
          is_flagged: false
        },
        {
          id: '3',
          full_name: 'Ana Torres',
          email: 'ana@email.com',
          balance: 75.25,
          status: 'frozen',
          created_at: '2024-03-10',
          last_login: '2024-06-10',
          total_transactions: 8,
          is_flagged: true,
          flag_reason: 'Suspicious transaction pattern detected by AI'
        }
      ]);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchSystemLogs = async () => {
    setSystemLogs([
      {
        id: '1',
        timestamp: '2024-06-12 14:30:25',
        type: 'security',
        message: 'AI flagged account ana@email.com for suspicious activity',
        severity: 'high'
      },
      {
        id: '2',
        timestamp: '2024-06-12 14:15:10',
        type: 'business',
        message: 'New business registration: Puerto Rican Restaurant',
        severity: 'info'
      },
      {
        id: '3',
        timestamp: '2024-06-12 13:45:32',
        type: 'system',
        message: 'Database backup completed successfully',
        severity: 'info'
      }
    ]);
  };

  const handleFreezeAccount = async (userId, reason) => {
    try {
      setUsers(users.map(user => 
        user.id === userId 
          ? { ...user, status: 'frozen', freeze_reason: reason }
          : user
      ));
      alert('Cuenta congelada exitosamente');
    } catch (error) {
      alert('Error congelando cuenta');
    }
  };

  const handleUnfreezeAccount = async (userId) => {
    try {
      setUsers(users.map(user => 
        user.id === userId 
          ? { ...user, status: 'active', freeze_reason: null }
          : user
      ));
      alert('Cuenta descongelada exitosamente');
    } catch (error) {
      alert('Error descongelando cuenta');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('¿Estás seguro de eliminar este usuario? Esta acción no se puede deshacer.')) {
      try {
        setUsers(users.filter(user => user.id !== userId));
        alert('Usuario eliminado exitosamente');
      } catch (error) {
        alert('Error eliminando usuario');
      }
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  // Overview Tab
  const OverviewTab = () => (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-4 text-white text-center">
          <div className="text-3xl mb-2">👥</div>
          <h3 className="text-2xl font-bold">{dashboardData.total_users}</h3>
          <p className="text-blue-100 text-sm">Usuarios Totales</p>
        </div>
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-4 text-white text-center">
          <div className="text-3xl mb-2">💸</div>
          <h3 className="text-2xl font-bold">{dashboardData.total_transfers}</h3>
          <p className="text-green-100 text-sm">Transferencias</p>
        </div>
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-4 text-white text-center">
          <div className="text-3xl mb-2">🏪</div>
          <h3 className="text-2xl font-bold">{dashboardData.total_businesses}</h3>
          <p className="text-purple-100 text-sm">Negocios</p>
        </div>
        <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-xl p-4 text-white text-center">
          <div className="text-3xl mb-2">⚠️</div>
          <h3 className="text-2xl font-bold">{users.filter(u => u.is_flagged).length}</h3>
          <p className="text-red-100 text-sm">Cuentas Flagged</p>
        </div>
      </div>

      {/* AI Security Alerts */}
      <div className="bg-red-50 rounded-xl p-4 border border-red-200">
        <h3 className="font-bold text-red-800 mb-3 flex items-center">
          <span className="text-2xl mr-2">🤖</span>
          Alertas de Seguridad AI
        </h3>
        <div className="space-y-2">
          {users.filter(u => u.is_flagged).map(user => (
            <div key={user.id} className="bg-white p-3 rounded-lg border border-red-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-red-800">{user.full_name}</p>
                  <p className="text-sm text-red-600">{user.flag_reason}</p>
                </div>
                <div className="space-x-2">
                  <button 
                    onClick={() => handleFreezeAccount(user.id, 'AI Security Alert')}
                    className="bg-red-600 text-white px-3 py-1 rounded text-sm"
                  >
                    Congelar
                  </button>
                  <button 
                    onClick={() => {
                      setSelectedUser(user);
                      setShowUserModal(true);
                    }}
                    className="bg-blue-600 text-white px-3 py-1 rounded text-sm"
                  >
                    Revisar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent System Activity */}
      <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-100">
        <h3 className="font-bold text-gray-800 mb-3">Actividad del Sistema</h3>
        <div className="space-y-2">
          {systemLogs.slice(0, 5).map(log => (
            <div key={log.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
              <div className="flex items-center space-x-2">
                <span className={`w-2 h-2 rounded-full ${
                  log.severity === 'high' ? 'bg-red-500' :
                  log.severity === 'warning' ? 'bg-yellow-500' : 'bg-green-500'
                }`}></span>
                <span className="text-sm text-gray-700">{log.message}</span>
              </div>
              <span className="text-xs text-gray-500">{log.timestamp}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Users Management Tab
  const UsersTab = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-gray-800">Gestión de Usuarios</h3>
        <div className="flex space-x-2">
          <button className="bg-blue-600 text-white px-3 py-1 rounded text-sm">
            Exportar CSV
          </button>
          <button className="bg-green-600 text-white px-3 py-1 rounded text-sm">
            + Crear Usuario
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {users.map(user => (
          <div key={user.id} className={`bg-white rounded-xl p-4 shadow-lg border ${
            user.is_flagged ? 'border-red-300' : 'border-gray-100'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold ${
                  user.status === 'frozen' ? 'bg-red-500' : 
                  user.is_flagged ? 'bg-yellow-500' : 'bg-blue-500'
                }`}>
                  {user.full_name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-bold text-gray-800">{user.full_name}</h4>
                  <p className="text-sm text-gray-600">{user.email}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      user.status === 'active' ? 'bg-green-100 text-green-800' :
                      user.status === 'frozen' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {user.status}
                    </span>
                    {user.is_flagged && (
                      <span className="px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800">
                        AI Flagged
                      </span>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                <p className="font-bold text-gray-800">{formatCurrency(user.balance)}</p>
                <p className="text-sm text-gray-600">{user.total_transactions} transacciones</p>
                <div className="flex space-x-1 mt-2">
                  <button 
                    onClick={() => {
                      setSelectedUser(user);
                      setShowUserModal(true);
                    }}
                    className="bg-blue-500 text-white px-2 py-1 rounded text-xs"
                  >
                    Ver
                  </button>
                  {user.status === 'active' ? (
                    <button 
                      onClick={() => handleFreezeAccount(user.id, 'Admin action')}
                      className="bg-yellow-500 text-white px-2 py-1 rounded text-xs"
                    >
                      Congelar
                    </button>
                  ) : (
                    <button 
                      onClick={() => handleUnfreezeAccount(user.id)}
                      className="bg-green-500 text-white px-2 py-1 rounded text-xs"
                    >
                      Activar
                    </button>
                  )}
                  <button 
                    onClick={() => handleDeleteUser(user.id)}
                    className="bg-red-500 text-white px-2 py-1 rounded text-xs"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // System Control Tab
  const SystemTab = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Control del Sistema</h3>
        
        <div className="grid grid-cols-2 gap-4">
          <button className="bg-green-600 text-white py-3 rounded-lg font-medium">
            🔄 Reiniciar Servicios
          </button>
          <button className="bg-blue-600 text-white py-3 rounded-lg font-medium">
            💾 Backup Database
          </button>
          <button className="bg-purple-600 text-white py-3 rounded-lg font-medium">
            📊 Generar Reportes
          </button>
          <button className="bg-orange-600 text-white py-3 rounded-lg font-medium">
            🔧 Configuración
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Estado de Integraciones</h3>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="font-medium">Moov API</span>
            </div>
            <span className="text-green-600 text-sm">Operativo</span>
          </div>
          <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="font-medium">MongoDB</span>
            </div>
            <span className="text-green-600 text-sm">Operativo</span>
          </div>
          <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <span className="font-medium">AI Security</span>
            </div>
            <span className="text-yellow-600 text-sm">Monitoreando</span>
          </div>
        </div>
      </div>

      <div className="bg-red-50 rounded-xl p-6 border border-red-200">
        <h3 className="text-lg font-bold text-red-800 mb-4">Zona de Peligro</h3>
        <div className="space-y-3">
          <button className="w-full bg-red-600 text-white py-3 rounded-lg font-medium">
            🗑️ Limpiar Logs del Sistema
          </button>
          <button className="w-full bg-red-700 text-white py-3 rounded-lg font-medium">
            🚨 Modo Mantenimiento
          </button>
        </div>
      </div>
    </div>
  );

  // User Detail Modal
  const UserModal = () => (
    showUserModal && selectedUser && (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-6 max-w-md w-full max-h-[80vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-800">Detalles del Usuario</h3>
            <button 
              onClick={() => setShowUserModal(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>

          <div className="space-y-4">
            <div className="text-center">
              <div className="w-20 h-20 bg-blue-600 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold">
                {selectedUser.full_name.charAt(0)}
              </div>
              <h4 className="text-xl font-bold text-gray-800">{selectedUser.full_name}</h4>
              <p className="text-gray-600">{selectedUser.email}</p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Balance:</span>
                <span className="font-medium">{formatCurrency(selectedUser.balance)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Estado:</span>
                <span className={`font-medium ${
                  selectedUser.status === 'active' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {selectedUser.status}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Transacciones:</span>
                <span className="font-medium">{selectedUser.total_transactions}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Registro:</span>
                <span className="font-medium">{selectedUser.created_at}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Último acceso:</span>
                <span className="font-medium">{selectedUser.last_login}</span>
              </div>
            </div>

            {selectedUser.is_flagged && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h5 className="font-bold text-red-800 mb-2">⚠️ Flagged por AI</h5>
                <p className="text-red-700 text-sm">{selectedUser.flag_reason}</p>
              </div>
            )}

            <div className="flex space-x-3">
              {selectedUser.status === 'active' ? (
                <button 
                  onClick={() => {
                    handleFreezeAccount(selectedUser.id, 'Admin review');
                    setShowUserModal(false);
                  }}
                  className="flex-1 bg-yellow-600 text-white py-3 rounded-lg font-medium"
                >
                  Congelar Cuenta
                </button>
              ) : (
                <button 
                  onClick={() => {
                    handleUnfreezeAccount(selectedUser.id);
                    setShowUserModal(false);
                  }}
                  className="flex-1 bg-green-600 text-white py-3 rounded-lg font-medium"
                >
                  Activar Cuenta
                </button>
              )}
              <button 
                onClick={() => {
                  handleDeleteUser(selectedUser.id);
                  setShowUserModal(false);
                }}
                className="flex-1 bg-red-600 text-white py-3 rounded-lg font-medium"
              >
                Eliminar Usuario
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
      <UserModal />
      
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
        <h1 className="text-xl font-bold text-gray-800">Admin Dashboard</h1>
        <div className="w-10 h-10 flex items-center justify-center">
          <span className="text-2xl">👑</span>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex bg-gray-100 rounded-xl p-1 mb-6">
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex-1 py-2 px-2 rounded-lg text-xs font-medium transition-colors ${
            activeTab === 'overview'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600'
          }`}
        >
          Resumen
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`flex-1 py-2 px-2 rounded-lg text-xs font-medium transition-colors ${
            activeTab === 'users'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600'
          }`}
        >
          Usuarios
        </button>
        <button
          onClick={() => setActiveTab('system')}
          className={`flex-1 py-2 px-2 rounded-lg text-xs font-medium transition-colors ${
            activeTab === 'system'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600'
          }`}
        >
          Sistema
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && <OverviewTab />}
      {activeTab === 'users' && <UsersTab />}
      {activeTab === 'system' && <SystemTab />}
    </div>
  );
};

export default AdminDashboard;
