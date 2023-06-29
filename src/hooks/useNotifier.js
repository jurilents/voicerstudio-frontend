import { useContext } from 'react';
import { NotificationContext } from '../context/NotificationContext';

export const useNotifier = () => {
  return useContext(NotificationContext);
};
