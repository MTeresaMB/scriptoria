import React from 'react';
import type { Genre } from '../hooks/useGenres';

interface GenreSelectProps {
  genres: Genre[];
  isLoading: boolean;
  value: string | null | undefined;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

export const GenreSelect: React.FC<GenreSelectProps> = ({
  genres,
  isLoading,
  value,
  onChange,
}) => {
  if (isLoading) {
    return (
      <div className="w-full mt-1 px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-slate-400">
        Loading genres...
      </div>
    );
  }

  const fictionGenres = genres.filter(g => {
    const cat = g.category?.toLowerCase()?.trim();
    return cat === 'fiction';
  });

  const nonFictionGenres = genres.filter(g => {
    const cat = g.category?.toLowerCase()?.trim();
    return cat === 'non-fiction' || cat === 'non fiction';
  });

  const otherGenres = genres.filter(g => {
    const cat = g.category?.toLowerCase()?.trim();
    return cat && cat !== 'fiction' && cat !== 'non-fiction' && cat !== 'non fiction';
  });

  return (
    <select
      id="genre"
      name="genre"
      value={value ?? ''}
      onChange={onChange}
      className="w-full mt-1 px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
    >
      <option value="">Select genre</option>
      {genres.length === 0 ? (
        <option value="" disabled>No genres available</option>
      ) : (
        <>
          {fictionGenres.length > 0 && (
            <optgroup label="Fiction">
              {fictionGenres.map(g => (
                <option key={g.name} value={g.name}>
                  {g.name}
                </option>
              ))}
            </optgroup>
          )}
          {nonFictionGenres.length > 0 && (
            <optgroup label="Non-Fiction">
              {nonFictionGenres.map(g => (
                <option key={g.name} value={g.name}>
                  {g.name}
                </option>
              ))}
            </optgroup>
          )}
          {otherGenres.length > 0 && (
            <optgroup label="Other">
              {otherGenres.map(g => (
                <option key={g.name} value={g.name}>
                  {g.name}
                </option>
              ))}
            </optgroup>
          )}
        </>
      )}
    </select>
  );
};

