FROM node:18.20.4-bullseye

WORKDIR /app

COPY package*.json .
RUN npm ci

ENV NODE_ENV=development
ENV HOST=0.0.0.0
ENV PORT=3000
ENV CHOKIDAR_USEPOLLING=true
ENV WATCHPACK_POLLING=true

EXPOSE 3000

CMD ["npm", "run", "start"]
