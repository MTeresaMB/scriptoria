import { useState, useCallback } from 'react';
import { supabase } from '@lib/supabase';
import type { Manuscript, ManuscriptInsert } from '@types';
import type { ManuscriptUpdate } from '@lib/respository/manuscriptRepository';
import { insertManuscript, updateManuscript } from '@lib/respository/manuscriptRepository';

interface UseManuscriptFormProps {
  initialData?: Manuscript;
  onSuccess: (data: Manuscript) => void;
}

export const useManuscriptForm = ({ initialData, onSuccess }: UseManuscriptFormProps) => {
  const [formData, setFormData] = useState<Omit<ManuscriptInsert, 'id_manuscript'>>({
    title: initialData?.title ?? '',
    summary: initialData?.summary ?? null,
    date_created: initialData?.date_created ?? new Date().toISOString(),
    picture: initialData?.picture ?? null,
    id_user: initialData?.id_user ?? '',
    genre: initialData?.genre ?? null,
    status: initialData?.status ?? 'Draft',
    word_count: initialData?.word_count ?? 0,
    target_audience: initialData?.target_audience ?? null
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = useCallback((
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const name = e.target.name;
    let val: string | number | null = e.target.value;

    if (e.target instanceof HTMLInputElement) {
      if (e.target.type === 'file') {
        val = e.target.files?.[0]?.name ?? null;
      } else if (e.target.type === 'number') {
        const numVal = Number(val);
        val = (val === '' || isNaN(numVal)) ? 0 : numVal;
      }
    } else {
      val = typeof val === 'string' ? (val.trim() || null) : val;
    }

    setFormData(prev => ({ ...prev, [name]: val }));
  }, []);

  const validateWordCount = useCallback((value: unknown): number => {
    if (value === undefined || value === null) return 0;
    if (typeof value === 'number') {
      return isNaN(value) ? 0 : Math.max(0, Math.floor(value));
    }
    if (typeof value === 'string') {
      const parsed = parseInt(value, 10);
      return isNaN(parsed) ? 0 : Math.max(0, parsed);
    }
    return 0;
  }, []);

  const cleanOptionalField = useCallback((value: unknown): string | null => {
    if (!value || typeof value !== 'string') return null;
    const trimmed = value.trim();
    return trimmed === '' ? null : trimmed;
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const { data: userData, error: userErr } = await supabase.auth.getUser();
      if (userErr || !userData.user) {
        throw new Error('No user authenticated');
      }

      const wordCount = validateWordCount(formData.word_count);
      const summary = cleanOptionalField(formData.summary);
      const picture = cleanOptionalField(formData.picture);
      const genre = cleanOptionalField(formData.genre);
      const targetAudience = cleanOptionalField(formData.target_audience);

      if (initialData?.id_manuscript) {
        // Update
        const updateData: ManuscriptUpdate = {
          title: formData.title.trim(),
          status: formData.status ?? 'Draft',
          word_count: wordCount,
        };

        if (summary !== null) updateData.summary = summary;
        if (picture !== null) updateData.picture = picture;
        if (genre !== null) updateData.genre = genre;
        if (targetAudience !== null) updateData.target_audience = targetAudience;

        const { data, error } = await updateManuscript(initialData.id_manuscript, updateData);
        if (error) throw error;
        if (data) onSuccess(data);
      } else {
        // Insert
        const insertData: ManuscriptInsert = {
          title: formData.title.trim(),
          id_user: userData.user.id,
          date_created: new Date().toISOString(),
          status: formData.status || 'Draft',
          word_count: wordCount,
        };

        if (summary !== null) insertData.summary = summary;
        if (picture !== null) insertData.picture = picture;
        if (genre !== null) insertData.genre = genre;
        if (targetAudience !== null) insertData.target_audience = targetAudience;

        if (isNaN(insertData.word_count as number)) {
          throw new Error('word_count no puede ser NaN');
        }

        const { data, error } = await insertManuscript(insertData);
        if (error) throw error;
        if (data) onSuccess(data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error guardando el manuscrito');
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, initialData, onSuccess, validateWordCount, cleanOptionalField]);

  return {
    formData,
    isSubmitting,
    error,
    handleInputChange,
    handleSubmit,
  };
};

