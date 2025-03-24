# Build stage
FROM node:18-alpine as build

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./

# Install dependencies
RUN npm ci

# Copy all files
COPY . .

# Ensure Tailwind is properly built
RUN npx tailwindcss -i ./src/index.css -o ./src/tailwind.css
RUN cat ./src/tailwind.css >> ./src/index.css

# Set API URL environment variable for production build
# This assumes api service is available at http://api:3000 in your Docker network
ENV REACT_APP_API_URL=http://api:3000/api

# Build the app
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built app from build stage
COPY --from=build /app/build /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]