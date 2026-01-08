import type { LucideIcon } from 'lucide-react';
import React from 'react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  iconClassName?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  iconClassName = 'text-slate-500'
}) => {
  return (
    <div className="flex flex-col items-center justify-center h-64 bg-slate-800 rounded-xl border border-slate-700 p-8">
      <div className={`${iconClassName} mb-4`}>
        <Icon className="w-16 h-16 mx-auto mb-2" />
      </div>
      <h3 className="text-xl font-semibold text-white mb-2">
        {title}
      </h3>
      {description && (
        <p className="text-slate-400 text-sm text-center mb-6">
          {description}
        </p>
      )}
      {onAction && actionLabel && (
        <button
          onClick={onAction}
          className="flex items-center space-x-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors"
        >
          <span>{actionLabel}</span>
        </button>
      )}
    </div>
  );
};

