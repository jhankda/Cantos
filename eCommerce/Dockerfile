
FROM node:21-alpine


WORKDIR /app

COPY package*.json ./

COPY . .
COPY .env .env

RUN npm install

EXPOSE 5555

CMD ["npm", "run", "dev"]
