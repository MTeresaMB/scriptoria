/**
 * Utilidades para formatear datos de manuscritos
 */

export const formatDate = (date: string): string => {
  return new Date(date).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export const formatWordCount = (wordCount: number): string => {
  return wordCount.toLocaleString('es-ES');
};

export const getStatusColor = (status: string): string => {
  const statusMap: Record<string, string> = {
    'in_progress': 'bg-green-500/20 text-green-400 border-green-500/30',
    'completed': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    'on_hold': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    'draft': 'bg-gray-500/20 text-gray-400 border-gray-500/30',
    'in progress': 'bg-green-500/20 text-green-400 border-green-500/30',
  };

  return statusMap[status.toLowerCase()] || 'bg-purple-500/20 text-purple-400 border-purple-500/30';
};

export const calculateProgress = (wordCount: number, target: number = 50000): number => {
  return Math.min((wordCount / target) * 100, 100);
};

