import React from 'react';
import { getStatusProgressColor } from '@/utils/statusColors';

interface ProgressBarProps {
  progress: number;
  status?: string | null | undefined;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  status,
  showLabel = true,
  size = 'sm',
  className = '',
}) => {
  const heightClasses = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3',
  };

  const progressColor = getStatusProgressColor(status);
  const clampedProgress = Math.min(Math.max(progress, 0), 100);

  return (
    <div className={`w-full ${className}`}>
      {showLabel && (
        <div className="flex justify-between text-xs text-slate-400 mb-1">
          <span>Progress</span>
          <span>{Math.round(clampedProgress)}%</span>
        </div>
      )}
      <div className={`w-full bg-slate-700 ${heightClasses[size]} rounded-full overflow-hidden`}>
        <div
          className={`${progressColor} ${heightClasses[size]} rounded-full transition-all duration-300`}
          style={{ width: `${clampedProgress}%` }}
          role="progressbar"
          aria-valuenow={clampedProgress}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`Progress: ${Math.round(clampedProgress)}%`}
        />
      </div>
    </div>
  );
};

