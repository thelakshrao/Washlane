import React, { useEffect, useState, useRef } from "react";
import { HashLink } from "react-router-hash-link";
import { Link, useLocation } from "react-router-dom";
import emailjs from "@emailjs/browser";
import { db } from "../firebase";
import {
  doc,
  setDoc,
  serverTimestamp,
  collection,
  query,
  getDocs,
  orderBy,
} from "firebase/firestore";
import {
  ShoppingBag,
  Menu,
  X,
  ChevronDown,
  LogOut,
  Settings,
  Receipt,
  Clock,
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

  const [showOrders, setShowOrders] = useState(false);
  const [userOrders, setUserOrders] = useState([]);
  const [fetchingOrders, setFetchingOrders] = useState(false);

  const location = useLocation();
  const isSchedulePage = location.pathname === "/schedualpickup";


  useEffect(() => {
    if (isLoggedIn) {
      fetchUserOrders();
    }
  }, [isLoggedIn]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const syncEverything = () => {
      const logged = localStorage.getItem("isLoggedIn") === "true";
      setIsLoggedIn(logged);
      setUserName(localStorage.getItem("userName") || "");
      if (logged) fetchUserOrders();
    };

    window.addEventListener("login-status-changed", syncEverything);
    window.addEventListener("open-login-modal", () => setShowLogin(true));

    return () => {
      window.removeEventListener("login-status-changed", syncEverything);
    };
  }, []);

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
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showDropdown]);


  const fetchUserOrders = async () => {
    const userEmail = localStorage.getItem("userEmail");
    if (!userEmail) return;

    setFetchingOrders(true);
    try {
      const ordersRef = collection(db, "orders", userEmail, "userOrders");
      const q = query(ordersRef, orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);

      const orders = [];
      querySnapshot.forEach((doc) => {
        orders.push({ id: doc.id, ...doc.data() });
      });
      setUserOrders(orders);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setFetchingOrders(false);
    }
  };

  const handleOrdersClick = () => {
    if (!isLoggedIn) {
      setShowLogin(true);
    } else {
      setShowOrders(true);
      fetchUserOrders();
    }
  };

  const handleSendOTP = (e) => {
    e.preventDefault();
    setLoading(true);
    const generatedOTP = Math.floor(100000 + Math.random() * 900000).toString();
    localStorage.setItem("current_otp", generatedOTP);

    emailjs
      .send(
        "service_0tqxyau",
        "template_qj30kbc",
        {
          email: email,
          otp_code: generatedOTP,
          user_name: enteredName,
        },
        "qWOHMVFvpSPceJAdP"
      )
      .then(() => {
        setLoading(false);
        setOtpSent(true);
        alert("OTP sent to your email!");
      })
      .catch((err) => {
        setLoading(false);
        alert("Failed to send OTP.");
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
        setIsLoggedIn(true);
        setUserName(enteredName);
        setShowLogin(false);
        setOtpSent(false);
        localStorage.removeItem("current_otp");
      } catch (error) {
        alert("Verification failed.");
      }
    } else {
      alert("Invalid OTP.");
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    setUserName("");
    setUserOrders([]);
    setShowDropdown(false);
    window.location.reload();
  };

  const textColor =
    isSchedulePage && !scrolled ? "text-white" : "text-[#061E29]";

  return (
    <>
      <nav
        className={`fixed top-0 left-0 w-full z-100 transition-all duration-300 ${
          scrolled ? "bg-white shadow-sm py-3" : "bg-transparent py-5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <h2 className={`font-black text-2xl cursor-pointer ${textColor}`}>
            WASHLANE
          </h2>

          <ul className="hidden md:flex items-center gap-6">
            <li>
              <Link
                to="/"
                className={`${textColor} text-xs font-semibold uppercase tracking-wider`}
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/?scroll=services"
                className={`${textColor} text-xs font-semibold uppercase tracking-wider`}
              >
                Services
              </Link>
            </li>
            <li>
              <Link
                to="/about"
                className={`${textColor} text-xs font-semibold uppercase tracking-wider`}
              >
                About
              </Link>
            </li>
            <li>
              <Link
                to="/schedualpickup"
                className={`${textColor} text-xs font-semibold uppercase tracking-wider`}
              >
                Schedule
              </Link>
            </li>
          </ul>

          <div className="flex items-center gap-4">
            <button onClick={handleOrdersClick} className="relative group">
              <ShoppingBag
                size={20}
                className={`${textColor} transition-transform group-hover:scale-110`}
              />
              {userOrders.length > 0 && isLoggedIn && (
                <span className="absolute -top-1 -right-1 bg-teal-500 text-white text-[8px] font-bold w-4 h-4 rounded-full flex items-center justify-center border-2 border-white">
                  {userOrders.length}
                </span>
              )}
            </button>

            {!isLoggedIn ? (
              <button
                onClick={() => setShowLogin(true)}
                className={`hidden md:block text-xs font-semibold uppercase tracking-wider ${textColor}`}
              >
                Login
              </button>
            ) : (
              <div className="relative">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className={`flex items-center gap-1 text-xs font-semibold uppercase tracking-wider ${textColor}`}
                >
                  {userName} <ChevronDown size={14} />
                </button>
                {showDropdown && (
                  <div
                    ref={dropdownRef}
                    className="absolute right-0 mt-2 w-48 bg-white border rounded-xl shadow-2xl overflow-hidden py-1"
                  >
                    <div className="px-4 py-2 border-b">
                      <p className="text-[10px] text-gray-400 font-bold uppercase">
                        Account
                      </p>
                    </div>
                    <button className="w-full flex items-center gap-2 px-4 py-3 hover:bg-gray-50 text-xs font-bold text-gray-700">
                      <Settings size={14} /> Settings
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-3 hover:bg-red-50 text-red-600 text-xs font-bold border-t"
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

      {showOrders && (
        <div className="fixed inset-0 z-200 flex justify-end">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300"
            onClick={() => setShowOrders(false)}
          />
          <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-500">
            <div className="p-6 border-b flex justify-between items-center bg-white sticky top-0 z-10">
              <div>
                <h3 className="font-black text-2xl text-[#061E29]">
                  My Orders
                </h3>
                <p className="text-[10px] text-teal-600 font-bold uppercase tracking-widest">
                  Laundry History
                </p>
              </div>
              <button
                onClick={() => setShowOrders(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50">
              {fetchingOrders ? (
                <div className="flex flex-col items-center justify-center h-64 space-y-3">
                  <div className="w-10 h-10 border-4 border-teal-500 border-t-transparent rounded-full animate-spin" />
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                    Fetching Orders...
                  </p>
                </div>
              ) : userOrders.length === 0 ? (
                <div className="text-center py-20">
                  <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Receipt size={32} className="text-gray-300" />
                  </div>
                  <p className="text-gray-500 font-bold">No orders found.</p>
                  <Link
                    to="/schedualpickup"
                    onClick={() => setShowOrders(false)}
                    className="text-teal-600 text-sm font-black uppercase underline mt-4 inline-block"
                  >
                    Book a Pickup
                  </Link>
                </div>
              ) : (
                userOrders.map((order) => (
                  <div
                    key={order.id}
                    className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:border-teal-200 transition-colors group"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">
                          Order Reference
                        </span>
                        <p className="font-black text-sm text-[#061E29]">
                          {order.orderId}
                        </p>
                      </div>
                      <span
                        className={`text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest ${
                          order.status === "Order Confirmed"
                            ? "bg-blue-50 text-blue-600"
                            : "bg-teal-50 text-teal-600"
                        }`}
                      >
                        {order.status}
                      </span>
                    </div>

                    <div className="space-y-2 mb-4 bg-gray-50 p-3 rounded-xl">
                      <p className="text-[11px] text-gray-600 font-bold flex items-center gap-2">
                        <Clock size={12} className="text-teal-500" />{" "}
                        {order.pickupDate} at {order.pickupTime}
                      </p>
                      <p className="text-[11px] text-gray-400 flex items-start gap-2 line-clamp-1 italic">
                        📍 {order.address}
                      </p>
                    </div>

                    <div className="pt-3 border-t flex justify-between items-center">
                      <div className="flex flex-col">
                        <span className="text-[9px] font-bold text-gray-400 uppercase">
                          Total Bill
                        </span>
                        <span className="text-lg font-black text-[#061E29]">
                          ₹{order.totalAmount}
                        </span>
                      </div>
                      <button className="bg-[#061E29] text-white px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-teal-600 transition-colors">
                        Details
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {showLogin && (
        <div className="fixed inset-0 z-300 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl p-8 relative">
            <button
              onClick={() => {
                setShowLogin(false);
                setOtpSent(false);
              }}
              className="absolute top-6 right-6 text-gray-400 hover:text-black"
            >
              <X size={20} />
            </button>
            <div className="text-center mb-8">
              <h2 className="font-black text-3xl text-[#061E29] mb-2 tracking-tighter">
                WASHLANE
              </h2>
              <p className="text-gray-500 text-sm font-medium">
                {otpSent
                  ? "Verify your email to continue"
                  : "Welcome back, please login"}
              </p>
            </div>

            {!otpSent ? (
              <form onSubmit={handleSendOTP} className="space-y-4">
                <input
                  required
                  type="text"
                  value={enteredName}
                  onChange={(e) => setEnteredName(e.target.value)}
                  placeholder="Full Name"
                  className="w-full px-4 py-4 border border-gray-100 bg-gray-50 rounded-2xl focus:ring-2 focus:ring-[#061E29] outline-none font-medium"
                />
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email Address"
                  className="w-full px-4 py-4 border border-gray-100 bg-gray-50 rounded-2xl focus:ring-2 focus:ring-[#061E29] outline-none font-medium"
                />
                <button
                  disabled={loading}
                  type="submit"
                  className="w-full bg-[#061E29] text-white font-black uppercase tracking-widest py-4 rounded-2xl shadow-xl disabled:bg-gray-300"
                >
                  {loading ? "Sending OTP..." : "Continue"}
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOTP} className="space-y-4">
                <input
                  required
                  type="text"
                  maxLength="6"
                  value={userOtpInput}
                  onChange={(e) => setUserOtpInput(e.target.value)}
                  placeholder="• • • • • •"
                  className="w-full px-4 py-4 border border-gray-100 bg-gray-50 rounded-2xl focus:ring-2 focus:ring-[#061E29] outline-none text-center text-2xl font-black tracking-[10px]"
                />
                <button
                  type="submit"
                  className="w-full bg-teal-600 text-white font-black uppercase tracking-widest py-4 rounded-2xl shadow-xl"
                >
                  Verify & Login
                </button>
                <button
                  type="button"
                  onClick={() => setOtpSent(false)}
                  className="w-full text-[10px] font-black text-gray-400 uppercase text-center mt-2"
                >
                  Back to Email
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
