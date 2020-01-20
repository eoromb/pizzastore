FROM node:12-alpine

WORKDIR /usr/pizza

COPY package*.json ./
RUN npm install --quiet

COPY . .
EXPOSE 3000