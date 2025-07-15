import Booking from "../models/Booking.js"
import Car from "../models/Car.js";


// Function to Check Availability of Car for a given Date
const checkAvailability = async (car, pickupDate, returnDate)=>{
    const bookings = await Booking.find({
        car,
        pickupDate: {$lte: returnDate},
        returnDate: {$gte: pickupDate},
    })
    return bookings.length === 0;
}

// API to Check Availability of Cars for the given Date and location
export const checkAvailabilityOfCar = async (req, res)=>{
    try {
        const {location, pickupDate, returnDate} = req.body

        // fetch all available cars for the given location , also check that they are available (Without date check)
        const cars = await Car.find({location, isAvaliable: true})

        // check car availability for the given date range using promise (With date check ) , ans store them in a new array
        // We are using map to iterate over the cars array and check availability for each car
        const availableCarsPromises = cars.map(async (car)=>{
           const isAvailable = await checkAvailability(car._id, pickupDate, returnDate)
           return {...car._doc, isAvailable: isAvailable}
        })

        // Wait for all promises to resolve 
        // availableCarsPromises is an array of promises, we need to resolve them to get the actual car objects
        // We are using Promise.all to wait for all promises to resolve
        let availableCars = await Promise.all(availableCarsPromises);
        // filter out the cars that are not available
        availableCars = availableCars.filter(car => car.isAvailable === true)

        res.json({success: true, availableCars})

    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}

// API to Create Booking
export const createBooking = async (req, res)=>{
    try {
        // USer id added by the auth middleware
        // car, pickupDate, returnDate are taken from the request body
        const {_id} = req.user;
        const {car, pickupDate, returnDate} = req.body;


        // Check if the car is available for the given date range
        // We are using the checkAvailability function to check if the car is available for the given
        const isAvailable = await checkAvailability(car, pickupDate, returnDate)
        if(!isAvailable){
            return res.json({success: false, message: "Car is not available"})
        }

        
        // Fetch the car data to get the owner and price
        const carData = await Car.findById(car)

        // Calculate price based on pickupDate and returnDate
        const picked = new Date(pickupDate);
        const returned = new Date(returnDate);
        const noOfDays = Math.ceil((returned - picked) / (1000 * 60 * 60 * 24))
        const price = carData.pricePerDay * noOfDays;

        // Create a new booking
        // The Booking model has a reference to the car, user, and owner
        await Booking.create({car, owner: carData.owner, user: _id, pickupDate, returnDate, price})

        res.json({success: true, message: "Booking Created"})

    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}

// API to List User Bookings 
export const getUserBookings = async (req, res)=>{
    try {
        const {_id} = req.user;
        // .populate("car") tells Mongoose to automatically replace the car field (which is just an ID) with the full Car document from the Car collection.
        const bookings = await Booking.find({ user: _id }).populate("car").sort({createdAt: -1})

        res.json({success: true, bookings})

    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}

// API to get Owner Bookings

export const getOwnerBookings = async (req, res)=>{
    try {
        if(req.user.role !== 'owner'){
            return res.json({ success: false, message: "Unauthorized" })
        }
        // just to get the bookings of the owner
        // .populate('car user') tells Mongoose to automatically replace the car and user fields
        // also rmoving password from user .
        const bookings = await Booking.find({owner: req.user._id}).populate('car user').select("-user.password").sort({createdAt: -1 })
        res.json({success: true, bookings})
    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}

// API to change booking status
export const changeBookingStatus = async (req, res)=>{
    try {
        const {_id} = req.user;
        const {bookingId, status} = req.body

        const booking = await Booking.findById(bookingId)

        // check if the user which is trying to change the status is the owner of the booking car .
        if(booking.owner.toString() !== _id.toString()){
            return res.json({ success: false, message: "Unauthorized"})
        }

        // set the status of the booking to the given status
        booking.status = status;
        // save the booking
        await booking.save();


        res.json({ success: true, message: "Status Updated"})
    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}