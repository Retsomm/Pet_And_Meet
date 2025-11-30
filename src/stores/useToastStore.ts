import { create } from "zustand";
import toast from "react-hot-toast";

type ToastOptions = any;

interface ToastState {
  showSuccess: (message: string, options?: ToastOptions) => void;
  showError: (message: string, options?: ToastOptions) => void;
  showInfo: (message: string, options?: ToastOptions) => void;
  showWarning: (message: string, options?: ToastOptions) => void;
  showLoading: (message?: string, options?: ToastOptions) => string;
  dismiss: (toastId: string) => void;
  dismissAll: () => void;
}

const useToastStore = create<ToastState>(() => ({
  showSuccess: (message, options = {}) => {
    toast.success(message, {
      duration: 2000,
      position: "top-center",
      style: {
        background: "#10b981",
        color: "#fff",
        borderRadius: "8px",
        fontSize: "14px",
        fontWeight: "500",
      },
      iconTheme: { primary: "#fff", secondary: "#10b981" },
      ...options,
    });
  },
  showError: (message, options = {}) => {
    toast.error(message, {
      duration: 2000,
      position: "top-center",
      style: {
        background: "#ef4444",
        color: "#fff",
        borderRadius: "8px",
        fontSize: "14px",
        fontWeight: "500",
      },
      iconTheme: { primary: "#fff", secondary: "#ef4444" },
      ...options,
    });
  },
  showInfo: (message, options = {}) => {
    toast(message, {
      duration: 2000,
      position: "top-center",
      style: {
        background: "#3b82f6",
        color: "#fff",
        borderRadius: "8px",
        fontSize: "14px",
        fontWeight: "500",
      },
      icon: "ℹ️",
      ...options,
    });
  },
  showWarning: (message, options = {}) => {
    toast(message, {
      duration: 2000,
      position: "top-center",
      style: {
        background: "#f59e0b",
        color: "#fff",
        borderRadius: "8px",
        fontSize: "14px",
        fontWeight: "500",
      },
      icon: "⚠️",
      ...options,
    });
  },
  showLoading: (message = "載入中...", options = {}) => {
    return toast.loading(message, { position: "top-center", style: { background: "#6b7280", color: "#fff" }, ...options });
  },
  dismiss: (toastId) => {
    toast.dismiss(toastId);
  },
  dismissAll: () => {
    toast.dismiss();
  },
}));

export default useToastStore;
