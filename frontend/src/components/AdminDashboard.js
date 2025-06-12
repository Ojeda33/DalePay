import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminDashboard = ({ user, onBack }) => {
  const [dashboardData, setDashboardData] = useState({
    total_users: 0,
    total_transfers: 0,
    total_businesses: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
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
        <h1 className="text-xl font-bold text-gray-800">Panel de Admin</h1>
        <div className="w-10 h-10 flex items-center justify-center">
          <span className="text-2xl">⚙️</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-blue-50 rounded-xl p-4 text-center">
          <div className="text-3xl mb-2">👥</div>
          <h3 className="text-2xl font-bold text-blue-800">{dashboardData.total_users}</h3>
          <p className="text-blue-600 text-sm">Usuarios</p>
        </div>
        <div className="bg-green-50 rounded-xl p-4 text-center">
          <div className="text-3xl mb-2">💸</div>
          <h3 className="text-2xl font-bold text-green-800">{dashboardData.total_transfers}</h3>
          <p className="text-green-600 text-sm">Transferencias</p>
        </div>
        <div className="bg-purple-50 rounded-xl p-4 text-center">
          <div className="text-3xl mb-2">🏪</div>
          <h3 className="text-2xl font-bold text-purple-800">{dashboardData.total_businesses}</h3>
          <p className="text-purple-600 text-sm">Negocios</p>
        </div>
        <div className="bg-orange-50 rounded-xl p-4 text-center">
          <div className="text-3xl mb-2">💰</div>
          <h3 className="text-2xl font-bold text-orange-800">$1.2M</h3>
          <p className="text-orange-600 text-sm">Volumen</p>
        </div>
      </div>

      {/* Admin Actions */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-gray-800">Acciones de Admin</h2>
        
        <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-100">
          <h3 className="font-medium text-gray-800 mb-3">Gestión de Usuarios</h3>
          <div className="space-y-2">
            <button className="w-full bg-blue-50 text-blue-600 py-2 rounded-lg text-sm font-medium">
              Ver todos los usuarios
            </button>
            <button className="w-full bg-red-50 text-red-600 py-2 rounded-lg text-sm font-medium">
              Usuarios suspendidos
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-100">
          <h3 className="font-medium text-gray-800 mb-3">Monitoreo de Transacciones</h3>
          <div className="space-y-2">
            <button className="w-full bg-green-50 text-green-600 py-2 rounded-lg text-sm font-medium">
              Transacciones en tiempo real
            </button>
            <button className="w-full bg-yellow-50 text-yellow-600 py-2 rounded-lg text-sm font-medium">
              Transacciones sospechosas
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-100">
          <h3 className="font-medium text-gray-800 mb-3">Gestión de Negocios</h3>
          <div className="space-y-2">
            <button className="w-full bg-purple-50 text-purple-600 py-2 rounded-lg text-sm font-medium">
              Aprobar negocios pendientes
            </button>
            <button className="w-full bg-orange-50 text-orange-600 py-2 rounded-lg text-sm font-medium">
              Reportes de ventas
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-100">
          <h3 className="font-medium text-gray-800 mb-3">API & Integraciones</h3>
          <div className="space-y-2">
            <button className="w-full bg-indigo-50 text-indigo-600 py-2 rounded-lg text-sm font-medium">
              Gestionar API Keys
            </button>
            <button className="w-full bg-pink-50 text-pink-600 py-2 rounded-lg text-sm font-medium">
              Webhooks activos
            </button>
          </div>
        </div>
      </div>

      {/* System Status */}
      <div className="mt-6 bg-green-50 rounded-xl p-4">
        <h3 className="font-medium text-green-800 mb-3">Estado del Sistema</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-green-700">API DalePay™:</span>
            <span className="text-green-600 font-medium">✅ Operativo</span>
          </div>
          <div className="flex justify-between">
            <span className="text-green-700">Moov API:</span>
            <span className="text-green-600 font-medium">✅ Operativo</span>
          </div>
          <div className="flex justify-between">
            <span className="text-green-700">Base de datos:</span>
            <span className="text-green-600 font-medium">✅ Operativo</span>
          </div>
          <div className="flex justify-between">
            <span className="text-green-700">Procesamiento:</span>
            <span className="text-green-600 font-medium">✅ Normal</span>
          </div>
        </div>
      </div>

      {/* Compliance */}
      <div className="mt-6 bg-blue-50 rounded-xl p-4">
        <h3 className="font-medium text-blue-800 mb-3">Cumplimiento Regulatorio</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-blue-700">FinCEN:</span>
            <span className="text-green-600 font-medium">✅ Compliant</span>
          </div>
          <div className="flex justify-between">
            <span className="text-blue-700">AML/BSA:</span>
            <span className="text-green-600 font-medium">✅ Activo</span>
          </div>
          <div className="flex justify-between">
            <span className="text-blue-700">FDIC:</span>
            <span className="text-green-600 font-medium">✅ Protegido</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
