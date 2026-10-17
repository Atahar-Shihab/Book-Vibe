import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import {  RouterProvider } from 'react-router';
import { router } from './routes/Routes.jsx';










createRoot(document.getElementById('root')).render(
  <StrictMode>

    <RouterProvider router={router} />


    <br />
    <div className="fab fab-flower">
      {/* a focusable div with tabIndex is necessary to work on all browsers. role="button" is necessary for accessibility */}
      <div tabIndex={0} role="button" className="btn btn-lg btn-circle btn-success">FAQ</div>

      {/* Main Action button replaces the original button when FAB is open */}
      <button className="fab-main-action btn btn-primary btn-circle btn-lg">?</button>

      {/* buttons that show up when FAB is open */}
      <button className="btn btn-lg btn-circle">A</button>
      <button className="btn btn-lg btn-circle">B</button>
      <button className="btn btn-lg btn-circle">C</button>
      <button className="btn btn-lg btn-circle">D</button>
    </div>

  </StrictMode>
)
