# QuizForge

A full-stack online quiz platform built with the MERN stack. Students take timed quizzes and see instant, server-verified scores. Admins create quizzes and track usage.

## Features
- JWT authentication with student and admin roles
- Timed quizzes with auto-submit when the timer ends
- Scoring on the server, so correct answers are never sent to the browser
- Answer review, personal history and a per-quiz leaderboard
- Admin dashboard: create and delete quizzes, see users, attempts and average score
- Security basics: password hashing (bcrypt), Helmet, rate limiting, input validation

## Tech stack
React (Vite), React Router, Tailwind CSS, Node.js, Express, MongoDB (Mongoose), JWT

## Run locally
Requires Node 18+ and MongoDB (local or Atlas).

```bash
# 1. API
cd server
cp .env.example .env      # then edit the values
npm install
npm run seed              # optional: adds a sample quiz
npm run dev

# 2. Client (new terminal)
cd client
cp .env.example .env
npm install
npm run dev
```
Open http://localhost:5173. Register with the email you set as `ADMIN_EMAIL` to become an admin.

## API
| Method | Route | Access |
|---|---|---|
| POST | /api/auth/register, /api/auth/login | Public |
| GET | /api/auth/me | User |
| GET | /api/quizzes | User |
| GET | /api/quizzes/:id | User |
| POST | /api/quizzes/:id/attempt | User |
| GET | /api/quizzes/:id/leaderboard | User |
| GET | /api/quizzes/me/attempts | User |
| POST, DELETE | /api/quizzes, /api/quizzes/:id | Admin |
| GET | /api/quizzes/admin/stats | Admin |

## Deploy (free)
1. Database: create a free MongoDB Atlas cluster and copy the connection string.
2. API: deploy the `server` folder on Render. Set `MONGO_URI`, `JWT_SECRET`, `CLIENT_URL`, `ADMIN_EMAIL`.
3. Client: deploy the `client` folder on Vercel. Set `VITE_API_URL` to your Render URL plus `/api`.
