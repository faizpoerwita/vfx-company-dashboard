import { rest } from 'msw'

export const handlers = [
  // Auth endpoints
  rest.post('/api/auth/login', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        user: {
          id: '1',
          email: 'user@example.com',
          firstName: 'John',
          lastName: 'Doe',
          role: 'ADMIN'
        },
        token: 'mock-jwt-token'
      })
    )
  }),

  // Projects endpoints
  rest.get('/api/projects', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json([
        {
          id: '1',
          name: 'Project Alpha',
          status: 'IN_PROGRESS',
          deadline: '2024-03-01',
          team: ['1', '2', '3'],
          tasks: [
            { id: '1', title: 'Model Creation', status: 'COMPLETED' },
            { id: '2', title: 'Texturing', status: 'IN_PROGRESS' },
            { id: '3', title: 'Animation', status: 'PENDING' }
          ]
        },
        {
          id: '2',
          name: 'Project Beta',
          status: 'PLANNING',
          deadline: '2024-04-15',
          team: ['4', '5'],
          tasks: [
            { id: '4', title: 'Concept Art', status: 'IN_PROGRESS' },
            { id: '5', title: 'Storyboard', status: 'PENDING' }
          ]
        }
      ])
    )
  }),

  // Analytics endpoints
  rest.get('/api/analytics/overview', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
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
    )
  }),

  // Team endpoints
  rest.get('/api/team', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json([
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
    )
  })
]
