# 🌟 AutiCare Frontend

**An integrated web platform designed to support children with Autism Spectrum Disorder (ASD)** by connecting doctors, therapists, and parents in a collaborative ecosystem.

---

## 🎯 Project Overview

AutiCare addresses fragmented communication in ASD care. The platform enables:

- ✅ **Unified Platform** for Doctors, Therapists, and Parents
- ✅ **Daily Feedback Logging** by parents
- ✅ **Immediate Recommendations** from therapists
- ✅ **Consolidated Reports** for doctors
- ✅ **Educational Resources** for parents
- ✅ **Visual Statistics** to track progress

---

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev

# 3. Open browser at http://localhost:3000
```

### 🔐 Demo Login Credentials

| Role | Email | Password |
|------|-------|----------|
| **Doctor** | doctor@auticare.com | password123 |
| **Therapist** | therapist@auticare.com | password123 |
| **Parent** | parent@auticare.com | password123 |

---

## 💻 Tech Stack

```
React 18 + Vite           → Fast, modern development
Tailwind CSS              → Utility-first styling
Zustand                   → Lightweight state management
TanStack Query            → Powerful API state management
React Router v6           → Routing with role-based access
React Hook Form + Zod     → Form validation
Recharts                  → Data visualization
Lucide React              → Beautiful icons
```

---

## 📁 Project Structure

```
src/
├── api/              # API calls & Axios client
├── components/
│   ├── ui/          # Reusable UI components
│   ├── layout/      # Navbar, Sidebar, Layout
│   └── shared/      # LoadingSpinner, ProtectedRoute
├── features/         # Feature modules by role
│   ├── auth/        # Login, Register
│   ├── doctor/      # Doctor features
│   ├── therapist/   # Therapist features
│   └── parent/      # Parent features
├── hooks/            # Custom React hooks
├── routes/           # Route configuration
├── store/            # Zustand stores (auth, UI)
├── utils/            # Helpers, validators, formatters
└── styles/           # Global Tailwind styles
```

---

## 🎨 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |

---

## 🗺️ Development Roadmap

### ✅ Phase 1: Foundation (COMPLETE)
- ✅ Project setup with Vite + React
- ✅ Tailwind CSS + responsive layout
- ✅ Authentication system (mock data)
- ✅ Protected routes with role-based access
- ✅ Zustand state management
- ✅ Parent Dashboard

### 🔄 Next Phases
- **Phase 2**: Doctor Features (Treatment Plans, Patient Management)
- **Phase 3**: Therapist Features (Session Notes, Weekly Plans)
- **Phase 4**: Parent Features (Daily Feedback, Resources)
- **Phase 5**: Statistics & Charts (Recharts integration)
- **Phase 6**: Communication (Messaging, Notifications)
- **Phase 7**: Polish (Accessibility, Performance)
- **Phase 8**: Backend Integration (Replace mock data)

---

## 🔌 Backend Integration

Currently using **mock data**. To connect your Node.js backend:

1. **Update `.env`**:
   ```
   VITE_API_BASE_URL=http://localhost:5000/api
   ```

2. **Replace mock functions** in `src/api/auth.api.js`:
   ```javascript
   // Use loginUser instead of mockLogin
   const response = await loginUser(data);
   ```

3. **Backend Response Format**:
   ```json
   {
     "user": {
       "id": "1",
       "name": "Dr. Sarah Johnson",
       "email": "doctor@auticare.com",
       "role": "doctor"
     },
     "token": "your-jwt-token"
   }
   ```

---

## 👥 User Roles & Features

### 🩺 Doctor
- Create/Edit Treatment Plans
- View All Patients
- Perform Assessments
- Assign Therapists
- View Reports

### 🎯 Therapist
- View Assigned Patients
- Create Session Notes
- Provide Parent Guidance
- Message Parents & Doctors
- View Weekly Plans

### 👨‍👩‍👧 Parent
- Log Daily Feedback
- View Weekly Plan
- Access Educational Resources
- Message Therapists
- View Child's Progress

---

## 🎨 Design System

### Colors
```css
Primary:   #0ea5e9 (Blue)
Secondary: #d946ef (Purple)
Success:   #22c55e (Green)
Warning:   #f59e0b (Orange)
Danger:    #ef4444 (Red)
```

### UI Components
All in `src/components/ui/`:
- **Button** - 7 variants (primary, secondary, success, danger, warning, outline, ghost)
- **Card** - With CardHeader, CardTitle, CardContent, CardFooter
- **Input** - With label, error handling, helper text
- **Badge** - Status indicators

---

## 📝 Code Examples

### Create a New Feature Page

```javascript
// src/features/parent/NewPage.jsx
import React from 'react';
import Card, { CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import Button from '../../components/ui/Button';

const NewPage = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">My New Page</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Card Title</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Your content here</p>
          <Button variant="primary">Click Me</Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default NewPage;
```

### Add a New Route

```javascript
// In src/routes/AppRoutes.jsx
import NewPage from '../features/parent/NewPage';

// Add to parent routes:
{ path: 'new-page', element: <NewPage /> }
```

### Make an API Call

```javascript
// src/api/myfeature.api.js
import apiClient from './apiClient';

export const getData = async (id) => {
  const response = await apiClient.get(`/data/${id}`);
  return response.data;
};

// In component:
import { useQuery } from '@tanstack/react-query';
import { getData } from '../../api/myfeature.api';

const { data, isLoading, error } = useQuery({
  queryKey: ['data', id],
  queryFn: () => getData(id),
});
```

---

## 🐛 Troubleshooting

**Issue**: Styles not working  
**Fix**: Ensure Tailwind config includes all content paths

**Issue**: Login doesn't work  
**Fix**: Check mock credentials in `src/api/auth.api.js`

**Issue**: Routes not working  
**Fix**: Verify `ProtectedRoute` and `allowedRoles` in AppRoutes.jsx

---

## 🤝 Contributing

1. Create feature branch
2. Make changes
3. Test thoroughly
4. Submit PR

---

## 📄 License

Educational/demonstration purposes.

---

**Built with ❤️ for children with ASD and their families**

🌟 **Star this repo** if you find it helpful!
