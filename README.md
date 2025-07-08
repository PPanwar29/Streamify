# Streamify

Streamify is a modern full-stack web application for real-time chat, video calls, and language learning. It features authentication, friend management, notifications, and a beautiful, responsive UI.

![image](https://github.com/user-attachments/assets/060c9404-896b-40d4-9728-6ed2c41e78ac)
![image](https://github.com/user-attachments/assets/a438b65e-6c04-4568-88b2-c1e18390b9a0)


---

## Features

- **User Authentication** (Sign up, Login, JWT, Cookies)
- **Friend Requests** (Send, Accept, Reject, Remove)
- **Real-time Chat** (with Stream API)
- **Video Calls**
- **Notifications**
- **Onboarding Flow**
- **Responsive UI** (React + Tailwind CSS)
- **Dark/Light Theme**
- **Production-ready Docker setup**
- **CI/CD with GitHub Actions**

---

## Tech Stack

- **Frontend:** React, Vite, Tailwind CSS
- **Backend:** Node.js, Express, Mongoose (MongoDB)
- **Database:** MongoDB (Atlas or local)
- **Real-time:** Stream API
- **Testing:** Jest, Supertest, React Testing Library
- **CI/CD:** GitHub Actions
- **Containerization:** Docker, Docker Compose

---

## Project Structure

```
Streamify/
  backend/         # Express API, models, controllers, routes
  frontend/        # React app (Vite), components, pages
  .github/         # GitHub Actions workflows
  Dockerfile       # Multi-stage build for production
  docker-compose.yml # For local dev (optional)
  README.md        # This file
```

---

## Local Development

### Prerequisites

- Node.js 18+
- npm
- MongoDB (local or Atlas)

### 1. Clone the repo

```
git clone https://github.com/yourusername/streamify.git
cd streamify
```

### 2. Install dependencies

```
cd backend && npm install
cd ../frontend && npm install
```

### 3. Start MongoDB (if local)

```
docker run -d -p 27017:27017 --name mongo mongo
```

### 4. Start the app (dev mode)

- **Backend:**
  ```
  cd backend
  npm run dev
  ```
- **Frontend:**
  ```
  cd frontend
  npm run dev
  ```
- Visit [http://localhost:5173](http://localhost:5173)

---

## Production Build & Docker

### 1. Build and Run with Docker

```
docker build -t streamify .
docker run -p 5000:5000 streamify
```

- The backend will serve the frontend at [http://localhost:5000](http://localhost:5000)

### 2. Docker Compose (for local dev with MongoDB)

```
docker-compose up --build
```

---

## CI/CD

- **GitHub Actions** runs tests and builds on every push/PR to `main`.
- MongoDB service is provided for backend tests.
- Frontend build step catches React build errors.

---

## Deployment

- **Fly.io, Render, or any Docker-compatible PaaS**
- Use the provided Dockerfile for monolithic deployment (backend serves frontend)
- Set environment variables (e.g., `MONGO_URL`, `PORT`, API keys) in your cloud provider

---

## Environment Variables

- `MONGO_URL` - MongoDB connection string
- `PORT` - Port for backend (default: 5000)
- `STREAM_API_KEY`, `STREAM_SECRET` - Stream API credentials
- `SENTRY_DSN` - (optional) Sentry DSN for error tracking

---

## Testing

- **Backend:**
  ```
  cd backend
  npm test
  ```
- **Frontend:**
  ```
  cd frontend
  npm test
  ```

---

## Contributing

1. Fork the repo
2. Create a new branch (`git checkout -b feature/your-feature`)
3. Commit your changes
4. Push to your fork and open a Pull Request

---

## License

MIT

---

## Maintainers
<<<<<<< HEAD

- [Your Name](https://github.com/yourusername)
=======
- [Prashant Singh Panwar](https://github.com/PPanwar29)
>>>>>>> 235831c0b200e40cee70bcef42e8977d8cc5d19b

---

## Acknowledgements

- [Stream API](https://getstream.io/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
<<<<<<< HEAD
- [Fly.io](https://fly.io/)
=======
- [Fly.io](https://fly.io/) 
>>>>>>> 235831c0b200e40cee70bcef42e8977d8cc5d19b
