FROM node:18-alpine

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy source files
COPY tsconfig.json ./
COPY src ./src

# Expose port
EXPOSE 8000

# Run directly with tsx
CMD ["npx", "tsx", "src/server.ts"]
