import express from "express";
import "dotenv/config";
import cors from "cors";
import connectDB from "./configs/db.js";
import userRouter from "./routes/userRoutes.js";
import ownerRouter from "./routes/ownerRoutes.js";
import bookingRouter from "./routes/bookingRoutes.js";

// Initialize Express App
const app = express()

// Connect Database
await connectDB()

// Middleware
// This middleware allows cross-origin requests, enabling the server to accept requests from different origins (like your frontend application).
// This is useful for development when your frontend and backend are running on different ports.
app.use(cors());
// Middleware to parse JSON requests
// This allows the server to understand JSON data sent in requests, such as user login or registration
app.use(express.json());

// Routes
app.get('/', (req, res)=> res.send("Server is running"))
app.use('/api/user', userRouter)
app.use('/api/owner', ownerRouter)
app.use('/api/bookings', bookingRouter)


const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=> console.log(`Server running on port ${PORT}`))