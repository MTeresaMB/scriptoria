import { useToastContext } from '@/components/common/toast/useToastContext';

export const useToast = () => {
  const { addToast } = useToastContext();

  return {
    toast: {
      success: (message: string, duration?: number) => addToast(message, 'success', duration),
      error: (message: string, duration?: number) => addToast(message, 'error', duration),
      warning: (message: string, duration?: number) => addToast(message, 'warning', duration),
      info: (message: string, duration?: number) => addToast(message, 'info', duration),
    },
  };
};
