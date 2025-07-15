import mongoose from "mongoose";

// Define a schema for the User model
// This schema outlines the structure of user documents in the MongoDB database
const userSchema = new mongoose.Schema({
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true },
    password: {type: String, required: true },
    role: {type: String, enum: ["owner", "user"], default: 'user' },
    image: {type: String, default: ''},
},{timestamps: true})

// Create a User model based on the userSchema
// This model will be used to interact with the 'users' collection in the MongoDB database
const User = mongoose.model('User', userSchema)

export default User