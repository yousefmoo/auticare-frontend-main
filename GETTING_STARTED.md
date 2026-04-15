# 🚀 AutiCare - Getting Started Guide

## ✅ What's Been Created

Your complete AutiCare frontend is now ready with:

### 📁 **41 Files Created**
- ✅ Configuration files (package.json, vite.config.js, tailwind.config.js)
- ✅ Core app files (main.jsx, App.jsx, config.js)
- ✅ API client setup with Axios
- ✅ Zustand stores (auth, UI)
- ✅ Protected routing system
- ✅ Layout components (Navbar, Sidebar, DashboardLayout)
- ✅ Authentication (Login page with mock data)
- ✅ Doctor dashboard & routes (4 components)
- ✅ Therapist dashboard & routes (3 components)
- ✅ Parent dashboard & routes (4 components)
- ✅ Shared components (3 components)
- ✅ Utility functions & helpers
- ✅ Tailwind CSS with custom styles

---

## 🎯 Step-by-Step Setup

### Step 1: Install Dependencies

```bash
cd auticare-frontend
npm install
```

This will install all dependencies (React, Vite, Tailwind, Zustand, React Query, etc.)

### Step 2: Create Environment File

```bash
cp .env.example .env
```

The `.env` file is pre-configured for local development.

### Step 3: Start Development Server

```bash
npm run dev
```

The app will open at: **http://localhost:3000**

---

## 🔐 Login with Demo Accounts

The app has **mock authentication** with 3 demo accounts:

### Doctor Account
- **Email**: `doctor@auticare.com`
- **Password**: `doctor123`
- **Access**: Patient management, treatment plans, reports

### Therapist Account
- **Email**: `therapist@auticare.com`
- **Password**: `therapist123`
- **Access**: Weekly plans, session notes, parent messaging

### Parent Account
- **Email**: `parent@auticare.com`
- **Password**: `parent123`
- **Access**: Daily feedback, statistics, educational resources

---

## 🧭 Navigation Guide

### After Login, Each Role Sees Different Pages:

#### **Doctor Dashboard** (`/doctor/dashboard`)
- Overview statistics
- Recent patients
- Upcoming assessments
- Navigation: Dashboard | Patients | Create Plan | Reports | Profile

#### **Therapist Dashboard** (`/therapist/dashboard`)
- Today's sessions
- Active plans
- Patient count
- Messages
- Navigation: Dashboard | Weekly Plan | Session Notes | Profile

#### **Parent Dashboard** (`/parent/dashboard`)
- Completed/pending activities
- Weekly progress
- Today's activities
- Navigation: Dashboard | Daily Log | Statistics | Resources | Profile

---

## 📂 Project Structure Overview

```
auticare-frontend/
│
├── src/
│   ├── api/                 # API client & endpoints
│   │   ├── client.js        # Axios setup with interceptors
│   │   └── auth.api.js      # Authentication API calls
│   │
│   ├── components/
│   │   ├── layout/          # Navbar, Sidebar, DashboardLayout
│   │   └── shared/          # ProtectedRoute, LoadingSpinner, etc.
│   │
│   ├── features/            # Feature modules by role
│   │   ├── auth/            # Login component
│   │   ├── doctor/          # Doctor features
│   │   ├── therapist/       # Therapist features
│   │   ├── parent/          # Parent features
│   │   └── shared/          # Shared across roles
│   │
│   ├── store/               # Zustand state management
│   │   ├── authStore.js     # User auth & permissions
│   │   └── uiStore.js       # UI state (sidebar, modals, etc.)
│   │
│   ├── routes/              # Routing configuration
│   │   └── AppRoutes.jsx    # All app routes
│   │
│   ├── utils/               # Helper functions
│   │   ├── constants.js     # App constants
│   │   └── helpers.js       # Utility functions
│   │
│   └── styles/              # Global CSS & Tailwind
│       └── index.css        # Tailwind + custom styles
│
├── package.json             # Dependencies
├── vite.config.js           # Vite configuration
└── tailwind.config.js       # Tailwind customization
```

