# Scalable Web App with Authentication & Dashboard

This is a full-stack web application built as part of a Frontend Developer Intern assignment.
The project demonstrates secure authentication, protected routes, CRUD operations, and a scalable project structure.

---

## Tech Stack

### Frontend
- React.js (Vite)
- Tailwind CSS
- React Router
- Context API

### Backend
- Node.js
- Express.js
- MongoDB (with in-memory fallback)
- JWT Authentication
- bcrypt for password hashing
- Zod for validation

---

## Features

- User Signup & Login with JWT authentication
- Protected Dashboard routes
- User Profile fetch from backend
- CRUD operations on Tasks
- Search and filter tasks
- Logout functionality
- Client-side and server-side validation

---

frontend/ → React frontend
backend/ → Express backend
postman/ → API collection


---

## How to Run the Project Locally

### 1. Clone the Repository


git clone <your-github-repo-url>
cd scalable-web-app


### 2. Run Backend


cd backend
npm install
npm run dev



Backend runs on: http://localhost:5000

---

### 3. Run Frontend


**cd frontend
npm install
npm run dev**


Frontend runs on: http://localhost:5173

---

## Authentication & Security Notes

- Passwords are securely hashed using bcrypt
- JWT is used for authentication and protected routes
- For simplicity, JWT is handled client-side
- In a production setup, HttpOnly cookies would be preferred for better security

---

## Scalability Notes

- Frontend can be deployed using Vercel or Netlify
- Backend can be containerized using Docker and deployed on Render or AWS
- MongoDB can be migrated to MongoDB Atlas for production
- API structure is modular and easy to extend

---

## API Testing

- A Postman collection is included in the `postman/` folder
- APIs include authentication, profile fetch, and task CRUD operations

---

## Responsiveness

- The UI is fully responsive and tested for both mobile and desktop screens using Tailwind CSS utilities

---

## Future Improvements

- Role-based access control
- Refresh token implementation
- Better UI animations and accessibility improvements

## Project Structure

