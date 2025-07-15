import User from "../models/User.js"
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import Car from "../models/Car.js";


// Generate JWT Token
const generateToken = (userId)=>{
    const payload = userId;
    return jwt.sign(payload, process.env.JWT_SECRET)
}

// Register User
export const registerUser = async (req, res)=>{
    try {
        // Destructure name, email, and password from the request body
        // This is the data sent by the user during registration
        const {name, email, password} = req.body

        // Validate the input fields
        // Check if all fields are filled .
        if(!name || !email || !password){
            return res.json({success: false, message: 'Fill all the fields'})
        }
        if(password.length < 8){
            return res.json({success: false, message: 'Password must be at least 8 characters'})
        }
        if(!email.includes('@')){
            return res.json({success: false, message: 'Invalid Email'})
        }
        
        // Check if the user already exists in the database
        // This prevents duplicate registrations with the same email
        const userExists = await User.findOne({email})

        // If user already exists, return an error message
        // This is to ensure that each email can only be registered once
        if(userExists){
            return res.json({success: false, message: 'User already exists'})
        }

        // Hash the password using bcrypt
        const hashedPassword = await bcrypt.hash(password, 10)
        // Create a new user in the database
        // This saves the user's name, email, and hashed password to the database
        const user = await User.create({name, email, password: hashedPassword})

        // If user creation is successful, generate a JWT token
        // This token will be used for authenticating the user in future requests
        // The token contains the user's ID and is signed with a secret key
        const token = generateToken(user._id.toString())
    
        // Return a success response with the token
        // This token can be used by the frontend to authenticate the user , This is used in automatic login .
        res.json({success: true, token})

    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}


// Login User 
export const loginUser = async (req, res)=>{
    try {
        const {email, password} = req.body
        const user = await User.findOne({email})
        if(!user){
            return res.json({success: false, message: "User not found" })
        }
        const isMatch = await bcrypt.compare(password, user.password)
        if(!isMatch){
            return res.json({success: false, message: "Invalid Credentials" })
        }
        // If the user is found and the password matches, generate a JWT token
        // This token will be used for authenticating the user in future requests
        const token = generateToken(user._id.toString())
        // Return a success response with the token
        // This token can be used by the frontend to authenticate the user.
        res.json({success: true, token})
    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}


// Get User data using Token (JWT)
export const getUserData = async (req, res) =>{
    try {
        // middleware will add user to the request object
        // This user object contains the authenticated user's information
        const {user} = req;
        res.json({success: true, user})
    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}

// Get All Cars for the Frontend
export const getCars = async (req, res) =>{
    try {
        const cars = await Car.find({isAvaliable: true})
        res.json({success: true, cars})
    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}