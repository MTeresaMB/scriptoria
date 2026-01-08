import { getStatusBadgeClasses } from './statusColors';

/**
 * Formatea números grandes con abreviaciones (K, M)
 */
export const formatNumber = (num: number): string => {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toLocaleString();
};

/**
 * Formatea el conteo de palabras con manejo de valores nulos/cero
 */
export const formatWordCount = (count: number | null | undefined): string => {
  if (!count || count === 0) return 'No words yet';
  return `${count.toLocaleString()} ${count === 1 ? 'word' : 'words'}`;
};

/**
 * Formatea números de palabras solo con separadores (sin texto adicional)
 */
export const formatWordCountNumber = (wordCount: number): string => {
  return wordCount.toLocaleString('es-ES');
};

/**
 * Formatea fechas en formato español
 */
export const formatDate = (date: string): string => {
  return new Date(date).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

/**
 * Calcula el progreso basado en el conteo de palabras y un objetivo
 */
export const calculateProgress = (wordCount: number, target: number = 50000): number => {
  return Math.min((wordCount / target) * 100, 100);
};

/**
 * @deprecated Use getStatusBadgeClasses from '@/utils/statusColors' instead
 */
export const getStatusColor = (status: string): string => {
  return getStatusBadgeClasses(status);
};

export const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};
