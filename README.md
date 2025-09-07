# VisitPass - Hospital Visitor Management System

VisitPass is a full-stack web application designed to streamline visitor management for hospitals and clinics. It provides role-based access for visitors, security personnel, and administrators.

## Features

- **Visitor Flow:** Phone number (OTP) based signup and login.
- **Digital Pass:** Visitors get a unique QR code to use for entry and exit.
- **Security Dashboard:** Staff can scan QR codes to log visitor entry/exit times.
- **Admin Dashboard:** Admins can manage staff accounts and generate daily visitor reports.
- **Role-Based Access Control:** Strict separation of permissions for Visitors, Security, and Admins.

## Tech Stack

### Frontend
- **Framework:** React
- **Routing:** React Router
- **HTTP Client:** Axios
- **Authentication:** Firebase Authentication (for phone OTP)
- **QR Scanning:** @yudiel/react-qr-scanner

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose
- **Authentication:** JWT (for internal API) & Firebase Admin SDK (to verify client tokens)
- **File Uploads:** Multer

## Project Setup

### Prerequisites
- Node.js (v18 or later recommended)
- npm
- MongoDB database instance (local or cloud like MongoDB Atlas)
- A Firebase project with Phone Authentication enabled.

### Backend Setup
1. Navigate to the backend directory.
2. Create a `.env` file by copying `.env.example`.
3. Fill in the required values:
   - `PORT`: The port for the server (e.g., 5000).
   - `MONGO_URI`: Your MongoDB connection string.
   - `JWT_SECRET`: A long, random, secret string for signing tokens.
   - `FIREBASE_SERVICE_ACCOUNT`: The JSON service account key from your Firebase project settings.
4. Run `npm install` to install dependencies.
5. Run `npm run dev` to start the development server.

### Frontend Setup
1. Navigate to the frontend directory.
2. Create a `.env` file by copying `.env.example`.
3. Fill in the required values:
   - `REACT_APP_API_URL`: The URL of your running backend (e.g., http://localhost:5000/api).
4. Run `npm install` to install dependencies.
5. Run `npm start` to start the React development server.

## Deployment Notes

This application is configured for deployment on Vercel.

**Important:** The current implementation for visitor selfie uploads uses the local server filesystem (`/uploads` directory). This will **not** work correctly on serverless platforms like Vercel, which have an ephemeral filesystem. For a production deployment, this should be replaced with a dedicated cloud storage service like AWS S3, Vercel Blob, or Cloudinary.