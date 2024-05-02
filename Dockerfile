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
RUN npm install pm2 -g
ENV PM2_PUBLIC_KEY 2vofq06pe8el0p0
ENV PM2_SECRET_KEY 2hfkqhpktcla3y9


COPY . .

CMD ["pm2-runtime", "index.js"]
