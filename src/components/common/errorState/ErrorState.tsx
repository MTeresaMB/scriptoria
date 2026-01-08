import React from 'react';
import { AlertCircle } from 'lucide-react';

interface ErrorStateProps {
  error: string;
  onRetry: () => void;
  itemType?: string;
  title?: string;
  defaultMessage?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  error,
  onRetry,
  itemType,
  title,
  defaultMessage,
}) => {
  const displayTitle = title || (itemType
    ? `Error to load ${itemType}`
    : 'Error loading data');

  const displayDefaultMessage = defaultMessage || (itemType
    ? `An error occurred while trying to load your ${itemType}. Please try again.`
    : 'An error occurred while trying to load the data. Please try again.');

  return (
    <div className="flex flex-col items-center justify-center h-64 bg-slate-800 rounded-xl border border-slate-700 p-8">
      <div className="text-red-400 mb-4">
        <AlertCircle className="w-16 h-16 mx-auto mb-2" />
      </div>
      <h3 className="text-xl font-semibold text-white mb-2">
        {displayTitle}
      </h3>
      <p className="text-slate-400 text-sm text-center mb-4">
        {error || displayDefaultMessage}
      </p>
      <button
        onClick={onRetry}
        className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors"
      >
        Retry
      </button>
    </div>
  );
};