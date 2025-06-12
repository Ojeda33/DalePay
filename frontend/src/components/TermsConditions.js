import React from 'react';

const TermsConditions = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-red-600 rounded-2xl p-6 text-white mb-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-white rounded-full mx-auto mb-4 flex items-center justify-center">
              <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-red-600">
                D
              </span>
            </div>
            <h1 className="text-3xl font-bold mb-2">DalePay™</h1>
            <p className="text-blue-100">Términos y Condiciones de Servicio</p>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl p-8 shadow-lg">
          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">1. Información de la Empresa</h2>
              <div className="bg-gradient-to-r from-red-50 via-yellow-50 to-blue-50 rounded-xl p-6 mb-4 border border-blue-200">
                <div className="text-center mb-4">
                  <div className="text-4xl mb-2">🇵🇷</div>
                  <h3 className="text-xl font-bold text-blue-800">Propiedad Intelectual Taína</h3>
                </div>
                <div className="text-gray-700 space-y-2">
                  <p><strong>Propietario Intelectual:</strong> Nación Maya-We</p>
                  <p><strong>Origen:</strong> 100% propiedad y operación Taína</p>
                  <p><strong>Declaración:</strong> Anunciamos humildemente que DalePay™ es completamente propiedad de taínos y hecho por taínos para el beneficio de nuestra comunidad y el mundo.</p>
                </div>
              </div>
              <div className="text-gray-700 space-y-2">
                <p><strong>Nombre:</strong> DalePay™</p>
                <p><strong>Tipo:</strong> Plataforma de Wallet Digital y Transferencias</p>
                <p><strong>Compliance Officer:</strong> AHMET S. OJEDA MERCADO</p>
                <p><strong>Servicio:</strong> Transferencias de dinero a través de socio licenciado Moov</p>
                <p><strong>Misión:</strong> Democratizar el acceso financiero para la comunidad puertorriqueña y honrar nuestro legado taíno</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">2. Legitimidad Legal y Protección</h2>
              <div className="bg-green-50 rounded-xl p-6 mb-4 border border-green-200">
                <h3 className="font-bold text-green-800 mb-2">🏛️ Cumplimiento Legal Completo</h3>
                <p className="text-green-700 text-sm mb-4">
                  DalePay™ opera en total cumplimiento con todas las regulaciones federales y estatales aplicables.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white rounded-lg p-4">
                    <h4 className="font-bold text-green-800 mb-2">FinCEN Registration</h4>
                    <p className="text-sm text-green-700">Registrado como Money Services Business (MSB) bajo FinCEN</p>
                  </div>
                  <div className="bg-white rounded-lg p-4">
                    <h4 className="font-bold text-green-800 mb-2">Protección FDIC</h4>
                    <p className="text-sm text-green-700">Fondos protegidos hasta límites aplicables a través de Moov</p>
                  </div>
                  <div className="bg-white rounded-lg p-4">
                    <h4 className="font-bold text-green-800 mb-2">Compliance AML/BSA</h4>
                    <p className="text-sm text-green-700">Monitoreo anti-lavado de dinero 24/7</p>
                  </div>
                  <div className="bg-white rounded-lg p-4">
                    <h4 className="font-bold text-green-800 mb-2">Auditorías Regulares</h4>
                    <p className="text-sm text-green-700">Auditorías de cumplimiento trimestrales</p>
                  </div>
                </div>
              </div>
              
              <div className="text-gray-700 space-y-3">
                <p>
                  <strong>Licenciamiento:</strong> DalePay™ opera bajo una arquitectura de cumplimiento donde NUNCA mantenemos fondos. 
                  Todos los servicios de transmisión de dinero son manejados por Moov Financial Inc., 
                  un transmisor de dinero completamente licenciado a nivel federal.
                </p>
                <p>
                  <strong>Protección Legal:</strong> Los usuarios están protegidos por todas las regulaciones aplicables 
                  del Bank Secrecy Act (BSA), Anti-Money Laundering (AML), y Know Your Customer (KYC).
                </p>
                <p>
                  <strong>Jurisdicción:</strong> Operamos bajo jurisdicción federal de Estados Unidos con 
                  cumplimiento específico para Puerto Rico como territorio estadounidense.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">3. Asociación con Moov</h2>
              <div className="text-gray-700 space-y-3">
                <p>
                  <strong>Socio Licenciado:</strong> Moov Financial Inc.
                </p>
                <p>
                  DalePay™ se asocia con Moov para proporcionar servicios de transmisión de dinero. 
                  Moov es un transmisor de dinero completamente licenciado que maneja:
                </p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Creación y gestión de wallets de usuario</li>
                  <li>Procesamiento de transferencias de dinero</li>
                  <li>Cumplimiento regulatorio</li>
                  <li>Protección de fondos de usuarios</li>
                  <li>Procesamiento de tarjetas de crédito/débito</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">4. Estructura de Tarifas</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-green-50 rounded-xl p-4">
                  <h3 className="font-bold text-green-800 mb-2">Servicios Gratuitos</h3>
                  <ul className="text-green-700 text-sm space-y-1">
                    <li>• Transferencias entre usuarios DalePay™</li>
                    <li>• Creación de cuenta</li>
                    <li>• Mantenimiento de wallet</li>
                    <li>• Retiros a cuenta bancaria</li>
                  </ul>
                </div>
                <div className="bg-blue-50 rounded-xl p-4">
                  <h3 className="font-bold text-blue-800 mb-2">Tarifas Aplicables</h3>
                  <ul className="text-blue-700 text-sm space-y-1">
                    <li>• Agregar dinero con tarjeta: 2.9%</li>
                    <li>• Pagos a negocios: 2.9% + $0.30</li>
                    <li>• Procesamiento crypto: Según mercado</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">5. Distribución de Ingresos</h2>
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="font-bold text-gray-800 mb-3">Por cada transacción:</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Tarifa DalePay™:</span>
                    <span className="font-medium">1.00%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Retención de usuario:</span>
                    <span className="font-medium">40.47% del valor</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Procesamiento Moov:</span>
                    <span className="font-medium">0.95%</span>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">6. Protección de Fondos</h2>
              <div className="text-gray-700 space-y-3">
                <p>
                  <strong>Protección FDIC:</strong> Los fondos de usuarios están protegidos por seguro FDIC 
                  a través de nuestro socio Moov hasta los límites aplicables.
                </p>
                <p>
                  <strong>Segregación de Fondos:</strong> DalePay™ nunca mantiene fondos de usuarios. 
                  Todos los fondos son mantenidos por Moov en cuentas segregadas.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">7. Servicios de Negocio</h2>
              <div className="text-gray-700 space-y-3">
                <p><strong>Registro de Negocio:</strong></p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Gratuito para registrarse</li>
                  <li>Tarifa de procesamiento: 2.9% + $0.30 por transacción</li>
                  <li>Retiros instantáneos disponibles</li>
                  <li>Códigos QR personalizados incluidos</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">8. Servicios de Criptomonedas</h2>
              <div className="text-gray-700 space-y-3">
                <p>
                  DalePay™ ofrece servicios de wallet de criptomonedas integrados, incluyendo:
                </p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Soporte para Bitcoin, Ethereum, USDC, USDT</li>
                  <li>Integración con MetaMask y WalletConnect</li>
                  <li>Precios en tiempo real</li>
                  <li>Funcionalidad DeFi (próximamente)</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">9. Privacidad y Seguridad</h2>
              <div className="text-gray-700 space-y-3">
                <p>
                  <strong>Protección de Datos:</strong> Cumplimos con estándares de protección de datos 
                  incluyendo encriptación end-to-end y almacenamiento seguro.
                </p>
                <p>
                  <strong>Cumplimiento AML:</strong> Todas las transacciones son monitoreadas para 
                  cumplimiento anti-lavado de dinero a través de Moov.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">10. Limitaciones de Responsabilidad</h2>
              <div className="text-gray-700 space-y-3">
                <p>
                  DalePay™ actúa como facilitador de servicios financieros. La responsabilidad 
                  por servicios de transmisión de dinero recae en nuestro socio licenciado Moov.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">11. Contacto</h2>
              <div className="bg-blue-50 rounded-xl p-6">
                <div className="space-y-2 text-blue-700">
                  <p><strong>Compliance Officer:</strong> AHMET S. OJEDA MERCADO</p>
                  <p><strong>Soporte:</strong> soporte@dalepay.com</p>
                  <p><strong>WhatsApp:</strong> +1 787-555-DALE</p>
                  <p><strong>Sitio web:</strong> www.dalepay.com</p>
                </div>
              </div>
            </section>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-gray-600">
          <p className="text-sm">
            © 2025 DalePay™. Todos los derechos reservados.
          </p>
          <p className="text-xs mt-2">
            Servicios de transmisión de dinero proporcionados por Moov Financial Inc.
          </p>
          <div className="flex items-center justify-center space-x-4 mt-4 text-xs">
            <span>🇵🇷 Hecho en Puerto Rico</span>
            <span>🏦 Licenciado por FinCEN</span>
            <span>🛡️ Protegido por FDIC</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsConditions;