import React, { createContext, useContext, ReactNode } from 'react';
import { ToastContainer, useToast, Toast, ToastType } from '../components/ui/Toast';

interface ToastContextType {
  addToast: (toast: Omit<Toast, 'id'>) => string;
  dismissToast: (id: string) => void;
  dismissAll: () => void;
  success: (title: string, message?: string, duration?: number) => string;
  error: (title: string, message?: string, duration?: number) => string;
  info: (title: string, message?: string, duration?: number) => string;
  loading: (title: string, message?: string) => string;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

interface ToastProviderProps {
  children: ReactNode;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ 
  children, 
  position = 'top-right' 
}) => {
  const toast = useToast();

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <ToastContainer 
        toasts={toast.toasts} 
        onDismiss={toast.dismissToast}
        position={position}
      />
    </ToastContext.Provider>
  );
};

export const useToastContext = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToastContext must be used within a ToastProvider');
  }
  return context;
};

// Optimized auto-save toast hook with reduced frequency
export const useAutoSaveToast = () => {
  const toast = useToastContext();
  let currentToastId: string | null = null;
  let isShowingToast = false;

  const showSaving = (message: string = 'Saving...') => {
    // Only show if not already showing a toast
    if (isShowingToast) {
      return currentToastId;
    }

    // Dismiss any existing auto-save toast
    if (currentToastId) {
      toast.dismissToast(currentToastId);
    }

    isShowingToast = true;
    currentToastId = toast.loading('Saving', message);
    return currentToastId;
  };

  const showSuccess = (message: string = 'Saved!') => {
    // Dismiss the loading toast
    if (currentToastId) {
      toast.dismissToast(currentToastId);
    }

    // Show success toast with shorter duration (1 second total)
    currentToastId = toast.success('Saved', message, 700); // 700ms + 300ms animation = 1s total

    // Reset the showing flag after toast duration
    setTimeout(() => {
      isShowingToast = false;
    }, 1000);

    return currentToastId;
  };

  const showError = (message: string = 'Save failed') => {
    // Dismiss the loading toast
    if (currentToastId) {
      toast.dismissToast(currentToastId);
    }

    // Show error toast with slightly longer duration
    currentToastId = toast.error('Error', message, 1200); // 1.2s + 300ms animation = 1.5s total

    // Reset the showing flag after toast duration
    setTimeout(() => {
      isShowingToast = false;
    }, 1500);

    return currentToastId;
  };

  const dismiss = () => {
    if (currentToastId) {
      toast.dismissToast(currentToastId);
      currentToastId = null;
    }
    isShowingToast = false;
  };

  return {
    showSaving,
    showSuccess,
    showError,
    dismiss,
  };
};
