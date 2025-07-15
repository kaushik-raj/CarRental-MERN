import mongoose from "mongoose";

// This function connects to the MongoDB database using Mongoose.
// It listens for the 'connected' event to log a message when the connection is successful.
const connectDB = async ()=>{
    try {
        mongoose.connection.on('connected', ()=> console.log("Database Connected"));
        await mongoose.connect(`${process.env.MONGODB_URI}/car-rental`)
    } catch (error) {
        console.log(error.message);
    }
}

// This line exports the connectDB function so it can be used in other parts of the application.
export default connectDB;