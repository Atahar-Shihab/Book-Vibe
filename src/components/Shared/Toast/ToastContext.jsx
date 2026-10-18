import { useState, useCallback } from "react";
import { ToastContext } from "./useToast";

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = "success", duration = 3500) => {
    const id = Date.now() + Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* Toast floating container */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2.5 pointer-events-none max-w-sm w-full">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            role="alert"
            className={`pointer-events-auto flex items-center justify-between gap-3 px-4 py-3.5 rounded-2xl shadow-2xl backdrop-blur-md border transition-all duration-300 animate-in slide-in-from-bottom-5 ${
              toast.type === "success"
                ? "bg-emerald-950/90 text-emerald-100 border-emerald-500/30 shadow-emerald-950/50"
                : toast.type === "warning"
                ? "bg-amber-950/90 text-amber-100 border-amber-500/30 shadow-amber-950/50"
                : "bg-slate-900/90 text-slate-100 border-slate-700 shadow-slate-950/50"
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="text-xl">
                {toast.type === "success" ? "✨" : toast.type === "warning" ? "⚠️" : "ℹ️"}
              </span>
              <p className="text-xs sm:text-sm font-medium leading-snug">{toast.message}</p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-white/60 hover:text-white text-xs font-bold px-1.5 py-0.5 rounded-lg hover:bg-white/10 transition"
              aria-label="Close notification"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export default ToastProvider;
