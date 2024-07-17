
FROM node:21-alpine


WORKDIR /app


COPY package*.json ./





COPY . .
COPY .env .env

RUN npm install

CMD ["npm", "run", "dev"]

