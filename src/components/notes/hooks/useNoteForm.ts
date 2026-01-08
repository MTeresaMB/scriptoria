import { useState, useCallback, useMemo } from 'react';
import type { FormEvent } from 'react';
import { insertNote, updateNote, type NoteInsert, type NoteUpdate } from '@/lib/respository/notesRepository';
import { useToast } from '@/hooks/useToast';
import { validateRequired, validateMinLength, validateMaxLength } from '@/utils/validations';
import { useUnsavedChanges } from '@/hooks/useUnsavedChanges';
import { cleanOptionalField } from '@/utils/formHelpers';
import type { Note } from '@/types';

interface UseNoteFormProps {
  initialData?: Note | null;
  onSuccess: (data: Note) => void;
}

type FormFieldName = 'title' | 'content' | 'category';

const FIELDS_TO_VALIDATE: FormFieldName[] = ['title', 'content', 'category'];

const MAX_LENGTHS = {
  title: 200,
  content: 10000,
  category: 100,
} as const;

export const useNoteForm = ({ initialData, onSuccess }: UseNoteFormProps) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
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

  const validateField = useCallback((name: string, value: unknown): boolean => {
    let validation: { isValid: boolean; error?: string } = { isValid: true };

    switch (name) {
      case 'title': {
        validation = validateRequired(value as string, 'Title');
        if (validation.isValid) {
          validation = validateMinLength(value as string, 2, 'Title');
        }
        if (validation.isValid) {
          validation = validateMaxLength(value as string, MAX_LENGTHS.title, 'Title');
        }
        break;
      }
      case 'content': {
        if (value) {
          validation = validateMaxLength(value as string, MAX_LENGTHS.content, 'Content');
        }
        break;
      }
      case 'category': {
        if (value) {
          validation = validateMaxLength(value as string, MAX_LENGTHS.category, 'Category');
        }
        break;
      }
    }

    setFieldErrors(prev => {
      if (validation.isValid) {
        const rest = Object.fromEntries(
          Object.entries(prev).filter(([key]) => key !== name)
        );
        return rest;
      }
      return { ...prev, [name]: validation.error || 'Invalid value' };
    });

    return validation.isValid;
  }, []);

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

    // Validate all fields
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
        const insertData = buildNoteData({ title }) as NoteInsert;
        const { data, error } = await insertNote(insertData);
        if (error) throw error;
        if (data) {
          toast.success('Note created successfully');
          onSuccess(data[0] as Note);
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
