# VFX Company Dashboard - Technical Guide

## 🏗 Project Architecture

```
vfx-company-dashboard/
├── backend/                 # Express.js backend
│   └── src/
│       ├── models/         # MongoDB models
│       ├── routes/         # API routes
│       └── middleware/     # Custom middleware
├── src/                    # React frontend
│   ├── components/         # UI components
│   ├── contexts/          # React contexts
│   ├── hooks/             # Custom hooks
│   ├── pages/             # Page components
│   └── utils/             # Utility functions
```

## 📝 Naming Conventions

### Authentication
- Use "signin" (not "login") for user authentication
- Use "signup" (not "register") for new user registration
- Keep naming consistent across:
  * Route names (e.g., `/auth/signin`, `/auth/signup`)
  * Component names (e.g., `Signin.tsx`, `Signup.tsx`)
  * Function names (e.g., `signin()`, `signup()`)
  * Variable names (e.g., `signinData`, `signupForm`)
  * Messages and UI text

## 🔐 Authentication System

### Backend Routes (`/auth/`)

```javascript
POST /auth/signup     // New user registration
POST /auth/signin     // User authentication
GET  /auth/me         // Get current user
GET  /auth/profile    // Get user profile
PUT  /auth/profile    // Update user profile
```

### User Model Schema

```javascript
{
  firstName: String,
  lastName: String,
  email: String,          // Required, unique
  password: String,       // Required, hashed
  role: String,          // Required, enum
  phone: String,
  bio: String,
  skills: [{
    name: String,
    level: String        // enum: ['Beginner'...'Expert']
  }],
  workPreferences: [{
    name: String,
    value: String
  }],
  learningInterests: String,
  portfolio: String,
  onboardingCompleted: Boolean,
  lastLogin: Date
}
```

## 🛡 Security Features

### Password Security
```javascript
// Password hashing middleware
userSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});
```

### JWT Authentication
```javascript
const token = jwt.sign(
  { userId: user._id, role: user.role },
  process.env.JWT_SECRET,
  { expiresIn: '24h' }
);
```

### CORS Configuration
```javascript
app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  credentials: true,
  optionsSuccessStatus: 200
}));
```

## 🎨 Frontend Implementation

### Authentication Context
```typescript
interface AuthContextType {
  user: User | null;
  signin: (data: SigninData) => Promise<void>;
  signup: (data: SignupData) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: any) => Promise<void>;
  isAuthenticated: boolean;
}
```

### Token Management
```typescript
// Store token
localStorage.setItem('token', token);

// Retrieve token
const token = localStorage.getItem('token');

// Clear token
localStorage.removeItem('token');
```

## 👥 Role-Based Access Control

```typescript
const ROLES = ['3D Artist', 'Animator', 'Compositor', 'VFX Supervisor', 'Producer'];

const rolePermissions: Record<Role, Permission[]> = {
  ADMIN: Object.values(Permissions),
  MANAGER: [
    Permissions.CREATE_PROJECT,
    Permissions.EDIT_PROJECT,
    Permissions.VIEW_PROJECT
  ],
  ARTIST: [Permissions.VIEW_PROJECT],
  CLIENT: [Permissions.VIEW_PROJECT],
  GUEST: []
};
```

## 🚨 Error Handling

### Backend Error Handling
```javascript
app.use((err, req, res, next) => {
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      message: 'Validation Error',
      errors: Object.values(err.errors).map(e => e.message)
    });
  }
  // Handle other errors
  res.status(500).json({
    message: 'Terjadi kesalahan server',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});
```

### Frontend Error Handling
```typescript
try {
  // API calls
} catch (error) {
  console.error('Error:', error);
  toast.error(error.message || 'An error occurred');
}
```

## 🌐 API Integration

```typescript
const BASE_URL = 'http://localhost:5000';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});
```

## ✅ Data Validation

