FROM node:20

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN rm -rf dist
RUN npm run build

CMD ["node", "dist/main.js"]