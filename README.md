# Student Performance Dashboard

A full-stack MERN (MongoDB, Express, React, Node.js) web application for tracking and evaluating student academic performance with real-time analytics.

---

## Features

- **JWT Authentication**: Secure login & protected routes with password hashing.
- **Analytics Dashboard**: Real-time charts for subject averages & grade distribution.
- **Student Management**: Full CRUD with search, class filter, & pagination.
- **Subject & Marks Directory**: Record examination scores with automatic grade calculation (A, B, C, S, F).
- **Responsive UI**: Built with Tailwind CSS, dark mode support, & toast alerts.

---

## Tech Stack

- **Frontend**: React (Vite), React Router, Tailwind CSS, Recharts, Axios, Lucide Icons.
- **Backend**: Node.js, Express.js, MongoDB (Mongoose), JWT, BcryptJS.

---

##  Quick Start Guide

### 1. Setup Backend
```bash
cd server
npm install
npm run seed     
npm run dev      
```

### 2. Setup Frontend
```bash
cd client
npm install
npm run dev      
```



## 🔌 Core API Endpoints

- `POST /api/auth/login` - Authenticate admin & get token
- `GET /api/dashboard/summary` - Aggregated metrics & chart data
- `GET / POST / PUT / DELETE /api/students` - Student management
- `GET / POST / PUT / DELETE /api/subjects` - Subject management
- `GET / POST / PUT / DELETE /api/marks` - Marks & grade entries

---

