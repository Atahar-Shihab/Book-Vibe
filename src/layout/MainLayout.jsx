import { Outlet } from "react-router";
import Navbar from "../components/Shared/Navbar/Navbar";
import Footer from "../components/Shared/Footer/Footer";
import CinematicParticles from "../components/Effects/CinematicParticles";

const MainLayout = () => {
  return (
    <div className="relative flex min-h-screen flex-col bg-slate-50 text-slate-800 antialiased selection:bg-violet-500 selection:text-white">
      {/* 4D/5D Ethereal Ambient Stardust Background */}
      <CinematicParticles />

      {/* Navigation */}
      <Navbar />

      {/* Main Page Content */}
      <div className="relative z-10 flex-1">
        <Outlet />
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default MainLayout;