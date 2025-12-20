# Use Node.js LTS as base
FROM node:20-slim

# Install Python 3 and pip
RUN apt-get update && apt-get install -y python3 python3-pip && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install Node dependencies
RUN npm install

# Copy Python requirements
COPY requirements.txt ./

# Install Python dependencies
# Note: On some Debian versions, --break-system-packages might be needed or venv, 
# but for simple container usage this is often sufficient. 
# Using a flag to ensure it works on newer pip versions.
RUN pip3 install -r requirements.txt --break-system-packages || pip3 install -r requirements.txt

# Copy the rest of the app
COPY . .

# Build the Next.js app
RUN npm run build

# Expose port
EXPOSE 3000

# Start the app
CMD ["npm", "start"]
