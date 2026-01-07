import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingBag, Menu, X } from "lucide-react";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Service", path: "#services" },
    { name: "About", path: "/about" },
    { name: "Schedule Pickup", path: "/schedualpickup" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-[100] transition-all duration-500 ${
        scrolled
          ? "bg-white/80 backdrop-blur-lg shadow-sm py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <Link
          to="/"
          className="font-black text-2xl tracking-tighter text-[#061E29] flex items-center gap-1"
        >
          WASHLANE
        </Link>

        <ul className="hidden md:flex items-center gap-10">
          {navLinks.map((link) => (
            <li key={link.name}>
              <Link
                to={link.path}
                className="text-sm font-bold text-[#061E29] hover:text-[#5F9598] transition-colors relative group"
              >
                {link.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#5F9598] transition-all group-hover:w-full" />
              </Link>
            </li>
          ))}
        </ul>

        <div className="hidden md:flex items-center gap-6">
          <div className="relative cursor-pointer group">
            <ShoppingBag className="text-[#061E29] group-hover:text-[#1D546D] transition-colors" size={22} />
            <span className="absolute -top-2 -right-2 bg-[#5F9598] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
              0
            </span>
          </div>
          <button className="bg-[#061E29] hover:bg-[#1D546D] text-white px-7 py-2.5 rounded-xl text-sm font-bold transition-all shadow-lg shadow-gray-200 active:scale-95">
            Login
          </button>
        </div>

        <div className="md:hidden flex items-center gap-4">
          <ShoppingBag size={22} className="text-[#061E29]" />
          <button onClick={() => setOpen(!open)} className="text-[#061E29] p-1">
            {open ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      <div
        className={`fixed inset-0 top-[60px] bg-white z-40 transition-transform duration-500 md:hidden h-80 rounded-4xl ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <ul className="flex flex-col items-center gap-3 pt-5 px-6">
          {navLinks.map((link) => (
            <li
              key={link.name}
              className="w-full text-center bg-[#F0F4F8] rounded-lg py-2"
            >
              <Link
                to={link.path}
                onClick={() => setOpen(false)}
                className="text-base font-semibold text-[#061E29] hover:text-[#5F9598]"
              >
                {link.name}
              </Link>
            </li>
          ))}
          <button className="w-full bg-[#061E29] text-white py-2 rounded-xl font-bold text-base mt-4">
            Login
          </button>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
