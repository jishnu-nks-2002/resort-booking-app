# 🏖️ Resort Booking Web Application

A full-stack resort booking platform built with React/Vite frontend and Node.js backend, featuring comprehensive booking management, package management, and user authentication.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [API Documentation](#api-documentation)
- [Usage](#usage)
- [Screenshots](#screenshots)


## ✨ Features

### Frontend Features
- **Hero Section**: Stunning resort imagery with call-to-action
- **Services Showcase**: Accommodation, Adventure Activities, Wellness & Spa
- **Gallery**: Interactive resort image gallery
- **Booking System**: Complete booking flow with real-time validation
- **User Authentication**: Secure login and registration
- **User Dashboard**: View and manage bookings
- **Admin Panel**: Comprehensive booking and package management
- **Responsive Design**: Mobile-first approach with Tailwind CSS and Gsap for animation

### Backend Features
- **RESTful API**: Built with Node.js and Express/JavaScript
- **Authentication & Authorization**: JWT-based secure authentication
- **Role-Based Access Control**: User and Admin roles
- **Booking Management**: Full CRUD operations for bookings
- **Package Management**: Create and manage resort packages with image uploads
- **User Management**: Admin user management capabilities
- **Database**: MongoDB with proper schema design
- **Validation & Sanitization**: Input validation and security best practices

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 18+ / Vite
- **Styling**: Tailwind CSS, CSS and Gsap
- **HTTP Client**: Axios
- **State Management**: React Hooks
- **Routing**: React Router DOM
- **Build Tool**: Vite

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: JavaScript
- **Database**: MongoDB
- **Authentication**: JWT (jsonwebtoken)
- **File Upload**: Multer
- **Validation**: Express Validator


### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- PostgreSQL or MongoDB
- Git

### Clone Repository
```bash
git clone https://github.com/yourusername/resort-booking-app.git
cd resort-booking-app
```

### Frontend Setup
```bash
cd frontend
npm install
```

### Backend Setup
```bash
cd backend
npm install
```

### Backend (.env)
PORT=5000
MONGODB_URI="mongodb+srv://jishnumindstory_db_user:kckSFXbYPU3uvnFU@cluster0.lrzo2lo.mongodb.net/?appName=Cluster0"
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
NODE_ENV=development

## 📚 API Documentation
Authentication Routes
| Method   | Endpoint       | Description                                 |
| -------- | -------------- | ------------------------------------------- |
| **POST** | `/register`    | Register a new user (with validation).      |
| **POST** | `/login`       | Login for normal users (with validation).   |
| **POST** | `/admin/login` | Login route for admin users.                |
| **GET**  | `/profile`     | Get authenticated user profile (Protected). |

Booking Routes
| Method     | Endpoint                | Middleware                 | Description                        |
| ---------- | ----------------------- | -------------------------- | ---------------------------------- |
| **POST**   | `/`                     | protect, bookingValidation | Create a new booking.              |
| **GET**    | `/`                     | protect, admin             | Get all bookings (Admin only).     |
| **GET**    | `/user`                 | protect                    | Get bookings of logged-in user.    |
| **GET**    | `/user/:userId`         | protect                    | Get bookings of a specific user.   |
| **GET**    | `/:id`                  | protect                    | Get booking by ID.                 |
| **PATCH**  | `/:id/status`           | protect, admin             | Update booking status.             |
| **PATCH**  | `/:id/start-cooking`    | protect, admin             | Mark order as “cooking started”.   |
| **PATCH**  | `/:id/complete-cooking` | protect, admin             | Mark order as “cooking completed”. |
| **DELETE** | `/:id`                  | protect, admin             | Delete a booking.                  |

Public Routes
| Method  | Endpoint | Description          |
| ------- | -------- | -------------------- |
| **GET** | `/`      | Get all packages.    |
| **GET** | `/:id`   | Get a package by ID. |

Admin Routes (Protected + Image Upload)

| Method     | Endpoint      | Middleware                                                                | Description                            |
| ---------- | ------------- | ------------------------------------------------------------------------- | -------------------------------------- |
| **POST**   | `/`           | protect, admin, uploadPackageImages, handleMulterError, packageValidation | Create a new package with images.      |
| **PUT**    | `/:id`        | protect, admin, uploadPackageImages, handleMulterError                    | Update package info + images.          |
| **DELETE** | `/:id`        | protect, admin                                                            | Delete a package.                      |
| **PATCH**  | `/:id/toggle` | protect, admin                                                            | Toggle package active/inactive status. |
| **DELETE** | `/:id/images` | protect, admin                                                            | Delete a single package image.         |





### Base URL
```
http://localhost:5000/api
```

**Frontend:**
```bash
cd frontend
npm run dev
# Runs on http://localhost:5173
```

**Backend:**
```bash
cd backend
npm run dev
# Runs on http://localhost:5000
```

#### Production Build

**Frontend:**
```bash
npm run build
npm run preview
```

**Backend:**
```bash
npm run build
npm start
```

### Default Admin Credentials
```
Email: admin@resort.com
Password: admin123
```

## 📸 Screenshots

### Hero Section
Modern landing page with stunning resort imagery and clear call-to-action.
<img width="1915" height="933" alt="image" src="https://github.com/user-attachments/assets/f8e31014-71fc-4d5f-ae35-fe4d8f5ed618" />


### Services Section
Three-column layout showcasing Accommodation, Adventure Activities, and Wellness & Spa services.
<img width="1741" height="975" alt="image" src="https://github.com/user-attachments/assets/a9341514-9525-4acc-910c-46496157095c" />


### Gallery
Grid layout displaying resort images with responsive design.
<img width="1030" height="701" alt="image" src="https://github.com/user-attachments/assets/4bf4c1cf-fe3f-48ca-83ec-84db0432d543" />


### Booking packages
User-friendly form with validation and real-time feedback.
<img width="1919" height="931" alt="image" src="https://github.com/user-attachments/assets/f8a9d910-30fc-4c01-84e9-2e35d480faf2" />


### Admin Dashboard
Comprehensive dashboard for managing bookings, packages, and users.
<img width="1901" height="875" alt="image" src="https://github.com/user-attachments/assets/b9e92255-4998-43b4-99ab-89af58a1cb2d" /><img width="1916" height="936" alt="image" src="https://github.com/user-attachments/assets/78eb31ce-6c33-4e62-87ad-b0f6a5323ed9" />
<img width="1910" height="943" alt="image" src="https://github.com/user-attachments/assets/3bf6d5ce-9482-41ad-86c8-3e24c84640ab" />
<img width="1604" height="720" alt="image" src="https://github.com/user-attachments/assets/db67891f-1fe0-4f80-b9e7-5a8288de183e" />

<img width="1910" height="909" alt="image" src="https://github.com/user-attachments/assets/eaa3b297-4ab7-4878-91b5-0aa48511ab67" />
<img width="1882" height="936" alt="image" src="https://github.com/user-attachments/assets/52eb195f-ecb9-4ed7-bd9f-822f162739a9" />



## 🔐 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Input validation and sanitization
- CORS configuration
- Secure file upload handling

### Users Table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  role ENUM('user', 'admin') DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Bookings Table
```sql
CREATE TABLE bookings (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  package_id UUID REFERENCES packages(id),
  check_in_date DATE NOT NULL,
  check_out_date DATE NOT NULL,
  guests INTEGER NOT NULL,
  total_price DECIMAL(10,2) NOT NULL,
  status ENUM('pending', 'confirmed', 'cooking', 'completed', 'cancelled'),
  special_requests TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Packages Table
```sql
CREATE TABLE packages (
  id UUID PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  category VARCHAR(100),
  features JSONB,
  images TEXT[],
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


## 👥 Authors

- https://github.com/jishnu-nks-2002

## 🙏 Acknowledgments

- Built as part of Full Stack Machine Test
- Thanks to all contributors
- Inspired by modern resort booking platforms


**Made with by [jishnu]**
