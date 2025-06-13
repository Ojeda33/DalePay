import React, { useState } from 'react';
import axios from 'axios';

const SubscriptionPlans = ({ user, onBack, darkMode }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const plans = [
    {
      id: 'basic',
      name: 'Basic',
      price: 0,
      period: 'month',
      description: 'Perfect for personal use',
      features: [
        'Send & receive money',
        'Basic bank linking',
        '$2,500 daily limit',
        '$10,000 monthly limit',
        'Standard support',
        'Basic transaction history'
      ],
      limitations: [
        'Standard transfer speed only',
        'Limited customer support hours'
      ],
      color: 'from-gray-600 to-gray-700',
      popular: false
    },
    {
      id: 'premium',
      name: 'Premium',
      price: 9.99,
      period: 'month',
      description: 'Best for frequent users',
      features: [
        'Everything in Basic',
        'Instant transfers included',
        '$25,000 daily limit',
        '$100,000 monthly limit',
        'Priority customer support',
        'Advanced analytics',
        'Multiple bank accounts',
        'Fee-free standard transfers',
        'Custom transaction categories',
        'Export transaction data'
      ],
      limitations: [],
      color: 'from-blue-600 to-purple-600',
      popular: true
    },
    {
      id: 'business',
      name: 'Business',
      price: 29.99,
      period: 'month',
      description: 'Designed for businesses',
      features: [
        'Everything in Premium',
        'Unlimited daily transfers',
        'Business dashboard',
        'Team management',
        'API integration',
        'Advanced fraud protection',
        'Dedicated account manager',
        'Custom compliance reports',
        'Multi-user access',
        'Bulk payment processing'
      ],
      limitations: [],
      color: 'from-green-600 to-blue-600',
      popular: false
    }
  ];

  const handleUpgrade = async (planId) => {
    if (planId === user?.subscription_plan) {
      setError('You are already on this plan');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await axios.post('/subscription/upgrade', {
        plan_id: planId
      });

      setSuccess(`Successfully upgraded to ${planId} plan!`);
      
      // In a real app, you would redirect to payment processing
      setTimeout(() => {
        onBack();
      }, 2000);

    } catch (error) {
      setError(error.response?.data?.detail || 'Failed to upgrade plan');
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'} py-8`}>
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-6">
          <button
            onClick={onBack}
            className={`flex items-center space-x-2 ${
              darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'
            } transition-colors`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span>Back to Dashboard</span>
          </button>
        </div>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className={`text-4xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4`}>
            Choose Your Plan
          </h1>
          <p className={`text-xl ${darkMode ? 'text-gray-300' : 'text-gray-600'} max-w-2xl mx-auto`}>
            Unlock powerful features and higher limits with our premium plans. All plans include bank-level security and FinCEN compliance.
          </p>
        </div>

        {/* Messages */}
        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm max-w-2xl mx-auto">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg text-sm max-w-2xl mx-auto">
            {success}
          </div>
        )}

        {/* Current Plan */}
        <div className={`mb-8 p-4 rounded-lg border ${
          darkMode ? 'bg-blue-900/20 border-blue-700' : 'bg-blue-50 border-blue-200'
        } max-w-2xl mx-auto text-center`}>
          <h3 className="text-blue-600 font-medium mb-2">Current Plan</h3>
          <p className={`${darkMode ? 'text-blue-300' : 'text-blue-700'} capitalize font-bold text-lg`}>
            {user?.subscription_plan || 'Basic'} Plan
          </p>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative ${
                darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
              } rounded-2xl border shadow-lg overflow-hidden ${
                plan.popular ? 'ring-2 ring-blue-500' : ''
              }`}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <span className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </span>
                </div>
              )}

              {/* Plan Header */}
              <div className={`bg-gradient-to-r ${plan.color} p-6 text-white text-center`}>
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <p className="text-blue-100 mb-4">{plan.description}</p>
                <div className="mb-4">
                  <span className="text-4xl font-bold">{formatPrice(plan.price)}</span>
                  {plan.price > 0 && (
                    <span className="text-blue-100 ml-2">/{plan.period}</span>
                  )}
                </div>
              </div>

              {/* Plan Content */}
              <div className="p-6">
                {/* Features */}
                <div className="mb-6">
                  <h4 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'} mb-3`}>
                    What's included:
                  </h4>
                  <ul className="space-y-2">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <svg className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                        </svg>
                        <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Limitations */}
                {plan.limitations.length > 0 && (
                  <div className="mb-6">
                    <h4 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'} mb-3`}>
                      Limitations:
                    </h4>
                    <ul className="space-y-2">
                      {plan.limitations.map((limitation, index) => (
                        <li key={index} className="flex items-start">
                          <svg className="w-5 h-5 text-yellow-500 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
                          </svg>
                          <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            {limitation}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Action Button */}
                <div className="mt-6">
                  {user?.subscription_plan === plan.id ? (
                    <button
                      disabled
                      className={`w-full py-3 px-4 rounded-lg font-medium ${
                        darkMode 
                          ? 'bg-gray-700 text-gray-400' 
                          : 'bg-gray-200 text-gray-500'
                      } cursor-not-allowed`}
                    >
                      Current Plan
                    </button>
                  ) : plan.price === 0 ? (
                    <button
                      onClick={() => handleUpgrade(plan.id)}
                      disabled={loading}
                      className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                        darkMode 
                          ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                          : 'bg-gray-200 hover:bg-gray-300 text-gray-900'
                      } disabled:opacity-50`}
                    >
                      {loading ? 'Processing...' : 'Downgrade to Basic'}
                    </button>
                  ) : (
                    <button
                      onClick={() => handleUpgrade(plan.id)}
                      disabled={loading}
                      className={`w-full bg-gradient-to-r ${plan.color} text-white py-3 px-4 rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50`}
                    >
                      {loading ? 'Processing...' : `Upgrade to ${plan.name}`}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="mt-16 max-w-4xl mx-auto">
          <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} text-center mb-8`}>
            Frequently Asked Questions
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                question: "Can I change my plan anytime?",
                answer: "Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately."
              },
              {
                question: "What payment methods do you accept?",
                answer: "We accept all major credit cards, debit cards, and bank transfers through our secure payment processor."
              },
              {
                question: "Is there a contract or commitment?",
                answer: "No, all plans are month-to-month with no long-term contracts. Cancel anytime."
              },
              {
                question: "Do you offer refunds?",
                answer: "We offer a 30-day money-back guarantee for all premium plans. Contact support for assistance."
              }
            ].map((faq, index) => (
              <div key={index} className={`p-6 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
                <h3 className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
                  {faq.question}
                </h3>
                <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Section */}
        <div className="mt-12 text-center">
          <div className={`p-6 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg max-w-2xl mx-auto`}>
            <h3 className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
              Need help choosing a plan?
            </h3>
            <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-4`}>
              Our support team is here to help you find the perfect plan for your needs.
            </p>
            <button className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors">
              Contact Support
            </button>
          </div>
        </div>

        {/* Security Notice */}
        <div className="text-center py-8">
          <div className="flex items-center justify-center space-x-2 text-gray-500 mb-2">
            <span className="text-lg">🔒</span>
            <span className="text-sm font-medium">All plans include bank-level security</span>
          </div>
          <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            DalePay™ • FinCEN Licensed • FDIC Insured • Secure payments powered by Moov Financial
          </p>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPlans;
