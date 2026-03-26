import { useState, useCallback, useMemo } from 'react';
import { supabase } from '@/lib/supabase';
import type { Chapter, ChapterInsert } from '@/types';
import type { ChapterUpdate } from '@/lib/repository/chaptersRepository';
import { insertChapter, updateChapter } from '@/lib/repository/chaptersRepository';
import { useToast } from '@/hooks/ui/useToast';
import {
  composeValidators,
  updateFieldErrors,
  validateMaxLength,
  validateMinLength,
  validatePositiveNumber,
  validateRequired,
  type ValidationResult,
} from '@/utils/validations';
import { useUnsavedChanges } from '@/hooks/ui/useUnsavedChanges';
import { normalizeInputValue, cleanOptionalField, validateWordCount } from '@/utils/formHelpers';

interface UseChapterFormProps {
  initialData?: Chapter;
  onSuccess: (data: Chapter) => void;
}

type ChapterFieldName = 'name_chapter' | 'word_count' | 'summary';

const FIELDS_TO_VALIDATE: ChapterFieldName[] = ['name_chapter', 'word_count', 'summary'];

export const useChapterForm = ({ initialData, onSuccess }: UseChapterFormProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<Omit<ChapterInsert, 'id_chapter'>>({
    name_chapter: initialData?.name_chapter ?? '',
    chapter_number: initialData?.chapter_number ?? null,
    date_created: initialData?.date_created ?? new Date().toISOString(),
    id_manuscript: initialData?.id_manuscript ?? null,
    id_user: initialData?.id_user ?? null,
    last_edit: initialData?.last_edit ?? null,
    status: initialData?.status ?? null,
    summary: initialData?.summary ?? null,
    word_count: initialData?.word_count ?? null,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<ChapterFieldName, string>>>({});
  const [touchedFields, setTouchedFields] = useState<Set<string>>(new Set());

  const hasUnsavedChanges = useMemo(() => {
    if (!initialData) {
      return (
        formData.name_chapter.trim() !== '' ||
        formData.summary !== null ||
        (formData.word_count ?? 0) > 0 ||
        formData.chapter_number !== null ||
        formData.status !== null
      );
    }
    return (
      formData.name_chapter !== initialData.name_chapter ||
      formData.summary !== (initialData.summary ?? null) ||
      formData.word_count !== (initialData.word_count ?? null) ||
      formData.chapter_number !== (initialData.chapter_number ?? null) ||
      formData.status !== (initialData.status ?? null) ||
      formData.id_manuscript !== (initialData.id_manuscript ?? null)
    );
  }, [formData, initialData]);

  useUnsavedChanges({
    hasUnsavedChanges: hasUnsavedChanges && !isSubmitting,
    message: 'You have unsaved changes. Are you sure you want to leave?',
  });

  const nameValidator = useCallback(
    (value: string): ValidationResult =>
      composeValidators<string>(
        (v) => validateRequired(v, 'Title'),
        (v) => validateMinLength(v, 2, 'Title'),
        (v) => validateMaxLength(v, 200, 'Title'),
      )(value),
    [],
  );

  const chapterSummaryValidator = useCallback(
    (value: string | null): ValidationResult =>
      value ? validateMaxLength(value, 2000, 'Summary') : { isValid: true },
    [],
  );

  const chapterWordCountValidator = useCallback(
    (value: number | null): ValidationResult => validatePositiveNumber(value, 'Word count'),
    [],
  );

  const validateField = useCallback((name: string, value: unknown): boolean => {
    let validation: ValidationResult = { isValid: true };

    if (name === 'name_chapter') {
      validation = nameValidator((value ?? '') as string);
    } else if (name === 'word_count') {
      validation = chapterWordCountValidator((value as number | null) ?? null);
    } else if (name === 'summary') {
      validation = chapterSummaryValidator((value as string | null) ?? null);
    }

    setFieldErrors(prev => updateFieldErrors(prev, name as ChapterFieldName, validation));

    return validation.isValid;
  }, [chapterSummaryValidator, chapterWordCountValidator, nameValidator]);

  const handleInputChange = useCallback((
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const name = e.target.name;
    const val = normalizeInputValue(e.target);

    setFormData(prev => ({ ...prev, [name]: val }));

    if (touchedFields.has(name)) {
      validateField(name, val);
    }
  }, [touchedFields, validateField]);

  const handleBlur = useCallback((
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const name = e.target.name;
    setTouchedFields(prev => new Set(prev).add(name));
    validateField(name, formData[name as keyof typeof formData]);
  }, [formData, validateField]);

  const buildChapterData = useCallback((
    baseData: { name_chapter: string; id_user?: string },
    isUpdate: boolean
  ): ChapterInsert | ChapterUpdate => {
    const wordCount = validateWordCount(formData.word_count);
    const summary = cleanOptionalField(formData.summary);
    const status = cleanOptionalField(formData.status);

    if (isUpdate) {
      const updateData: Partial<ChapterUpdate> = {
        name_chapter: baseData.name_chapter,
      };
      if (wordCount !== null && wordCount !== undefined) {
        updateData.word_count = wordCount;
      }
      if (summary !== null && summary !== undefined) {
        updateData.summary = summary;
      }
      if (status !== null && status !== undefined) {
        updateData.status = status;
      }
      if (formData.chapter_number !== null && formData.chapter_number !== undefined) {
        updateData.chapter_number = formData.chapter_number;
      }
      if (formData.id_manuscript !== null && formData.id_manuscript !== undefined) {
        updateData.id_manuscript = formData.id_manuscript;
      }
      return updateData as ChapterUpdate;
    }

    const insertData: ChapterInsert = {
      name_chapter: baseData.name_chapter,
      id_user: baseData.id_user!,
    };

    if (wordCount !== null) insertData.word_count = wordCount;
    if (summary !== null) insertData.summary = summary;
    if (status !== null) insertData.status = status;
    if (formData.chapter_number !== null && formData.chapter_number !== undefined) {
      insertData.chapter_number = formData.chapter_number;
    }
    if (formData.id_manuscript !== null && formData.id_manuscript !== undefined) {
      insertData.id_manuscript = formData.id_manuscript;
    }

    return insertData;
  }, [formData]);

  const handleSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    let isValid = true;
    FIELDS_TO_VALIDATE.forEach(field => {
      setTouchedFields(prev => new Set(prev).add(field));
      const fieldValid = validateField(field, formData[field]);
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

      if (initialData?.id_chapter) {
        const updateData = buildChapterData({
          name_chapter: formData.name_chapter.trim(),
        }, true) as ChapterUpdate;

        const { data, error } = await updateChapter(initialData.id_chapter, updateData);
        if (error) throw error;
        if (data) {
          toast.success('Chapter updated successfully');
          onSuccess(data as Chapter);
        }
      } else {
        const insertData = buildChapterData({
          name_chapter: formData.name_chapter.trim(),
          id_user: userData.user.id,
        }, false) as ChapterInsert;

        const { data, error } = await insertChapter(insertData);
        if (error) throw error;
        if (data) {
          toast.success('Chapter created successfully');
          onSuccess(data as Chapter);
        }
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error saving chapter';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, initialData, onSuccess, validateField, buildChapterData, toast]);

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
