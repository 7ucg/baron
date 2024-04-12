FROM node:lts-buster

RUN apt-get update && \
    apt-get install -y \
    ffmpeg \
    imagemagick \
    webp \
    python3 \
    python3-pip && \
    apt-get upgrade -y && \
    rm -rf /var/lib/apt/lists/*


WORKDIR /usr/src/app

COPY package.json .
RUN npm install 

COPY . .

CMD ["node", "."]