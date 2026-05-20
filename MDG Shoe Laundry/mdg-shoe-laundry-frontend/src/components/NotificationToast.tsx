import React from 'react';
import { AlertCircle, CheckCircle, Info, AlertTriangle, X } from 'lucide-react';
import { useNotification } from '../contexts/NotificationContext';

export const NotificationToast: React.FC = () => {
  const { notifications, removeNotification } = useNotification();

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle size={20} className="text-green-600" />;
      case 'error':
        return <AlertCircle size={20} className="text-red-600" />;
      case 'warning':
        return <AlertTriangle size={20} className="text-yellow-600" />;
      case 'info':
        return <Info size={20} className="text-blue-600" />;
      default:
        return null;
    }
  };

  const getBgColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'error':
        return 'bg-red-50 border-red-200';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200';
      case 'info':
        return 'bg-blue-50 border-blue-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const getTextColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'text-green-800';
      case 'error':
        return 'text-red-800';
      case 'warning':
        return 'text-yellow-800';
      case 'info':
        return 'text-blue-800';
      default:
        return 'text-gray-800';
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-3 pointer-events-none">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`flex items-start gap-3 p-4 rounded-lg border pointer-events-auto animate-in fade-in slide-in-from-right-4 ${getBgColor(
            notification.type,
          )}`}
        >
          {getIcon(notification.type)}
          <div className="flex-1">
            <p className={`font-bold ${getTextColor(notification.type)}`}>{notification.title}</p>
            <p className={`text-sm ${getTextColor(notification.type)}`}>{notification.message}</p>
          </div>
          <button
            onClick={() => removeNotification(notification.id)}
            className={`p-1 hover:bg-black/10 rounded transition-all ${getTextColor(notification.type)}`}
          >
            <X size={16} />
          </button>
        </div>
      ))}
    </div>
  );
};
