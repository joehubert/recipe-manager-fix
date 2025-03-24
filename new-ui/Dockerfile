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

# Set API URL for production build using a build-time ARG
# This will be eventually used by the browser, so it needs to use localhost
ARG REACT_APP_API_URL=http://localhost:3000/api
ENV REACT_APP_API_URL=${REACT_APP_API_URL}

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