"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { CheckCircle2, Info, AlertCircle, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ToastMessage {
  id: string;
  type?: "success" | "info" | "warning";
  text: string;
}

interface ToastContextType {
  toast: (text: string, type?: "success" | "info" | "warning") => void;
}

const ToastContext = createContext<ToastContextType>({
  toast: () => {},
});

export const useToast = () => useContext(ToastContext);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const toast = useCallback(
    (text: string, type: "success" | "info" | "warning" = "success") => {
      const id = Math.random().toString(36).substring(2, 9);
      setToasts((prev) => [...prev, { id, type, text }]);

      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 3200);
    },
    []
  );

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 pointer-events-none max-w-sm w-full px-4 sm:px-0">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={cn(
              "pointer-events-auto flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-md border text-xs font-mono shadow-2xl transition-all animate-in fade-in slide-in-from-bottom-3",
              "bg-[#111111] text-foreground border-[#2A2A2A]",
              t.type === "success" && "border-amber/40 text-foreground",
              t.type === "warning" && "border-yellow-600/40 text-yellow-200"
            )}
          >
            <div className="flex items-center gap-2.5">
              {t.type === "success" && (
                <CheckCircle2 className="w-4 h-4 text-amber shrink-0" />
              )}
              {t.type === "info" && (
                <Info className="w-4 h-4 text-muted shrink-0" />
              )}
              {t.type === "warning" && (
                <AlertCircle className="w-4 h-4 text-yellow-500 shrink-0" />
              )}
              <span>{t.text}</span>
            </div>
            <button
              onClick={() => removeToast(t.id)}
              className="text-muted hover:text-foreground p-1 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};
