FROM node:18-alpine

# Set working directory for the application
WORKDIR /app

# Copy package.json files and install dependencies for the client
COPY reactclient/package*.json ./reactclient/
RUN cd reactclient && npm install --omit=dev

# Build the client application
COPY reactclient/ ./reactclient/
RUN cd reactclient && npm run build

# Copy package.json files and install dependencies for the server
COPY server/package*.json ./server/
RUN cd server && npm install --omit=dev

# Copy the server source code
COPY server/ ./server/

# Switch to the 'node' user
USER node

# Set working directory for the server
WORKDIR /app/server

# Start the server
CMD ["npm", "start"]

# Expose the port the app runs on
EXPOSE 8000
