import React, { useEffect, useState } from 'react'
import { assets} from '../../assets/assets'
import Title from '../../components/owner/Title'
import { useAppContext } from '../../context/AppContext'
import toast from 'react-hot-toast'

const ManageCars = () => {

  const {isOwner, axios, currency} = useAppContext()

  // State to hold the list of cars owned by the owner
  // This will be used to display the cars in the UI.
  const [cars, setCars] = useState([])

  // Function to fetch the cars owned by the owner
  // This function will make a GET request to the server to get the list of cars.
  const fetchOwnerCars = async ()=>{
    try {
      const {data} = await axios.get('/api/owner/cars')
      if(data.success){
        setCars(data.cars)
      }else{
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  // Function to toggle the availability of a car
  // This function will make a POST request to the server to toggle the availability of the car
  const toggleAvailability = async (carId)=>{
    try {
      const {data} = await axios.post('/api/owner/toggle-car', {carId})
      if(data.success){
        toast.success(data.message)
        fetchOwnerCars()
      }else{
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  // Function to delete a car
  // This function will make a POST request to the server to delete the car
  const deleteCar = async (carId)=>{
    try {

      const confirm = window.confirm('Are you sure you want to delete this car?')

      if(!confirm) return null

      const {data} = await axios.post('/api/owner/delete-car', {carId})
      if(data.success){
        toast.success(data.message)
        fetchOwnerCars()
      }else{
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  // useEffect to fetch the cars when the component mounts or when isOwner changes
  // This will ensure that the cars are fetched only if the user is an owner.
  useEffect(()=>{
    isOwner && fetchOwnerCars()
  },[isOwner])

  return (
    <div className='px-4 pt-10 md:px-10 w-full'>
      
      <Title title="Manage Cars" subTitle="View all listed cars, update their details, or remove them from the booking platform."/>

      {/* This div will show the list of cars owned by the owner. */}
      {/* It will display the car details in a table format. */}
      <div className='max-w-3xl w-full rounded-md overflow-hidden border border-borderColor mt-6'>

        <table className='w-full border-collapse text-left text-sm text-gray-600'>

          
          <thead className='text-gray-500'>
            <tr>
              <th className="p-3 font-medium">Car</th>
              <th className="p-3 font-medium max-md:hidden">Category</th>
              <th className="p-3 font-medium">Price</th>
              <th className="p-3 font-medium max-md:hidden">Status</th>
              <th className="p-3 font-medium">Actions</th>
            </tr>
          </thead>

          <tbody>
            {cars.map((car, index)=>(
              <tr key={index} className='border-t border-borderColor'>

                <td className='p-3 flex items-center gap-3'>
                  <img src={car.image} alt="" className="h-12 w-12 aspect-square rounded-md object-cover"/>
                  <div className='max-md:hidden'>
                    <p className='font-medium'>{car.brand} {car.model}</p>
                    <p className='text-xs text-gray-500'>{car.seating_capacity} • {car.transmission}</p>
                  </div>
                </td>

                <td className='p-3 max-md:hidden'>{car.category}</td>
                
                <td className='p-3'>{currency}{car.pricePerDay}/day</td>

                <td className='p-3 max-md:hidden'>
                  <span className={`px-3 py-1 rounded-full text-xs ${car.isAvaliable ? 'bg-green-100 text-green-500' : 'bg-red-100 text-red-500'}`}>
                    {car.isAvaliable ? "Available" : "Unavailable" }
                  </span>
                </td>

                <td className='flex items-center p-3'>

                  <img onClick={()=> toggleAvailability(car._id)} src={car.isAvaliable ? assets.eye_close_icon : assets.eye_icon} alt="" className='cursor-pointer'/>

                  <img onClick={()=> deleteCar(car._id)} src={assets.delete_icon} alt="" className='cursor-pointer'/>
                </td>

              </tr>
            ))}
          </tbody>
        </table>

      </div>

    </div>
  )
}

export default ManageCars
