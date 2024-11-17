import { http, HttpResponse } from 'msw';

export const handlers = [
  // Auth handlers
  http.post('/api/auth/signin', async ({ request }) => {
    const { email, password } = await request.json();

    if (email === 'test@example.com' && password === 'Password123!') {
      return HttpResponse.json({
        token: 'fake-jwt-token',
        refreshToken: 'fake-refresh-token',
        user: {
          id: '1',
          email: 'test@example.com',
          role: '3D Artist',
          fullName: 'Test User',
        },
      });
    }

    return new HttpResponse(null, {
      status: 401,
      statusText: 'Unauthorized',
    });
  }),

  http.post('/api/auth/signup', async ({ request }) => {
    const { email, password, role } = await request.json();

    if (email && password && role) {
      return HttpResponse.json({
        token: 'fake-jwt-token',
        refreshToken: 'fake-refresh-token',
        user: {
          id: '1',
          email,
          role,
        },
      });
    }

    return new HttpResponse(null, {
      status: 400,
      statusText: 'Bad Request',
    });
  }),

  // User handlers
  http.get('/api/user/profile', ({ request }) => {
    const authHeader = request.headers.get('Authorization');

    if (authHeader?.includes('fake-jwt-token')) {
      return HttpResponse.json({
        id: '1',
        email: 'test@example.com',
        role: '3D Artist',
        fullName: 'Test User',
        skills: [
          { name: '3D Modeling', level: 'Advanced' },
          { name: 'Texturing', level: 'Intermediate' },
        ],
        workPreferences: [
          { name: 'Bekerja dalam tim', selected: true },
          { name: 'Remote work', selected: true },
        ],
      });
    }

    return new HttpResponse(null, {
      status: 401,
      statusText: 'Unauthorized',
    });
  }),

  http.put('/api/user/profile', async ({ request }) => {
    const authHeader = request.headers.get('Authorization');
    const data = await request.json();

    if (authHeader?.includes('fake-jwt-token')) {
      return HttpResponse.json({
        ...data,
        id: '1',
        email: 'test@example.com',
      });
    }

    return new HttpResponse(null, {
      status: 401,
      statusText: 'Unauthorized',
    });
  }),

  // Project handlers
  http.get('/api/projects', ({ request }) => {
    const authHeader = request.headers.get('Authorization');

    if (authHeader?.includes('fake-jwt-token')) {
      return HttpResponse.json([
        {
          id: '1',
          title: 'Project 1',
          description: 'Test project description',
          startDate: '2024-02-01T00:00:00Z',
          endDate: '2024-03-01T00:00:00Z',
          status: 'In Progress',
          priority: 'High',
          assignees: ['1'],
        },
      ]);
    }

    return new HttpResponse(null, {
      status: 401,
      statusText: 'Unauthorized',
    });
  }),

  // Task handlers
  http.get('/api/tasks', ({ request }) => {
    const authHeader = request.headers.get('Authorization');

    if (authHeader?.includes('fake-jwt-token')) {
      return HttpResponse.json([
        {
          id: '1',
          title: 'Task 1',
          description: 'Test task description',
          projectId: '1',
          assigneeId: '1',
          dueDate: '2024-02-15T00:00:00Z',
          status: 'In Progress',
          priority: 'High',
        },
      ]);
    }

    return new HttpResponse(null, {
      status: 401,
      statusText: 'Unauthorized',
    });
  }),
];
