import { createContext, useRef } from 'react';
import NotificationSystem from 'react-notification-system';

export const NotificationContext = createContext(() => {
});

export const NotificationProvider = ({ children }) => {
  const $notificationSystem = useRef();

  const notify = (obj) => {
    const notification = $notificationSystem.current;
    notification.clearNotifications();
    notification.addNotification({
      position: 'tc',
      dismissible: 'none',
      autoDismiss: 2,
      message: obj.message,
      level: obj.level,
    });
  };

  return (
    <NotificationContext.Provider value={notify}>
      <NotificationSystem ref={$notificationSystem} allowHTML={true} />
      {children}
    </NotificationContext.Provider>
  );
};
