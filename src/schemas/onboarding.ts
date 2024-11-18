import { z } from 'zod';
import { ROLES } from '@/constants/roles';
import { WORK_PREFERENCES, dislikedWorkAreas } from '@/constants/preferences';

// Basic validation messages in Indonesian
const messages = {
  required: 'Wajib diisi',
  minLength: (field: string, length: number) => `${field} minimal ${length} karakter`,
  maxLength: (field: string, length: number) => `${field} maksimal ${length} karakter`,
  invalidUrl: 'URL tidak valid',
  minItems: (field: string, count: number) => `Pilih minimal ${count} ${field}`,
  invalidOption: (field: string) => `Pilihan ${field} tidak valid`
} as const;

// Skill level validation
export const skillLevelSchema = z.enum(['Beginner', 'Intermediate', 'Advanced', 'Expert'] as const, {
  required_error: messages.required,
  invalid_type_error: messages.invalidOption('level keahlian')
});

// Work preference validation
export const workPreferenceSchema = z.array(z.string())
  .min(1, messages.minItems('preferensi kerja', 1))
  .refine(
    (items) => items.every(item => WORK_PREFERENCES.includes(item as any)),
    messages.invalidOption('preferensi kerja')
  );

// Disliked work areas validation
export const dislikedWorkAreasSchema = z.array(z.string())
  .min(1, messages.minItems('area yang tidak disukai', 1))
  .refine(
    (items) => items.every(item => dislikedWorkAreas.includes(item as any)),
    messages.invalidOption('area yang tidak disukai')
  );

// Skills validation
export const skillSchema = z.object({
  name: z.string().min(1, messages.required),
  level: skillLevelSchema
});

// Complete onboarding schema
export const onboardingSchema = z.object({
  firstName: z.string()
    .min(2, messages.minLength('Nama depan', 2))
    .max(50, messages.maxLength('Nama depan', 50)),
    
  lastName: z.string()
    .min(2, messages.minLength('Nama belakang', 2))
    .max(50, messages.maxLength('Nama belakang', 50)),
    
  role: z.enum(Object.values(ROLES) as [string, ...string[]], {
    required_error: messages.required,
    invalid_type_error: messages.invalidOption('role')
  }),
  
  skills: z.array(skillSchema)
    .min(1, messages.minItems('keahlian', 1)),
    
  experienceLevel: skillLevelSchema,
  
  workPreferences: workPreferenceSchema,
  
  dislikedWorkAreas: dislikedWorkAreasSchema,
  
  portfolio: z.string()
    .url(messages.invalidUrl)
    .optional()
    .or(z.literal('')),
    
  bio: z.string()
    .min(10, messages.minLength('Bio', 10))
    .max(500, messages.maxLength('Bio', 500))
});

// Type inference
export type OnboardingFormData = z.infer<typeof onboardingSchema>;
