FROM node:20-alpine

# Set working directory
WORKDIR /app

# Install pnpm globally
RUN npm install -g pnpm

# Copy package.json and pnpm-lock.yaml
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile
#RUN pnpm run build
# Copy the rest of the application code
COPY . .
RUN pnpm run build
# Expose the development server port
EXPOSE 3000

# Start the application
CMD ["pnpm", "start"]