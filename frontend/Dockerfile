FROM node:20-alpine AS base
RUN apk add --no-cache tzdata
ENV TZ=Asia/Seoul

WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package*.json ./
RUN npm install

# Build stage
FROM base AS builder
COPY . .
RUN npm run build

# Production stage
FROM base AS runner
COPY . .

EXPOSE 3000
CMD ["npm", "run", "dev", "--", "--host"]
