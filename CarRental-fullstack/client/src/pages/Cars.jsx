import React, { useEffect, useState } from 'react'
import Title from '../components/Title'
import { assets, dummyCarData } from '../assets/assets'
import CarCard from '../components/CarCard'
import { useSearchParams } from 'react-router-dom'
import { useAppContext } from '../context/AppContext'
import toast from 'react-hot-toast'
import { motion } from 'motion/react'

const Cars = () => {

  // getting search params from url
  const [searchParams] = useSearchParams()
  const pickupLocation = searchParams.get('pickupLocation')
  const pickupDate = searchParams.get('pickupDate')
  const returnDate = searchParams.get('returnDate')

  const {cars, axios} = useAppContext()

  // This is the input state for the search option .
  // It will be used to filter the cars based on the input value.
  const [input, setInput] = useState('')

  const isSearchData = pickupLocation && pickupDate && returnDate

  // This state will hold the filtered cars based on the input value.
  // If the input is empty, it will show all the cars.
  const [filteredCars, setFilteredCars] = useState([])

  const applyFilter = async ()=>{
     
    if(input === ''){
      setFilteredCars(cars)
      // If the input is empty, show all cars

      return null
    }

    // If the input is not empty, filter the cars based on the input value
    // This will filter the cars based on the brand, model, category, and transmission
    // slice() is used here to create a shallow copy of the cars array.
    // .filter() returns a new array containing only the cars that match the search input.
    const filtered = cars.slice().filter((car)=>{
      return car.brand.toLowerCase().includes(input.toLowerCase())
      || car.model.toLowerCase().includes(input.toLowerCase())  
      || car.category.toLowerCase().includes(input.toLowerCase())  
      || car.transmission.toLowerCase().includes(input.toLowerCase())
    })
    setFilteredCars(filtered)
  }

  // This function will check the availability of cars based on the pickup location and dates.
  // It will send a request to the server to check the availability of cars.
  const searchCarAvailablity = async () =>{
    const {data} = await axios.post('/api/bookings/check-availability', {location: pickupLocation, pickupDate, returnDate})
    if (data.success) {
      setFilteredCars(data.availableCars)
      if(data.availableCars.length === 0){
        toast('No cars available')
      }
      return null
    }
  }

  // This useEffect will run when the component mounts.
  // It will check if the search params are present in the url.
  useEffect(()=>{
    isSearchData && searchCarAvailablity()
  },[])

  // This useEffect will run when the input value changes or when the cars data changes.
  // It will filter the cars based on the input value.
  // This will not run when the search params are present in the url.
  useEffect(()=>{
    cars.length > 0 && !isSearchData && applyFilter()
  },[input, cars])

  return (
    <div>

      {/* This div contain the title and the search option . */}
      <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}

      className='flex flex-col items-center py-20 bg-light max-md:px-4'>
        <Title title='Available Cars' subTitle='Browse our selection of premium vehicles available for your next adventure'/>

        {/* This is the div which contain the serach option . */}
        <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}

        className='flex items-center bg-white px-4 mt-6 max-w-140 w-full h-12 rounded-full shadow'>
          <img src={assets.search_icon} alt="" className='w-4.5 h-4.5 mr-2'/>

          <input onChange={(e)=> setInput(e.target.value)} value={input} type="text" placeholder='Search by make, model, or features' className='w-full h-full outline-none text-gray-500'/>

          <img src={assets.filter_icon} alt="" className='w-4.5 h-4.5 ml-2'/>
        </motion.div>
      </motion.div>


      {/* This div contain the cars cards . */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}

      className='px-6 md:px-16 lg:px-24 xl:px-32 mt-10'>
        <p className='text-gray-500 xl:px-20 max-w-7xl mx-auto'>Showing {filteredCars.length} Cars</p>

        {/* We are using grid layout to show the cars list. We are using the car card to show the car lists.  */}
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-4 xl:px-20 max-w-7xl mx-auto'>
          {filteredCars.map((car, index)=> (
            <motion.div key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index, duration: 0.4 }}
            >
              <CarCard car={car}/>
            </motion.div>
          ))}
        </div>
      </motion.div>

    </div>
  )
}

export default Cars