### Backend Mongoose Validation
```javascript
email: {
  type: String,
  required: [true, 'Email harus diisi'],
  validate: {
    validator: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
    message: 'Format email tidak valid'
  }
}
```

### Frontend Zod Validation
```typescript
const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Must contain uppercase')
  .regex(/[0-9]/, 'Must contain number');
```

## 🔧 Environment Configuration

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/vfx-dashboard
JWT_SECRET=your-secret-key
NODE_ENV=development
```

## 📦 Dependencies

### Frontend
- React
- Axios
- React-Hot-Toast
- Zod
- TypeScript

### Backend
- Express
- Mongoose
- JWT
- Bcrypt

### Development
- Vite
- TypeScript

## 🚀 Best Practices

1. Security
   - Password hashing
   - JWT authentication
   - CORS protection
   - Input validation

2. Error Handling
   - Comprehensive error messages
   - Error logging
   - User-friendly error displays

3. Code Organization
   - Modular structure
   - Clear separation of concerns
   - TypeScript for type safety

4. Performance
   - API request caching
   - Optimized database queries
   - Efficient state management

## 🔄 Future Improvements

1. Authentication Enhancements
   - Token refresh mechanism
   - Remember me functionality
   - Multi-factor authentication

2. Security Improvements
   - Rate limiting
   - Enhanced logging
   - Security headers
   - CSRF protection

3. User Experience
   - Better error messages
   - Loading states
   - Offline support

4. Development Experience
   - Automated testing
   - CI/CD pipeline
   - Documentation generation

## 📝 Naming Conventions

### Authentication Routes
- Use "signin" instead of "login"
- Use "signup" instead of "register"
- All authentication routes should follow this convention in:
  - URLs (e.g., `/auth/signin`, `/auth/signup`)
  - Component names (e.g., `Signin.tsx`, `Signup.tsx`)
  - Function names (e.g., `signin()`, `signup()`)
  - Variable names (e.g., `signinForm`, `signupData`)

### File Structure Example
```
src/
├── pages/
│   ├── Signin.tsx         # ✅ Correct
│   ├── Signup.tsx         # ✅ Correct
│   ├── Login.tsx          # ❌ Incorrect
│   └── Register.tsx       # ❌ Incorrect
└── components/
    └── auth/
        ├── SigninForm.tsx # ✅ Correct
        └── SignupForm.tsx # ✅ Correct
```

### Frontend Authentication

```typescript
// API calls
api.signin(email, password)    // ✅ Correct
api.signup(userData)           // ✅ Correct
api.login(email, password)     // ❌ Incorrect
api.register(userData)         // ❌ Incorrect

// Route paths
/signin    // ✅ Correct
/signup    // ✅ Correct
/login     // ❌ Incorrect
/register  // ❌ Incorrect

