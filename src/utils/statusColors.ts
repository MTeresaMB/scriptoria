export type StatusType = 'completed' | 'draft' | 'in progress' | string;

export interface StatusColors {
  badge: string;
  gradient: {
    from: string;
    to: string;
  };
  progress: string;
}

const statusColorMap: Record<string, StatusColors> = {
  'completed': {
    badge: 'bg-green-500/15 dark:bg-green-500/20 text-green-800 dark:text-green-400 border-green-600/25 dark:border-green-500/30',
    gradient: {
      from: 'from-purple-900',
      to: 'to-indigo-900',
    },
    progress: 'bg-purple-500',
  },
  'draft': {
    badge: 'bg-amber-500/15 dark:bg-yellow-500/20 text-amber-900 dark:text-yellow-400 border-amber-600/30 dark:border-yellow-500/30',
    gradient: {
      from: 'from-blue-900',
      to: 'to-cyan-900',
    },
    progress: 'bg-yellow-500',
  },
  'in progress': {
    badge: 'bg-blue-500/15 dark:bg-blue-500/20 text-blue-800 dark:text-blue-400 border-blue-600/30 dark:border-blue-500/30',
    gradient: {
      from: 'from-blue-900',
      to: 'to-cyan-900',
    },
    progress: 'bg-blue-500',
  },
};

export const getStatusColors = (status: string | null | undefined): StatusColors => {
  const statusLower = (status ?? 'draft').toLowerCase();
  return statusColorMap[statusLower] || statusColorMap['draft'];
};

export const getStatusBadgeClasses = (status: string | null | undefined): string => {
  return getStatusColors(status).badge;
};

/**
 * Obtiene las clases CSS para el gradiente según status
 */
export const getStatusGradientClasses = (status: string | null | undefined): string => {
  const colors = getStatusColors(status);
  return `${colors.gradient.from} ${colors.gradient.to}`;
};

export const getStatusProgressColor = (status: string | null | undefined): string => {
  return getStatusColors(status).progress;
};

