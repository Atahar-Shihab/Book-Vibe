import { NavLink } from "react-router";
const Navbar = () => {
    const links = <>
    <div className="mr-1 flex flex-col gap-2 sm:flex-row">
        <li><NavLink to={"/"} className={({ isActive }) => isActive ? " text-green-500  border bg-amber-50 border-green-500" : ""}>Home</NavLink></li>
        <li><NavLink to={"/books"} className={({ isActive }) => isActive ? "text-green-500 border bg-amber-50 border-green-500" : ""}>Listed Books</NavLink></li>
        <li><NavLink to={"/about"} className={({ isActive }) => isActive ? "text-green-500  border bg-amber-50 border-green-500" : ""}>Pages to Read</NavLink></li>
    </div>
    </>;
    return (
        <div>
            <div className="navbar shadow-sm">
                <div className="navbar-start">
                    <div className="dropdown">
                        <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
                            </svg>     
                        </div>
                        <ul
                            tabIndex={-1}
                            className="menu menu-sm dropdown-content rounded-box z-1 mt-3 w-52 p-2 shadow">
                            {links}
                        </ul>
                    </div>
                    <h2 className="font-bold text-xl">Book Vibe</h2>
                </div>
                <div className="navbar-center hidden lg:flex">
                    <ul className="menu menu-horizontal px-1">
                        {links}
                    </ul>
                </div>
                <div className="navbar-end gap-2 ">
                    <button className="btn text-white bg-[#23BE0A]">Sign In</button>
                    <button className="btn text-white bg-[#59C6D2]">Sign Up</button>
                </div>
            </div>
        </div>
    );
};

export default Navbar;