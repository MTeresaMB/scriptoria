import { useState, useCallback, useMemo } from 'react';
import { supabase } from '@lib/supabase';
import type { Manuscript, ManuscriptInsert } from '@types';
import type { ManuscriptUpdate } from '@lib/respository/manuscriptRepository';
import { insertManuscript, updateManuscript } from '@lib/respository/manuscriptRepository';
import { useToast } from '@/hooks/useToast';
import { validateRequired, validateMinLength, validateMaxLength, validatePositiveNumber } from '@/utils/validations';
import { useUnsavedChanges } from '@/hooks/useUnsavedChanges';
import { normalizeInputValue, cleanOptionalField, validateWordCountWithDefault } from '@/utils/formHelpers';

interface UseManuscriptFormProps {
  initialData?: Manuscript;
  onSuccess: (data: Manuscript) => void;
}

export const useManuscriptForm = ({ initialData, onSuccess }: UseManuscriptFormProps) => {
  const { toast } = useToast();
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
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [touchedFields, setTouchedFields] = useState<Set<string>>(new Set());

  // Detectar cambios sin guardar
  const hasUnsavedChanges = useMemo(() => {
    if (!initialData) {
      // En creación, hay cambios si hay algún campo con valor
      return formData.title.trim() !== '' ||
        formData.summary !== null ||
        (formData.word_count ?? 0) > 0 ||
        formData.genre !== null ||
        formData.target_audience !== null;
    }
    // En edición, comparar con datos iniciales
    return formData.title !== initialData.title ||
      formData.summary !== (initialData.summary ?? null) ||
      formData.word_count !== (initialData.word_count ?? 0) ||
      formData.status !== (initialData.status ?? 'Draft') ||
      formData.genre !== (initialData.genre ?? null) ||
      formData.target_audience !== (initialData.target_audience ?? null);
  }, [formData, initialData]);

  useUnsavedChanges({
    hasUnsavedChanges: hasUnsavedChanges && !isSubmitting,
    message: 'You have unsaved changes. Are you sure you want to leave?',
  });

  const validateField = useCallback((name: string, value: unknown) => {
    let validation: { isValid: boolean; error?: string } = { isValid: true };

    switch (name) {
      case 'title':
        validation = validateRequired(value as string, 'Title');
        if (validation.isValid) {
          validation = validateMinLength(value as string, 3, 'Title');
        }
        if (validation.isValid) {
          validation = validateMaxLength(value as string, 200, 'Title');
        }
        break;
      case 'word_count':
        validation = validatePositiveNumber(value as number, 'Word count');
        break;
      case 'summary':
        if (value) {
          validation = validateMaxLength(value as string, 5000, 'Summary');
        }
        break;
    }

    setFieldErrors(prev => {
      if (validation.isValid) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { [name]: removed, ...rest } = prev;
        return rest;
      }
      return { ...prev, [name]: validation.error || 'Invalid value' };
    });

    return validation.isValid;
  }, []);

  const handleInputChange = useCallback((
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const name = e.target.name;
    let val = normalizeInputValue(e.target);

    // For number inputs in manuscripts, default to 0 instead of null
    if (e.target instanceof HTMLInputElement && e.target.type === 'number') {
      val = val ?? 0;
    }

    setFormData(prev => ({ ...prev, [name]: val }));

    if (touchedFields.has(name)) {
      validateField(name, val);
    }
  }, [touchedFields, validateField]);

  const handleBlur = useCallback((e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const name = e.target.name;
    setTouchedFields(prev => new Set(prev).add(name));
    validateField(name, formData[name as keyof typeof formData]);
  }, [formData, validateField]);

  const handleSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    // Marcar todos los campos como tocados y validar
    const fieldsToValidate = ['title', 'word_count', 'summary'];
    let isValid = true;

    fieldsToValidate.forEach(field => {
      setTouchedFields(prev => new Set(prev).add(field));
      const fieldValid = validateField(field, formData[field as keyof typeof formData]);
      if (!fieldValid) isValid = false;
    });

    if (!isValid) {
      toast.error('Please fix the errors before submitting');
      return;
    }

    setIsSubmitting(true);

    try {
      const { data: userData, error: userErr } = await supabase.auth.getUser();
      if (userErr || !userData.user) {
        throw new Error('No user authenticated');
      }

      const wordCount = validateWordCountWithDefault(formData.word_count);
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
        if (data) {
          toast.success('Manuscript updated successfully');
          onSuccess(data);
        }
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
        if (data) {
          toast.success('Manuscript created successfully');
          onSuccess(data);
        }
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error saving manuscript';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, initialData, onSuccess, toast, validateField]);

  return {
    formData,
    isSubmitting,
    error,
    fieldErrors,
    touchedFields,
    hasUnsavedChanges,
    handleInputChange,
    handleBlur,
    handleSubmit,
  };
};

