# Project Structure

This document outlines the organization and structure of the EduAI employee website codebase.

## Directory Structure

```
EduAI-website-employee-V1/
├── .next/               # Next.js build output
├── node_modules/        # Dependencies
├── public/              # Static assets
├── src/                 # Source code
│   ├── app/             # Next.js App Router pages
│   ├── components/      # Reusable UI components
│   ├── features/        # Redux Toolkit slices and API
│   ├── GlobalRedux/     # Redux store configuration
│   ├── hooks/           # Custom React hooks
│   ├── middleware.ts    # Next.js middleware for authentication
│   └── ...
├── docs/                # Documentation
├── .env                 # Environment variables (not in repository)
├── .gitignore           # Git ignore configuration
├── Dockerfile           # Docker configuration
├── next.config.mjs      # Next.js configuration
├── package.json         # Project metadata and dependencies
└── README.md            # Project overview
```

## Key Components

### App Router Structure

The application uses Next.js App Router for routing. The main routes are:

- `/login` - Authentication page
- `/signup` - Registration page
- `/financial-management` - Financial management features
- ...other main routes

### Component Organization

Components are categorized as:

1. **Page Components** - Located in `src/app` directory, these represent entire pages
2. **Shared UI Components** - Located in `src/components`, these are reusable across pages
3. **Feature-specific Components** - Located within feature directories

### State Management

Redux Toolkit is used for state management:

- **Store Configuration** - Located in `src/GlobalRedux/store.ts`
- **Slices** - Located in `src/features/` directory, organized by domain
- **API Integration** - RTK Query used for API calls, defined in feature-specific API files

### Middleware

Next.js middleware (`src/middleware.ts`) handles authentication and route protection.

## File Naming Conventions

- React components: PascalCase (e.g., `NavBar.tsx`)
- Utilities and hooks: camelCase (e.g., `useNotifications.ts`)
- Redux slices: camelCase with "Slice" suffix (e.g., `languageSlice.ts`)
- Pages: `page.tsx` within appropriate directory

## Important Files

- `next.config.mjs` - Next.js configuration
- `middleware.ts` - Authentication and route protection
- `GlobalRedux/store.ts` - Redux store configuration
