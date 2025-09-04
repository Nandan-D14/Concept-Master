import React from 'react';
import { BellRing, Info, CheckCircle, XCircle } from 'lucide-react';
// --- Start of copied cn function ---
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
// --- End of copied cn function ---

interface NotificationItemProps {
  message: string;
  type?: 'info' | 'success' | 'warning' | 'error';
  timestamp?: string;
}

const NotificationItem: React.FC<NotificationItemProps> = ({
  message,
  type = 'info',
  timestamp,
}) => {
  const iconMap = {
    info: <Info className="h-5 w-5 text-blue-500" />,
    success: <CheckCircle className="h-5 w-5 text-green-500" />,
    warning: <BellRing className="h-5 w-5 text-yellow-500" />,
    error: <XCircle className="h-5 w-5 text-red-500" />,
  };

  return (
    <div className={cn(
      "flex items-start space-x-3 p-3 rounded-md border",
      type === 'info' && "border-blue-200 bg-blue-50",
      type === 'success' && "border-green-200 bg-green-50",
      type === 'warning' && "border-yellow-200 bg-yellow-50",
      type === 'error' && "border-red-200 bg-red-50",
    )}>
      <div className="flex-shrink-0 mt-1">
        {iconMap[type]}
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium text-foreground">{message}</p>
        {timestamp && (
          <p className="text-xs text-muted-foreground mt-1">{timestamp}</p>
        )}
      </div>
    </div>
  );
};

export default NotificationItem;
