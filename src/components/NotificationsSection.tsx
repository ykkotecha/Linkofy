import React from 'react';
import { Bell, Mail, UserPlus, CheckCircle, AlertCircle } from 'lucide-react';

export default function NotificationsSection() {
  const notifications = [
    {
      id: 1,
      type: 'connection',
      icon: UserPlus,
      title: 'New Connection Accepted',
      message: 'John Doe accepted your connection request',
      time: '2 hours ago',
      read: false,
    },
    {
      id: 2,
      type: 'campaign',
      icon: Mail,
      title: 'Campaign Milestone',
      message: 'Your "Tech Recruiters" campaign reached 100 connections',
      time: '5 hours ago',
      read: false,
    },
    {
      id: 3,
      type: 'alert',
      icon: AlertCircle,
      title: 'Daily Limit Warning',
      message: 'You are approaching your daily connection limit',
      time: '1 day ago',
      read: true,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Notifications</h2>
          <button className="text-sm text-blue-600 hover:text-blue-700">
            Mark all as read
          </button>
        </div>

        <div className="space-y-4">
          {notifications.map((notification) => {
            const Icon = notification.icon;
            return (
              <div
                key={notification.id}
                className={`flex items-start space-x-4 p-4 rounded-lg ${
                  notification.read ? 'bg-gray-50' : 'bg-blue-50'
                }`}
              >
                <div className={`p-2 rounded-full ${
                  notification.read ? 'bg-gray-200' : 'bg-blue-200'
                }`}>
                  <Icon className={`h-5 w-5 ${
                    notification.read ? 'text-gray-600' : 'text-blue-600'
                  }`} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-gray-900">
                      {notification.title}
                    </h3>
                    <span className="text-sm text-gray-500">
                      {notification.time}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    {notification.message}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Notification Settings
        </h3>
        <div className="space-y-4">
          {[
            'Connection requests',
            'Message responses',
            'Campaign updates',
            'System alerts',
          ].map((setting, i) => (
            <div key={i} className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">{setting}</p>
                <p className="text-sm text-gray-500">
                  Receive notifications for {setting.toLowerCase()}
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}