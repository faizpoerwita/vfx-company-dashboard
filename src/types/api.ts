import { User } from '@/components/ui/types'

export type ApiResponse<T = unknown> = {
  success: boolean
  data?: T
  error?: {
    message: string
    code?: string
  }
}

export type AuthResponse = ApiResponse<{
  user: User
  token: string
}>

export type SignInData = {
  email: string
  password: string
}

export type SignUpData = {
  email: string
  password: string
  firstName: string
  lastName: string
}

export type Project = {
  id: string
  name: string
  description: string
  status: 'PLANNING' | 'IN_PROGRESS' | 'REVIEW' | 'COMPLETED'
  startDate: string
  endDate?: string
  client: string
  budget: number
  team: User[]
  tasks: Task[]
  progress: number
}

export type Task = {
  id: string
  title: string
  description: string
  status: 'TODO' | 'IN_PROGRESS' | 'REVIEW' | 'COMPLETED'
  assignee?: User
  dueDate: string
  priority: 'LOW' | 'MEDIUM' | 'HIGH'
  tags: string[]
  attachments: Attachment[]
}

export type Attachment = {
  id: string
  name: string
  url: string
  type: string
  size: number
  uploadedBy: User
  uploadedAt: string
}

export type Analytics = {
  projectsCount: number
  activeProjects: number
  completedProjects: number
  totalBudget: number
  teamSize: number
  tasksByStatus: Record<'todo' | 'inProgress' | 'review' | 'completed', number>
  projectProgress: Array<{
    projectId: string
    projectName: string
    progress: number
  }>
  recentActivity: Array<{
    id: string
    type: 'PROJECT_CREATED' | 'TASK_COMPLETED' | 'MEMBER_JOINED' | 'PROJECT_COMPLETED'
    description: string
    timestamp: string
    user: User
  }>
}
