import React, { useState } from 'react';
import { UserCircle, LogOut } from 'lucide-react';
import Sidebar from './components/Sidebar';
import TargetingSection from './components/TargetingSection';
import NotificationsSection from './components/NotificationsSection';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [subscription, setSubscription] = useState('free');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggedIn(true);
  };

  const PricingCard = ({ tier, price, features, recommended = false }) => (
    <div className={`bg-white rounded-xl shadow-sm p-6 ${recommended ? 'ring-2 ring-blue-500' : ''}`}>
      <h3 className="text-xl font-semibold text-gray-900">{tier}</h3>
      <p className="mt-2 text-3xl font-bold text-gray-900">${price}<span className="text-sm font-normal text-gray-500">/mo</span></p>
      <ul className="mt-6 space-y-4">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center text-gray-600">
            <UserCircle className="h-5 w-5 text-blue-500 mr-2" />
            {feature}
          </li>
        ))}
      </ul>
      <button 
        onClick={() => setSubscription(tier.toLowerCase())}
        className={`mt-8 w-full py-2 px-4 rounded-lg ${
          recommended 
            ? 'bg-blue-600 text-white hover:bg-blue-700' 
            : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
        } transition-colors`}
      >
        {subscription === tier.toLowerCase() ? 'Current Plan' : 'Subscribe'}
      </button>
    </div>
  );

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center mb-8">
              <UserCircle className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h2 className="text-3xl font-bold text-gray-900">Welcome Back</h2>
              <p className="text-gray-500 mt-2">Sign in to access your automation dashboard</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className="text-sm font-medium text-gray-700 block">Email</label>
                <input
                  type="email"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block">Password</label>
                <input
                  type="password"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
              >
                Sign In
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-500">
                Don't have an account?{' '}
                <button className="text-blue-600 hover:text-blue-700 font-medium">
                  Start free trial
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex h-screen">
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          subscription={subscription}
        />

        <div className="flex-1 overflow-auto">
          <header className="bg-white shadow-sm">
            <div className="flex items-center justify-between px-6 py-4">
              <h1 className="text-2xl font-bold text-gray-900">
                {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
              </h1>
              <div className="flex items-center space-x-4">
                <button className="flex items-center space-x-2 text-gray-500 hover:text-gray-700">
                  <UserCircle className="h-6 w-6" />
                  <span>Profile</span>
                </button>
                <button
                  onClick={() => setIsLoggedIn(false)}
                  className="flex items-center space-x-2 text-gray-500 hover:text-gray-700"
                >
                  <LogOut className="h-6 w-6" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </header>

          <main className="p-6">
            {activeTab === 'targeting' && <TargetingSection />}
            {activeTab === 'notifications' && <NotificationsSection />}
            {activeTab === 'subscription' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <PricingCard
                    tier="Free"
                    price="0"
                    features={[
                      '50 connection requests/month',
                      'Basic templates',
                      'Standard support'
                    ]}
                  />
                  <PricingCard
                    tier="Pro"
                    price="29"
                    recommended={true}
                    features={[
                      '200 connection requests/month',
                      'Advanced templates',
                      'Priority support',
                      'Analytics dashboard'
                    ]}
                  />
                  <PricingCard
                    tier="Premium"
                    price="99"
                    features={[
                      'Unlimited connections',
                      'Custom templates',
                      '24/7 Premium support',
                      'Advanced analytics',
                      'Team collaboration'
                    ]}
                  />
                </div>

                {subscription !== 'free' && (
                  <div className="bg-white rounded-xl shadow-sm p-6 mt-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Billing Information</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Card Number
                        </label>
                        <input
                          type="text"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="**** **** **** ****"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Expiration Date
                        </label>
                        <input
                          type="text"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="MM/YY"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

export default App;