# Use the official Node.js image
FROM node:20-bookworm AS deps-api
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM node:20-bookworm AS build-api
WORKDIR /app
COPY --from=deps-api /app/node_modules ./node_modules
COPY package.json package-lock.json tsconfig.json ./
COPY src ./src
RUN npx tsc && npm prune --omit=dev

FROM node:20-bookworm AS deps-ui
WORKDIR /ui
COPY ui/package.json ui/package-lock.json ./
RUN npm ci

FROM node:20-bookworm AS build-ui
WORKDIR /ui
COPY --from=deps-ui /ui/node_modules ./node_modules
COPY ui/ ./
RUN npm run build--prod

FROM node:20-bookworm-slim AS runtime
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=8080

RUN apt-get update \
  && apt-get install -y --no-install-recommends ca-certificates \
  && rm -rf /var/lib/apt/lists/* \
  && groupadd -r nodeapp && useradd -r -g nodeapp nodeapp

COPY --from=build-api /app/node_modules ./node_modules
COPY --from=build-api /app/package.json ./package.json
COPY --from=build-api /app/dist ./dist
COPY --from=build-ui /ui/dist ./ui/dist

USER nodeapp
EXPOSE 8080
CMD ["node", "dist/app.js"]
