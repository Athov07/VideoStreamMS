FROM node:18-alpine

# Set the working directory
WORKDIR /app

# Copy package files first for better caching
COPY package*.json ./

# Install dependencies (including production and dev if needed)
RUN npm install

# IMPORTANT: Copy everything from your local folder into the /app folder
# This includes the 'src' folder itself.
COPY . .

# Check if files exist (Debugging step - will show in logs if it fails)
RUN ls -al /app && ls -al /app/src

# Use the start script defined in your package.json
CMD ["npm", "start"]