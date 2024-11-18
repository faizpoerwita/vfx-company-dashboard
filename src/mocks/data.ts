import { User, Project } from '@/types/api'

export const mockUsers: (User & { password: string })[] = [
  {
    id: '1',
    email: 'admin@vfx.com',
    password: 'admin123',
    firstName: 'Admin',
    lastName: 'User',
    role: 'admin',
    workPreference: 'office',
    department: 'Management',
    avatar: 'https://api.dicebear.com/6.x/avataaars/svg?seed=admin',
  },
  {
    id: '2',
    email: 'artist@vfx.com',
    password: 'artist123',
    firstName: 'Artist',
    lastName: 'User',
    role: 'artist',
    workPreference: 'hybrid',
    department: 'VFX',
    avatar: 'https://api.dicebear.com/6.x/avataaars/svg?seed=artist',
  },
]

export const mockProjects: Project[] = [
  {
    id: '1',
    name: 'Avatar 3',
    client: '20th Century Studios',
    status: 'in_progress',
    startDate: '2023-01-01',
    endDate: '2024-12-31',
    budget: 1000000,
    description: 'Third installment of the Avatar franchise',
    thumbnail: '/projects/avatar.jpg',
    tasks: [
      {
        id: '1',
        title: 'Character Rigging',
        status: 'in_progress',
        assignedTo: '2',
        dueDate: '2023-12-31',
        priority: 'high',
      },
    ],
    team: ['1', '2'],
  },
  {
    id: '2',
    name: 'Dune: Part Two',
    client: 'Warner Bros',
    status: 'pending',
    startDate: '2023-06-01',
    endDate: '2024-03-31',
    budget: 800000,
    description: 'Second part of Dune',
    thumbnail: '/projects/dune.jpg',
    tasks: [
      {
        id: '2',
        title: 'Environment Design',
        status: 'pending',
        assignedTo: '2',
        dueDate: '2024-01-31',
        priority: 'medium',
      },
    ],
    team: ['1', '2'],
  },
]
