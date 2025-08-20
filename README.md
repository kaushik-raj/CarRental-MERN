# 🚗 Car Rental Web App

A full-stack car rental platform that allows users to browse, filter, and rent cars, while also enabling car owners to list and manage their vehicles. The app features secure authentication, role-based access control, and real-time UI feedback.

> **🔗 Live Demo:** (https://car-rental-two-delta.vercel.app/)

---

## 🛠 Tech Stack

**Frontend:**

* React.js
* React Router
* Axios
* React Context API
* Tailwind CSS

**Backend:**

* Node.js
* Express.js
* MongoDB (with Mongoose)
* MongoDB Atlas
* JSON Web Tokens (JWT) for authentication
* Multer for file uploads

---

## 🚀 Features

### 🔐 Authentication & Authorization

* Secure **JWT-based authentication**
* **Role-based access control**: Separate views and features for users and owners
* Protected routes using Express middleware
* Auth state managed globally using React Context API

### 👥 User Functionality

* **User registration and login**
* **Browse and search cars** by brand, model, category, location, etc.
* **Book cars** with selected pickup and return dates
* View personal **booking history and rental status**

### 🚘 Owner Functionality

* Owners can **list their cars** with images and detailed specs
* **Manage listings** and **toggle car availability**
* Access a **dedicated owner dashboard**

### 🌐 General Features

* Clean and **responsive UI** with real-time feedback using toast notifications
* Conditional rendering based on user role
* Form validations for car details and user input

---

## 📁 Folder Structure

client/         // React frontend
server/         // Node.js backend
models/         // Mongoose models
routes/         // Express route handlers
middleware/     // JWT and auth middlewares
uploads/        // Car image storage (local, using multer)


---

## 🧪 To Run Locally

bash
# Clone the repository
git clone https://github.com/your-username/car-rental-app.git

# Navigate to client and server folders to install dependencies
cd client && npm install
cd ../server && npm install

# Set up environment variables (e.g., JWT_SECRET, MongoDB URI)

# Start the servers
cd server && npm run dev
cd ../client && npm run dev


---
