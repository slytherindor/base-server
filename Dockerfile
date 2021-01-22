FROM node:15
WORKDIR /usr/src/app
COPY package*.json ./
ENV NODE_ENV=production
RUN npm install --production
COPY build .
EXPOSE 8080
CMD ["node", "src/index.js"]
USER node
