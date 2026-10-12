# ðŸ¥ Hospital Management System (Full-Stack)

[![Laravel](https://img.shields.io/badge/Laravel-10.x-FF2D20?style=for-the-badge&logo=laravel&logoColor=white)](https://laravel.com/)
[![React](https://img.shields.io/badge/React-18.x-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)
[![Railway](https://img.shields.io/badge/Railway-Cloud-0B0D0E?style=for-the-badge&logo=railway&logoColor=white)](https://railway.app/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

> A modern, comprehensive, full-stack Hospital Management System built for hospitals, clinics, and healthcare centers. Features complete patient admission, appointment scheduling, doctor records, billing, and cloud deployment ready configurations.

---

## ðŸ—ï¸ Architecture Overview

The system is decoupled into an enterprise-ready modular architecture:

`
hospital/
â”œâ”€â”€ backend/            # Laravel 10 REST API Backend
â”‚   â”œâ”€â”€ app/            # Models, Controllers, Services & Middleware
â”‚   â”œâ”€â”€ routes/api.php  # Authenticated API Endpoints
â”‚   â”œâ”€â”€ database/       # Migrations, Factories & Seeders
â”‚   â””â”€â”€ railway.json    # Railway Cloud Deployment Spec
â””â”€â”€ frontend/           # Modern React + Vite Single Page Application
    â”œâ”€â”€ src/            # Components, Pages, State & Services
    â”œâ”€â”€ vercel.json     # Vercel Deployment Configuration
    â””â”€â”€ vite.config.js  # Optimized Vite Asset Bundler
`

---

## ðŸŒŸ Key Features

- **ðŸ‘¨â€âš•ï¸ Doctor & Department Management**: Directory of specialized physicians, duty rosters, and consultation hours.
- **ðŸ“… Smart Appointment Scheduling**: Real-time slot allocation, booking confirmations, and patient queues.
- **ðŸ“‹ Electronic Health Records (EHR)**: Secure patient history, diagnosis logs, prescriptions, and medical records.
- **ðŸ’³ Billing & Invoicing**: Automated invoice calculation, pharmacy billing, and payment tracking.
- **ðŸ” Secure Role-Based Access (RBAC)**: Admin, Doctor, Receptionist, and Patient permissions with Laravel Sanctum tokens.
- **â˜ï¸ Cloud & Container Ready**: Pre-configured for Docker, Railway cloud, and Vercel hosting.

---

## ðŸš€ Getting Started

### 1. Backend Setup (Laravel 10 API)
`ash
cd backend
composer install
cp .env.example .env
php artisan key:generate

# Configure your database in .env (MySQL or SQLite)
php artisan migrate --seed
php artisan serve
`
Backend API will be running at http://localhost:8000.

### 2. Frontend Setup (React + Vite)
`ash
cd ../frontend
npm install
npm run dev
`
Frontend client will run at http://localhost:5173.

---

## ðŸ‘¤ Author

Developed by **[Mubassher Alam Tanzim](https://github.com/tanzim557)**  
GitHub: [@tanzim557](https://github.com/tanzim557) â€¢ Email: mubassheralam0@gmail.com

---

## ðŸ“„ License
This project is open-source software licensed under the MIT License.