```

## 🔍 Analytics System

### API Endpoint Conventions

All analytics endpoints follow these conventions:
- Base path: `/api/analytics/`
- HTTP Method: GET for data retrieval
- Authentication: Required via auth middleware
- Response format:
  ```javascript
  {
    success: boolean,
    data: any,
    error?: string
  }
  ```

### Analytics Endpoints

```javascript
GET /api/analytics/role-distribution      // Get user count by role
GET /api/analytics/users-by-role/:role    // Get users in specific role
GET /api/analytics/experience-distribution // Get experience levels
GET /api/analytics/skills-distribution    // Get skills breakdown
GET /api/analytics/work-preferences       // Get work preference stats
GET /api/analytics/disliked-areas         // Get disliked work areas
GET /api/analytics/department-distribution // Get department stats
```

### URL Parameter Encoding
- All URL parameters must be properly encoded using `encodeURIComponent()`
- Special characters in role names and other parameters are safely handled
- Example:
  ```javascript
  // Correct
  `/api/analytics/users-by-role/${encodeURIComponent('Senior VFX Artist')}`
  
  // Incorrect
  `/api/analytics/users-by-role/Senior VFX Artist`
  ```

### Error Handling
- All endpoints use consistent error response format
- HTTP status codes are properly set
- Detailed error messages in development
- Sanitized error messages in production

## 📊 Analytics Page

### Component Structure
```typescript
// src/pages/Analytics.tsx
const Analytics = () => {
  // Core analytics data and state management
  const { data, loading, error } = useAnalytics();

  return (
    <div className="min-h-screen bg-black">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        {/* Stats and Charts */}
      </div>
    </div>
  );
};
```

### Data Visualization
- Uses Chart.js for all visualizations
- Implements four main chart types:
  * Doughnut chart for role distribution
  * Bar chart for experience levels
  * Line chart for skills distribution
  * Bar chart for work preferences
- Each chart is wrapped in `BackgroundGradient` for consistent styling
- Responsive layout with grid system
- Loading states and error handling included

### Best Practices
- Clean, distraction-free UI
- Focus on data readability
- Consistent color scheme
- Responsive design
- Comprehensive error states
- Loading indicators
- Empty state handling

## 🎯 Component Analysis

### Projects Section
```typescript
interface Project {
  title: string;
  description: string;
  priority: 'Critical' | 'High' | 'Medium';
  status: 'Pre-Production' | 'In Production' | 'Post-Production';
  completion: number;
  efficiency: {
    timeline: number;
    resources: number;
    milestones: number;
    overall: number;
  };
  teamSize: number;
  deadline: string;
  budget: {
    allocated: number;
    spent: number;
  };
  client: string;
}
```

Features:
- Detailed project tracking
- Budget monitoring
- Team size management
- Efficiency metrics
- Priority-based organization
- Status tracking with visual indicators
- Timeline management
- Client association

### UI Components

#### Background Gradient
- Interactive mouse position tracking
- Dynamic opacity transitions
- Responsive gradient movement
- Custom container styling
- Animation controls
- Performance optimized animations
- Event listener management with cleanup

#### Analytics Dashboard
Chart Types:
- Doughnut charts for project distribution
- Bar charts for resource utilization
- Line charts for trends

```typescript
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  PointElement,
  LineElement,
  Filler
);
```

Performance Metrics:
```typescript
const performanceMetrics = [
  {
    title: "Project Velocity",
    description: "Average completion time reduced by 15%",
    icon: <IconTrendingUp />
  },
  {
    title: "Resource Efficiency",
    description: "Resource utilization improved by 22%",
    icon: <IconRocket />
  }
  // ...more metrics
];
```

### Resource Management
```typescript
const resourceUtilization = {
  labels: ['Rendering', '3D Modeling', 'Compositing', 'Animation', 'Texturing'],
  datasets: [{
    label: 'Resource Usage',
    data: [85, 65, 45, 75, 55],
    backgroundColor: [/* custom colors */],
  }]
};
```

Features:
- VFX process tracking
- Resource allocation monitoring
- Utilization percentages
- Visual representation
- Performance metrics

### Project Management Features
Status Tracking:
- Pre-Production
- In Production
- Post-Production

Priority Levels:
- Critical
- High
- Medium

Budget Management:
- Allocation tracking
- Spent amount monitoring
- Budget efficiency calculations

### Technical Optimizations
- useRef for DOM references
- useEffect for side effects
- Memoization with useMemo
- Event listener cleanup
- Conditional rendering
- Lazy loading of charts
- Type-safe interfaces
- Custom hooks for business logic
- Performance-optimized animations

### Interactive Features
- Mouse tracking for gradients
- Chart interactions
- Tooltip information
- Dynamic updates
- Real-time data visualization
- Smooth animations
- Responsive design adaptations

### Advanced UI Components
MovingBorder:
- Animated border effects
- Customizable animation speed
- Responsive design

StatsCard:
- Dynamic data display
- Hover effects
- Icon integration

BackgroundGradient:
- Interactive gradient effects
- Mouse tracking
- Smooth animations
- Custom container support
