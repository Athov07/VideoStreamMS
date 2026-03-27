# Use a lightweight Node image
FROM node:18-alpine

# Set the working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install --production

# Copy the rest of the code
COPY . .

# Match the port in your code
EXPOSE 8000

# Start the application
CMD ["node", "index.js"]