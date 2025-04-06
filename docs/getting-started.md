# Getting Started

This guide will help you set up the EduAI employee website for development.

## Prerequisites

- Node.js (v18 or higher)
- npm, yarn, or pnpm
- Git

## Installation

1. Clone the repository:

   ```bash
   git clone [repository-url]
   cd EduAI-website-employee-V1
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn
   # or
   pnpm install
   ```

## Environment Setup

1. Create a `.env` file in the root directory with the following variables:

   ```
   # API Configuration
   NEXT_PUBLIC_API_URL=your_api_url

   # CometChat Configuration
   NEXT_PUBLIC_COMETCHAT_APP_ID=your_cometchat_app_id
   NEXT_PUBLIC_COMETCHAT_REGION=your_cometchat_region
   NEXT_PUBLIC_COMETCHAT_AUTH_KEY=your_cometchat_auth_key

   # Other environment variables
   # Add any other environment variables here
   ```

## Running the Application

### Development Mode

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

### Production Build

```bash
npm run build
npm start
# or
yarn build
yarn start
# or
pnpm build
pnpm start
```

## Testing

```bash
npm run test
# or
yarn test
# or
pnpm test
```

## Code Formatting

```bash
npm run format
# or
yarn format
# or
pnpm format
```

## Linting

```bash
npm run lint
# or
yarn lint
# or
pnpm lint
```
