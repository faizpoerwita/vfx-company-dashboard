import { http, HttpResponse } from 'msw'
import { mockUsers, mockProjects } from './data'

export const handlers = [
  // Auth endpoints
  http.post('/api/auth/login', async ({ request }) => {
    const { email, password } = await request.json()
    const user = mockUsers.find(u => u.email === email && u.password === password)

    if (!user) {
      return new HttpResponse(null, {
        status: 401,
        statusText: 'Unauthorized'
      })
    }

    return HttpResponse.json({
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role
      },
      token: 'mock-jwt-token'
    })
  }),

  // Projects endpoints
  http.get('/api/projects', () => {
    return HttpResponse.json(mockProjects)
  }),

  // Analytics endpoints
  http.get('/api/analytics/overview', (req, res, ctx) => {
    return HttpResponse.json({
      projectsCount: 5,
      activeProjects: 3,
      completedProjects: 2,
      teamMembers: 12,
      upcomingDeadlines: 3,
      recentActivities: [
        { id: '1', type: 'PROJECT_UPDATE', description: 'Project Alpha: New task added', timestamp: new Date().toISOString() },
        { id: '2', type: 'TASK_COMPLETED', description: 'Project Beta: Concept art completed', timestamp: new Date().toISOString() }
      ]
    })
  }),

  // Team endpoints
  http.get('/api/team', (req, res, ctx) => {
    return HttpResponse.json([
      {
        id: '1',
        name: 'Alice Johnson',
        role: '3D Artist',
        projects: ['1'],
        skills: ['Maya', 'ZBrush', 'Substance Painter']
      },
      {
        id: '2',
        name: 'Bob Smith',
        role: 'Animator',
        projects: ['1', '2'],
        skills: ['Maya', 'Motion Capture', 'Character Animation']
      }
    ])
  })
]
