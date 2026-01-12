import React, { useEffect, useState } from "react";
import { HashLink } from "react-router-hash-link";
import { Link, useLocation } from "react-router-dom";
import { ShoppingBag, Menu, X } from "lucide-react";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const location = useLocation();

  const isSchedulePage = location.pathname === "/schedualpickup";

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const textColor =
    isSchedulePage && !scrolled ? "text-white" : "text-[#061E29]";

  return (
    <>
      <nav
        className={`fixed top-0 left-0 w-full z-[100] transition-all duration-300 ${
          scrolled ? "bg-white shadow-sm py-3" : "bg-transparent py-5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">

          <h2
            to="/"
            className={`font-black text-2xl transition-colors cursor-alias ${textColor}`}
          >
            WASHLANE
          </h2>

          <ul className="hidden md:flex items-center gap-10">
            <li>
              <Link to="/" className={`nav-link ${textColor}`}>
                Home
              </Link>
            </li>
            <li>
              <HashLink smooth to="/#services" className={`nav-link ${textColor}`}>
                Services
              </HashLink>
            </li>
            <li>
              <Link to="/about" className={`nav-link ${textColor}`}>
                About
              </Link>
            </li>
            <li>
              <Link to="/schedualpickup" className={`nav-link ${textColor}`}>
                Schedule Pickup
              </Link>
            </li>
          </ul>

          <div className="flex items-center cursor-pointer gap-4">
            <ShoppingBag size={22} className={textColor} />

            <button className={`hidden md:block text-sm cursor-pointer font-bold ${textColor}`}>
              Login
            </button>

            <button
              onClick={() => setOpen(!open)}
              className={`md:hidden ${textColor}`}
            >
              {open ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>
        </div>
      </nav>

      {open && (
        <div className="fixed top-[72px] left-0 w-full bg-white z-[90] shadow-lg md:hidden">
          <ul className="flex flex-col divide-y">
            <li>
              <Link to="/" onClick={() => setOpen(false)} className="mobile-link">
                Home
              </Link>
            </li>
            <li>
              <HashLink
                smooth
                to="/#services"
                onClick={() => setOpen(false)}
                className="mobile-link"
              >
                Services
              </HashLink>
            </li>
            <li>
              <Link to="/about" onClick={() => setOpen(false)} className="mobile-link">
                About
              </Link>
            </li>
            <li>
              <Link
                to="/schedualpickup"
                onClick={() => setOpen(false)}
                className="mobile-link"
              >
                Schedule Pickup
              </Link>
            </li>
            <li>
              <button className="mobile-link font-bold">Login</button>
            </li>
          </ul>
        </div>
      )}
    </>
  );
};

export default Navbar;
