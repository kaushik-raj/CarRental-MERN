import React from 'react'
import { useAppContext } from '../context/AppContext';
import toast from 'react-hot-toast';

const Login = () => {

    // Using the useAppContext hook to access the context values.
    // This allows us to use the setShowLogin function to control the visibility of the login modal,
    // the axios instance for making API requests, the setToken function to store the authentication token
    // and the navigate function to redirect the user after successful login or registration.

    // SetShowLogin controls whether the Login modal (the login/signup popup) is visible or hidden.
    const {setShowLogin, axios, setToken, navigate} = useAppContext()

    // State to manage whether the user is in login or registration mode.
    // It starts with "login" indicating that the user is on the login page.
    const [state, setState] = React.useState("login");

    // Local state to manage the input fields for name, email, and password.
    // These states will be used to capture user input during login or registration.
    const [name, setName] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");

    // Function to handle form submission for login or registration.
    // It prevents the default form submission behavior, sends a POST request to the server,
    const onSubmitHandler = async (event)=>{
        try {
            event.preventDefault();
            // Depending on the state (login or register), it sends a request to the appropriate endpoint.
            // name ,email, and password are sent as part of the request body.
            const {data} = await axios.post(`/api/user/${state}`, {name, email, password})

            if (data.success) {
                navigate('/')                               // ✅ Redirect user after login
                setToken(data.token)                        // ✅ Save token to state (likely context/global state)
                localStorage.setItem('token', data.token)   // ✅ Persist token in browser storage
                setShowLogin(false)                         // ✅ Hide login modal
            }else{
                toast.error(data.message)
            }

        } catch (error) {
            toast.error(error.message)
        }
        
    }

  return (
    // This div is used to create a modal-like effect for the login/signup form.
    // It covers the entire screen and has a semi-transparent background.
    // if we click outside the form, it will close the modal by setting setShowLogin to false.
    // The form inside this div will handle user input for login or registration.
    <div onClick={()=> setShowLogin(false)} className='fixed top-0 bottom-0 left-0 right-0 z-100 flex items-center text-sm text-gray-600 bg-black/50'>

        {/* This div is used to prevent the click event from propagating to the parent div, which would close the modal. */}
      <form onSubmit={onSubmitHandler} onClick={(e)=>e.stopPropagation()} className="flex flex-col gap-4 m-auto items-start p-8 py-12 w-80 sm:w-[352px] rounded-lg shadow-xl border border-gray-200 bg-white">
            <p className="text-2xl font-medium m-auto">
                <span className="text-primary">User</span> {state === "login" ? "Login" : "Sign Up"}
            </p>
            {/* This conditional rendering checks if the state is "register" and displays the name input field. */}
            {/* If the state is "login", it will not display the name input field. */}
            {state === "register" && (
                <div className="w-full">
                    <p>Name</p>
                    <input onChange={(e) => setName(e.target.value)} value={name} placeholder="type here" className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary" type="text" required />
                </div>
            )}


            <div className="w-full ">
                <p>Email</p>
                <input onChange={(e) => setEmail(e.target.value)} value={email} placeholder="type here" className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary" type="email" required />
            </div>

            <div className="w-full ">
                <p>Password</p>
                <input onChange={(e) => setPassword(e.target.value)} value={password} placeholder="type here" className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary" type="password" required />
            </div>

            {/* This conditional rendering checks the state and displays a different message based on whether the user is registering or logging in. */}
            {/* If the state is "register", it will prompt the user to click here to login. */}
            {/* If the state is "login", it will prompt the user to click here to register. */}
            {state === "register" ? (
                <p>
                    Already have account? <span onClick={() => setState("login")} className="text-primary cursor-pointer">click here</span>
                </p>
            ) : (
                <p>
                    Create an account? <span onClick={() => setState("register")} className="text-primary cursor-pointer">click here</span>
                </p>
            )}
            {/* This button is used to submit the form. */}
            {/* It will display "Create Account" if the state is "register" and "Login" if the state is "login". */}
            {/* The button has a primary background color, white text, and rounded corners. */}
            <button className="bg-primary hover:bg-blue-800 transition-all text-white w-full py-2 rounded-md cursor-pointer">
                {state === "register" ? "Create Account" : "Login"}
            </button>
        </form>
    </div>
  )
}

export default Login
