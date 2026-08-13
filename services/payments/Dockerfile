FROM node:22-alpine AS runtime

WORKDIR /app

COPY package.json ./

RUN npm install --omit=dev

COPY src ./src

RUN addgroup -S app && \
    adduser -S app -G app

USER app

ENV NODE_ENV=production

EXPOSE 3002

CMD ["node", "src/server.js"]