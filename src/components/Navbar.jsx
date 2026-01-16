import React, { useEffect, useState, useRef } from "react"; // Added useRef here
import { HashLink } from "react-router-hash-link";
import { Link, useLocation } from "react-router-dom";
import emailjs from "@emailjs/browser";
import { db } from "../firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import {
  ShoppingBag,
  Menu,
  X,
  ChevronDown,
  LogOut,
  Settings,
} from "lucide-react";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem("isLoggedIn") === "true"
  );
  const [userName, setUserName] = useState(
    localStorage.getItem("userName") || ""
  );
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const [email, setEmail] = useState("");
  const [enteredName, setEnteredName] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [userOtpInput, setUserOtpInput] = useState("");
  const [loading, setLoading] = useState(false);

  const location = useLocation();
  const isSchedulePage = location.pathname === "/schedualpickup";

  // Handle Scroll effect
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // PROB FIXED: Click outside logic
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        showDropdown &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDropdown]);

  const textColor =
    isSchedulePage && !scrolled ? "text-white" : "text-[#061E29]";

  const handleSendOTP = (e) => {
    e.preventDefault();
    setLoading(true);

    const generatedOTP = Math.floor(100000 + Math.random() * 900000).toString();
    localStorage.setItem("current_otp", generatedOTP);

    const templateParams = {
      email: email,
      otp_code: generatedOTP,
      user_name: enteredName,
    };

    emailjs
      .send(
        "service_0tqxyau",
        "template_qj30kbc",
        templateParams,
        "qWOHMVFvpSPceJAdP"
      )
      .then(() => {
        setLoading(false);
        setOtpSent(true);
        alert("OTP sent to your email!");
      })
      .catch((err) => {
        setLoading(false);
        console.error("EmailJS Error:", err);
        alert("Failed to send OTP. Check console.");
      });
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    const savedOTP = localStorage.getItem("current_otp");

    if (userOtpInput === savedOTP) {
      try {
        await setDoc(doc(db, "users", email), {
          name: enteredName,
          email: email,
          lastLogin: serverTimestamp(),
          role: "customer",
        });

        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("userName", enteredName);
        localStorage.setItem("userEmail", email);
        window.dispatchEvent(new Event("login-status-changed"));

        setUserName(enteredName);
        setIsLoggedIn(true);
        setShowLogin(false);
        setOtpSent(false);
        localStorage.removeItem("current_otp");
        alert("Welcome to Washlane, " + enteredName + "!");
      } catch (error) {
        console.error("Firebase Error:", error);
        alert("Verified, but profile not saved.");
      }
    } else {
      alert("Invalid OTP code. Please try again.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userName");
    setIsLoggedIn(false);
    setUserName("");
    setShowDropdown(false);
  };

  const handleSamePageClick = (path) => {
    if (location.pathname === path) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  useEffect(() => {
    const openLogin = () => setShowLogin(true);
    window.addEventListener("open-login-modal", openLogin);
    return () => {
      window.removeEventListener("open-login-modal", openLogin);
    };
  }, []);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 w-full z-100 transition-all duration-300 ${
          scrolled ? "bg-white shadow-sm py-3" : "bg-transparent py-5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <h2
            className={`font-black text-2xl cursor-pointer transition-colors ${textColor}`}
          >
            WASHLANE
          </h2>

          {/* Desktop Navigation */}
          <ul className="hidden md:flex items-center gap-6 ">
            <li>
              <Link
                to="/"
                onClick={() => handleSamePageClick("/")}
                className={`${textColor} text-xs font-semibold uppercase tracking-wider hover:opacity-70 transition`}
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/?scroll=services"
                className={`${textColor} text-xs font-semibold uppercase tracking-wider hover:opacity-70 transition`}
              >
                Services
              </Link>
            </li>
            <li>
              <Link
                to="/about"
                onClick={() => handleSamePageClick("/about")}
                className={`${textColor} text-xs font-semibold uppercase tracking-wider hover:opacity-70 transition`}
              >
                About
              </Link>
            </li>
            <li>
              <Link
                to="/schedualpickup"
                onClick={() => handleSamePageClick("/schedualpickup")}
                className={`${textColor} text-xs font-semibold uppercase tracking-wider hover:opacity-70 transition`}
              >
                Schedule Pickup
              </Link>
            </li>
          </ul>

          <div className="flex items-center gap-4">
            <ShoppingBag size={20} className={textColor} />

            {!isLoggedIn ? (
              <button
                onClick={() => setShowLogin(true)}
                className={`hidden md:block text-xs font-semibold uppercase tracking-wider ${textColor}`}
              >
                Login
              </button>
            ) : (
              <div className="relative">
                {/* User Dropdown Toggle */}
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className={`flex items-center gap-1 text-xs font-semibold uppercase tracking-wider ${textColor}`}
                >
                  {userName} <ChevronDown size={14} />
                </button>

                {/* PROB FIXED: Removed the double wrapper and double button logic that was in your code */}
                {showDropdown && (
                  <div
                    ref={dropdownRef}
                    className="absolute right-0 mt-2 w-40 bg-white border rounded-lg shadow-xl overflow-hidden text-gray-800"
                  >
                    <button className="w-full flex items-center gap-2 px-4 py-3 hover:bg-gray-100 text-sm">
                      <Settings size={14} /> Settings
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-3 hover:bg-red-50 text-red-600 text-sm border-t"
                    >
                      <LogOut size={14} /> Logout
                    </button>
                  </div>
                )}
              </div>
            )}

            <button
              onClick={() => setOpen(!open)}
              className={`md:hidden ${textColor}`}
            >
              {open ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {open && (
        <div className="fixed top-14 left-0 w-full bg-white z-90 md:hidden">
          <ul className="flex flex-col items-center py-8 gap-6">
            <li>
              <Link
                to="/"
                onClick={() => {
                  handleSamePageClick("/");
                  setOpen(false);
                }}
                className="text-sm font-semibold uppercase tracking-wider text-[#061E29]"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/?scroll=services"
                onClick={() => setOpen(false)}
                className="text-sm font-semibold uppercase tracking-wider text-[#061E29]"
              >
                Services
              </Link>
            </li>
            <li>
              <Link
                to="/about"
                onClick={() => {
                  handleSamePageClick("/about");
                  setOpen(false);
                }}
                className="text-sm font-semibold uppercase tracking-wider text-[#061E29]"
              >
                About
              </Link>
            </li>
            <li>
              <Link
                to="/schedualpickup"
                onClick={() => {
                  handleSamePageClick("/schedualpickup");
                  setOpen(false);
                }}
                className="text-sm font-semibold uppercase tracking-wider text-[#061E29]"
              >
                Schedule Pickup
              </Link>
            </li>

            {!isLoggedIn && (
              <li>
                <button
                  onClick={() => {
                    setShowLogin(true);
                    setOpen(false);
                  }}
                  className="text-sm font-semibold uppercase tracking-wider text-[#061E29]"
                >
                  Login
                </button>
              </li>
            )}
          </ul>
        </div>
      )}

      {/* Login Modal */}
      {showLogin && (
        <div className="fixed inset-0 z-200 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-8 relative overflow-hidden">
            <button
              onClick={() => {
                setShowLogin(false);
                setOtpSent(false);
              }}
              className="absolute top-4 right-4 text-gray-400 hover:text-black"
            >
              <X size={20} />
            </button>

            <div className="text-center mb-8">
              <h2 className="font-black text-3xl text-[#061E29] mb-2 tracking-tighter">
                WASHLANE
              </h2>
              <p className="text-gray-500 text-sm">
                {otpSent
                  ? "Enter the 6-digit code sent to your email"
                  : "Login to manage your laundry"}
              </p>
            </div>

            {!otpSent ? (
              <form onSubmit={handleSendOTP} className="space-y-4">
                <div>
                  <label className="block text-xs font-black uppercase text-gray-500 mb-1 ml-1">
                    Your Name
                  </label>
                  <input
                    required
                    type="text"
                    value={enteredName}
                    onChange={(e) => setEnteredName(e.target.value)}
                    placeholder="Your Name"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#061E29] outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black uppercase text-gray-500 mb-1 ml-1">
                    Email Address
                  </label>
                  <input
                    required
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Your Email"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#061E29] outline-none transition-all"
                  />
                </div>
                <button
                  disabled={loading}
                  type="submit"
                  className="w-full bg-[#061E29] text-white font-black uppercase tracking-widest py-4 rounded-xl hover:bg-black transition-colors shadow-lg disabled:bg-gray-400"
                >
                  {loading ? "Sending..." : "Send OTP"}
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOTP} className="space-y-4">
                <div>
                  <label className="block text-xs font-black uppercase text-gray-500 mb-1 ml-1">
                    Enter OTP
                  </label>
                  <input
                    required
                    type="text"
                    maxLength="6"
                    value={userOtpInput}
                    onChange={(e) => setUserOtpInput(e.target.value)}
                    placeholder="000000"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#061E29] outline-none transition-all text-center text-2xl tracking-widest"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-green-600 text-white font-black uppercase tracking-widest py-4 rounded-xl hover:bg-green-700 transition-colors shadow-lg"
                >
                  Verify & Login
                </button>
                <button
                  type="button"
                  onClick={() => setOtpSent(false)}
                  className="w-full text-xs text-gray-400 uppercase font-bold"
                >
                  Change Email
                </button>
              </form>
            )}

            <p className="text-center mt-6 text-xs text-gray-400">
              By continuing, you agree to our Terms and Privacy Policy.
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
