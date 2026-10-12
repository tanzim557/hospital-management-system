# Hospital Management System (Full-Stack)

[![Laravel](https://img.shields.io/badge/Laravel-10.x-FF2D20?style=for-the-badge&logo=laravel&logoColor=white)](https://laravel.com/)
[![React](https://img.shields.io/badge/React-18.x-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

A modern, comprehensive, full-stack Hospital Management System built for hospitals, clinics, and healthcare centers. Features complete patient admission, appointment scheduling, doctor records, billing, and cloud deployment configurations.

---

## Architecture Overview

The system is organized into a modular full-stack architecture:

```
hospital/
├── backend/            # Laravel 10 REST API Backend
│   ├── app/            # Models, Controllers, Services and Middleware
│   ├── routes/api.php  # Authenticated API Endpoints
│   ├── database/       # Migrations, Factories and Seeders
│   └── railway.json    # Railway Cloud Deployment Spec
└── frontend/           # Modern React and Vite Single Page Application
    ├── src/            # Components, Pages, State and Services
    ├── vercel.json     # Vercel Deployment Configuration
    └── vite.config.js  # Vite Asset Bundler
```

---

## Key Features

- Doctor and Department Management: Directory of specialized physicians, duty rosters, and consultation hours.
- Smart Appointment Scheduling: Real-time slot allocation, booking confirmations, and patient queues.
- Electronic Health Records (EHR): Secure patient history, diagnosis logs, prescriptions, and medical records.
- Billing and Invoicing: Automated invoice calculation, pharmacy billing, and payment tracking.
- Secure Role-Based Access (RBAC): Admin, Doctor, Receptionist, and Patient permissions with Laravel Sanctum tokens.
- Cloud and Container Ready: Pre-configured for Docker, Railway cloud, and Vercel hosting.

---

## Getting Started

### 1. Backend Setup (Laravel 10 API)
```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate

# Configure your database in .env
php artisan migrate --seed
php artisan serve
```
Backend API runs at http://localhost:8000.

### 2. Frontend Setup (React + Vite)
```bash
cd ../frontend
npm install
npm run dev
```
Frontend client runs at http://localhost:5173.

---

## Author

Developed by Mubassher Alam Tanzim
- GitHub: https://github.com/tanzim557
- Email: mubassheralam0@gmail.com

---

## License
This project is open-source software licensed under the MIT License.
