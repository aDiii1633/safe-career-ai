# ─── Stage 1: Build ───────────────────────────────────────────────────────────
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Copy dependency manifests first (layer caching)
COPY package.json package-lock.json ./

# Install all dependencies (including devDeps needed for build)
RUN npm ci

# Copy the rest of the source code
COPY . .

# Build arguments that map to Vite env vars (injected at build time)
# Pass these via: docker build --build-arg VITE_GEMINI_API_KEY=xxx ...
# Or via Google Cloud Build substitutions / Secret Manager
ARG VITE_GEMINI_API_KEY
ARG VITE_PERPLEXITY_API_KEY

ENV VITE_GEMINI_API_KEY=$VITE_GEMINI_API_KEY
ENV VITE_PERPLEXITY_API_KEY=$VITE_PERPLEXITY_API_KEY

# Build the production bundle
RUN npm run build

# ─── Stage 2: Serve ───────────────────────────────────────────────────────────
FROM nginx:1.25-alpine AS production

# Remove default nginx config
RUN rm /etc/nginx/conf.d/default.conf

# Copy our custom nginx config for SPA routing
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built static assets from the builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Cloud Run injects $PORT at runtime; nginx listens on it via the config
# Expose port 8080 (Cloud Run default)
EXPOSE 8080

# Start nginx in foreground
CMD ["nginx", "-g", "daemon off;"]
