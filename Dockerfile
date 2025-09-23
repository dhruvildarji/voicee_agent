# Stage 1: Build the React app
FROM node:20-bullseye AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci --ignore-scripts
COPY . .
RUN npm run build

# Stage 2: Run server with built assets
FROM node:20-bullseye
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/package*.json ./
RUN npm ci --omit=dev --ignore-scripts
COPY --from=build /app/dist ./dist
COPY --from=build /app/server.js ./server.js
COPY --from=build /app/.env.example ./env.example
EXPOSE 3001
CMD ["node", "server.js"]

