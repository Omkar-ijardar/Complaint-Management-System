# 🎓 AI-Powered College & Hostel Complaint Management System

[![Node.js](https://img.shields.io/badge/Node.js-v18%2B-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-v18-blue.svg)](https://react.dev/)
[![Express.js](https://img.shields.io/badge/Express.js-v4.18-lightgrey.svg)](https://expressjs.com/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-orange.svg)](https://www.mysql.com/)
[![Sequelize](https://img.shields.io/badge/Sequelize-v6.37-blueviolet.svg)](https://sequelize.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v3.4-38bdf8.svg)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

> A full-stack MERN-style (**React + Node.js/Express + MySQL**) Grievance Redressal & Complaint Management System designed specifically for college campuses and hostels. Features **100% local, offline AI & GenAI utilities** — requiring **zero external APIs** (no OpenAI, ChatGPT, or paid keys needed).

---

## 📌 Table of Contents

- [1. Project Overview](#1-project-overview)
- [2. Key Features](#2-key-features)
- [3. Architecture & Tech Stack](#3-architecture--tech-stack)
- [4. Local AI Engine Details](#4-local-ai-engine-details)
- [5. Folder Structure](#5-folder-structure)
- [6. Database Design & ER Schema](#6-database-design--er-schema)
- [7. API Documentation](#7-api-documentation)
- [8. Step-by-Step Installation & Setup](#8-step-by-step-installation--setup)
- [9. Demo Credentials](#9-demo-credentials)
- [10. Troubleshooting & FAQ](#10-troubleshooting--faq)
- [11. How to Push to GitHub](#11-how-to-push-to-github)
- [12. License](#12-license)

---

## 1. Project Overview

Hostels and educational campuses often face delays and transparency issues with complaint handling. The **AI-Powered Complaint Management System** solves this by providing:

1. **For Students**: A simple portal to report issues, receive instant local AI analysis (category, severity, estimated resolution time, suggested solution), convert informal drafts into formal complaints ("Make it Professional"), track resolution status, chat with an offline help assistant, and rate completed resolutions.
2. **For Wardens & Administrators**: Role-based dashboards to filter, assign staff, update statuses, trigger escalations, view analytics, and generate downloadable PDF reports.
3. **Automatic SLA Escalation**: A background cron service periodically monitors unresolved complaints past configured SLA windows (`ESCALATION_HOURS`) and automatically escalates them to higher management.

---

## 2. Key Features

### 🧑‍🎓 Student Portal
- **Secure Authentication**: JWT-based sign up, login, profile management, and password reset.
- **Smart Complaint Submission**: Real-time AI categorization, priority calculation, and solution suggestions.
- **"Make It Professional" AI Assistant**: Converts informal notes (e.g., *"fan noise too loud"*) into well-formatted, formal grievances.
- **Interactive Tracking**: Live status updates (Submitted → Under Review → Assigned → In Progress → Resolved/Rejected).
- **Offline Help Chatbot**: Quick FAQ and website navigation assistant running locally.
- **Feedback & Rating System**: Rate resolved complaints with 1-5 stars and feedback comments.

### 🛡️ Admin & Warden Dashboard
- **Role-Based Controls**: Distinct views for Administrators and Hostel Wardens.
- **Complaint Management Table**: Filter by status, priority, category, or hostel block.
- **Staff Assignment**: Delegate complaints to specific technicians/department heads.
- **Manual & Automated Escalation**: Flag urgent complaints or let the background scheduler escalate breached SLAs.
- **Analytics & Visualizations**: Interactive Recharts displaying complaint volume, status distribution, category breakdown, and average resolution times.
- **PDF Report Generation**: Export formatted complaint summary reports on demand using server-side PDFKit.

---

## 3. Architecture & Tech Stack

```
 ┌───────────────────────────────────────────────────────────┐
 │                      REACT FRONTEND                       │
 │        (React 18 + Vite + Tailwind CSS + Recharts)         │
 └─────────────────────────────┬─────────────────────────────┘
                               │ HTTP REST Requests (Axios)
                               ▼
 ┌───────────────────────────────────────────────────────────┐
 │                      EXPRESS BACKEND                      │
 │          (Node.js + JWT Auth + Local AI Engine)          │
 └──────────────┬─────────────────────────────┬──────────────┘
                │                             │
                ▼                             ▼
 ┌─────────────────────────────┐ ┌───────────────────────────┐
 │         MYSQL DATABASE      │ │      NODE-CRON SERVICE    │
 │       (Sequelize ORM)       │ │     (Auto-Escalations)    │
 └─────────────────────────────┘ └───────────────────────────┘
```

| Layer | Technology / Library | Description |
|---|---|---|
| **Frontend** | React 18, Vite | Component-driven SPA framework with fast HMR |
| **Styling** | Tailwind CSS, Lucide Icons | Responsive layout & modern UI design system |
| **Charts & Data** | Recharts, Axios | Interactive visual data graphs & HTTP client |
| **Backend** | Node.js, Express.js | High-performance RESTful API server |
| **Database** | MySQL 8.x, Sequelize ORM | Relational schema with foreign keys & auto-sync |
| **Security** | JWT, bcryptjs | Encrypted authentication & token authorization |
| **AI / GenAI** | Custom Local Rule-Based NLP Engine | 100% offline text scoring, classification & generation |
| **PDF Reporting** | PDFKit | Server-side PDF report compilation |
| **Background Scheduler**| node-cron | Cron job executing periodic SLA checks |

---

## 4. Local AI Engine Details

> 💡 **Zero External API Dependency**: This system operates entirely **offline** inside the Node.js runtime. No API keys (OpenAI, Gemini, Anthropic) are required, making it cost-free, privacy-friendly, and lightweight.

Located in [`backend/utils/localAiEngine.js`](file:///f:/Complaint%20Management%20System/backend/utils/localAiEngine.js):

1. **Smart Categorization Engine**: Scores complaint text against weighted keyword banks across 10 categories (Plumbing, Electrical, Cleaning, Ragging/Security, Wi-Fi/Network, Mess/Food, Infrastructure, Furniture, Noise/Discipline, Other). Computes confidence percentage.
2. **Dynamic Priority Scorer**: Analyzes severity indicators ("emergency", "fire", "leak", "broken") and category impact to calculate a priority rating: `Low`, `Medium`, `High`, or `Critical`.
3. **Professional Text Generator**: Transforms informal student inputs into polished formal complaints using dynamic templating and contextual phrasing.
4. **Suggested Resolution Estimator**: Predicts responsible department, estimated turnaround time (in hours), and standard operating procedures (SOP).
5. **Offline Intent Chatbot**: Recognizes student intent via keyword patterns to answer common questions regarding hostel rules, complaint workflow, and emergency contacts.

---

## 5. Folder Structure

```
Complaint Management System/
├── backend/
│   ├── config/
│   │   └── db.js                 # MySQL Sequelize connection setup
│   ├── controllers/              # Request handlers
│   │   ├── adminController.js    # Dashboard stats, PDF generation & management
│   │   ├── aiController.js       # AI analysis & chatbot endpoints
│   │   ├── authController.js     # Login, Register, Password reset
│   │   ├── complaintController.js# Student complaint CRUD
│   │   └── feedbackController.js # Feedback submission & retrieval
│   ├── database/
│   │   ├── schema.sql            # Raw MySQL DDL Dumps
│   │   └── seed.js              # Initial database seed script
│   ├── jobs/
│   │   └── escalationJob.js      # Background node-cron SLA service
│   ├── middleware/
│   │   ├── auth.js               # JWT verification & RBAC middleware
│   │   └── errorHandler.js       # Global Express error handler
│   ├── models/                   # Sequelize ORM Schema Definitions
│   │   ├── AiSuggestion.js
│   │   ├── Complaint.js
│   │   ├── Escalation.js
│   │   ├── Feedback.js
│   │   ├── User.js
│   │   └── index.js
│   ├── routes/                   # API Route definitions
│   │   ├── adminRoutes.js
│   │   ├── aiRoutes.js
│   │   ├── authRoutes.js
│   │   ├── complaintRoutes.js
│   │   └── feedbackRoutes.js
│   ├── utils/
│   │   ├── generateToken.js      # JWT generator helper
│   │   └── localAiEngine.js      # Local offline NLP & GenAI logic
│   ├── .env.example              # Environment template
│   ├── package.json              # Backend dependencies
│   └── server.js                 # Entry point Express app
├── frontend/
│   ├── src/
│   │   ├── components/           # Reusable UI elements
│   │   │   ├── ChatAssistant.jsx # Offline AI Chat widget
│   │   │   ├── ComplaintCard.jsx # Complaint list card item
│   │   │   ├── Navbar.jsx        # Navigation header
│   │   │   ├── ProtectedRoute.jsx# Auth wrapper
│   │   │   ├── Sidebar.jsx       # Side navigation bar
│   │   │   └── StatCard.jsx      # Dashboard statistic card
│   │   ├── context/
│   │   │   ├── AuthContext.jsx   # Global User Auth state
│   │   │   └── ThemeContext.jsx  # Dark/Light theme state
│   │   ├── pages/
│   │   │   ├── admin/
│   │   │   │   ├── AdminDashboard.jsx
│   │   │   │   └── ManageComplaints.jsx
│   │   │   ├── auth/
│   │   │   │   ├── Login.jsx
│   │   │   │   └── Register.jsx
│   │   │   └── student/
│   │   │       ├── Feedback.jsx
│   │   │       ├── MyComplaints.jsx
│   │   │       ├── NewComplaint.jsx
│   │   │       └── StudentDashboard.jsx
│   │   ├── services/
│   │   │   └── api.js            # Axios client instance & endpoints
│   │   ├── App.jsx               # Routes & Layout root
│   │   ├── index.css             # Tailwind base styles
│   │   └── main.jsx              # React app entry point
│   ├── .env.example              # Frontend environment template
│   ├── index.html                # HTML entry point
│   ├── package.json              # Frontend dependencies
│   ├── tailwind.config.js        # Tailwind CSS config
│   └── vite.config.js            # Vite bundler config
├── .gitignore                    # Global git ignore configuration
└── README.md                     # System documentation
```

---

## 6. Database Design & ER Schema

The database consists of 5 core relational tables in MySQL:

- **`users`**: Stores user authentication profiles, hashed passwords, roles (`student`, `admin`, `warden`), hostel block, and room numbers.
- **`complaints`**: Tracks complaint title, description, category, priority, status, assigned technician, student ID, and timestamps.
- **`ai_suggestions`**: Holds output generated by the local AI engine for each complaint (confidence score, suggested category, suggested priority, resolution template).
- **`escalations`**: Records escalation history (manual or cron auto-escalations), reason, escalated by user ID, and target level.
- **`feedback`**: Contains student rating (1 to 5 stars), resolution satisfaction comments, and associated complaint ID.

---

## 7. API Documentation

### 🔑 Authentication Routes (`/api/auth`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/auth/register` | Public | Register new student/admin/warden account |
| `POST` | `/api/auth/login` | Public | Authenticate user and issue JWT token |
| `POST` | `/api/auth/forgot-password` | Public | Request password reset token |
| `POST` | `/api/auth/reset-password` | Public | Reset password with token |
| `GET` | `/api/auth/profile` | Authenticated | Get current logged-in user profile |
| `PUT` | `/api/auth/profile` | Authenticated | Update profile details |

### 📝 Complaint Routes (`/api/complaints`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/complaints` | Student | Create complaint with automatic local AI processing |
| `GET` | `/api/complaints/mine` | Student | Fetch logged-in student's complaints |
| `GET` | `/api/complaints/:id` | Authenticated | Fetch specific complaint details |
| `PUT` | `/api/complaints/:id` | Student | Update a pending complaint |
| `DELETE` | `/api/complaints/:id` | Student/Admin | Delete a complaint |

### 🛡️ Admin & Warden Routes (`/api/admin`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/admin/complaints` | Admin/Warden | List all complaints with filtering & pagination |
| `PUT` | `/api/admin/complaints/:id/status` | Admin/Warden | Update complaint status (In Progress, Resolved, etc.) |
| `PUT` | `/api/admin/complaints/:id/assign` | Admin/Warden | Assign technician/department staff |
| `POST` | `/api/admin/complaints/:id/escalate` | Admin/Warden | Manually escalate complaint priority/level |
| `GET` | `/api/admin/dashboard-stats` | Admin/Warden | Fetch analytics metrics & chart summary data |
| `GET` | `/api/admin/reports/pdf` | Admin/Warden | Download compiled PDF complaint report |

### 🤖 AI Utilities Routes (`/api/ai`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/ai/analyze` | Authenticated | Generate category, priority & SOP for complaint draft |
| `POST` | `/api/ai/generate-complaint`| Authenticated | Convert informal text into formal professional text |
| `POST` | `/api/ai/chat` | Authenticated | Query local offline help chatbot |

### ⭐ Feedback Routes (`/api/feedback`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/feedback` | Student | Submit rating & feedback for resolved complaint |
| `GET` | `/api/feedback` | Admin/Warden | Retrieve all feedback entries |

---

## 8. Step-by-Step Installation & Setup

### Prerequisites

Ensure you have the following installed on your machine:
- **Node.js** (v18.x or v20.x LTS) — [Download](https://nodejs.org)
- **MySQL Server** (v8.0+) — [Download](https://dev.mysql.com/downloads/) or via XAMPP / WAMP
- **Git** — [Download](https://git-scm.com)

---

### Step 1: Database Setup

1. Start your MySQL Server (via MySQL Workbench, Command Line, or XAMPP Control Panel).
2. Open terminal/PowerShell and create the database:
   ```bash
   mysql -u root -p -e "CREATE DATABASE grievance_system;"
   ```
3. (Optional) Run the database schema SQL file:
   ```bash
   mysql -u root -p grievance_system < backend/database/schema.sql
   ```
   > *Note: Sequelize automatically synchronizes and creates tables on backend launch if they do not exist.*

---

### Step 2: Backend Configuration & Launch

1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
3. Open `backend/.env` and fill in your MySQL credentials:
   ```env
   PORT=5000
   NODE_ENV=development
   CLIENT_URL=http://localhost:5173

   DB_HOST=localhost
   DB_PORT=3306
   DB_NAME=grievance_system
   DB_USER=root
   DB_PASSWORD=your_mysql_password_here

   JWT_SECRET=super_secret_jwt_key_12345
   JWT_EXPIRES_IN=7d
   ESCALATION_HOURS=72
   ```
4. Install dependencies:
   ```bash
   npm install
   ```
5. Seed initial demo data:
   ```bash
   npm run seed
   ```
6. Start the backend development server:
   ```bash
   npm run dev
   ```
   The backend server will run on `http://localhost:5000`.

---

### Step 3: Frontend Configuration & Launch

1. Open a new terminal and navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
3. Ensure `frontend/.env` points to your backend URL:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```
4. Install dependencies:
   ```bash
   npm install
   ```
5. Start the frontend Vite server:
   ```bash
   npm run dev
   ```
6. Open `http://localhost:5173` in your web browser.

---

## 9. Demo Credentials

After running `npm run seed` in the backend, you can log in with the following pre-configured test accounts (Password for all: `Password@123`):

| Role | Email | Password | Access Level |
|---|---|---|---|
| **Administrator** | `admin@college.edu` | `Password@123` | Full system access, staff assignment, PDF reports |
| **Hostel Warden** | `warden@college.edu` | `Password@123` | Hostel complaints, status management, escalations |
| **Student** | `student@college.edu` | `Password@123` | Complaint creation, AI writer, tracking, feedback |

---

## 10. Troubleshooting & FAQ

| Problem | Cause | Solution |
|---|---|---|
| `ER_ACCESS_DENIED_ERROR` | Incorrect MySQL credentials | Verify `DB_USER` & `DB_PASSWORD` in `backend/.env`. |
| `ECONNREFUSED 127.0.0.1:3306` | MySQL service is not running | Start MySQL via Windows Services (`services.msc`), XAMPP control panel, or `net start mysql`. |
| `Unknown database 'grievance_system'` | Database not created yet | Run `CREATE DATABASE grievance_system;` in MySQL client. |
| `CORS Error in Console` | Mismatch between frontend URL and `CLIENT_URL` | Ensure `CLIENT_URL=http://localhost:5173` matches Vite server URL. |
| `EADDRINUSE: address already in use :::5000` | Port 5000 occupied by another application | Change `PORT=5001` in `backend/.env` or terminate the process using port 5000. |

---

## 11. How to Push to GitHub

To push this repository to your GitHub account (`Omkar-ijardar`):

1. **Initialize Git & Commit Locally** *(if not already done)*:
   ```bash
   git init
   git add .
   git commit -m "chore: initial commit with full system features and README"
   ```

2. **Create a New Repository on GitHub**:
   - Go to [GitHub New Repository](https://github.com/new).
   - Set repository name: `Complaint-Management-System`.
   - Set visibility (Public or Private) and click **Create repository**.

3. **Link Remote & Push**:
   ```bash
   git remote add origin https://github.com/Omkar-ijardar/Complaint-Management-System.git
   git branch -M main
   git push -u origin main
   ```

---

## 12. License

This project is licensed under the [MIT License](LICENSE) — feel free to modify and adapt it for academic, personal, or institutional use.