---

## 🎨 Customization

### Change Colors

Edit `tailwind.config.js`:

```javascript
colors: {
  primary: {
    600: '#YOUR_COLOR', // Main primary color
  },
  secondary: {
    600: '#YOUR_COLOR', // Secondary color
  }
}
```

### Add New Page

1. Create component in appropriate `features/` folder
2. Add route in `src/routes/AppRoutes.jsx`
3. Add navigation link in `src/components/layout/Sidebar.jsx`

---

## 🔄 Current Status & Next Steps

### ✅ **Phase 1: Foundation - COMPLETE**
- [x] Project setup
- [x] Authentication system
- [x] Role-based routing
- [x] Basic layouts
- [x] Mock data

### 🚧 **Phase 2: Doctor Features - Ready to Build**
- [ ] Patient management (CRUD)
- [ ] Treatment plan creation form
- [ ] Progress reports with charts
- [ ] Assessment scheduling

### 🚧 **Phase 3: Therapist Features - Ready to Build**
- [ ] Session notes form
- [ ] Weekly plan detailed view
- [ ] Parent messaging interface
- [ ] Activity guidance system

### 🚧 **Phase 4: Parent Features - Ready to Build**
- [ ] Daily feedback logging form
- [ ] Progress charts (Recharts)
- [ ] Educational resource library
- [ ] Therapist chat

---

## 🔌 Connecting to Your Backend

Currently using **mock data**. To connect to your Node.js backend:

### 1. Update `.env`

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

### 2. Enable Real API Calls

In `src/api/auth.api.js`, uncomment the real API call:

```javascript
export const login = async (email, password) => {
  // Comment out the mock return
  // return new Promise(...)
  
  // Uncomment this:
  return apiClient.post(API_ENDPOINTS.AUTH.LOGIN, { email, password })
}
```

### 3. Replace Mock Users

Remove mock authentication logic from `src/store/authStore.js` and use JWT tokens from your backend.

---

## 🛠️ Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

---

## 📊 State Management

### Auth Store (`useAuthStore`)

```javascript
import { useAuthStore } from './store/authStore'

const { user, role, login, logout, isAuthenticated } = useAuthStore()
```

### UI Store (`useUIStore`)

```javascript
import { useUIStore } from './store/uiStore'

const { toggleSidebar, addNotification, addToast } = useUIStore()
```

---

## 🎯 Key Features

### 1. **Role-Based Access Control**
- Routes automatically protect based on user role
- Unauthorized access redirects to `/unauthorized`

### 2. **Responsive Design**
- Mobile-first approach
- Tailwind CSS utilities
- Collapsible sidebar

### 3. **State Management**
- Zustand for global state (lightweight Redux alternative)
- TanStack Query ready for API calls (when you connect backend)

### 4. **Modern Styling**
- Tailwind CSS with custom design system
- Pre-built utility classes
- Custom color scheme

---

## 🐛 Troubleshooting

### Port Already in Use

```bash
# Kill process on port 3000
npx kill-port 3000

# Or change port in vite.config.js
```

### Dependencies Not Installing

```bash
# Clear npm cache
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### Module Not Found Errors

Make sure you're in the correct directory:

```bash
cd /home/claude/auticare-frontend
npm install
```

---

## 📝 Important Notes

1. **Mock Data**: Authentication is currently using mock data stored in `authStore.js`
2. **Protected Routes**: All dashboard routes require authentication
3. **Role Switching**: Logout and login with different accounts to see role-based views
4. **Placeholders**: Most feature components show placeholders - implement them phase by phase

---

## 🎉 You're Ready to Build!

1. ✅ Run `npm install`
2. ✅ Run `npm run dev`
3. ✅ Login with any demo account
4. ✅ Explore the different role dashboards
5. ✅ Start building features phase by phase!

---

## 📞 Support

- Check `README.md` for full documentation
- Review code comments for implementation details
- All components have clear structure to guide development

**Happy Coding! 🚀**
