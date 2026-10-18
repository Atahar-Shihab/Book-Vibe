import { use } from "react";
import BookCard from "../BookCard/BookCard";


const booksPromise = fetch('/booksData.json').then(res => res.json())



const AllBooks = () => {
    const books = use(booksPromise)
    console.log(books, "books");
    return (
        <div className="my-12">
            <h2 className="text-3xl text-center font-bold">Books</h2>



            {/* Responsive Book Grid */}
            <div className="my-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {books.map((book) => (
                    <BookCard key={book.bookId} book={book} />
                ))}
            </div>
        </div>
    );
};

export default AllBooks;