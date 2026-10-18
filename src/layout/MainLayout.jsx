import { useState, useEffect } from "react";
import { Outlet } from "react-router";
import Navbar from "../components/Shared/Navbar/Navbar";
import Footer from "../components/Shared/Footer/Footer";
import CinematicParticles from "../components/Effects/CinematicParticles";
import CommandPalette from "../components/Navigation/CommandPalette";

const MainLayout = () => {
  const [isCommandOpen, setIsCommandOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsCommandOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="relative flex min-h-screen flex-col bg-slate-50 text-slate-800 antialiased selection:bg-violet-500 selection:text-white">
      {/* 4D/5D Ethereal Ambient Stardust Background */}
      <CinematicParticles />

      {/* Navigation */}
      <Navbar onOpenCommand={() => setIsCommandOpen(true)} />

      {/* Main Page Content */}
      <div className="relative z-10 flex-1">
        <Outlet />
      </div>

      {/* Footer */}
      <Footer />

      {/* Command Palette Spotlight Modal */}
      <CommandPalette
        isOpen={isCommandOpen}
        onClose={() => setIsCommandOpen(false)}
      />
    </div>
  );
};

export default MainLayout;