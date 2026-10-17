import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'


createRoot(document.getElementById('root')).render(
  <StrictMode>

    <h2 className="flex items-center p-5 justify-center text-2xl font-bold bg-linear-to-r from-purple-500 to-pink-500  ">Welcome to the Book Vibe</h2>

  </StrictMode>
)
