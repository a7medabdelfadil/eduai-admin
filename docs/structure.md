# EduAI Platform Technical Structure

## Architecture Overview

The EduAI Employee Platform follows a modern frontend architecture utilizing Next.js with the App Router pattern. The application is structured to optimize both development experience and runtime performance.

```
┌─────────────────────────────┐
│       Next.js App Router    │
├─────────────────────────────┤
│    Redux Toolkit + RTK Query│
├─────────────────────────────┤
│    React Components         │
├─────────────────────────────┤
│    API Integration          │
└─────────────────────────────┘
```

## Component Architecture

The application follows a hierarchical component structure:

1. **Page Components** - Top-level components representing full pages
2. **Layout Components** - Components that define the structure of pages
3. **Feature Components** - Domain-specific components for business logic
4. **UI Components** - Reusable, presentational components
5. **Hooks** - Custom React hooks for shared behavior

## Data Flow

```
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│ UI Component │───▶│ Redux Action │───▶│  RTK Query   │
└──────────────┘    └──────────────┘    └──────────────┘
        ▲                                       │
        │                                       ▼
        │                              ┌──────────────┐
        └──────────────────────────────│   API Call   │
                                       └──────────────┘
```

1. User interactions trigger Redux actions or RTK Query hooks
2. Redux middleware processes actions
3. RTK Query manages API calls and caching
4. State changes trigger UI updates

## State Management

The application uses Redux Toolkit for state management with the following organization:

- **Store Configuration**: Centralized in `/src/GlobalRedux/store.ts`
- **Slices**: Feature-specific state management in `/src/features/`
- **Selectors**: Used to access specific parts of the state
- **RTK Query**: API definition and data fetching

## Authentication Flow

```
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│  Login Form  │───▶│  Auth Action │───▶│  Auth API    │
└──────────────┘    └──────────────┘    └──────────────┘
                                                │
                                                ▼
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│ Protected    │◀───│  Middleware  │◀───│  Set Token   │
│ Routes       │    │  Check       │    │  in Cookie   │
└──────────────┘    └──────────────┘    └──────────────┘
```

1. User submits login credentials
2. Auth API validates and returns token
3. Token is stored in cookies
4. Middleware checks token for protected routes
5. Unauthenticated users are redirected to login

## Folder Structure Details

### `/src/app`

App Router based pages and layouts. Each directory represents a route:

- `/dashboard` - Main dashboard views
- `/financial-management` - Budget and finance features
- `/user-management` - User administration features

### `/src/components`

Reusable UI components:

- Form elements
- Navigation components
- UI utilities
- Modal components

### `/src/features`

Domain-specific code organized by feature:

- `/auth` - Authentication logic
- `/dashboard` - Dashboard-specific reducers and API
- `/events` - Event handling logic
- `/language` - Internationalization features

### `/src/hooks`

Custom React hooks:

- `useNotifications` - WebSocket notification handling
- `useTheme` - Theme management
- `useAuth` - Authentication utilities

## Third-Party Integrations

- **CometChat**: Real-time communication
- **STOMP/WebSocket**: Notification system
- **ApexCharts**: Data visualization
- **Radix UI**: Accessible UI primitives

## Build and Deployment Pipeline

```
┌────────────┐   ┌────────────┐   ┌────────────┐   ┌────────────┐
│ Code       │──▶│ Build      │──▶│ Docker     │──▶│ Deployment │
│ Repository │   │ Process    │   │ Container  │   │ Target     │
└────────────┘   └────────────┘   └────────────┘   └────────────┘
```

1. Source code in Git repository
2. Next.js build process (`next build`)
3. Docker containerization (optional)
4. Deployment to hosting environment (Vercel/custom hosting)
