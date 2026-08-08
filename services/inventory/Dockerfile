FROM node:22-alpine AS runtime
WORKDIR /app
COPY package.json ./
COPY src ./src
RUN addgroup -S app && adduser -S app -G app
USER app
ENV NODE_ENV=production
EXPOSE 3003
CMD ["node", "src/server.js"]
