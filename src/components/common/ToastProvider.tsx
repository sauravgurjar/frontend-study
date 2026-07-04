import { createContext, ReactNode, useCallback, useContext, useState } from 'react';

interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  variant: 'success' | 'error' | 'info';
}

interface ToastContextValue {
  notify: (message: Omit<ToastMessage, 'id'>) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const toastStyles = {
  success: 'bg-emerald-50 border-emerald-200 text-emerald-900',
  error: 'bg-rose-50 border-rose-200 text-rose-900',
  info: 'bg-slate-50 border-slate-200 text-slate-900'
};

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [messages, setMessages] = useState<ToastMessage[]>([]);

  const notify = useCallback((message: Omit<ToastMessage, 'id'>) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    setMessages((current) => [...current, { id, ...message }]);
    window.setTimeout(() => {
      setMessages((current) => current.filter((toast) => toast.id !== id));
    }, 4000);
  }, []);

  return (
    <ToastContext.Provider value={{ notify }}>
      {children}
      <div className="pointer-events-none fixed right-4 top-4 z-50 flex w-[320px] flex-col gap-3">
        {messages.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto rounded-3xl border px-4 py-3 shadow-soft backdrop-blur-xl ${toastStyles[toast.variant]}`}
          >
            <p className="font-semibold">{toast.title}</p>
            {toast.description && <p className="mt-1 text-sm text-slate-600">{toast.description}</p>}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
