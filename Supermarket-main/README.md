Supermarket Project
A full-stack application featuring a React frontend and Node.js/Express backend for an online supermarket.

Project Structure
The project consists of two main parts:
Supermarket-main: React frontend application
Supermarket-backend-main: Node.js/Express backend API

Setup Instructions

Backend Setup

Navigate to the backend directory:
cd Supermarket-backend-main

Install dependencies:
npm install

Create a .env file in the root of the backend folder with necessary environment variables.

Frontend Setup

Navigate to the frontend directory:
cd Supermarket-main

Install dependencies:
npm install

Running the Application

Backend
Run the development server:
cd Supermarket-backend-main
npm run dev
The backend server will run on http://localhost:5000.

Frontend
Run the React development server:
cd Supermarket-main
npm start
The application will open at http://localhost:3000 in your browser.

Features:
User authentication (login/register)
Product browsing by categories
Customer profile management
Shopping cart functionality

API Endpoints

Authentication
POST /auth/register - Register a new user
POST /auth/login - User login

Products
GET /todos/categories - Get all product categories
GET /todos/products/:id - Get product details by ID

User Data
GET /todos/profile/customer/:id - Get customer profile data

Technologies Used

Frontend:
React
CSS
JavaScript

Backend:
Node.js
Express
SQLite/Better-SQLite3
bcrypt (authentication)
JSON Web Tokens (JWT)

Building for Production
Frontend
This creates optimized production files in the build folder.

Backend
The backend can be deployed to any Node.js hosting service.