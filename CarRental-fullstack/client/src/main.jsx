import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {BrowserRouter} from 'react-router-dom'
import {AppProvider} from './context/AppContext.jsx'
import {MotionConfig} from 'motion/react'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
  {/* This AppProvider , will help to use the Appcontext hook , in the entire App . */}
    <AppProvider>
      {/* This will help to use motionConfig in all the app components  */}
      <MotionConfig viewport={{once: true}}>
        <App />
      </MotionConfig>
    </AppProvider>
  </BrowserRouter>,
)
