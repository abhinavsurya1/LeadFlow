# --- build ---
FROM node:20-alpine AS builder

WORKDIR /app

RUN apk add --no-cache openssl libc6-compat

COPY package*.json ./
COPY prisma ./prisma/
RUN npm ci
RUN ./node_modules/.bin/prisma generate

COPY tsconfig.json ./
COPY src ./src
RUN npm run build

# --- runtime ---
FROM node:20-alpine AS runner

WORKDIR /app

RUN apk add --no-cache openssl postgresql-client

ENV NODE_ENV=production

COPY package*.json ./
RUN npm ci --omit=dev \
  && npm install prisma@5.22.0 ts-node@10.9.2 typescript@5.5.3 @types/node@20.14.9 --legacy-peer-deps

COPY prisma ./prisma
COPY --from=builder /app/dist ./dist
# Reuse generated client from builder (avoids npx fetching Prisma 7.x)
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma

COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

EXPOSE 5001

ENTRYPOINT ["/usr/local/bin/docker-entrypoint.sh"]
CMD ["node", "dist/index.js"]
