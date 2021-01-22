FROM node:15
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
RUN npm run prepare
COPY build .
EXPOSE 8080
CMD ["node", "src/index.js"]
USER node
