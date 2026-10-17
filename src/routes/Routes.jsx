import { createBrowserRouter } from "react-router";
import MainLayout from "../layout/MainLayout";
import Homepage from "../pages/Homepage/Homepage";
import Books from "../pages/Books/Books";




export  const router = createBrowserRouter([
  {
    path: "/",
    // element: <div> <h2 className="flex items-center p-5 justify-center text-2xl font-bold bg-linear-to-r from-purple-500 to-pink-500  ">Welcome to the Book Vibe</h2></div>,
    element: <MainLayout />,

    children: [
      {
        index: true,

        element: <Homepage />
      },
      {
        path: "/books",
        element: <Books />
      }
    ]
  }

]);
