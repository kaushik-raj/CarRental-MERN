import imagekit from "../configs/imageKit.js";
import Booking from "../models/Booking.js";
import Car from "../models/Car.js";
import User from "../models/User.js";

// file system module to read files
import fs from "fs";


// API to Change Role of User

export const changeRoleToOwner = async (req, res)=>{
    try {
        // taking user id from the request object
        // This user object is added by the 'protect' middleware
        const {_id} = req.user;
        await User.findByIdAndUpdate(_id, {role: "owner"})
        res.json({success: true, message: "Now you can list cars"})
    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}

// API to List Car

export const addCar = async (req, res)=>{
    try {
        const {_id} = req.user;
        let car = JSON.parse(req.body.carData);
        // This file is uploaded using multer.js(middleware) in the ownerRoutes.js file
        // The file is stored in the 'uploads' folder

        const imageFile = req.file;

        
        // taking the file from the storage
        const fileBuffer = fs.readFileSync(imageFile.path)

        // Upload Image to ImageKit
        // imagekit is a cloud image hosting service
        // The imagekit is configured in the configs/imageKit.js file
        const response = await imagekit.upload({
            file: fileBuffer,
            fileName: imageFile.originalname,
            folder: '/cars'
        })


        // optimization through imagekit URL transformation
        var optimizedImageUrl = imagekit.url({
            path : response.filePath,
            transformation : [
                {width: '1280'}, // Width resizing
                {quality: 'auto'}, // Auto compression
                { format: 'webp' }  // Convert to modern format
            ]
        });

        // Adding the owner id and image url to the car object
        // The owner id is taken from the request object
        const image = optimizedImageUrl;
        await Car.create({...car, owner: _id, image})

        res.json({success: true, message: "Car Added"})

    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}



// API to List Owner Cars

export const getOwnerCars = async (req, res)=>{
    try {
        // The owner id is taken from the request object
        const {_id} = req.user;

        // Finding all the cars that belong to the owner
        // Array of car objects (or [] if none)
        const cars = await Car.find({owner: _id })

        res.json({success: true, cars})
    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}

// API to Toggle Car Availability
// We are not using the findandUpdate method here because we have to check where the deleting user is the owner of the car or not , (basically Authorization). 

export const toggleCarAvailability = async (req, res) =>{
    try {
        const {_id} = req.user;
        const {carId} = req.body
        const car = await Car.findById(carId)

        // Checking is car belongs to the user (USer is the owner of the car)
        if(car.owner.toString() !== _id.toString()){
            return res.json({ success: false, message: "Unauthorized" });
        }

        // Toggling the availability of the car
        // If the car is available, it will be set to not available and vice versa
        car.isAvaliable = !car.isAvaliable;

        // We are saving the car object to the database
        // This will update the car object in the database , no new object is created.
        // If the car is available, it will be set to not available and vice versa
        await car.save()

        res.json({success: true, message: "Availability Toggled"})

    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}

// Api to delete a car
export const deleteCar = async (req, res) =>{
    try {
        const {_id} = req.user;
        const {carId} = req.body
        const car = await Car.findById(carId)

        // Checking is car belongs to the user (Authorization) 
        if(car.owner.toString() !== _id.toString()){
            return res.json({ success: false, message: "Unauthorized" });
        }

        // Here we didn’t directly deleted the whole car object , bcz that car can be in history of some others user .
        //  So , if we delete the whole object , then history will also be changed .
        // So, we are just removing the owner id and setting the availability to false
        // This will make the car not available for booking and also remove the owner from the car
        car.owner = null;
        car.isAvaliable = false;

        await car.save()

        res.json({success: true, message: "Car Removed"})
    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}


// API to get Dashboard Data

export const getDashboardData = async (req, res) =>{
    try {
        const { _id, role } = req.user;

        if(role !== 'owner'){
            return res.json({ success: false, message: "Unauthorized" });
        }

        const cars = await Car.find({owner: _id})
        const bookings = await Booking.find({ owner: _id }).populate('car').sort({ createdAt: -1 });

        const pendingBookings = await Booking.find({owner: _id, status: "pending" })
        const completedBookings = await Booking.find({owner: _id, status: "confirmed" })

        // Calculate TotalRevenue from bookings where status is confirmed
        const monthlyRevenue = bookings.slice().filter(booking => booking.status === 'confirmed').reduce((acc, booking)=> acc + booking.price, 0)

        const dashboardData = {
            totalCars: cars.length,
            totalBookings: bookings.length,
            pendingBookings: pendingBookings.length,
            completedBookings: completedBookings.length,
            recentBookings: bookings.slice(0,3),
            monthlyRevenue
        }

        res.json({ success: true, dashboardData });

    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}

// API to update user image

export const updateUserImage = async (req, res)=>{
    try {
        const { _id } = req.user;

        const imageFile = req.file;

        // Upload Image to ImageKit
        const fileBuffer = fs.readFileSync(imageFile.path)
        const response = await imagekit.upload({
            file: fileBuffer,
            fileName: imageFile.originalname,
            folder: '/users'
        })

        // optimization through imagekit URL transformation
        var optimizedImageUrl = imagekit.url({
            path : response.filePath,
            transformation : [
                {width: '400'}, // Width resizing
                {quality: 'auto'}, // Auto compression
                { format: 'webp' }  // Convert to modern format
            ]
        });

        const image = optimizedImageUrl;

        await User.findByIdAndUpdate(_id, {image});
        res.json({success: true, message: "Image Updated" })

    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}   