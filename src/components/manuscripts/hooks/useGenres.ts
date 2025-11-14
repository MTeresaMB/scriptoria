import { useState, useEffect } from 'react';
import { supabase } from '@lib/supabase';

export interface Genre {
  name: string;
  category: string;
}

export const useGenres = () => {
  const [genres, setGenres] = useState<Genre[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadGenres = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const { data, error: genreError } = await supabase
          .from('genre')
          .select('name, category')
          .order('category', { ascending: true })
          .order('name', { ascending: true });

        if (genreError) {
          throw new Error(genreError.message || 'Error loading genres');
        }

        if (data && data.length > 0) {
          setGenres(data);
        } else {
          setGenres([]);
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Error loading genres';
        setError(errorMessage);
        console.error('Error loading genres:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadGenres();
  }, []);

  return { genres, isLoading, error };
};

