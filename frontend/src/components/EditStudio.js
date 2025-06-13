import React, { useState } from 'react';

const EditStudio = ({ onClose, darkMode }) => {
  const [activeTab, setActiveTab] = useState('colors');
  const [settings, setSettings] = useState({
    primaryColor: '#3B82F6',
    secondaryColor: '#8B5CF6',
    accentColor: '#10B981',
    backgroundColor: darkMode ? '#111827' : '#F9FAFB',
    fontFamily: 'Inter',
    borderRadius: '12',
    logoText: 'DalePay™',
    heroTitle: 'Banking Simplified',
    heroSubtitle: 'Puerto Rico\'s modern digital wallet',
    buttonStyle: 'gradient',
    animation: 'enabled'
  });

  const colorPresets = [
    { name: 'Ocean Blue', primary: '#3B82F6', secondary: '#8B5CF6', accent: '#10B981' },
    { name: 'Sunset Orange', primary: '#F97316', secondary: '#EC4899', accent: '#8B5CF6' },
    { name: 'Forest Green', primary: '#10B981', secondary: '#059669', accent: '#3B82F6' },
    { name: 'Royal Purple', primary: '#8B5CF6', secondary: '#A855F7', accent: '#EC4899' },
    { name: 'Crimson Red', primary: '#EF4444', secondary: '#F97316', accent: '#FBBF24' }
  ];

  const fontOptions = [
    { name: 'Inter', value: 'Inter', style: 'font-sans' },
    { name: 'Roboto', value: 'Roboto', style: 'font-sans' },
    { name: 'Poppins', value: 'Poppins', style: 'font-sans' },
    { name: 'Playfair', value: 'Playfair Display', style: 'font-serif' },
    { name: 'Montserrat', value: 'Montserrat', style: 'font-sans' }
  ];

  const handleColorPreset = (preset) => {
    setSettings({
      ...settings,
      primaryColor: preset.primary,
      secondaryColor: preset.secondary,
      accentColor: preset.accent
    });
  };

  const handleExport = () => {
    const exportData = {
      ...settings,
      timestamp: new Date().toISOString(),
      version: '1.0'
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'dalepay-theme.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const TabButton = ({ id, label, icon }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`flex items-center space-x-2 px-4 py-3 rounded-lg font-medium transition-all ${
        activeTab === id
          ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300'
          : darkMode
            ? 'text-gray-300 hover:text-white hover:bg-gray-700'
            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
      }`}
    >
      <span>{icon}</span>
      <span className="hidden sm:block">{label}</span>
    </button>
  );

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Header */}
      <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b sticky top-0 z-50`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">🎨</span>
              </div>
              <div>
                <h1 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  DalePay Edit Studio
                </h1>
                <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Customize your app experience
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={handleExport}
                className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors"
              >
                💾 Export Theme
              </button>
              <button
                onClick={onClose}
                className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
              >
                <svg className={`w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-2xl border shadow-lg p-6`}>
            <h3 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4`}>
              Customization Tools
            </h3>
            
            <div className="space-y-2">
              <TabButton id="colors" label="Colors" icon="🎨" />
              <TabButton id="typography" label="Typography" icon="📝" />
              <TabButton id="layout" label="Layout" icon="📐" />
              <TabButton id="content" label="Content" icon="✏️" />
              <TabButton id="effects" label="Effects" icon="✨" />
            </div>

            {/* Quick Actions */}
            <div className="mt-8">
              <h4 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'} mb-3`}>
                Quick Actions
              </h4>
              <div className="space-y-2">
                <button className={`w-full text-left px-3 py-2 rounded-lg text-sm ${
                  darkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-600'
                } transition-colors`}>
                  🔄 Reset to Default
                </button>
                <button className={`w-full text-left px-3 py-2 rounded-lg text-sm ${
                  darkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-600'
                } transition-colors`}>
                  📱 Mobile Preview
                </button>
                <button className={`w-full text-left px-3 py-2 rounded-lg text-sm ${
                  darkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-600'
                } transition-colors`}>
                  💾 Save Template
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Colors Tab */}
            {activeTab === 'colors' && (
              <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-2xl border shadow-lg p-6`}>
                <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-6`}>
                  Color Scheme
                </h3>

                {/* Color Presets */}
                <div className="mb-8">
                  <h4 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'} mb-4`}>
                    Color Presets
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {colorPresets.map((preset, index) => (
                      <button
                        key={index}
                        onClick={() => handleColorPreset(preset)}
                        className={`p-4 rounded-xl border-2 transition-all hover:scale-105 ${
                          darkMode ? 'border-gray-600 hover:border-gray-500' : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex space-x-1 mb-2">
                          <div className="w-4 h-4 rounded-full" style={{ backgroundColor: preset.primary }}></div>
                          <div className="w-4 h-4 rounded-full" style={{ backgroundColor: preset.secondary }}></div>
                          <div className="w-4 h-4 rounded-full" style={{ backgroundColor: preset.accent }}></div>
                        </div>
                        <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          {preset.name}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Custom Colors */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                      Primary Color
                    </label>
                    <div className="flex items-center space-x-3">
                      <input
                        type="color"
                        value={settings.primaryColor}
                        onChange={(e) => setSettings({...settings, primaryColor: e.target.value})}
                        className="w-12 h-12 rounded-lg border-2 border-gray-300 cursor-pointer"
                      />
                      <input
                        type="text"
                        value={settings.primaryColor}
                        onChange={(e) => setSettings({...settings, primaryColor: e.target.value})}
                        className={`flex-1 px-3 py-2 rounded-lg border ${
                          darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-300 text-gray-900'
                        } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      />
                    </div>
                  </div>

                  <div>
                    <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                      Secondary Color
                    </label>
                    <div className="flex items-center space-x-3">
                      <input
                        type="color"
                        value={settings.secondaryColor}
                        onChange={(e) => setSettings({...settings, secondaryColor: e.target.value})}
                        className="w-12 h-12 rounded-lg border-2 border-gray-300 cursor-pointer"
                      />
                      <input
                        type="text"
                        value={settings.secondaryColor}
                        onChange={(e) => setSettings({...settings, secondaryColor: e.target.value})}
                        className={`flex-1 px-3 py-2 rounded-lg border ${
                          darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-300 text-gray-900'
                        } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      />
                    </div>
                  </div>

                  <div>
                    <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                      Accent Color
                    </label>
                    <div className="flex items-center space-x-3">
                      <input
                        type="color"
                        value={settings.accentColor}
                        onChange={(e) => setSettings({...settings, accentColor: e.target.value})}
                        className="w-12 h-12 rounded-lg border-2 border-gray-300 cursor-pointer"
                      />
                      <input
                        type="text"
                        value={settings.accentColor}
                        onChange={(e) => setSettings({...settings, accentColor: e.target.value})}
                        className={`flex-1 px-3 py-2 rounded-lg border ${
                          darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-300 text-gray-900'
                        } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Typography Tab */}
            {activeTab === 'typography' && (
              <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-2xl border shadow-lg p-6`}>
                <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-6`}>
                  Typography
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                      Font Family
                    </label>
                    <select
                      value={settings.fontFamily}
                      onChange={(e) => setSettings({...settings, fontFamily: e.target.value})}
                      className={`w-full px-3 py-2 rounded-lg border ${
                        darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-300 text-gray-900'
                      } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    >
                      {fontOptions.map((font) => (
                        <option key={font.value} value={font.value}>
                          {font.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                      Border Radius
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="24"
                      value={settings.borderRadius}
                      onChange={(e) => setSettings({...settings, borderRadius: e.target.value})}
                      className="w-full"
                    />
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mt-1`}>
                      {settings.borderRadius}px
                    </p>
                  </div>
                </div>

                {/* Font Preview */}
                <div className={`mt-6 p-6 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <h4 className={`text-2xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: settings.fontFamily }}>
                    Typography Preview
                  </h4>
                  <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`} style={{ fontFamily: settings.fontFamily }}>
                    This is how your text will appear with the selected font family. 
                    Banking made simple with DalePay.
                  </p>
                </div>
              </div>
            )}

            {/* Content Tab */}
            {activeTab === 'content' && (
              <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-2xl border shadow-lg p-6`}>
                <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-6`}>
                  Content Settings
                </h3>

                <div className="space-y-6">
                  <div>
                    <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                      Logo Text
                    </label>
                    <input
                      type="text"
                      value={settings.logoText}
                      onChange={(e) => setSettings({...settings, logoText: e.target.value})}
                      className={`w-full px-3 py-2 rounded-lg border ${
                        darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-300 text-gray-900'
                      } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    />
                  </div>

                  <div>
                    <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                      Hero Title
                    </label>
                    <input
                      type="text"
                      value={settings.heroTitle}
                      onChange={(e) => setSettings({...settings, heroTitle: e.target.value})}
                      className={`w-full px-3 py-2 rounded-lg border ${
                        darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-300 text-gray-900'
                      } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    />
                  </div>

                  <div>
                    <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                      Hero Subtitle
                    </label>
                    <textarea
                      value={settings.heroSubtitle}
                      onChange={(e) => setSettings({...settings, heroSubtitle: e.target.value})}
                      rows={3}
                      className={`w-full px-3 py-2 rounded-lg border ${
                        darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-300 text-gray-900'
                      } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Live Preview */}
            <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-2xl border shadow-lg p-6`}>
              <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-6`}>
                Live Preview
              </h3>
              
              <div 
                className="rounded-xl overflow-hidden border-4"
                style={{ 
                  borderColor: settings.primaryColor,
                  borderRadius: `${settings.borderRadius}px`
                }}
              >
                <div 
                  className="p-8 text-center text-white relative overflow-hidden"
                  style={{
                    background: `linear-gradient(135deg, ${settings.primaryColor}, ${settings.secondaryColor})`
                  }}
                >
                  <div className="relative z-10">
                    <div 
                      className="w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4"
                      style={{ 
                        backgroundColor: 'rgba(255,255,255,0.2)',
                        borderRadius: `${settings.borderRadius}px`
                      }}
                    >
                      <span className="text-2xl font-bold">$</span>
                    </div>
                    <h1 
                      className="text-3xl font-bold mb-2"
                      style={{ fontFamily: settings.fontFamily }}
                    >
                      {settings.logoText}
                    </h1>
                    <h2 
                      className="text-5xl font-bold mb-4"
                      style={{ fontFamily: settings.fontFamily }}
                    >
                      {settings.heroTitle}
                    </h2>
                    <p 
                      className="text-xl opacity-90 mb-6"
                      style={{ fontFamily: settings.fontFamily }}
                    >
                      {settings.heroSubtitle}
                    </p>
                    <button 
                      className="bg-white text-gray-900 px-6 py-3 font-bold transition-all hover:scale-105"
                      style={{ 
                        borderRadius: `${settings.borderRadius}px`,
                        fontFamily: settings.fontFamily
                      }}
                    >
                      Get Started
                    </button>
                  </div>
                  
                  <div 
                    className="absolute top-4 right-4 w-16 h-16 rounded-full opacity-20"
                    style={{ backgroundColor: settings.accentColor }}
                  ></div>
                  <div 
                    className="absolute bottom-4 left-4 w-12 h-12 rounded-full opacity-20"
                    style={{ backgroundColor: settings.accentColor }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditStudio;