import { useState, useCallback, useMemo } from 'react';
import type { FormEvent } from 'react';
import { supabase } from '@/lib/supabase';
import { insertNote, updateNote, type NoteInsert, type NoteUpdate } from '@/lib/repository/notesRepository';
import { useToast } from '@/hooks/ui/useToast';
import {
  composeValidators,
  updateFieldErrors,
  validateMaxLength,
  validateMinLength,
  validateRequired,
  type ValidationResult,
} from '@/utils/validations';
import { useUnsavedChanges } from '@/hooks/ui/useUnsavedChanges';
import { cleanOptionalField } from '@/utils/formHelpers';
import type { Note } from '@/types';

interface UseNoteFormProps {
  initialData?: Note | null;
  onSuccess: (data: Note) => void;
}

type NoteFieldName = 'title' | 'content' | 'category';

const FIELDS_TO_VALIDATE: NoteFieldName[] = ['title', 'content', 'category'];

const MAX_LENGTHS = {
  title: 200,
  content: 10000,
  category: 100,
} as const;

export const useNoteForm = ({ initialData, onSuccess }: UseNoteFormProps) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<NoteFieldName, string>>>({});
  const [touchedFields, setTouchedFields] = useState<Set<string>>(new Set());

  const [formData, setFormData] = useState<NoteInsert>({
    title: initialData?.title ?? '',
    content: initialData?.content ?? null,
    category: initialData?.category ?? null,
    priority: initialData?.priority ?? null,
    id_manuscript: initialData?.id_manuscript ?? null,
  });

  const hasUnsavedChanges = useMemo(() => {
    if (!initialData) {
      return (
        formData.title.trim() !== '' ||
        formData.content !== null ||
        formData.category !== null ||
        formData.priority !== null ||
        formData.id_manuscript !== null
      );
    }
    return (
      formData.title !== initialData.title ||
      formData.content !== (initialData.content ?? null) ||
      formData.category !== (initialData.category ?? null) ||
      formData.priority !== (initialData.priority ?? null) ||
      formData.id_manuscript !== (initialData.id_manuscript ?? null)
    );
  }, [formData, initialData]);

  useUnsavedChanges({
    hasUnsavedChanges: hasUnsavedChanges && !isSubmitting,
    message: 'You have unsaved changes. Are you sure you want to leave?',
  });

  const titleValidator = useCallback(
    (value: string): ValidationResult =>
      composeValidators<string>(
        (v) => validateRequired(v, 'Title'),
        (v) => validateMinLength(v, 2, 'Title'),
        (v) => validateMaxLength(v, MAX_LENGTHS.title, 'Title'),
      )(value),
    [],
  );

  const contentValidator = useCallback(
    (value: string | null): ValidationResult =>
      value ? validateMaxLength(value, MAX_LENGTHS.content, 'Content') : { isValid: true },
    [],
  );

  const categoryValidator = useCallback(
    (value: string | null): ValidationResult =>
      value ? validateMaxLength(value, MAX_LENGTHS.category, 'Category') : { isValid: true },
    [],
  );

  const validateField = useCallback((name: string, value: unknown): boolean => {
    let validation: ValidationResult = { isValid: true };

    if (name === 'title') {
      validation = titleValidator((value ?? '') as string);
    } else if (name === 'content') {
      validation = contentValidator((value as string | null) ?? null);
    } else if (name === 'category') {
      validation = categoryValidator((value as string | null) ?? null);
    }

    setFieldErrors(prev => updateFieldErrors(prev, name as NoteFieldName, validation));

    return validation.isValid;
  }, [categoryValidator, contentValidator, titleValidator]);

  const handleInputChange = useCallback((
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    const newValue = value === '' ? null : value;

    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }));

    if (touchedFields.has(name)) {
      validateField(name, newValue);
    }
  }, [touchedFields, validateField]);

  const handleBlur = useCallback((
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const name = e.target.name;
    setTouchedFields(prev => new Set(prev).add(name));
    validateField(name, formData[name as keyof typeof formData]);
  }, [formData, validateField]);

  const buildNoteData = useCallback((
    baseData: { title: string }
  ): Partial<NoteInsert | NoteUpdate> => {
    const content = cleanOptionalField(formData.content);
    const category = cleanOptionalField(formData.category);

    const data: Partial<NoteInsert | NoteUpdate> = {
      ...baseData,
    };

    if (content !== null) data.content = content;
    if (category !== null) data.category = category;
    if (formData.priority !== null) {
      data.priority = formData.priority as 'Low' | 'Medium' | 'High' | null;
    }
    if (formData.id_manuscript !== null && formData.id_manuscript !== undefined) {
      data.id_manuscript = formData.id_manuscript;
    }

    return data;
  }, [formData]);

  const handleSubmit = useCallback(async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    let isValid = true;
    FIELDS_TO_VALIDATE.forEach(field => {
      setTouchedFields(prev => new Set(prev).add(field));
      const fieldValid = validateField(field, formData[field]);
      if (!fieldValid) isValid = false;
    });

    if (!isValid) {
      toast.error('Please fix the errors before submitting');
      setIsSubmitting(false);
      return;
    }

    try {
      const title = formData.title.trim();

      if (initialData) {
        const updateData = buildNoteData({ title }) as NoteUpdate;
        const { data, error } = await updateNote(initialData.id_note, updateData);
        if (error) throw error;
        if (data) {
          toast.success('Note updated successfully');
          onSuccess(data as Note);
        }
      } else {
        const { data: userData } = await supabase.auth.getUser();
        if (!userData.user) {
          toast.error('You must be logged in to create a note');
          setIsSubmitting(false);
          return;
        }
        const insertData = { ...buildNoteData({ title }), id_user: userData.user.id } as NoteInsert;
        const { data, error } = await insertNote(insertData);
        if (error) throw error;
        if (data) {
          const created = Array.isArray(data) ? data[0] : data;
          if (!created) return;
          toast.success('Note created successfully');
          onSuccess(created as Note);
        }
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, initialData, onSuccess, toast, validateField, buildNoteData]);

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
