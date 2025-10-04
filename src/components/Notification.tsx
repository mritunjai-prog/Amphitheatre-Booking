import React, { useEffect } from "react";

interface NotificationProps {
  message: string;
  type: "success" | "error" | "info";
  onClose: () => void;
}

const toneMap: Record<
  NotificationProps["type"],
  { icon: string; classes: string }
> = {
  success: {
    icon: "✅",
    classes: "border-emerald-400/40 bg-emerald-500/15 text-emerald-100",
  },
  error: {
    icon: "❌",
    classes: "border-rose-400/50 bg-rose-500/20 text-rose-100",
  },
  info: {
    icon: "ℹ️",
    classes: "border-primary-400/40 bg-primary-500/15 text-primary-100",
  },
};

const Notification: React.FC<NotificationProps> = ({
  message,
  type,
  onClose,
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 4000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const tone = toneMap[type];

  return (
    <div className="fixed right-6 top-6 z-50">
      <div
        className={`glass-card flex items-center gap-4 border ${tone.classes} px-6 py-4 shadow-lg shadow-black/30 backdrop-blur-xl`}
      >
        <span className="text-xl">{tone.icon}</span>
        <p className="flex-1 text-sm font-medium text-white/90">{message}</p>
        <button
          onClick={onClose}
          className="text-lg text-white/70 transition hover:text-white"
          aria-label="Dismiss notification"
        >
          ×
        </button>
      </div>
    </div>
  );
};

export default Notification;
