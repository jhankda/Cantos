# Stage 1: Build
FROM node:21-alpine as builder

WORKDIR /app

COPY ./package.json  /package.json
RUN npm install

COPY . .



FROM node:21-alpine

WORKDIR /app

COPY --from=builder /app /app

# Copy the environment file (if required)
COPY .env .env

ENV NODE_ENV=production
ENV BUILD_VERSION=0.0.0

EXPOSE 4444

CMD ["npm", "run","dev"]
