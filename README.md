# Student Performance Dashboard

A full-stack (MERN stack) web application designed for academic administrators to manage students, curriculum subjects, examination marks, and analyze overall student academic performance with interactive visual charts, automated grade calculations, and real-time risk identification.

---

## 🚀 Features

- **JWT Authentication & Authorization**: Secure login with bcrypt password hashing, rate limiting, and protected API routes.
- **Interactive Dashboard Overview**:
  - **4 Stat Cards**: Total Students, Class Average, Pass Rate (%), and At-Risk Count.
  - **Subject Average Chart**: Bar chart illustrating average scores across subjects.
  - **Grade Distribution Chart**: Donut chart displaying proportions of A, B, C, S, and F grades.
  - **Term Progress Trend**: Line chart tracking academic performance trajectory across terms.
  - **Top Performing Students Table**: Ranks top 5 overall students with class rank.
  - **At-Risk Identification**: Highlights students with overall average scores < 40 in red.
- **Student Management**: Full CRUD operations with search, class filter, pagination, and cascade deletion of associated marks.
- **Subject Management**: Full CRUD operations with code validation and deletion protection when mark records exist.
- **Marks & Evaluation**: Full CRUD operations with term filtering, automatic grade assignment (A: 75-100, B: 65-74, C: 50-64, S: 35-49, F: 0-34), and duplicate prevention for student-subject-term entries.
- **Modern Responsive UI**: Collapsible sidebar, light & dark mode toggle with persistent storage, mobile-friendly design, inline form validation, skeleton loaders, and toast notifications.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 18 (Vite)
- **Routing**: React Router DOM v6
- **Styling**: Tailwind CSS
- **Data Visualization**: Recharts
- **Icons & UI**: Lucide React, react-hot-toast
- **HTTP Client**: Axios (with Request/Response Interceptors)

### Backend
- **Runtime**: Node.js (ES Modules)
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Auth & Security**: JSON Web Tokens (`jsonwebtoken`), `bcryptjs`, `express-rate-limit`, `cors`
- **Validation & Utils**: `express-validator`, `morgan`, `dotenv`

---

## 📁 Project Structure

```
student-dashboard/
├── README.md
├── .gitignore
├── server/
│   ├── package.json
│   ├── .env.example
│   ├── .env
│   └── src/
│       ├── server.js
│       ├── app.js
│       ├── config/db.js
│       ├── models/
│       │   ├── User.js
│       │   ├── Student.js
│       │   ├── Subject.js
│       │   └── Mark.js
│       ├── controllers/
│       │   ├── authController.js
│       │   ├── studentController.js
│       │   ├── subjectController.js
│       │   ├── markController.js
│       │   └── dashboardController.js
│       ├── routes/
│       │   ├── authRoutes.js
│       │   ├── studentRoutes.js
│       │   ├── subjectRoutes.js
│       │   ├── markRoutes.js
│       │   └── dashboardRoutes.js
│       ├── middleware/
│       │   ├── authMiddleware.js
│       │   ├── errorHandler.js
│       │   ├── validate.js
│       │   └── notFound.js
│       ├── utils/
│       │   ├── gradeCalculator.js
│       │   ├── generateToken.js
│       │   └── ApiError.js
│       └── seed/
│           └── seed.js
└── client/
    ├── package.json
    ├── .env.example
    ├── .env
    ├── index.html
    ├── vite.config.js
    ├── tailwind.config.js
    ├── postcss.config.js
    └── src/
        ├── main.jsx, App.jsx, index.css
        ├── api/axios.js
        ├── context/AuthContext.jsx
        ├── components/
        │   ├── layout/ (Sidebar, Navbar, Layout)
        │   ├── common/ (Modal, ConfirmDialog, Loader, EmptyState, Pagination, SearchBar, StatCard, ProtectedRoute)
        │   └── charts/ (SubjectAverageChart, GradeDistributionChart, TermTrendChart)
        ├── pages/ (Login, Dashboard, Students, Subjects, Marks, NotFound)
        ├── hooks/ (useFetch.js)
        └── utils/ (formatters.js)
```

---

## ⚙️ Prerequisites

- **Node.js**: `v18.0.0` or higher
- **npm**: `v9.0.0` or higher
- **MongoDB**: Local MongoDB instance running on `mongodb://127.0.0.1:27017` or MongoDB Atlas URI.

---

## 🚀 Setup & Installation Instructions

### 1. Clone the repository
```bash
git clone https://github.com/your-username/student-dashboard.git
cd student-dashboard
```

### 2. Backend Setup
```bash
cd server
npm install
```

Configure Environment Variables (`server/.env`):
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/student_dashboard
JWT_SECRET=supersecretjwtkey1234567890_student_dashboard
JWT_EXPIRES_IN=1d
CLIENT_URL=http://localhost:5173
```

Seed Database with initial data:
```bash
npm run seed
```

Start Backend Server:
```bash
npm run dev
```

### 3. Frontend Setup
Open a new terminal window:
```bash
cd client
npm install
```

Configure Environment Variables (`client/.env`):
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

Start Frontend Dev Server:
```bash
npm run dev
```

The application will be running at `http://localhost:5173`.

---

## 🔑 Default Administrator Credentials

Use the seeded credentials below to sign in:

| Field | Value |
| :--- | :--- |
| **Email** | `admin@example.com` |
| **Password** | `Admin@123` |

---

## 🔌 API Endpoints Reference

### Auth Routes (`/api/auth`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/login` | Public | Authenticates user & returns JWT token |
| `GET` | `/api/auth/me` | Protected | Returns logged-in user profile |

### Student Routes (`/api/students`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/students` | Protected | Get all students (search, class filter, page) |
| `GET` | `/api/students/:id` | Protected | Get single student details & marks |
| `POST` | `/api/students` | Protected | Register a new student |
| `PUT` | `/api/students/:id` | Protected | Update student information |
| `DELETE` | `/api/students/:id` | Protected | Delete student & cascade delete marks |

### Subject Routes (`/api/subjects`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/subjects` | Protected | List all subjects with mark counts |
| `GET` | `/api/subjects/:id` | Protected | Get single subject |
| `POST` | `/api/subjects` | Protected | Create new subject |
| `PUT` | `/api/subjects/:id` | Protected | Update subject |
| `DELETE` | `/api/subjects/:id` | Protected | Delete subject (blocked if marks exist) |

### Marks Routes (`/api/marks`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/marks` | Protected | List all mark entries with populated student/subject |
| `GET` | `/api/marks/:id` | Protected | Get single mark entry |
| `POST` | `/api/marks` | Protected | Create mark entry (calculates grade) |
| `PUT` | `/api/marks/:id` | Protected | Update mark entry |
| `DELETE` | `/api/marks/:id` | Protected | Delete mark record |

### Dashboard Routes (`/api/dashboard`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/dashboard/summary` | Protected | Aggregated stats, charts data, top 5, & at-risk list |

---

## 📸 Screenshots

*(Place application screenshots here)*
- `Dashboard Dark Mode`: `docs/dashboard-dark.png`
- `Student Management`: `docs/students.png`
- `Marks & Grades`: `docs/marks.png`

---

## 📄 License

This project is licensed under the MIT License.
