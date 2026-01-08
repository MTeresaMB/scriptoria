import React from 'react';
import { getStatusBadgeClasses } from '@/utils/statusColors';

interface StatusBadgeProps {
  status: string | null | undefined;
  size?: 'sm' | 'md' | 'lg';
  uppercase?: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  size = 'sm',
  uppercase = true,
}) => {
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
    lg: 'px-3 py-1.5 text-base',
  };

  const displayStatus = status ?? 'Draft';
  const displayText = uppercase ? displayStatus.toUpperCase() : displayStatus;

  return (
    <span
      className={`inline-block rounded font-semibold border ${sizeClasses[size]} ${getStatusBadgeClasses(status)}`}
    >
      {displayText}
    </span>
  );
};

