FROM oven/bun:1.3.13-alpine AS deps
WORKDIR /opt/app
COPY package.json bun.lock* .npmrc ./
COPY apps/site/package.json apps/site/package.json
COPY packages/alien-ui/package.json packages/alien-ui/package.json
RUN bun install

FROM oven/bun:1.3.13-alpine AS builder
WORKDIR /opt/app
COPY --from=deps /opt/app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN bun run build

FROM oven/bun:1.3.13-alpine AS runner
WORKDIR /opt/app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
EXPOSE 3000

COPY --from=builder /opt/app/package.json ./package.json
COPY --from=builder /opt/app/apps/site/.next ./apps/site/.next
COPY --from=builder /opt/app/apps/site/public ./apps/site/public
COPY --from=builder /opt/app/apps/site/package.json ./apps/site/package.json
COPY --from=builder /opt/app/node_modules ./node_modules
COPY --from=builder /opt/app/packages ./packages

CMD ["bun", "run", "start"]
