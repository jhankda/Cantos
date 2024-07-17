
FROM node:21-alpine


WORKDIR /app

COPY package*.json ./

RUN npm install -g npm@latest
RUN npm install

COPY . .
COPY .env .env

EXPOSE 5555

CMD ["npm", "run", "dev"]
