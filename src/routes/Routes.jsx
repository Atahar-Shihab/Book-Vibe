import { createBrowserRouter } from "react-router";
import MainLayout from "../layout/MainLayout";
import Homepage from "../pages/Homepage/Homepage";
import Books from "../pages/Books/Books";
import PagesToRead from "../pages/PagesToRead/PagesToRead";
import BookDetails from "../pages/BookDetails/BookDetails";
import ErrorPage from "../pages/ErrorPage.jsx/ErrorPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <Homepage />,
      },
      {
        path: "books",
        element: <Books />,
      },
      {
        path: "pages-to-read",
        element: <PagesToRead />,
      },
      {
        path: "about",
        element: <PagesToRead />,
      },
      {
        path: "bookDetails/:bookId",
        element: <BookDetails />,
        loader: () => fetch("/booksData.json"),
      },
      {
        path: "*",
        element: <ErrorPage />,
      },
    ],
  },
]);
