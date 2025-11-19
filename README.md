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
- **Responsive Design**: Mobile-first approach with Tailwind CSS

### Backend Features
- **RESTful API**: Built with Node.js and Express/TypeScript
- **Authentication & Authorization**: JWT-based secure authentication
- **Role-Based Access Control**: User and Admin roles
- **Booking Management**: Full CRUD operations for bookings
- **Package Management**: Create and manage resort packages with image uploads
- **User Management**: Admin user management capabilities
- **Database**: PostgreSQL/MongoDB with proper schema design
- **Validation & Sanitization**: Input validation and security best practices

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 18+ / Vite
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **State Management**: React Hooks
- **Routing**: React Router DOM
- **Build Tool**: Vite

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL / MongoDB
- **Authentication**: JWT (jsonwebtoken)
- **File Upload**: Multer
- **Validation**: Express Validator / Joi

## 📁 Project Structure

```
resort-booking-app/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Hero.jsx
│   │   │   ├── Services.jsx
│   │   │   ├── Gallery.jsx
│   │   │   └── Footer.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Bookings.jsx
│   │   │   └── Admin/
│   │   ├── services/
│   │   │   └── api.js
│   │   └── App.jsx
│   ├── package.json
│   └── vite.config.js
│
└── backend/
    ├── src/
    │   ├── controllers/
    │   ├── models/
    │   ├── routes/
    │   ├── middleware/
    │   └── config/
    ├── package.json
    └── tsconfig.json
```

## 🚀 Installation

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

## 🔧 Environment Variables

### Frontend (.env)
```env
# For Vite
VITE_API_URL=http://localhost:5000/api

# For Create React App (alternative)
REACT_APP_API_URL=http://localhost:5000/api
```

### Backend (.env)
```env
# Server
PORT=5000
NODE_ENV=development

# Database (PostgreSQL)
DB_HOST=localhost
DB_PORT=5432
DB_NAME=resort_booking
DB_USER=your_username
DB_PASSWORD=your_password

# OR MongoDB
MONGODB_URI=mongodb://localhost:27017/resort_booking

# JWT
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=7d

# File Upload
MAX_FILE_SIZE=5242880
UPLOAD_PATH=./uploads
```

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication Endpoints

#### Register User
```http
POST /auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "+1234567890"
}
```

#### User Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

#### Admin Login
```http
POST /auth/admin/login
Content-Type: application/json

{
  "email": "admin@resort.com",
  "password": "admin123"
}
```

#### Get User Profile
```http
GET /auth/profile
Authorization: Bearer {token}
```

#### Update Profile
```http
PUT /auth/profile
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "John Updated",
  "phone": "+1234567890"
}
```

### Booking Endpoints

#### Create Booking
```http
POST /bookings
Authorization: Bearer {token}
Content-Type: application/json

{
  "packageId": "package_id",
  "checkInDate": "2024-12-01",
  "checkOutDate": "2024-12-05",
  "guests": 2,
  "specialRequests": "Late check-in preferred"
}
```

#### Get All Bookings (Admin)
```http
GET /bookings
Authorization: Bearer {admin_token}
Query Parameters: ?status=pending&page=1&limit=10
```

#### Get User Bookings
```http
GET /bookings/user
Authorization: Bearer {token}

# Or for specific user (admin only)
GET /bookings/user/{userId}
Authorization: Bearer {admin_token}
```

#### Get Booking by ID
```http
GET /bookings/{id}
Authorization: Bearer {token}
```

#### Update Booking
```http
PUT /bookings/{id}
Authorization: Bearer {token}
Content-Type: application/json

{
  "checkInDate": "2024-12-02",
  "guests": 3
}
```

#### Update Booking Status (Admin)
```http
PATCH /bookings/{id}/status
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "status": "confirmed"
}
```

#### Start Cooking (Admin)
```http
PATCH /bookings/{id}/start-cooking
Authorization: Bearer {admin_token}
```

#### Complete Cooking (Admin)
```http
PATCH /bookings/{id}/complete-cooking
Authorization: Bearer {admin_token}
```

#### Delete Booking
```http
DELETE /bookings/{id}
Authorization: Bearer {token}
```

### Package Endpoints

#### Get All Packages
```http
GET /packages
Query Parameters: ?active=true&page=1&limit=10
```

#### Get Package by ID
```http
GET /packages/{id}
```

#### Create Package (Admin)
```http
POST /packages
Authorization: Bearer {admin_token}
Content-Type: multipart/form-data

{
  "name": "Deluxe Beach Villa",
  "description": "Luxury beachfront accommodation",
  "price": 299.99,
  "category": "Accommodation",
  "features": ["Ocean View", "Private Pool", "Free WiFi"],
  "images": [file1, file2, file3]
}
```

#### Update Package (Admin)
```http
PUT /packages/{id}
Authorization: Bearer {admin_token}
Content-Type: multipart/form-data

{
  "name": "Updated Package Name",
  "price": 349.99,
  "images": [new_file]
}
```

#### Delete Package (Admin)
```http
DELETE /packages/{id}
Authorization: Bearer {admin_token}
```

#### Toggle Package Status (Admin)
```http
PATCH /packages/{id}/toggle
Authorization: Bearer {admin_token}
```

#### Delete Package Image (Admin)
```http
DELETE /packages/{id}/images
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "imageUrl": "https://example.com/image.jpg"
}
```

### User Management Endpoints (Admin Only)

#### Get All Users
```http
GET /users
Authorization: Bearer {admin_token}
Query Parameters: ?role=user&page=1&limit=10
```

#### Get User by ID
```http
GET /users/{id}
Authorization: Bearer {admin_token}
```

#### Update User
```http
PUT /users/{id}
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "name": "Updated Name",
  "email": "updated@example.com"
}
```

#### Update User Role
```http
PATCH /users/{id}/role
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "role": "admin"
}
```

#### Delete User
```http
DELETE /users/{id}
Authorization: Bearer {admin_token}
```

## 💡 Usage

### Running the Application

#### Development Mode

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
