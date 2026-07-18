FROM node:22-alpine AS base
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1

# ---------- deps ----------
# Usa npm ci para reproducibilidad; necesita package-lock.json en el repo
FROM base AS deps
COPY package.json package-lock.json* ./
RUN npm ci

# ---------- builder ----------
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run prisma:generate
RUN npm run build

# ---------- runner ----------
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system appgroup \
    && adduser --system --ingroup appgroup appuser

# Copiamos todo lo necesario para runtime
COPY --from=builder --chown=appuser:appgroup /app/package.json ./package.json
COPY --from=builder --chown=appuser:appgroup /app/node_modules ./node_modules
COPY --from=builder --chown=appuser:appgroup /app/.next ./.next
COPY --from=builder --chown=appuser:appgroup /app/public ./public
COPY --from=builder --chown=appuser:appgroup /app/prisma ./prisma
COPY --from=builder --chown=appuser:appgroup /app/next.config.js ./next.config.js

USER appuser
EXPOSE 3000
CMD ["npm", "start"]
