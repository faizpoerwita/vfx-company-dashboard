import { useState, useCallback } from 'react';
import { z } from 'zod';
import { validateData } from '@/utils/validation';

interface FormState<T> {
  values: T;
  errors: Partial<Record<keyof T, string>>;
  touched: Partial<Record<keyof T, boolean>>;
}

interface UseFormOptions<T> {
  initialValues: T;
  validationSchema?: z.ZodSchema<T>;
  onSubmit: (values: T) => Promise<void> | void;
}

export function useForm<T extends Record<string, any>>({
  initialValues,
  validationSchema,
  onSubmit,
}: UseFormOptions<T>) {
  const [formState, setFormState] = useState<FormState<T>>({
    values: initialValues,
    errors: {},
    touched: {},
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateField = useCallback(
    (name: keyof T, value: any) => {
      if (!validationSchema) return '';

      const fieldSchema = z.object({ [name]: validationSchema.shape[name] });
      const validation = validateData(fieldSchema, { [name]: value });

      if (!validation.success) {
        const error = validation.error.errors.find((err) => err.path[0] === name);
        return error?.message || '';
      }

      return '';
    },
    [validationSchema]
  );

  const setFieldValue = useCallback(
    (name: keyof T, value: any) => {
      setFormState((prev) => ({
        ...prev,
        values: { ...prev.values, [name]: value },
        errors: {
          ...prev.errors,
          [name]: validateField(name, value),
        },
        touched: { ...prev.touched, [name]: true },
      }));
    },
    [validateField]
  );

  const setFieldTouched = useCallback((name: keyof T, isTouched = true) => {
    setFormState((prev) => ({
      ...prev,
      touched: { ...prev.touched, [name]: isTouched },
    }));
  }, []);

  const validateForm = useCallback(() => {
    if (!validationSchema) return true;

    const validation = validateData(validationSchema, formState.values);
    if (!validation.success) {
      const errors: Partial<Record<keyof T, string>> = {};
      validation.error.errors.forEach((err) => {
        const field = err.path[0] as keyof T;
        errors[field] = err.message;
      });

      setFormState((prev) => ({
        ...prev,
        errors,
        touched: Object.keys(prev.values).reduce(
          (acc, key) => ({ ...acc, [key]: true }),
          {}
        ),
      }));

      return false;
    }

    return true;
  }, [validationSchema, formState.values]);

  const handleSubmit = useCallback(
    async (e?: React.FormEvent) => {
      if (e) {
        e.preventDefault();
      }

      if (!validateForm()) {
        return;
      }

      setIsSubmitting(true);
      try {
        await onSubmit(formState.values);
      } finally {
        setIsSubmitting(false);
      }
    },
    [formState.values, validateForm, onSubmit]
  );

  const resetForm = useCallback(() => {
    setFormState({
      values: initialValues,
      errors: {},
      touched: {},
    });
  }, [initialValues]);

  return {
    values: formState.values,
    errors: formState.errors,
    touched: formState.touched,
    isSubmitting,
    setFieldValue,
    setFieldTouched,
    handleSubmit,
    resetForm,
  };
}
