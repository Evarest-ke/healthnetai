import React, { useState } from 'react';
import { Bell, Mail, MessageSquare, Smartphone, Settings, Plus } from 'lucide-react';

export default function AlertNotifications() {
  const [channels, setChannels] = useState([
    {
      id: 1,
      type: 'email',
      recipients: ['admin@example.com', 'tech@example.com'],
      enabled: true,
      settings: {
        criticalOnly: false,
        digest: false
      }
    },
    {
      id: 2,
      type: 'slack',
      webhook: 'https://hooks.slack.com/services/xxx',
      channel: '#alerts',
      enabled: true,
      settings: {
        criticalOnly: true,
        mentions: ['@oncall']
      }
    },
    {
      id: 3,
      type: 'sms',
      numbers: ['+1234567890'],
      enabled: false,
      settings: {
        criticalOnly: true
      }
    }
  ]);

  const getChannelIcon = (type) => {
    switch (type) {
      case 'email':
        return <Mail className="h-5 w-5" />;
      case 'slack':
        return <MessageSquare className="h-5 w-5" />;
      case 'sms':
        return <Smartphone className="h-5 w-5" />;
      default:
        return <Bell className="h-5 w-5" />;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold">Notification Channels</h2>
        <button className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
          <Plus className="h-4 w-4 mr-2" />
          Add Channel
        </button>
      </div>

      <div className="space-y-4">
        {channels.map(channel => (
          <div
            key={channel.id}
            className={`border rounded-lg p-4 ${
              channel.enabled ? 'bg-white' : 'bg-gray-50'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className={`p-2 rounded-lg ${
                  channel.enabled ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-100 text-gray-400'
                }`}>
                  {getChannelIcon(channel.type)}
                </div>
                <div className="ml-4">
                  <h3 className="font-medium text-gray-900 capitalize">
                    {channel.type} Notifications
                  </h3>
                  <div className="mt-1">
                    {channel.type === 'email' && (
                      <p className="text-sm text-gray-500">
                        Recipients: {channel.recipients.join(', ')}
                      </p>
                    )}
                    {channel.type === 'slack' && (
                      <p className="text-sm text-gray-500">
                        Channel: {channel.channel}
                      </p>
                    )}
                    {channel.type === 'sms' && (
                      <p className="text-sm text-gray-500">
                        Numbers: {channel.numbers.join(', ')}
                      </p>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <button className="text-gray-400 hover:text-gray-500">
                  <Settings className="h-5 w-5" />
                </button>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={channel.enabled}
                    onChange={() => {
                      setChannels(channels.map(c =>
                        c.id === channel.id ? { ...c, enabled: !c.enabled } : c
                      ));
                    }}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                </label>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 