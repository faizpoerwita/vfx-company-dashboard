import { z } from 'zod';

// Auth schemas
export const signUpSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['3D Artist', 'Animator', 'Compositor', 'VFX Supervisor', 'Producer']),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

export const signInSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

// Profile schemas
export const skillSchema = z.object({
  name: z.string().min(1, 'Skill name is required'),
  level: z.enum(['Beginner', 'Intermediate', 'Advanced', 'Expert']),
  yearsOfExperience: z.number().min(0, 'Years of experience must be non-negative'),
  certifications: z.array(z.string()).optional(),
});

export const workPreferenceSchema = z.object({
  name: z.string().min(1, 'Preference name is required'),
  selected: z.boolean(),
  priority: z.enum(['High', 'Medium', 'Low']).optional(),
});

export const profileSchema = z.object({
  fullName: z.string().min(1, 'Full name is required'),
  phone: z.string().regex(/^\+?[\d\s-]{10,}$/, 'Invalid phone number'),
  bio: z.string().min(10, 'Bio must be at least 10 characters'),
  skills: z.array(skillSchema).min(1, 'At least one skill is required'),
  workPreferences: z.array(workPreferenceSchema).min(1, 'At least one work preference is required'),
  learningInterests: z.string().optional(),
  portfolio: z.string().url('Invalid portfolio URL').optional(),
  availability: z.enum(['Full-time', 'Part-time', 'Contract', 'Freelance']),
  timezone: z.string(),
  languages: z.array(z.string()).min(1, 'At least one language is required'),
});

// Project schemas
export const projectSchema = z.object({
  title: z.string().min(1, 'Project title is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  startDate: z.string().datetime('Invalid start date'),
  endDate: z.string().datetime('Invalid end date'),
  status: z.enum(['Planning', 'In Progress', 'Review', 'Completed']),
  priority: z.enum(['Low', 'Medium', 'High']),
  assignees: z.array(z.string()).min(1, 'At least one assignee is required'),
  tags: z.array(z.string()).optional(),
  budget: z.number().positive('Budget must be positive').optional(),
  milestones: z.array(z.object({
    title: z.string(),
    dueDate: z.string().datetime(),
    completed: z.boolean(),
  })).optional(),
}).refine((data) => new Date(data.startDate) < new Date(data.endDate), {
  message: 'End date must be after start date',
  path: ['endDate'],
});

// Task schemas
export const taskSchema = z.object({
  title: z.string().min(1, 'Task title is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  assignee: z.string(),
  dueDate: z.string().datetime('Invalid due date'),
  status: z.enum(['Todo', 'In Progress', 'Review', 'Done']),
  priority: z.enum(['Low', 'Medium', 'High']),
  estimatedHours: z.number().min(0, 'Estimated hours must be non-negative'),
  dependencies: z.array(z.string()).optional(),
  attachments: z.array(z.string()).optional(),
});

// Comment schemas
export const commentSchema = z.object({
  content: z.string().min(1, 'Comment content is required'),
  attachments: z.array(z.string()).optional(),
  mentions: z.array(z.string()).optional(),
});

// Helper function to validate data against a schema
export const validateData = <T>(schema: z.ZodSchema<T>, data: unknown): { success: true; data: T } | { success: false; error: z.ZodError } => {
  try {
    const validatedData = schema.parse(data);
    return { success: true, data: validatedData };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error };
    }
    throw error;
  }
};
