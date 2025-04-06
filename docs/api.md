# API Documentation

This document outlines the API integration patterns used in the EduAI employee website.

## API Integration Architecture

The application uses Redux Toolkit Query (RTK Query) for API calls, providing a standardized approach to data fetching, caching, and state management.

## Base API Configuration

API endpoints are organized by feature domain in separate files under the `src/features/` directory.

### Example API Configuration:

```typescript
// src/features/dashboard/dashboardApi.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const dashboardApi = createApi({
  reducerPath: 'dashboardApi',
  baseQuery: fetchBaseQuery({ 
    baseUrl: process.env.NEXT_PUBLIC_API_URL,
    prepareHeaders: (headers) => {
      const token = Cookie.get('token');
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getAllCurrentUser: builder.query({
      query: () => `/users/me`,
    }),
    // Other endpoints...
  }),
});

export const { useGetAllCurrentUserQuery } = dashboardApi;
```

## Authentication API

### Login

- **Endpoint**: `/auth/login`
- **Method**: POST
- **Request Body**:
  ```json
  {
    "email": "string",
    "password": "string"
  }
  ```
- **Response**: User data with authentication token

### Signup

- **Endpoint**: `/auth/register`
- **Method**: POST
- **Request Body**:
  ```json
  {
    "email": "string",
    "password": "string",
    "firstName": "string",
    "lastName": "string",
    // other registration fields
  }
  ```

## User API

### Get Current User

- **Endpoint**: `/users/me`
- **Method**: GET
- **Authorization**: Bearer Token Required
- **Response**: Current user data

## Financial Management API

### Budget Endpoints

- **Get Budget**: GET `/budget`
- **Create Budget Item**: POST `/budget`
- **Update Budget Item**: PUT `/budget/{id}`
- **Delete Budget Item**: DELETE `/budget/{id}`

## WebSocket Integration

The application uses STOMP over WebSocket for real-time notifications.

### Connection Setup

```typescript
// Example from src/hooks/useNotifications.ts
import { Client } from '@stomp/stompjs';

const client = new Client({
  brokerURL: 'ws://your-websocket-endpoint',
  connectHeaders: {
    Authorization: `Bearer ${token}`,
  },
  onConnect: () => {
    client.subscribe('/user/queue/notifications', message => {
      // Handle incoming notifications
    });
  },
});
```

## Error Handling

API errors are handled globally using RTK Query's error handling mechanisms. Common error patterns include:

1. Authentication errors (401)
2. Permission errors (403)
3. Not found errors (404)
4. Validation errors (400)
5. Server errors (500)

## Caching Strategy

RTK Query provides automatic caching for API requests. The cache invalidation strategy is:

1. Time-based invalidation for regularly-updated data
2. Manual invalidation through tag-based cache management
3. Optimistic updates for user-initiated actions
