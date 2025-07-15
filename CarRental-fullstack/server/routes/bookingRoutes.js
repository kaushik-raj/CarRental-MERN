import express from "express";
import { changeBookingStatus, checkAvailabilityOfCar, createBooking, getOwnerBookings, getUserBookings } from "../controllers/bookingController.js";
import { protect } from "../middleware/auth.js";

const bookingRouter = express.Router();

// we didn't use the 'get' method for checking availability because it is not a safe operation.
// 'post' is used to send data in the request body, which is more appropriate for operations that might change the state of the server or require more complex data handling.
// This is a common practice to use 'post' for such operations, even if they don't change the state of the server, to ensure that the request is processed correctly and securely.
// we didn't middleware 'protect' here because this route is used to check availability of a car, which can be done without authentication. Means without login any user can check the availability of a car.
bookingRouter.post('/check-availability', checkAvailabilityOfCar)

bookingRouter.post('/create', protect, createBooking)
bookingRouter.get('/user', protect, getUserBookings)
bookingRouter.get('/owner', protect, getOwnerBookings)
bookingRouter.post('/change-status', protect, changeBookingStatus)

export default bookingRouter;