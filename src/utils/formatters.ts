export const formatNumber = (num: number): string => {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toLocaleString();
};

export const formatWordCount = (count: number | null | undefined): string => {
  if (!count || count === 0) return 'No words yet';
  return `${count.toLocaleString()} ${count === 1 ? 'word' : 'words'}`;
};

/** 200 wpm reading speed */
export const formatReadingTime = (wordCount: number | null | undefined): string => {
  if (!wordCount || wordCount === 0) return '—';
  const minutes = Math.ceil(wordCount / 200);
  if (minutes < 60) return `~${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m ? `~${h}h ${m}m` : `~${h}h`;
};

export const formatWordCountNumber = (wordCount: number): string => {
  return wordCount.toLocaleString('es-ES');
};

export const formatDate = (date: string): string => {
  return new Date(date).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export const calculateProgress = (wordCount: number, target: number = 50000): number => {
  return Math.min((wordCount / target) * 100, 100);
};

export const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};
