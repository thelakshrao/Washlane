import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaShoppingCart } from "react-icons/fa";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [onWhiteSection, setOnWhiteSection] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const sections = ["services", "orders", "works"];
      const navHeight = 80;
      let active = false;

      sections.forEach((id) => {
        const section = document.getElementById(id);
        if (!section) return;
        const rect = section.getBoundingClientRect();
        if (rect.top <= navHeight && rect.bottom >= navHeight) {
          active = true;
        }
      });

      setOnWhiteSection(active);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navBg = onWhiteSection ? "bg-black text-white" : "bg-white text-black";
  const dropdownBg = onWhiteSection
    ? "bg-white text-black"
    : "bg-black text-white";
  const buttonBg = onWhiteSection
    ? "bg-white text-black"
    : "bg-black text-white";

  return (
    <>
      <nav
        className={`hidden md:flex fixed top-0 left-0 w-full z-50 transition-all duration-300 ${navBg}`}
      >
        <div className="max-w-7xl mx-auto w-full px-6 py-4 flex items-center justify-between">
          <Link to="/" className="font-bold text-xl tracking-wide">WASHLANE</Link>

          <ul className="flex gap-12 font-medium">
            <li className="cursor-pointer hover:opacity-70">Services</li>
            <li className="cursor-pointer hover:opacity-70">Pricing</li>
            <Link
              to="/schedualpickup"
              className="cursor-pointer hover:opacity-70"
            >
              Schedule Pickup
            </Link>
          </ul>

          <div className="flex items-center gap-6">
            <FaShoppingCart className="text-lg cursor-pointer hover:opacity-70" />
            <button
              className={`px-6 py-2 rounded-full text-sm font-semibold ${buttonBg}`}
            >
              Login
            </button>
          </div>
        </div>
      </nav>

      <div
        className={`md:hidden fixed top-0 left-0 w-full z-50 transition-all duration-300 ${navBg}`}
      >
        <div className="flex items-center justify-between px-5 py-4">
          <Link to="/" className="font-bold text-lg">WASHLANE</Link>

          <div className="flex items-center gap-4">
            <FaShoppingCart className="text-lg cursor-pointer" />
            <button onClick={() => setOpen(!open)} className="text-2xl">
              ☰
            </button>
          </div>
        </div>

        <div
          className={`overflow-hidden transition-all duration-300 ${dropdownBg} ${
            open ? "max-h-80" : "max-h-0"
          }`}
        >
          <ul className="flex flex-col items-center gap-6 py-6 font-medium">
            <li onClick={() => setOpen(false)}>Services</li>
            <li onClick={() => setOpen(false)}>Pricing</li>
            <li onClick={() => setOpen(false)}>
              <Link to="/schedualpickup">Schedule Pickup</Link>
            </li>
            <button
              className={`px-8 py-2 rounded-full text-sm font-semibold ${
                onWhiteSection ? "bg-black text-white" : "bg-white text-black"
              }`}
            >
              Login
            </button>
          </ul>
        </div>
      </div>
    </>
  );
};

export default Navbar;
