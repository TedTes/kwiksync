import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";
import { AlertCircle, CheckCircle, XCircle, Info } from "lucide-react";

const ToastContext = createContext<ToastContextType | null>(null);

const TOAST_TYPES = {
  success: {
    icon: CheckCircle,
    bgColor: "bg-green-100",
    textColor: "text-green-800",
    borderColor: "border-green-200",
  },
  error: {
    icon: XCircle,
    bgColor: "bg-red-100",
    textColor: "text-red-800",
    borderColor: "border-red-200",
  },
  warning: {
    icon: AlertCircle,
    bgColor: "bg-yellow-100",
    textColor: "text-yellow-800",
    borderColor: "border-yellow-200",
  },
  info: {
    icon: Info,
    bgColor: "bg-blue-100",
    textColor: "text-blue-800",
    borderColor: "border-blue-200",
  },
};

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback(
    (message: string, type: ToastType, duration = 3000) => {
      const id = Date.now();
      setToasts((prev) => [...prev, { id, message, type }]);

      setTimeout(() => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
      }, duration);
    },
    []
  );

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {toasts.map((toast) => {
          const {
            icon: Icon,
            bgColor,
            textColor,
            borderColor,
          } = TOAST_TYPES[toast.type];

          return (
            <div
              key={toast.id}
              className={`flex items-center p-4 rounded-lg border ${bgColor} ${textColor} ${borderColor} shadow-lg transform transition-all duration-300 ease-in-out`}
              role="alert"
            >
              <Icon className="w-5 h-5 mr-2" />
              <span className="font-medium">{toast.message}</span>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};
