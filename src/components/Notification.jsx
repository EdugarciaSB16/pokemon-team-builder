import { useEffect } from 'react';
import { CheckCircle, Info, AlertCircle, X } from 'lucide-react';

const ICONS = {
  success: CheckCircle,
  info: Info,
  warning: AlertCircle,
  error: AlertCircle,
};

const COLORS = {
  success: 'bg-green-500 border-green-600 text-green-100',
  info: 'bg-blue-500 border-blue-600 text-blue-100',
  warning: 'bg-yellow-500 border-yellow-600 text-yellow-100',
  error: 'bg-red-500 border-red-600 text-red-100',
};

export default function Notification({ notification, onClose }) {
  const { type, message, duration } = notification;
  const Icon = ICONS[type] || Info;

  useEffect(() => {
    if (duration) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  return (
    <div className="fixed top-4 right-4 z-50 animate-slide-in">
      <div
        className={`flex items-center space-x-3 px-4 py-3 rounded-lg border-2 shadow-lg ${COLORS[type]}`}
      >
        <Icon size={20} />
        <span className="font-medium">{message}</span>
        <button
          onClick={onClose}
          className="ml-2 hover:opacity-80 transition-opacity"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}
