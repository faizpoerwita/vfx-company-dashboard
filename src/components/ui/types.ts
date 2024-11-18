import { ReactNode } from 'react'

export interface ButtonProps {
  children: ReactNode
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
  className?: string
  onClick?: () => void
}

export interface CardProps {
  children: ReactNode
  className?: string
}

export interface SparklesProps {
  children?: ReactNode
  className?: string
  id?: string
  background?: string
  minSize?: number
  maxSize?: number
  speed?: number
  particleColor?: string
}

export type WorkPreference = {
  name: string
  value: string
}

export type User = {
  id: string
  email: string
  firstName: string
  lastName: string
  role: 'ADMIN' | 'MANAGER' | 'ARTIST' | 'CLIENT' | 'GUEST'
  onboardingCompleted?: boolean
  skills?: Array<{ name: string; level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert' }>
  workPreferences?: WorkPreference[]
  experienceLevel?: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert'
  portfolio?: string
  bio?: string
  dislikedWorkAreas?: string[]
}
