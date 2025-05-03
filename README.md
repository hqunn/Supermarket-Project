# CoderStore - Supermarket Management System

A comprehensive full-stack supermarket management system featuring role-based authentication, product browsing, cart functionality, payment processing, and customer management.

---

## 📋 Project Overview

CoderStore is a complete e-commerce solution for supermarket operations with distinct user interfaces for customers, cashiers, and consultants. The application provides seamless shopping experiences for customers while offering management tools for staff.

---

## 🌟 Features

### User Authentication
- Secure login and registration system
- Role-based access control (Customer, Cashier, Consultant)
- User profile management

### Product Management
- Browse products by category
- Detailed product views with specifications
- Advanced product search
- Add new products (Cashier role)

### Shopping Experience
- Interactive shopping cart
- Quantity adjustment
- Multiple payment methods
- Order confirmation and tracking

### Customer Management
- Customer profiles and history
- Order management and tracking
- Customer analytics (for Consultants)

---

## 🛠️ Technology Stack

### Frontend
- **React** - UI library
- **Material UI** - Component library with responsive design
- **React Router DOM** - Navigation and routing
- **React Hook Form** - Form validation
- **Yup** - Schema validation
- **Axios** - API communication

### Backend
- **Node.js** - JavaScript runtime
- **Express** - Web framework
- **PostgreSQL** - Database
- **JWT** - Authentication
- **Bcrypt** - Password encryption

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- PostgreSQL database

### Backend Setup
```bash
# Navigate to backend directory
cd Supermarket-backend-main

# Install dependencies
npm install

# Create environment file with your configurations
# Example .env file content:
PORT=5000
DB_USER=myuser
DB_PASSWORD=mypassword
DB_HOST=localhost
DB_PORT=5432
DB_NAME=supermarket
JWT_SECRET=your_secret_key

# Start development server
npm run dev
```
### Frontend Setup
```bash
# Navigate to frontend directory
cd Supermarket-main

# Install dependencies
npm install

# Start development server
npm start
```

The application will open at [http://localhost:3000](http://localhost:3000) with the backend running at [http://localhost:5000](http://localhost:5000).

---
## 📂 Project Structure
### Frontend Structure
```csharp
Supermarket-main/
├── public/          # Static files
├── src/
│   ├── app/         # App configuration
│   ├── components/  # Reusable UI components
│   ├── contexts/    # React context providers
│   ├── layouts/     # Page layouts
│   ├── pages/       # Application pages
│   └── utils/       # Utility functions
```
### Backend Structure
```csharp
Supermarket-backend-main/
├── public/          # Static assets
├── src/
│   ├── middleware/  # Express middleware
│   ├── routes/      # API routes
│   ├── db.js        # Database configuration
│   └── server.js    # Express server setup
```
---
## 📡 API Endpoints
### Authentication
- POST /auth/register - Register a new user
- POST /auth/login - User login
### Products
- GET /todos/categories - Get all product categories
- GET /todos/products/:id - Get product details by ID
- POST /todos/products - Add new product (Cashier only)
### User Data
- GET /todos/profile/customer/:id - Get customer profile data
---
## 🖥️ Role-Based Access
## Customer
- Browse products
- Add items to cart
- Process payments
- View order history
## Cashier
- Add new products to inventory
- View customer orders
## Consultant
- View customer list
- Access customer analytics
---
## 📱 Responsive Design
The application is fully responsive, providing an optimal viewing experience across a wide range of devices from desktop computers to mobile phones.

---
## 🔨 Building for Production
### Frontend
```bash
cd Supermarket-main
npm run build
```

This creates optimized production files in the build folder.
### Backend
The backend can be deployed to any Node.js hosting service like Heroku, Vercel, or AWS.
---
## 📜 License
MIT License - See [LICENSE](https://choosealicense.com/licenses/mit/) for details.

---
## 👥 Contributors
- Dinh Hoang Quan - 2352986

© 2025 CoderStore. All Rights Reserved.
