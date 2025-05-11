# ---- Build Stage ----
FROM node:20 AS builder
WORKDIR /app

# Use smaller install step to reduce memory usage
COPY package.json package-lock.json ./
RUN npm ci --prefer-offline --no-audit --progress=false

COPY . .
RUN npm run build

# ---- Production Stage ----
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

EXPOSE 3000
CMD ["npm", "start"]
