FROM node:20-alpine

WORKDIR /app

COPY package*.json /app

RUN npm install

COPY . /app

EXPOSE 3000

RUN npx prisma generate
CMD ["npm", "start"]