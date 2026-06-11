FROM node:22-alpine

WORKDIR /app

COPY package.json ./
COPY src ./src

# Zero runtime dependencies — no npm install needed.

ENTRYPOINT ["node", "src/index.js"]
