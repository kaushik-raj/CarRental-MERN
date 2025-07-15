import express from "express";
import { getCars, getUserData, loginUser, registerUser } from "../controllers/userController.js";
import { protect } from "../middleware/auth.js";

const userRouter = express.Router();

userRouter.post('/register', registerUser)
userRouter.post('/login', loginUser)
// This route is protected by the 'protect' middleware, which checks if the user is authenticated
// If the user is authenticated, it retrieves the user's data and sends it in the response
userRouter.get('/data', protect, getUserData)
userRouter.get('/cars', getCars)

export default userRouter;