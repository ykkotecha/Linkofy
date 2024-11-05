import React from 'react';
import { UserCircle, Settings, BarChart3, Send, Users, CreditCard, Zap, Target, Bell } from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  subscription: string;
}

export default function Sidebar({ activeTab, setActiveTab, subscription }: SidebarProps) {
  const menuItems = [
    { id: 'dashboard', icon: BarChart3, label: 'Dashboard' },
    { id: 'campaigns', icon: Send, label: 'Campaigns' },
    { id: 'connections', icon: Users, label: 'Connections' },
    { id: 'targeting', icon: Target, label: 'Targeting' },
    { id: 'notifications', icon: Bell, label: 'Notifications' },
    { id: 'subscription', icon: CreditCard, label: 'Subscription' },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <div className="w-64 bg-white shadow-lg">
      <div className="p-6">
        <div className="flex items-center space-x-3">
          <Send className="h-8 w-8 text-blue-600" />
          <span className="text-xl font-bold">LinkedPro</span>
        </div>
      </div>
      <nav className="mt-6">
        {menuItems.map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`w-full flex items-center space-x-3 px-6 py-3 text-gray-600 hover:bg-blue-50 hover:text-blue-600 ${
              activeTab === id ? 'bg-blue-50 text-blue-600' : ''
            }`}
          >
            <Icon className="h-5 w-5" />
            <span>{label}</span>
          </button>
        ))}
      </nav>

      {subscription !== 'premium' && (
        <div className="mt-6 mx-4 p-4 bg-blue-50 rounded-lg">
          <div className="flex items-center space-x-2 text-blue-600 mb-2">
            <Zap className="h-5 w-5" />
            <span className="font-medium">Upgrade to Premium</span>
          </div>
          <p className="text-sm text-blue-600">Get access to advanced features and unlimited connections</p>
          <button
            onClick={() => setActiveTab('subscription')}
            className="mt-3 w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm"
          >
            Upgrade Now
          </button>
        </div>
      )}
    </div>
  );
}