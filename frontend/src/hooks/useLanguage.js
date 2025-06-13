import { useState, useEffect, createContext, useContext } from 'react';

// Language Context
const LanguageContext = createContext();

// Hook to use language context
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

// Language Provider Component
export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    // Get from localStorage or default to English
    return localStorage.getItem('dalepay_language') || 'en';
  });

  useEffect(() => {
    // Save to localStorage when language changes
    localStorage.setItem('dalepay_language', language);
  }, [language]);

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'es' : 'en');
  };

  const value = {
    language,
    setLanguage,
    toggleLanguage,
    isSpanish: language === 'es',
    isEnglish: language === 'en'
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

// Translation hook
export const useTranslation = () => {
  const { language } = useLanguage();

  const translations = {
    en: {
      // Navigation
      home: "Home",
      dashboard: "Dashboard",
      sendMoney: "Send Money",
      receiveMoney: "Receive Money",
      bankLinking: "Link Bank",
      transactions: "Transactions",
      realBanking: "Real Banking",
      
      // Common
      balance: "Balance",
      amount: "Amount",
      description: "Description",
      send: "Send",
      receive: "Receive",
      submit: "Submit",
      cancel: "Cancel",
      loading: "Loading...",
      success: "Success",
      error: "Error",
      
      // Login/Register
      login: "Login",
      register: "Register",
      email: "Email",
      password: "Password",
      fullName: "Full Name",
      phone: "Phone",
      getStarted: "Get Started",
      
      // Wallet
      digitalWallet: "Digital Wallet",
      walletBalance: "Wallet Balance",
      addMoney: "Add Money",
      linkBankAccount: "Link Bank Account",
      bankName: "Bank Name",
      accountType: "Account Type",
      routingNumber: "Routing Number",
      accountNumber: "Account Number",
      
      // Transfers
      instantTransfer: "Instant Transfer",
      standardTransfer: "Standard Transfer",
      transferFee: "Transfer Fee",
      recipient: "Recipient",
      
      // POS System
      merchantPayment: "Merchant Payment",
      posPayment: "POS Payment",
      tip: "Tip",
      total: "Total",
      
      // Security
      secureConnection: "Secure Connection",
      bankLevelSecurity: "Bank-Level Security",
      encryptedData: "Your data is encrypted and secure",
      
      // Puerto Rico
      puertoRico: "Puerto Rico",
      proudlyServing: "Proudly serving Puerto Rico",
      fincenLicensed: "FinCEN Licensed MSB",
      
      // Business
      dailyLimit: "Daily Limit",
      monthlyLimit: "Monthly Limit",
      transactionHistory: "Transaction History",
      
      // Messages
      welcomeMessage: "Welcome to Puerto Rico's modern digital wallet",
      bankingSimplified: "Banking Simplified",
      modernBanking: "Modern Banking",
      digitalWalletDesc: "Send, receive, and manage money with instant transfers and secure banking",
      
      // Buttons
      watchDemo: "Watch Demo",
      editStudio: "Edit Studio",
      linkAccount: "Link Account",
      removeAccount: "Remove Account",
      
      // Status
      active: "Active",
      pending: "Pending",
      completed: "Completed",
      verified: "Verified"
    },
    es: {
      // Navigation
      home: "Inicio",
      dashboard: "Panel",
      sendMoney: "Enviar Dinero",
      receiveMoney: "Recibir Dinero",
      bankLinking: "Vincular Banco",
      transactions: "Transacciones",
      realBanking: "Banca Real",
      
      // Common
      balance: "Balance",
      amount: "Cantidad",
      description: "Descripción",
      send: "Enviar",
      receive: "Recibir",
      submit: "Enviar",
      cancel: "Cancelar",
      loading: "Cargando...",
      success: "Éxito",
      error: "Error",
      
      // Login/Register
      login: "Iniciar Sesión",
      register: "Registrarse",
      email: "Correo",
      password: "Contraseña",
      fullName: "Nombre Completo",
      phone: "Teléfono",
      getStarted: "Comenzar",
      
      // Wallet
      digitalWallet: "Billetera Digital",
      walletBalance: "Balance de Billetera",
      addMoney: "Añadir Dinero",
      linkBankAccount: "Vincular Cuenta Bancaria",
      bankName: "Nombre del Banco",
      accountType: "Tipo de Cuenta",
      routingNumber: "Número de Ruta",
      accountNumber: "Número de Cuenta",
      
      // Transfers
      instantTransfer: "Transferencia Instantánea",
      standardTransfer: "Transferencia Estándar",
      transferFee: "Tarifa de Transferencia",
      recipient: "Destinatario",
      
      // POS System
      merchantPayment: "Pago Comercial",
      posPayment: "Pago POS",
      tip: "Propina",
      total: "Total",
      
      // Security
      secureConnection: "Conexión Segura",
      bankLevelSecurity: "Seguridad Bancaria",
      encryptedData: "Sus datos están encriptados y seguros",
      
      // Puerto Rico
      puertoRico: "Puerto Rico",
      proudlyServing: "Sirviendo orgullosamente a Puerto Rico",
      fincenLicensed: "MSB Licenciado por FinCEN",
      
      // Business
      dailyLimit: "Límite Diario",
      monthlyLimit: "Límite Mensual",
      transactionHistory: "Historial de Transacciones",
      
      // Messages
      welcomeMessage: "Bienvenido a la billetera digital moderna de Puerto Rico",
      bankingSimplified: "Banca Simplificada",
      modernBanking: "Banca Moderna",
      digitalWalletDesc: "Envía, recibe y administra dinero con transferencias instantáneas y banca segura",
      
      // Buttons
      watchDemo: "Ver Demo",
      editStudio: "Estudio de Edición",
      linkAccount: "Vincular Cuenta",
      removeAccount: "Eliminar Cuenta",
      
      // Status
      active: "Activo",
      pending: "Pendiente",
      completed: "Completado",
      verified: "Verificado"
    }
  };

  const t = (key, defaultValue = key) => {
    return translations[language]?.[key] || defaultValue;
  };

  return { t, language };
};