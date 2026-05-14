# Build stage
FROM node:20-slim AS base
WORKDIR /app

# Install system dependencies required for building some native modules
RUN apt-get update && apt-get install -y     python3     make     g++     && rm -rf /var/lib/apt/lists/*

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source
COPY . .

# Expose port
EXPOSE 5173

# Run development
CMD ["npm", "run", "dev", "--", "--host"]
