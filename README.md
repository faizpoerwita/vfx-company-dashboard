# VFX Company Dashboard

A modern dashboard application for managing VFX company operations, projects, and resources.

## Features
- Secure authentication with signin/signup
- Project tracking and management
- Resource allocation
- Task management
- Performance metrics
- Timeline visualization
- Role-based access control

## Setup
1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
# Create .env file
cp .env.example .env

# Fill in required variables:
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
```

3. Run the development server:
```bash
npm run dev
```

## Tech Stack
- React with TypeScript
- Express.js backend
- MongoDB database
- JWT authentication
- Tailwind CSS
- Chart.js for visualizations
- React Router for navigation

## Documentation
For detailed documentation including API endpoints, authentication flows, and naming conventions, see [GUIDE.md](./GUIDE.md).
