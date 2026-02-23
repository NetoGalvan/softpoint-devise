### FRONTEND
- **React 18** - UI Library
- **TypeScript** - Type Safety
- **Vite 5** - Build Tool
- **TailwindCSS** - Styling
- **React Hook Form** - Form Management
- **Zod** - Schema Validation
- **Chart.js** - Data Visualization
- **React Router v6** - Client-side Routing

### Frontend Architecture

**Pattern:** Component-based architecture with Context API for state

```
frontend/
├── src/
│   ├── api/                  # API client layer
│   │   ├── client.ts         # HTTP client (fetch)
│   │   ├── auth.ts           # Auth endpoints
│   │   ├── properties.ts     # Property endpoints
│   │   └── dashboard.ts      # Dashboard endpoints
│   │
│   ├── components/
│   │   ├── common/           # Reusable UI components
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Card.tsx
│   │   │   └── Modal.tsx
│   │   │
│   │   ├── forms/            # Form components
│   │   │   ├── Select.tsx
│   │   │   └── TextArea.tsx
│   │   │
│   │   └── layout/           # Layout components
│   │       ├── Navbar.tsx
│   │       ├── Sidebar.tsx
│   │       └── DashboardLayout.tsx
│   │
│   ├── contexts/             # React Context
│   │   └── AuthContext.tsx   # Authentication state
│   │
│   ├── hooks/                # Custom React hooks
│   │   ├── useAuth.ts
│   │   ├── useApi.ts
│   │   └── useToast.ts
│   │
│   ├── pages/                # Page components
│   │   ├── auth/
│   │   ├── dashboard/
│   │   └── properties/
│   │
│   ├── routes/               # Routing
│   │   ├── AppRoutes.tsx
│   │   ├── PrivateRoute.tsx
│   │   └── PublicRoute.tsx
│   │
│   ├── types/                # TypeScript types
│   │   ├── auth.ts
│   │   ├── property.ts
│   │   └── api.ts
│   │
│   └── utils/                # Utility functions
│       ├── formatters.ts
│       └── constants.ts
```