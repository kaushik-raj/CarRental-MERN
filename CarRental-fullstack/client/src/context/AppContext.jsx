import { createContext, useContext, useEffect, useState } from "react";
import axios from 'axios'
import {toast} from 'react-hot-toast'
import { useNavigate } from "react-router-dom";

// Setting the base URL for axios requests
// This will be used for all the API requests made using axios
axios.defaults.baseURL = import.meta.env.VITE_BASE_URL

// Create a context for the app
// This will allow us to share state and functions across components without prop drilling
export const AppContext = createContext();

//The children prop comes from React itself — it’s everything that you wrap inside <AppProvider> in your main.jsx .
export const AppProvider = ({ children })=>{

    // useNavigate is a hook from react-router-dom that allows us to navigate programmatically
    // It returns a function that we can call to navigate to a different route
    const navigate = useNavigate()

    const currency = import.meta.env.VITE_CURRENCY
    
    //token is used to store the JWT token for authentication
    //user is used to store the user data after login
    const [token, setToken] = useState(null)
    
    const [user, setUser] = useState(null)
    const [isOwner, setIsOwner] = useState(false)
    const [showLogin, setShowLogin] = useState(false)
    const [pickupDate, setPickupDate] = useState('')
    const [returnDate, setReturnDate] = useState('')

    const [cars, setCars] = useState([])

    // Function to check if user is logged in
    const fetchUser = async ()=>{
        try {
           const {data} = await axios.get('/api/user/data')
           if (data.success) {
            setUser(data.user)
            setIsOwner(data.user.role === 'owner')
           }else{
            navigate('/')
           }
        } catch (error) {
            toast.error(error.message)
        }
    }
    // Function to fetch all cars from the server
    const fetchCars = async () =>{
        try {
            const {data} = await axios.get('/api/user/cars')
            data.success ? setCars(data.cars) : toast.error(data.message)
        } catch (error) {
            toast.error(error.message)
        }
    }

    // Function to log out the user
    const logout = ()=>{
        localStorage.removeItem('token')
        setToken(null)
        setUser(null)
        setIsOwner(false)
        axios.defaults.headers.common['Authorization'] = ''
        toast.success('You have been logged out')
    }

    // useEffect to retrieve the token from localStorage
    useEffect(()=>{
        const token = localStorage.getItem('token')
        setToken(token)
        fetchCars()
    },[])

    // useEffect to set the Authorization header for axios requests
    // and to fetch user data if token is available
    useEffect(()=>{
        if(token){
            axios.defaults.headers.common['Authorization'] = `${token}`
            fetchUser()
        }
    },[token])

    const value = {
        navigate, currency, axios, user, setUser,
        token, setToken, isOwner, setIsOwner, fetchUser, showLogin, setShowLogin, logout, fetchCars, cars, setCars, 
        pickupDate, setPickupDate, returnDate, setReturnDate
    }

    return (
    // these values will be available to all components that consume this context
    // using the useAppContext hook
    <AppContext.Provider value={value}>
        { children }
    </AppContext.Provider>
    )
}

// when ever we want to use the context values in a component, we can use this custom hook(AppContext).
// This hook will return the context values so that we can use them in our components
export const useAppContext = ()=>{
    return useContext(AppContext)
}