# Build frontend
FROM node:18 as frontend
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend .
ARG VITE_STREAM_API_KEY
ENV VITE_STREAM_API_KEY=$VITE_STREAM_API_KEY
RUN npm run build

# Build backend
FROM node:18 as backend
WORKDIR /app
COPY backend/package*.json ./
RUN npm install
COPY backend .
# Copy frontend build into backend's expected static folder
COPY --from=frontend /app/frontend/dist ./frontend/dist

# ENV PORT=5000 (removed for Render compatibility)
EXPOSE 5000

CMD ["npm", "start"]