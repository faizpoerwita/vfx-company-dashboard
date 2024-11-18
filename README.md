# VFX Company Dashboard

A modern dashboard for VFX companies to manage projects, teams, and resources.

## Features

- 📊 Real-time analytics and reporting
- 👥 Team management and collaboration
- 🎨 Project tracking and resource allocation
- 🔒 Secure authentication and authorization
- 📱 Responsive design for all devices

## Tech Stack

- **Frontend**: React + TypeScript + Vite
- **Styling**: TailwindCSS + Shadcn/ui
- **State Management**: React Context
- **Authentication**: JWT
- **Deployment**: Netlify
- **CI/CD**: GitHub Actions

## Development Setup

1. Clone the repository:
```bash
git clone https://github.com/faizpoerwita/vfx-company-dashboard.git
cd vfx-company-dashboard
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```env
VITE_API_URL=your_api_url
```

4. Start the development server:
```bash
npm run dev
```

## Build & Deployment

### Local Build
```bash
npm run build
npm run preview
```

### Netlify Deployment

The project is configured for automatic deployment to Netlify. Each push to the main branch triggers a new deployment.

#### Deployment Configuration

- **Build Command**: `npm run build`
- **Publish Directory**: `dist`
- **Node Version**: 18
- **Base Directory**: `/`

The deployment configuration is managed through `netlify.toml` and GitHub Actions workflow.

#### Environment Variables

Required environment variables in Netlify:
- `VITE_API_URL`: API endpoint URL

### Troubleshooting Deployment

If you encounter build failures:

1. Verify Node.js version:
   - The project uses Node.js 18
   - Check `netlify.toml` for correct Node version specification

2. Check build logs:
   - Review Netlify deployment logs for specific errors
   - Ensure all dependencies are properly installed

3. Environment variables:
   - Verify all required environment variables are set in Netlify
   - Check variable names match those in the code

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
