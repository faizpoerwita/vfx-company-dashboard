import { ROLES } from '@/constants/roles';

export type RoleType = typeof ROLES[keyof typeof ROLES];

export type SkillLevel = 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';

export interface Skill {
  name: string;
  level: SkillLevel;
}

export interface WorkPreference {
  name: string;
  value: string;
}

export interface User {
  id: string;
  email: string;
  role: RoleType;
  firstName?: string;
  lastName?: string;
  experienceLevel?: SkillLevel;
  skills?: Skill[];
  workPreferences?: WorkPreference[];
  dislikedWorkAreas?: string[];
  portfolio?: string;
  bio?: string;
  onboardingCompleted: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface UserProfile extends Omit<User, 'id' | 'email' | 'role'> {
  firstName: string;
  lastName: string;
  experienceLevel: SkillLevel;
  skills: Skill[];
  workPreferences: WorkPreference[];
  dislikedWorkAreas: string[];
  bio: string;
}

export interface SignupData {
  email: string;
  password: string;
  role: RoleType;
}

export interface SigninData {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  token?: string;
  user?: User;
  message?: string;
}
