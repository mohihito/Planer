import React, { createContext, useContext, useState, useCallback } from 'react';
import { ToastMessage, ToastType } from '../types';
import CheckCircleIcon from './icons/CheckCircleIcon';
import XCircleIcon from './icons/XCircleIcon';

interface ToastContextType {
    addToast: (message: string, type: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [toasts, setToasts] = useState<ToastMessage[]>([]);

    const addToast = useCallback((message: string, type: ToastType) => {
        const id = crypto.randomUUID();
        setToasts(prev => [...prev, { id, message, type }]);
        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id));
        }, 5000);
    }, []);

    const removeToast = (id: string) => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
    };
    
    const icons = {
        success: <CheckCircleIcon />,
        error: <XCircleIcon />,
        info: <CheckCircleIcon />,
    };

    const colors = {
        success: 'bg-green-600/90 border-green-500',
        error: 'bg-red-600/90 border-red-500',
        info: 'bg-blue-600/90 border-blue-500',
    }

    return (
        <ToastContext.Provider value={{ addToast }}>
            {children}
            <div className="fixed top-5 right-5 z-50 space-y-3 w-full max-w-sm">
                {toasts.map(toast => (
                    <div
                        key={toast.id}
                        className={`relative flex items-center p-4 rounded-lg shadow-lg text-white border-l-4 animate-fade-in-right backdrop-blur-sm ${colors[toast.type]}`}
                    >
                       <div className="flex-shrink-0">{icons[toast.type]}</div>
                       <div className="ml-3 text-sm font-medium">{toast.message}</div>
                       <button onClick={() => removeToast(toast.id)} className="ml-auto -mx-1.5 -my-1.5 bg-transparent p-1.5 rounded-lg inline-flex h-8 w-8 text-white/70 hover:text-white hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/30 transition-colors">
                           <span className="sr-only">Dismiss</span>
                           <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                       </button>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
};
