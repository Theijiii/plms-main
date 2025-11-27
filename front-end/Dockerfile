# ==========================
# Stage 1: Build
# ==========================
FROM node:20 AS build
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy all source code and build
COPY . .
RUN npm run build

# ==========================
# Stage 2: Serve
# ==========================
FROM node:20-slim
WORKDIR /app

# Copy build artifacts from stage 1
COPY --from=build /app/package*.json ./
COPY --from=build /app/dist ./dist

# Install serve globally to serve static files
RUN npm install -g serve

# Expose port 80 for container
EXPOSE 80

# Start the frontend
CMD ["serve", "-s", "dist", "-l", "3000"]
