'use client';

import React, { createContext, useContext } from 'react';
import { toast } from 'sonner';

interface NotificationContextType {
  showNotification: (type: 'price_alert' | 'weather_alert', message: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

interface NotificationProviderProps {
  children: React.ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const showNotification = (type: 'price_alert' | 'weather_alert', message: string) => {
    const icon = type === 'price_alert' ? '💰' : '🌤️';
    
    toast(message, {
      icon,
      style: {
        background: type === 'price_alert' ? '#FEF3C7' : '#E0F2FE',
        border: `1px solid ${type === 'price_alert' ? '#FCD34D' : '#7DD3FC'}`,
        color: type === 'price_alert' ? '#92400E' : '#075985',
      },
    });
  };

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}
    </NotificationContext.Provider>
  );
}; 