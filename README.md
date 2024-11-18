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

## 🚀 Deployment

### Prerequisites
1. [Netlify Account](https://www.netlify.com/)
2. [MongoDB Atlas Account](https://www.mongodb.com/cloud/atlas)
3. Git repository (GitHub, GitLab, or Bitbucket)

### Environment Variables
Create the following environment variables in Netlify:
```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
NODE_ENV=production
FRONTEND_URL=https://vfx-company-dashboard.netlify.app
```

### Deployment Steps

1. **Database Setup**
   - Create a MongoDB Atlas cluster
   - Get your connection string
   - Add IP address 0.0.0.0/0 to network access (or Netlify's IPs)

2. **Frontend & Backend Deployment**
   - Connect your Git repository to Netlify
   - Configure build settings:
     - Build command: `npm run build`
     - Publish directory: `dist`
   - Add environment variables in Netlify settings
   - Deploy!

3. **Post-Deployment**
   - Set up custom domain (optional)
   - Configure SSL certificate
   - Test all API endpoints
   - Monitor logs for any issues

### Continuous Deployment
The app is set up for continuous deployment:
1. Push changes to main branch
2. Netlify automatically builds and deploys
3. Both frontend and serverless functions are updated

### Monitoring
- Use Netlify's built-in analytics
- Monitor MongoDB Atlas metrics
- Check function execution logs
- Set up alerts for errors
