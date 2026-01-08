/**
 * Sistema de colores centralizado para status
 */

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
    badge: 'bg-green-500/20 text-green-400 border-green-500/30',
    gradient: {
      from: 'from-purple-900',
      to: 'to-indigo-900',
    },
    progress: 'bg-purple-500',
  },
  'draft': {
    badge: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    gradient: {
      from: 'from-blue-900',
      to: 'to-cyan-900',
    },
    progress: 'bg-yellow-500',
  },
  'in progress': {
    badge: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    gradient: {
      from: 'from-blue-900',
      to: 'to-cyan-900',
    },
    progress: 'bg-blue-500',
  },
};

/**
 * Obtiene los colores para un status dado
 */
export const getStatusColors = (status: string | null | undefined): StatusColors => {
  const statusLower = (status ?? 'draft').toLowerCase();
  return statusColorMap[statusLower] || statusColorMap['draft'];
};

/**
 * Obtiene las clases CSS para el badge de status
 */
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

/**
 * Obtiene el color de la barra de progreso según status
 */
export const getStatusProgressColor = (status: string | null | undefined): string => {
  return getStatusColors(status).progress;
};

