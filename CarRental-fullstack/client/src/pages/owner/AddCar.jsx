import React, { useState } from 'react'
import Title from '../../components/owner/Title'
import { assets } from '../../assets/assets'
import { useAppContext } from '../../context/AppContext'
import toast from 'react-hot-toast'

const AddCar = () => {

  const {axios, currency} = useAppContext()

  // State to manage car image 
  // This will hold the image file selected by the user
  const [image, setImage] = useState(null)
  // State to manage car details
  // This will hold all the details of the car being added
  const [car, setCar] = useState({
    brand: '',
    model: '',
    year: 0,
    pricePerDay: 0,
    category: '',
    transmission: '',
    fuel_type: '',
    seating_capacity: 0,
    location: '',
    description: '',
  })

  // State to manage loading state
  // This will be used to disable the submit button while the request is being processed
  const [isLoading, setIsLoading] = useState(false)

  // Function to handle form submission
  // This function will be called when the user submits the form to add a new car
  const onSubmitHandler = async (e)=>{

    e.preventDefault()
    if(isLoading) return null

    setIsLoading(true)
    try {
      const formData = new FormData()
      // Append the car image and car details to the form data
      formData.append('image', image)
      formData.append('carData', JSON.stringify(car))

      // Send a POST request to the server to add the new car
      // The server will handle the image upload and save the car details in the database
      const {data} = await axios.post('/api/owner/add-car', formData)

      // If the request is successful, show a success message and reset the form
      // finally block will reset the loading state 
      if(data.success){
        toast.success(data.message)
        setImage(null)
        setCar({
          brand: '',
          model: '',
          year: 0,
          pricePerDay: 0,
          category: '',
          transmission: '',
          fuel_type: '',
          seating_capacity: 0,
          location: '',
          description: '',
        })
      }else{
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }finally{
      setIsLoading(false)
    }
  }

  return (
    <div className='px-4 py-10 md:px-10 flex-1'>

      <Title title="Add New Car" subTitle="Fill in details to list a new car for booking, including pricing, availability, and car specifications."/>

      <form onSubmit={onSubmitHandler} className='flex flex-col gap-5 text-gray-500 text-sm mt-6 max-w-xl'>

        {/* Car Image */}
        <div className='flex items-center gap-2 w-full'>
          <label htmlFor="car-image">

            {/* To Show selected image if image is selected , Show default icon if image is not selected */}
            <img src={image ? URL.createObjectURL(image) : assets.upload_icon} alt="" className='h-14 rounded cursor-pointer'/>
            {/* Hidden file input to select image */}
            {/* When the user clicks on the label, it will open the file input dialog */}
            <input type="file" id="car-image" accept="image/*" hidden onChange={e=> setImage(e.target.files[0])}/>

          </label>
          <p className='text-sm text-gray-500'>Upload a picture of your car</p>
        </div>


        {/* Car Brand & Model */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <div className='flex flex-col w-full'>
            <label>Brand</label>
            {/* Here in the setCar function we are spreading the car object , to return all the values in the car object , and updating the value of brand to the value given in the input */}
            <input type="text" placeholder="e.g. BMW, Mercedes, Audi..." required className='px-3 py-2 mt-1 border border-borderColor rounded-md outline-none' value={car.brand} onChange={e=> setCar({...car, brand: e.target.value})}/>
          </div>
          <div className='flex flex-col w-full'>
            <label>Model</label>
             {/* Here in the setCar function we are spreading the car object , to return all the values in the car object , and updating the value of model to the value given in the input */}
            <input type="text" placeholder="e.g. X5, E-Class, M4..." required className='px-3 py-2 mt-1 border border-borderColor rounded-md outline-none' value={car.model} onChange={e=> setCar({...car, model: e.target.value})}/>
          </div>
          
        </div>

        {/* Car Year, Price, Category */}
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6'>
          <div className='flex flex-col w-full'>
            <label>Year</label>
             {/* Here in the setCar function we are spreading the car object , to return all the values in the car object , and updating the value of year to the value given in the input */}
            <input type="number" placeholder="2025" required className='px-3 py-2 mt-1 border border-borderColor rounded-md outline-none' value={car.year} onChange={e=> setCar({...car, year: e.target.value})}/>
          </div>
          <div className='flex flex-col w-full'>
            <label>Daily Price ({currency})</label>
            {/* Here in the setCar function we are spreading the car object , to return all the values in the car object , and updating the value of pricePerDay to the value given in the input */}
            <input type="number" placeholder="1000" required className='px-3 py-2 mt-1 border border-borderColor rounded-md outline-none' value={car.pricePerDay} onChange={e=> setCar({...car, pricePerDay: e.target.value})}/>
          </div>
          <div className='flex flex-col w-full'>
            <label>Category</label>
            {/* Here in the setCar function we are spreading the car object , to return all the values in the car object , and updating the value of category to the value given in the input */}
            {/* The select element will show a dropdown with options for the user to select the category of the car */}
            {/* The value of the select element will be the value of category in the car object */}
            <select onChange={e=> setCar({...car, category: e.target.value})} value={car.category} className='px-3 py-2 mt-1 border border-borderColor rounded-md outline-none'>
              <option value="">Select a category</option>
              <option value="Sedan">Sedan</option>
              <option value="SUV">SUV</option>
              <option value="Van">Van</option>
            </select>
          </div>
        </div>

         {/* Car Transmission, Fuel Type, Seating Capacity */}
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6'>

          {/* We use select tag to provide a dropdown option .  */}
          <div className='flex flex-col w-full'>
            <label>Transmission</label>
            <select onChange={e=> setCar({...car, transmission: e.target.value})} value={car.transmission} className='px-3 py-2 mt-1 border border-borderColor rounded-md outline-none'>
              <option value="">Select a transmission</option>
              <option value="Automatic">Automatic</option>
              <option value="Manual">Manual</option>
              <option value="Semi-Automatic">Semi-Automatic</option>
            </select>
          </div>


          <div className='flex flex-col w-full'>
            <label>Fuel Type</label>
            <select onChange={e=> setCar({...car, fuel_type: e.target.value})} value={car.fuel_type} className='px-3 py-2 mt-1 border border-borderColor rounded-md outline-none'>
              <option value="">Select a fuel type</option>
              <option value="CNG">CNG</option>
              <option value="Diesel">Diesel</option>
              <option value="Petrol">Petrol</option>
              <option value="Electric">Electric</option>
              <option value="Hybrid">Hybrid</option>
            </select>
          </div>


          <div className='flex flex-col w-full'>
            <label>Seating Capacity</label>
            <input type="number" placeholder="4" required className='px-3 py-2 mt-1 border border-borderColor rounded-md outline-none' value={car.seating_capacity} onChange={e=> setCar({...car, seating_capacity: e.target.value})}/>
          </div>
        </div>

         {/* Car Location */}
         <div className='flex flex-col w-full'>
            <label>Location</label>
            <select onChange={e=> setCar({...car, location: e.target.value})} value={car.location} className='px-3 py-2 mt-1 border border-borderColor rounded-md outline-none'>
              <option value="">Select a location</option>
              <option value="DELHI">DELHI</option>
              <option value="PUNE">PUNE</option>
              <option value="MUMBAI">MUMBAI</option>
              <option value="NOIDA">NOIDA</option>
            </select>
         </div>

        {/* Car Description */}
         <div className='flex flex-col w-full'>
            <label>Description</label>
            <textarea rows={5} placeholder="e.g. A luxurious SUV with a spacious interior and a powerful engine." required className='px-3 py-2 mt-1 border border-borderColor rounded-md outline-none' value={car.description} onChange={e=> setCar({...car, description: e.target.value})}></textarea>
          </div>

        <button className='flex items-center gap-2 px-4 py-2.5 mt-4 bg-primary text-white rounded-md font-medium w-max cursor-pointer'>
          <img src={assets.tick_icon} alt="" />
          {isLoading ? 'Listing...' : 'List Your Car'}
        </button>


      </form>

    </div>
  )
}

export default AddCar
