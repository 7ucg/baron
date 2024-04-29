FROM node:current

# Install system dependencies
RUN apt-get update && \
    apt-get install -y \
    ffmpeg \
    imagemagick \
    webp && \
    apt-get clean && \
    apt install iputils-ping -y && \
    apt-get upgrade -y && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /usr/src/app

COPY package.json .
RUN npm install --force

# Copy the rest of the application source code
COPY . .

# Set the default command to run the application
CMD ["node", "."]
