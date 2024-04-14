FROM node:lts-buster

# Install system dependencies
RUN apt-get update && \
    apt-get install -y \
    ffmpeg \
    imagemagick \
    webp && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Copy package.json and install dependencies
COPY package.json .
RUN npm install --force

# Copy the rest of the application source code
COPY . .

# Set the default command to run the application
CMD ["node", "."]
