# API Endpoints Documentation

This document provides a structured overview of all API endpoints used in this project, including both server-side (Express.js) and client-side (axios) usage.

---

## Server API Endpoints

### 1. **Authentication (`/api/auth/`):**

- `POST   /register` — Register a new user
- `POST   /login` — Login user
- `POST   /verify-otp` — Verify OTP
- `POST   /resend-otp` — Resend OTP
- `GET    /branches` — Get all branches
- `GET    /profile/:id` — Get user profile
- `POST   /forgot-password` — Forgot password
- `PUT    /reset-password/:resetToken` — Reset password
- `GET    /private` — Get private user data (protected)

### 2. **Super Admin (`/api/superadmin/`):**

#### Branches

- `GET    /branches` — List all branches
- `POST   /branches` — Create a branch
- `PUT    /branches/:id` — Update a branch
- `DELETE /branches/:id` — Delete a branch

#### Clubs

- `GET    /clubs` — List all clubs
- `POST   /clubs` — Create a club
- `PUT    /clubs/:id` — Update a club
- `DELETE /clubs/:id` — Delete a club

#### Admins

- `GET    /admins` — List all admins
- `POST   /admins` — Create an admin
- `PUT    /admins/:id` — Update an admin
- `PUT    /admins/:id/deactivate` — Deactivate admin
- `PUT    /admins/:id/reactivate` — Reactivate admin

#### Users

- `GET    /users` — List all users
- `PUT    /users/:id/ban` — Ban user
- `PUT    /users/:id/unban` — Unban user

#### Stats

- `GET    /stats` — Get system statistics

### 3. **Admin (`/api/admin/`):**

- `GET    /users` — List all users
- `PUT    /users/:uid` — Update user
- `POST   /event` — Add event
- `PUT    /event/:eid` — Update event
- `PUT    /product/:pid` — Update product listing
- `GET    /comment/:eid` — Get all comments for event

### 4. **Categories (`/api/categories/`):**

- `GET    /` — List all categories
- `POST   /` — Create category
- `PUT    /:id` — Update category
- `DELETE /:id` — Delete category

### 5. **Events (`/api/event/`):**

- `GET    /` — List all events
- `POST   /` — Create event
- `GET    /:eid` — Get event details
- `POST   /:eid/rsvp` — RSVP to event
- `GET    /:eid/comment` — Get comments for event
- `POST   /:eid/comment` — Add comment to event

### 6. **Products (`/api/product/`):**

- `GET    /` — List all products
- `POST   /` — Add product
- `GET    /:id` — Get product details
- `PUT    /:id` — Update product
- `DELETE /:id` — Delete product
- `PUT    /:id/approve` — Approve product (admin)
- `PUT    /:id/reject` — Reject product (admin)
- `PUT    /:id/sold` — Mark product as sold

### 7. **Payments (`/api/payments/`):**

- `GET    /key` — Get Razorpay key
- `POST   /create-order` — Create payment order
- `POST   /verify` — Verify payment
- `GET    /my` — Get my payments
- `GET    /:id` — Get payment by ID
- `GET    /admin/all` — Get all payments (admin)

### 8. **Messages (`/api/message/`):**

- `GET    /` — Get all messages
- `POST   /:pid` — Send message to product owner

---

## Client API Usage

The client uses axios to interact with the above endpoints. The main service files are in `client/src/features/`:

- `authService.js` — Handles authentication endpoints
- `superAdminService.js` — Handles super admin endpoints
- `adminService.js` — Handles admin endpoints
- `categoryService.js` — Handles category endpoints
- `eventService.js` — Handles event endpoints
- `productService.js` — Handles product endpoints
- `paymentService.js` — Handles payment endpoints
- `messageService.js` — Handles message endpoints
- `commentService.js` — Handles event comment endpoints

Each service file contains functions that map directly to the endpoints above, using axios for HTTP requests. See the respective service files for details on request parameters and usage.

---

## Notes

- All endpoints requiring authentication expect a Bearer token in the `Authorization` header.
- Some endpoints are restricted to admin or super admin users.
- For more details, see the controller and service files in the codebase.
