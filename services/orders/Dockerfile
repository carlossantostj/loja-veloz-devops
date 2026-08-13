FROM node:22-alpine AS runtime

WORKDIR /app

COPY package.json ./

RUN npm install --omit=dev

COPY src ./src

RUN addgroup -S -g 1001 app && \
    adduser -S -u 1001 -G app app

USER 1001:1001

ENV NODE_ENV=production

EXPOSE 3001

CMD ["node", "src/server.js"]