import { useToast } from "@/hooks/useToast";
import { updateCharacter, insertCharacter } from "@/lib/respository/charactersRepository";
import { supabase } from "@/lib/supabase";
import type { Character, CharacterInsert, CharacterUpdate } from "@/types";
import { useCallback, useState, useMemo } from "react";
import { validateRequired, validateMinLength, validateMaxLength, validateNumberRange } from "@/utils/validations";
import { useUnsavedChanges } from "@/hooks/useUnsavedChanges";
import { normalizeInputValue, cleanOptionalField } from "@/utils/formHelpers";

interface UseCharacterFormProps {
  initialData?: Character;
  onSuccess: (data: Character) => void;
}

export const useCharacterForm = ({ initialData, onSuccess }: UseCharacterFormProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<Omit<CharacterInsert, 'id_character'>>({
    name: initialData?.name ?? '',
    biography: initialData?.biography ?? null,
    role: initialData?.role ?? null,
    date_created: initialData?.date_created ?? new Date().toISOString(),
    flaw: initialData?.flaw ?? null,
    external_motivation: initialData?.external_motivation ?? null,
    internal_motivation: initialData?.internal_motivation ?? null,
    positive_traits: initialData?.positive_traits ?? null,
    negative_traits: initialData?.negative_traits ?? null,
    quirks_mannerisms: initialData?.quirks_mannerisms ?? null,
    fears_phobias: initialData?.fears_phobias ?? null,
    motto: initialData?.motto ?? null,
    birth: initialData?.birth ?? null,
    height: initialData?.height ?? null,
    weight: initialData?.weight ?? null,
    build: initialData?.build ?? null,
    hair_color: initialData?.hair_color ?? null,
    hair_style: initialData?.hair_style ?? null,
    eye_color: initialData?.eye_color ?? null,
    eye_shape: initialData?.eye_shape ?? null,
    id_manuscript: initialData?.id_manuscript ?? null,
    picture: initialData?.picture ?? null,
    age: initialData?.age ?? null,
    occupation: initialData?.occupation ?? null,
    relationship_status: initialData?.relationship_status ?? null,
    personality_type: initialData?.personality_type ?? null,
    scars: initialData?.scars ?? null,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [touchedFields, setTouchedFields] = useState<Set<string>>(new Set());

  // Detectar cambios sin guardar
  const hasUnsavedChanges = useMemo(() => {
    if (!initialData) {
      return formData.name.trim() !== '' ||
        formData.biography !== null ||
        formData.role !== null ||
        formData.age !== null;
    }
    return formData.name !== initialData.name ||
      formData.biography !== (initialData.biography ?? null) ||
      formData.role !== (initialData.role ?? null) ||
      formData.age !== (initialData.age ?? null) ||
      formData.id_manuscript !== (initialData.id_manuscript ?? null);
  }, [formData, initialData]);

  useUnsavedChanges({
    hasUnsavedChanges: hasUnsavedChanges && !isSubmitting,
    message: 'You have unsaved changes. Are you sure you want to leave?',
  });

  const validateField = useCallback((name: string, value: unknown) => {
    let validation: { isValid: boolean; error?: string } = { isValid: true };

    switch (name) {
      case 'name':
        validation = validateRequired(value as string, 'Name');
        if (validation.isValid) {
          validation = validateMinLength(value as string, 2, 'Name');
        }
        if (validation.isValid) {
          validation = validateMaxLength(value as string, 100, 'Name');
        }
        break;
      case 'age':
        if (value !== null && value !== undefined) {
          validation = validateNumberRange(value as number, 0, 150, 'Age');
        }
        break;
      case 'biography':
        if (value) {
          validation = validateMaxLength(value as string, 10000, 'Biography');
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
    const val = normalizeInputValue(e.target);

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

  const validateAge = useCallback((value: unknown): number | null => {
    if (value === undefined || value === null) return null;
    if (typeof value === 'number') {
      return isNaN(value) ? null : Math.max(0, Math.floor(value));
    }
    if (typeof value === 'string') {
      const parsed = parseInt(value, 10);
      return isNaN(parsed) ? null : Math.max(0, parsed);
    }
    return null;
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    // Marcar todos los campos como tocados y validar
    const fieldsToValidate = ['name', 'age', 'biography'];
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

      const age = validateAge(formData.age);
      const biography = cleanOptionalField(formData.biography);
      const role = cleanOptionalField(formData.role);
      const flaw = cleanOptionalField(formData.flaw);
      const externalMotivation = cleanOptionalField(formData.external_motivation);
      const internalMotivation = cleanOptionalField(formData.internal_motivation);
      const positiveTraits = cleanOptionalField(formData.positive_traits);
      const negativeTraits = cleanOptionalField(formData.negative_traits);
      const quirksMannerisms = cleanOptionalField(formData.quirks_mannerisms);
      const fearsPhobias = cleanOptionalField(formData.fears_phobias);
      const motto = cleanOptionalField(formData.motto);
      const birth = cleanOptionalField(formData.birth);
      const height = cleanOptionalField(formData.height);
      const weight = cleanOptionalField(formData.weight);
      const build = cleanOptionalField(formData.build);
      const hairColor = cleanOptionalField(formData.hair_color);
      const hairStyle = cleanOptionalField(formData.hair_style);
      const eyeColor = cleanOptionalField(formData.eye_color);
      const eyeShape = cleanOptionalField(formData.eye_shape);
      const picture = cleanOptionalField(formData.picture);
      const occupation = cleanOptionalField(formData.occupation);
      const relationshipStatus = cleanOptionalField(formData.relationship_status);
      const personalityType = cleanOptionalField(formData.personality_type);
      const scars = cleanOptionalField(formData.scars);

      if (initialData?.id_character) {
        // Update
        const updateData: CharacterUpdate = {
          name: formData.name.trim(),
        };

        if (age !== null) updateData.age = age;
        if (biography !== null) updateData.biography = biography;
        if (role !== null) updateData.role = role;
        if (flaw !== null) updateData.flaw = flaw;
        if (externalMotivation !== null) updateData.external_motivation = externalMotivation;
        if (internalMotivation !== null) updateData.internal_motivation = internalMotivation;
        if (positiveTraits !== null) updateData.positive_traits = positiveTraits;
        if (negativeTraits !== null) updateData.negative_traits = negativeTraits;
        if (quirksMannerisms !== null) updateData.quirks_mannerisms = quirksMannerisms;
        if (fearsPhobias !== null) updateData.fears_phobias = fearsPhobias;
        if (motto !== null) updateData.motto = motto;
        if (birth !== null) updateData.birth = birth;
        if (height !== null) updateData.height = height;
        if (weight !== null) updateData.weight = weight;
        if (build !== null) updateData.build = build;
        if (hairColor !== null) updateData.hair_color = hairColor;
        if (hairStyle !== null) updateData.hair_style = hairStyle;
        if (eyeColor !== null) updateData.eye_color = eyeColor;
        if (eyeShape !== null) updateData.eye_shape = eyeShape;
        if (picture !== null) updateData.picture = picture;
        if (occupation !== null) updateData.occupation = occupation;
        if (relationshipStatus !== null) updateData.relationship_status = relationshipStatus;
        if (personalityType !== null) updateData.personality_type = personalityType;
        if (scars !== null) updateData.scars = scars;
        if (formData.id_manuscript !== null && formData.id_manuscript !== undefined) {
          updateData.id_manuscript = formData.id_manuscript;
        }

        const { data, error } = await updateCharacter(initialData.id_character, updateData);
        if (error) throw error;
        if (data) {
          toast.success('Character updated successfully');
          onSuccess(data);
        }
      } else {
        // Insert
        const insertData: CharacterInsert = {
          name: formData.name.trim(),
        };

        if (age !== null) insertData.age = age;
        if (biography !== null) insertData.biography = biography;
        if (role !== null) insertData.role = role;
        if (flaw !== null) insertData.flaw = flaw;
        if (externalMotivation !== null) insertData.external_motivation = externalMotivation;
        if (internalMotivation !== null) insertData.internal_motivation = internalMotivation;
        if (positiveTraits !== null) insertData.positive_traits = positiveTraits;
        if (negativeTraits !== null) insertData.negative_traits = negativeTraits;
        if (quirksMannerisms !== null) insertData.quirks_mannerisms = quirksMannerisms;
        if (fearsPhobias !== null) insertData.fears_phobias = fearsPhobias;
        if (motto !== null) insertData.motto = motto;
        if (birth !== null) insertData.birth = birth;
        if (height !== null) insertData.height = height;
        if (weight !== null) insertData.weight = weight;
        if (build !== null) insertData.build = build;
        if (hairColor !== null) insertData.hair_color = hairColor;
        if (hairStyle !== null) insertData.hair_style = hairStyle;
        if (eyeColor !== null) insertData.eye_color = eyeColor;
        if (eyeShape !== null) insertData.eye_shape = eyeShape;
        if (picture !== null) insertData.picture = picture;
        if (occupation !== null) insertData.occupation = occupation;
        if (relationshipStatus !== null) insertData.relationship_status = relationshipStatus;
        if (personalityType !== null) insertData.personality_type = personalityType;
        if (scars !== null) insertData.scars = scars;
        if (formData.id_manuscript !== null && formData.id_manuscript !== undefined) {
          insertData.id_manuscript = formData.id_manuscript;
        }

        const { data, error } = await insertCharacter(insertData);
        if (error) throw error;
        if (data) {
          toast.success('Character created successfully');
          onSuccess(data);
        }
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error saving character';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, initialData, onSuccess, validateAge, toast, validateField]);

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
}