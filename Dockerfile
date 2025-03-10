# Use the official Node.js image
FROM node:20

# Set the working directory
WORKDIR /app

# Copy the rest of the application code
COPY . .

# Install dependencies
RUN npm install

# Rebuild native modules (e.g., bcrypt)
RUN npm rebuild bcrypt --build-from-source

# Install pm2 globally
RUN npm install -g pm2

RUN pm2 --version

RUN rm -rf dist

# Compile TypeScript to JavaScript
RUN npx tsc

# Build the frontend (if applicable)
 RUN cd ui && npm install --force && npm run build --prod

# Expose the port the app runs on
EXPOSE 8080

# Start the application using pm2
CMD ["node", "dist/app.js"]