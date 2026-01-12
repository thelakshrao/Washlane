import React, { useEffect, useState } from "react";
import { HashLink } from "react-router-hash-link";
import { Link } from "react-router-dom";
import {
  ShoppingBag,
  Menu,
  X,
  ChevronDown,
  User,
  LogOut,
  MapPin,
} from "lucide-react";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [step, setStep] = useState(1);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState({ name: "", phone: "" });
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setStep(2);
  };

  const handleOtpSubmit = (e) => {
    e.preventDefault();
    setIsLoggedIn(true);
    setShowModal(false);
    setStep(1);
    console.log("Customer Details:", user);
  };

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Services", path: "/#services", hash: true },
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
          className="font-black text-2xl tracking-tighter text-[#061E29] active:scale-95 transition-transform"
        >
          WASHLANE
        </Link>

        <ul className="hidden md:flex items-center gap-10">
          {navLinks.map((link) => (
            <li key={link.name}>
              <Link
                to={link.path}
                className="text-sm font-bold text-[#061E29] hover:text-[#5F9598] transition-colors"
              >
                {link.name}
              </Link>
            </li>
          ))}
        </ul>

        <div className="hidden md:flex items-center gap-6">
          <ShoppingBag size={22} className="text-[#061E29] cursor-pointer" />

          {!isLoggedIn ? (
            <button
              onClick={() => setShowModal(true)}
              className="text-[#061E29] font-bold text-sm active:scale-95"
            >
              Login
            </button>
          ) : (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-1 text-[#061E29] font-bold text-sm bg-white border px-3 py-2 rounded-lg"
              >
                {user.name}'s Account <ChevronDown size={14} />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white shadow-xl rounded-xl border border-gray-100 p-2">
                  <div className="px-3 py-2 mb-1">
                    <p className="text-sm font-bold text-[#061E29]">
                      {user.name}
                    </p>
                    <p className="text-[10px] text-gray-400">{user.phone}</p>
                  </div>
                  <hr className="mb-1" />
                  <button className="w-full text-left flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg">
                    <MapPin size={14} /> Saved Address
                  </button>
                  <button
                    onClick={() => setIsLoggedIn(false)}
                    className="w-full text-left flex items-center gap-2 px-3 py-2 text-sm text-red-500 hover:bg-red-50 rounded-lg font-medium"
                  >
                    <LogOut size={14} /> Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            onClick={() => setShowModal(false)}
          />
          <div className="relative bg-white w-full max-w-[360px] rounded-3xl p-8 shadow-2xl">
            <h2 className="text-2xl font-black text-[#061E29] text-center mb-1">
              WashLane
            </h2>
            <p className="text-gray-500 text-xs text-center mb-8">
              Premium Laundry Services
            </p>

            {step === 1 ? (
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <input
                  type="text"
                  placeholder="Your Name"
                  required
                  className="w-full border rounded-xl p-3 outline-none focus:border-[#5F9598]"
                  onChange={(e) => setUser({ ...user, name: e.target.value })}
                />
                <input
                  type="tel"
                  placeholder="WhatsApp Number"
                  required
                  className="w-full border rounded-xl p-3 outline-none focus:border-[#5F9598]"
                  onChange={(e) => setUser({ ...user, phone: e.target.value })}
                />
                <button
                  type="submit"
                  className="w-full bg-[#061E29] text-white font-bold p-3 rounded-xl"
                >
                  Send OTP
                </button>
              </form>
            ) : (
              <form onSubmit={handleOtpSubmit} className="space-y-4">
                <p className="text-sm text-center">Confirming {user.phone}</p>
                <input
                  type="text"
                  placeholder="Enter OTP"
                  required
                  className="w-full border rounded-xl p-3 text-center tracking-[0.5em] text-xl"
                />
                <button
                  type="submit"
                  className="w-full bg-[#061E29] text-white font-bold p-3 rounded-xl"
                >
                  Verify & Login
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
