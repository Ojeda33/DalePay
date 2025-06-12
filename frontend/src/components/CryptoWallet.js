import React, { useState, useEffect } from 'react';

const CryptoWallet = ({ user, onBack }) => {
  const [cryptoPrices, setCryptoPrices] = useState({
    bitcoin: { price: 43250, change: 2.5 },
    ethereum: { price: 2650, change: -1.2 },
    usdc: { price: 1.00, change: 0.01 },
    usdt: { price: 1.00, change: -0.01 }
  });

  const [portfolio, setPortfolio] = useState([
    { symbol: 'BTC', name: 'Bitcoin', amount: 0.00000, icon: '₿' },
    { symbol: 'ETH', name: 'Ethereum', amount: 0.0000, icon: 'Ξ' },
    { symbol: 'USDC', name: 'USD Coin', amount: 0.00, icon: '💰' }
  ]);

  const [activeTab, setActiveTab] = useState('portfolio');

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatCrypto = (amount, symbol) => {
    return `${amount.toFixed(symbol === 'BTC' ? 5 : symbol === 'ETH' ? 4 : 2)} ${symbol}`;
  };

  const calculatePortfolioValue = () => {
    return portfolio.reduce((total, coin) => {
      const price = cryptoPrices[coin.name.toLowerCase().replace(' ', '')] || cryptoPrices.bitcoin;
      return total + (coin.amount * price.price);
    }, 0);
  };

  const PortfolioTab = () => (
    <div className="space-y-6">
      {/* Total Portfolio Value */}
      <div className="bg-gradient-to-r from-orange-500 to-yellow-500 rounded-2xl p-6 text-white">
        <div className="text-center">
          <p className="text-orange-100 text-sm mb-1">Portfolio Total</p>
          <h2 className="text-3xl font-bold mb-2">
            {formatCurrency(calculatePortfolioValue())}
          </h2>
          <p className="text-orange-100 text-sm">
            +$12.34 (+2.1%) hoy
          </p>
        </div>
      </div>

      {/* Portfolio Holdings */}
      <div>
        <h3 className="text-lg font-bold text-gray-800 mb-4">Mis Cryptos</h3>
        <div className="space-y-3">
          {portfolio.map((coin, index) => {
            const price = cryptoPrices[coin.name.toLowerCase().replace(' ', '')] || cryptoPrices.bitcoin;
            const value = coin.amount * price.price;
            
            return (
              <div key={index} className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                      <span className="text-orange-600 text-lg">{coin.icon}</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-800">{coin.name}</h4>
                      <p className="text-sm text-gray-600">
                        {formatCrypto(coin.amount, coin.symbol)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-800">{formatCurrency(value)}</p>
                    <p className={`text-sm ${price.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {price.change >= 0 ? '+' : ''}{price.change.toFixed(2)}%
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4">
        <button className="bg-green-500 text-white py-4 rounded-xl font-bold">
          💰 Comprar Crypto
        </button>
        <button className="bg-blue-500 text-white py-4 rounded-xl font-bold">
          🔄 Intercambiar
        </button>
      </div>
    </div>
  );

  const PricesTab = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-gray-800">Precios en tiempo real</h3>
      {Object.entries(cryptoPrices).map(([key, data]) => {
        const names = {
          bitcoin: { name: 'Bitcoin', symbol: 'BTC', icon: '₿' },
          ethereum: { name: 'Ethereum', symbol: 'ETH', icon: 'Ξ' },
          usdc: { name: 'USD Coin', symbol: 'USDC', icon: '💰' },
          usdt: { name: 'Tether', symbol: 'USDT', icon: '💵' }
        };
        
        const coin = names[key];
        
        return (
          <div key={key} className="bg-white rounded-xl p-4 border border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                  <span className="text-lg">{coin.icon}</span>
                </div>
                <div>
                  <h4 className="font-medium text-gray-800">{coin.name}</h4>
                  <p className="text-sm text-gray-600">{coin.symbol}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-gray-800">{formatCurrency(data.price)}</p>
                <p className={`text-sm ${data.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {data.change >= 0 ? '+' : ''}{data.change.toFixed(2)}%
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );

  const DeFiTab = () => (
    <div className="space-y-6">
      <div className="text-center">
        <div className="text-6xl mb-4">🚀</div>
        <h3 className="text-xl font-bold text-gray-800 mb-2">DeFi Coming Soon</h3>
        <p className="text-gray-600">
          Próximamente podrás hacer staking, yield farming y más con DalePay™
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-purple-50 rounded-xl p-4 text-center">
          <div className="text-3xl mb-2">💎</div>
          <h4 className="font-medium text-purple-800">Staking</h4>
          <p className="text-sm text-purple-600">Hasta 12% APY</p>
        </div>
        <div className="bg-blue-50 rounded-xl p-4 text-center">
          <div className="text-3xl mb-2">🌊</div>
          <h4 className="font-medium text-blue-800">Liquidity</h4>
          <p className="text-sm text-blue-600">Pools activos</p>
        </div>
      </div>

      <button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-4 rounded-xl font-bold">
        Notificarme cuando esté listo
      </button>
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
        <h1 className="text-xl font-bold text-gray-800">Crypto Wallet</h1>
        <div className="w-10 h-10 flex items-center justify-center">
          <span className="text-2xl">₿</span>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex bg-gray-100 rounded-xl p-1 mb-6">
        <button
          onClick={() => setActiveTab('portfolio')}
          className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'portfolio'
              ? 'bg-white text-orange-600 shadow-sm'
              : 'text-gray-600'
          }`}
        >
          Portfolio
        </button>
        <button
          onClick={() => setActiveTab('prices')}
          className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'prices'
              ? 'bg-white text-orange-600 shadow-sm'
              : 'text-gray-600'
          }`}
        >
          Precios
        </button>
        <button
          onClick={() => setActiveTab('defi')}
          className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'defi'
              ? 'bg-white text-orange-600 shadow-sm'
              : 'text-gray-600'
          }`}
        >
          DeFi
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'portfolio' && <PortfolioTab />}
      {activeTab === 'prices' && <PricesTab />}
      {activeTab === 'defi' && <DeFiTab />}

      {/* Bottom Info */}
      <div className="mt-8 bg-orange-50 rounded-xl p-4">
        <div className="flex items-start space-x-3">
          <div className="text-2xl">🔥</div>
          <div>
            <h4 className="font-medium text-orange-800 mb-1">Crypto en DalePay™</h4>
            <p className="text-orange-700 text-sm">
              Integración completa con MetaMask y WalletConnect. 
              Compra, vende e intercambia crypto directamente desde tu wallet.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CryptoWallet;
