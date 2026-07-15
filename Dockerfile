# Use official Playwright image (matches your Playwright version)
FROM mcr.microsoft.com/playwright:v1.61.1-noble

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm ci

# Copy the rest of your app
COPY . .

# Expose port if it's a web server
EXPOSE 3000

# Start your app (adjust command as needed)
CMD ["npm", "start"]