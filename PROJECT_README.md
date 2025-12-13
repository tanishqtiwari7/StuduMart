# StuduMart (formerly Eduverse) - Enhanced College Community Platform

StuduMart is a comprehensive MERN stack application designed for college communities, featuring advanced role management, secure payments, and branch-based organization.

## Key Features

1.  **Super Admin Dashboard**: Complete control over the system. Manage branches, clubs, admins, and users.
    *   **Default Credentials**: `tanishqtiwari2020@gmail.com` / `superadmin123`
    *   **Access**: `/auth/superadmin` (only visible to Super Admins)

2.  **Role Hierarchy**:
    *   **Super Admin**: System owner.
    *   **Admin**: Club or Department admins (created by Super Admin).
    *   **Student**: End users (register via OTP).

3.  **Branch & Club Management**:
    *   Modular system for B.Tech branches (CSE, ECE, etc.).
    *   Clubs can be linked to specific branches or be college-wide.

4.  **Secure Authentication**:
    *   **OTP Verification**: Email verification required upon registration using Nodemailer.
    *   **JWT Auth**: Secure session management.

5.  **Payment Integration (Razorpay)**:
    *   Secure payments for paid events.
    *   Automatic verification and attendee status update.

6.  **Event Visibility**:
    *   Events can be restricted to specific branches or clubs.
    *   "Public" events visible to all.

## Setup Instructions

### 1. Prerequisites
*   Node.js installed.
*   MongoDB installed and running.
*   Razorpay Account (for keys).
*   Gmail Account (for Nodemailer SMTP).

### 2. Installation

**Backend:**
```bash
cd server
npm install
```

**Frontend:**
```bash
cd client
npm install
```

### 3. Environment Variables

Create a `.env` file in the `server` directory:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret

# Nodemailer
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# Razorpay
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

# Super Admin Creds (Optional overrides, otherwise hardcoded defaults used)
SUPER_ADMIN_EMAIL=tanishqtiwari2020@gmail.com
SUPER_ADMIN_PASSWORD=StuduMart@SuperAdmin2024
```

### 4. Database Seeding

Initialize the database with the Super Admin and default branches:

```bash
cd server
node seeder.js
```

### 5. Running the App

**Development Mode (Concurrent):**
```bash
cd server
npm run dev
```

This will start both the backend (port 5000) and frontend (port 5173).

## Usage Guide

1.  **Super Admin**: Log in with default credentials. Go to `/auth/superadmin` to create branches, clubs, and other admins.
2.  **Student Registration**: Go to `/register`. Fill details, select branch, and verify email via OTP.
3.  **Events**: Admins can create events with visibility settings. Students see events relevant to their branch/clubs.
4.  **Payments**: For paid events, click "Pay Now" to transact via Razorpay.

## Directory Structure
*   `server/models`: Database schemas (User, Branch, Club, Event, Payment).
*   `server/controllers`: Business logic.
*   `client/src/features`: Redux slices (Auth, SuperAdmin, Payment, Events).
*   `client/src/pages`: UI Pages (SuperAdmin, Register, Login, EventDetail).
