import React, { useMemo, useState, useEffect, useRef } from "react";
import {
  Calendar,
  Clock,
  MapPin,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";
import threeperson from "../images/three.png";
import Footer from "./Footer";
import { useLocation } from "react-router-dom";
import PaymentMethod from "./PaymentMethod";
import { db } from "../firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import toast from 'react-hot-toast';

const SchedualPickUp = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [timeWarning, setTimeWarning] = useState("");
  const [serviceData, setServiceData] = useState({});
  const [activeConfig, setActiveConfig] = useState(null);
  const [deliveryType, setDeliveryType] = useState("standard");
  const [dropDate, setDropDate] = useState("");
  const [dropTime, setDropTime] = useState("");
  const [dropTimeWarning, setDropTimeWarning] = useState("");
  const [dropDateWarning, setDropDateWarning] = useState("");
  const [showExpressNote, setShowExpressNote] = useState(false);
  const location = useLocation();
  const initialAddressFromHome = location.state?.address || "";
  const preSelectedService = location.state?.selectedService || null;
  const cardRef = useRef(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");
  const [tempSelectedMethod, setTempSelectedMethod] = useState("");

  const [isUserLoggedIn, setIsUserLoggedIn] = useState(
    !!localStorage.getItem("userEmail")
  );

  useEffect(() => {
    const syncLogin = () => {
      setIsUserLoggedIn(!!localStorage.getItem("userEmail"));
    };

    window.addEventListener("login-status-changed", syncLogin);
    window.addEventListener("focus", syncLogin);

    return () => {
      window.removeEventListener("login-status-changed", syncLogin);
      window.removeEventListener("focus", syncLogin);
    };
  }, []);

  const colors = {
    deepNavy: "#061E29",
    primaryBlue: "#1D546D",
    teal: "#5F9598",
    lightGrey: "#F3F4F4",
  };

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: initialAddressFromHome,
    message: "",
  });

  const servicesList = useMemo(
    () => [
      {
        id: "wash-fold",
        title: "Wash & Fold",
        items: [
          { name: "Shirt / T-shirt / Kurta", price: 15 },
          { name: "Trouser / Jeans / Pent", price: 15 },
          { name: "Jacket / Sweaters", price: 50 },
          { name: "Sarees", price: 150 },
          { name: "Dresses", price: 30 },
          { name: "Bedsheet (single)", price: 50 },
          { name: "Bedsheet (double)", price: 80 },
        ],
      },
      {
        id: "wash-iron",
        title: "Wash & Iron",
        items: [
          { name: "Shirt / T-shirt / Kurta", price: 25 },
          { name: "Trouser / Jeans / Pent", price: 25 },
          { name: "Jacket / Sweaters", price: 50 },
          { name: "Sarees", price: 200 },
          { name: "Dresses", price: 45 },
          { name: "Bedsheet (single)", price: 70 },
          { name: "Bedsheet (double)", price: 100 },
        ],
      },
      {
        id: "only-iron",
        title: "Only Iron",
        items: [
          { name: "Shirt / T-shirt / Kurta", price: 15 },
          { name: "Trouser / Jeans / Pent", price: 15 },
          { name: "Sarees", price: 50 },
          { name: "Dresses", price: 20 },
        ],
      },
      {
        id: "dry-clean",
        title: "Dry Cleaning",
        items: [
          { name: "Blazers", price: 299 },
          { name: "Suit (2 pcs)", price: 349 },
          { name: "Suit (3 pcs)", price: 399 },
          { name: "Jacket/Woolen Clothes", price: 249 },
          { name: "Kurta Pyjama", price: 249 },
          { name: "Blanket (single)", price: 349 },
          { name: "Blanket (double)", price: 449 },
          { name: "Shawl", price: 199 },
        ],
      },
      { id: "curtain", title: "Curtain Cleaning", price: 199 },
      { id: "sofa", title: "Sofa cover cleaning", price: 249 },
      { id: "shoes", title: "Shoe Laundry", price: 249 },
      { id: "bags", title: "Bag Laundry", price: 149 },
    ],
    []
  );

  const serviceTitleToId = useMemo(() => {
    const map = {};
    servicesList.forEach((s) => {
      map[s.title] = s.id;
    });
    return map;
  }, [servicesList]);

  const dates = useMemo(() => {
    const result = [];
    const today = new Date();
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      result.push({
        day: date.toLocaleDateString("en-US", { weekday: "short" }),
        date: date.getDate(),
        fullDate: date.toISOString().split("T")[0],
      });
    }
    return result;
  }, []);

  useEffect(() => {
    if (dates.length) setSelectedDate(dates[0].fullDate);
    const now = new Date();
    const current = `${now.getHours().toString().padStart(2, "0")}:${now
      .getMinutes()
      .toString()
      .padStart(2, "0")}`;
    setSelectedTime(current);
    validateTime(current);
  }, [dates]);

  useEffect(() => {
    if (selectedTime) {
      validateTime(selectedTime);
    }
  }, [selectedTime, selectedDate]);

  useEffect(() => {
    if (dropTime) {
      validateDropTime(dropTime);
    }
  }, [dropTime, dropDate]);

  useEffect(() => {
    if (dropDate) {
      validateDropDate(dropDate);
    }
  }, [dropDate, selectedDate]);

  const getServiceTotal = (id) => {
    const data = serviceData[id];
    if (!data) return 0;
    if (typeof data === "number") return data;
    return Object.values(data).reduce((a, b) => a + b, 0);
  };

  const hasAtLeastOneItem = useMemo(() => {
    return Object.keys(serviceData).some((id) => getServiceTotal(id) > 0);
  }, [serviceData]);

  const handleUpdateCount = (id, itemName, val) => {
    const count = Math.max(0, parseInt(val) || 0);
    setServiceData((prev) => {
      const current = prev[id] || {};
      if (itemName) return { ...prev, [id]: { ...current, [itemName]: count } };
      return { ...prev, [id]: count };
    });
  };

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const validateTime = (time) => {
    if (!selectedDate) return;

    const now = new Date();
    const today = now.toISOString().split("T")[0];

    const [selHour, selMin] = time.split(":").map(Number);
    const curHour = now.getHours();
    const curMin = now.getMinutes();

    if (selectedDate === today) {
      if (selHour < curHour || (selHour === curHour && selMin < curMin)) {
        setTimeWarning(
          "We don't Deliver in Past. Please select a future time."
        );
        return;
      }
    }

    if (selHour < 8 || selHour >= 22) {
      setTimeWarning("Available between 8 AM to 10 PM.");
      return;
    }

    setTimeWarning("");
  };

  const validateDropTime = (time) => {
    if (!dropDate || !selectedDate) return;

    const now = new Date();
    const today = now.toISOString().split("T")[0];

    const [dropHour, dropMin] = time.split(":").map(Number);
    const curHour = now.getHours();
    const curMin = now.getMinutes();

    if (dropDate === selectedDate && dropDate === today) {
      if (dropHour < curHour || (dropHour === curHour && dropMin < curMin)) {
        setDropTimeWarning(
          "We don’t deliver in the past. Please select a future time."
        );
        return;
      }
    }

    setDropTimeWarning("");
  };

  const validateDropDate = (date) => {
    if (!date) return;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const selectedDropDate = new Date(date);
    selectedDropDate.setHours(0, 0, 0, 0);

    if (selectedDropDate < today) {
      setDropDateWarning(
        "We don’t deliver on past dates. Please select a future date."
      );
      return;
    }

    if (selectedDropDate < new Date(selectedDate)) {
      setDropDateWarning("Drop date cannot be before pickup date.");
      return;
    }

    setDropDateWarning("");
  };

  useEffect(() => {
    if (deliveryType === "standard" && selectedDate) {
      const nextDay = new Date(selectedDate);
      nextDay.setDate(nextDay.getDate() + 1);

      setDropDate(nextDay.toISOString().split("T")[0]);
      setDropTime(selectedTime);
    }
  }, [deliveryType, selectedDate, selectedTime]);

  useEffect(() => {
    if (currentStep === 2 && preSelectedService) {
      const serviceId = serviceTitleToId[preSelectedService];
      if (serviceId) {
        setActiveConfig(serviceId);
      }
    }
  }, [currentStep, preSelectedService, serviceTitleToId]);

  useEffect(() => {
    if (cardRef.current && currentStep > 1) {
      cardRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [currentStep]);

  const basePrice = Object.entries(serviceData).reduce((acc, [sId, items]) => {
    const s = servicesList.find((x) => x.id === sId);
    if (typeof items === "number") return acc + items * (s.price || 0);
    return (
      acc +
      Object.entries(items).reduce((sum, [iName, count]) => {
        const p = s.items?.find((i) => i.name === iName)?.price || 0;
        return sum + count * p;
      }, 0)
    );
  }, 0);

  const expressCharge = deliveryType === "express" ? basePrice * 0.5 : 0;
  const subtotal = basePrice + expressCharge;
  const deliveryFee = subtotal < 299 && subtotal > 0 ? 40 : 0;
  const finalTotalToPay = subtotal + deliveryFee;

  const handleGenerateOrder = async (method, total) => {
    const userEmail = localStorage.getItem("userEmail");

    if (!userEmail) {
      toast.error("Please log in to place an order!");
      return;
    }

    try {
      const year = new Date().getFullYear().toString().slice(-2);
      const randomPart = Math.floor(1000 + Math.random() * 9000);
      const newOrderId = `WL${year}${randomPart}`;

      const orderData = {
        orderId: newOrderId,
        customerName: formData.name,
        customerEmail: userEmail,
        phone: formData.phone,
        address: formData.address,
        message: formData.message || "",

        deliveryType: deliveryType,
        baseAmount: basePrice,
        expressCharge: expressCharge,
        deliveryFee: deliveryFee,
        totalAmount: finalTotalToPay,

        paymentMethod: method,
        pickupDate: selectedDate,
        pickupTime: selectedTime,
        dropDate: deliveryType === "standard" ? dropDate : "Express (5-6 hrs)",
        dropTime: deliveryType === "standard" ? dropTime : "Express (5-6 hrs)",

        status: "Order Confirmed",
        items: serviceData,
        createdAt: serverTimestamp(),
      };

      await setDoc(
        doc(db, "orders", userEmail, "userOrders", newOrderId),
        orderData
      );

      localStorage.setItem(`hasSeenOrders_${userEmail}`, "false");
      localStorage.setItem("lastOrderId", newOrderId);
      toast.success("Order Booked Successfully! ID: " + newOrderId);
      setCurrentStep(6);
    } catch (error) {
      console.error("Firebase Error:", error);
      toast.error("Error: " + error.message);
    }
  };

  const isStep3Valid =
    formData.name.trim() && formData.phone.trim() && formData.address.trim();

  return (
    <>
      <div
        className="min-h-screen"
        style={{ backgroundColor: colors.lightGrey }}
      >
        <div
          className="relative overflow-hidden pt-24 pb-16 px-6 md:px-20 text-white"
          style={{
            background: `linear-gradient(135deg, ${colors.deepNavy} 0%, ${colors.primaryBlue} 100%)`,
          }}
        >
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between relative z-10">
            <div className="md:w-1/2 text-left space-y-4 animate-in slide-in-from-left duration-700">
              <span
                className="px-4 py-1 rounded-full text-xs font-bold tracking-widest uppercase"
                style={{ backgroundColor: colors.teal }}
              >
                Premium Laundry Service
              </span>
              <h1 className="text-5xl md:text-7xl font-extrabold leading-tight">
                Fresh Clothes,
                <br /> <span style={{ color: colors.teal }}>Zero Effort.</span>
              </h1>
              <p className="text-gray-300 text-lg max-w-md">
                The smartest way to handle your laundry. Choose your time, pick
                your items, and let us handle the rest.
              </p>
            </div>
            <div className="md:w-1/2 mt-10 md:mt-0 flex justify-center relative">
              <div className="absolute inset-0 bg-teal-500/20 blur-3xl rounded-full"></div>
              <img
                src={threeperson}
                alt="Laundry Service"
                className="w-64 md:w-96 drop-shadow-2xl animate-bounce-slow relative z-10"
                style={{ animation: "float 6s ease-in-out infinite" }}
              />
            </div>
          </div>

          <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-0">
            <svg
              viewBox="0 0 1200 120"
              preserveAspectRatio="none"
              className="relative block w-full h-12 fill-current"
              style={{ color: colors.lightGrey }}
            >
              <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C58.47,113.1,121.13,103.11,179.13,90.54Z"></path>
            </svg>
          </div>
        </div>

        <section className="flex justify-center items-start px-4 -mt-10 pb-20 relative z-20 scroll-mt-24">
          <div
            ref={cardRef}
            className="w-full max-w-4xl bg-white rounded-3xl p-8 md:p-12 shadow-2xl shadow-blue-900/10"
          >
            <div className="flex justify-between mb-12 relative">
              <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-100 -translate-y-1/2 z-0"></div>
              {[1, 2, 3, 4, 5].map((step) => (
                <div
                  key={step}
                  className={`relative z-10 flex flex-col items-center transition-all duration-500 ${
                    step <= currentStep ? "opacity-100" : "opacity-40"
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm mb-2 border-4 transition-colors shadow-lg ${
                      step <= currentStep
                        ? "text-white"
                        : "bg-white text-gray-400 border-gray-100"
                    }`}
                    style={{
                      backgroundColor:
                        step <= currentStep ? colors.teal : "white",
                      borderColor:
                        step <= currentStep ? colors.teal : "#F3F4F4",
                    }}
                  >
                    {step < currentStep ? "✓" : step}
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">
                    Step {step}
                  </span>
                </div>
              ))}
            </div>

            {currentStep === 1 && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h2
                  className="text-3xl font-bold mb-2"
                  style={{ color: colors.deepNavy }}
                >
                  Pick a Schedule
                </h2>
                <p className="text-gray-500 mb-8">
                  Select your preferred date and time for pickup
                </p>

                <div className="flex gap-4 overflow-x-auto pb-6 scrollbar-hide">
                  {dates.map((item) => (
                    <button
                      key={item.fullDate}
                      onClick={() => setSelectedDate(item.fullDate)}
                      className={`min-w-20 py-4 px-2 rounded-2xl border-2 transition-all duration-300 ${
                        selectedDate === item.fullDate
                          ? "text-white shadow-lg"
                          : "bg-white border-gray-100 text-gray-400 hover:border-teal-200"
                      }`}
                      style={{
                        backgroundColor:
                          selectedDate === item.fullDate
                            ? colors.primaryBlue
                            : "white",
                        borderColor:
                          selectedDate === item.fullDate
                            ? colors.primaryBlue
                            : "#F3F4F4",
                      }}
                    >
                      <div className="text-[10px] uppercase font-bold opacity-80">
                        {item.day}
                      </div>
                      <div className="text-2xl font-black">{item.date}</div>
                    </button>
                  ))}
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide">
                    Pickup Time
                  </label>
                  <input
                    type="time"
                    value={selectedTime}
                    onChange={(e) => {
                      setSelectedTime(e.target.value);
                      validateTime(e.target.value);
                    }}
                    className="p-4 rounded-xl border-2 border-gray-100 w-full focus:ring-4 outline-none transition-all"
                    style={{
                      focusRingColor: colors.teal + "20",
                      focusBorderColor: colors.teal,
                    }}
                  />

                  <p className="text-xs text-gray-500 mt-2 italic">
                    * Your order will be picked up within 1 hour of your
                    selected time.
                  </p>

                  {timeWarning && (
                    <p className="text-sm text-red-500 mt-3 font-semibold flex items-center gap-2">
                      ⚠️ {timeWarning}
                    </p>
                  )}
                </div>

                <div className="mt-8">
                  <p className="text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide">
                    Delivery Type
                  </p>

                  <div className="flex gap-4">
                    <button
                      onClick={() => {
                        setDeliveryType("standard");
                        setShowExpressNote(false);
                      }}
                      className={`flex-1 py-4 rounded-xl font-bold transition-all ${
                        deliveryType === "standard"
                          ? "text-white shadow-lg"
                          : "bg-white border-2 border-gray-200 text-gray-500"
                      }`}
                      style={{
                        backgroundColor:
                          deliveryType === "standard"
                            ? colors.primaryBlue
                            : "white",
                      }}
                    >
                      Standard Delivery
                    </button>

                    <button
                      onClick={() => {
                        setDeliveryType("express");
                        setShowExpressNote(true);
                      }}
                      className={`flex-1 py-4 rounded-xl font-bold transition-all ${
                        deliveryType === "express"
                          ? "text-white shadow-lg"
                          : "bg-white border-2 border-gray-200 text-gray-500"
                      }`}
                      style={{
                        backgroundColor:
                          deliveryType === "express"
                            ? colors.primaryBlue
                            : "white",
                      }}
                    >
                      Express Delivery
                    </button>
                  </div>

                  {deliveryType === "express" && showExpressNote && (
                    <div className="mt-6 p-5 rounded-2xl bg-linear-to-r from-[#1D546D] to-[#5F9598] text-white animate-in fade-in slide-in-from-bottom-3 duration-500 shadow-md">
                      <h4 className="text-lg font-black mb-1">
                        Express Delivery Activated
                      </h4>
                      <p className="text-sm opacity-90">
                        Picked up and delivered within
                      </p>
                      <p className="text-xl font-black mt-1 mb-3">
                        5 – 6 Hours
                      </p>

                      <div className="pt-3 border-t border-white/20">
                        <p className="text-xs font-medium">
                          Note: Express delivery will be charged at 1.5x the
                          standard rate.
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {deliveryType === "standard" && (
                  <div className="mt-8 animate-in fade-in slide-in-from-bottom-3 duration-500">
                    <h2
                      className="text-3xl font-bold mb-2"
                      style={{ color: colors.deepNavy }}
                    >
                      Schedule Drop
                    </h2>
                    <p className="text-gray-500 mb-8">
                      Select your preferred date and time for Delivery
                    </p>

                    <div className="mb-4">
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        Drop Date
                      </label>
                      <input
                        type="date"
                        value={dropDate}
                        min={selectedDate}
                        onChange={(e) => {
                          setDropDate(e.target.value);
                          validateDropDate(e.target.value);
                        }}
                        className="p-4 rounded-xl border-2 border-gray-100 w-full"
                      />
                      {dropDateWarning && (
                        <p className="text-sm text-red-500 mt-3 font-semibold flex items-center gap-2">
                          ⚠️ {dropDateWarning}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        Drop Time
                      </label>
                      <input
                        type="time"
                        value={dropTime}
                        onChange={(e) => {
                          setDropTime(e.target.value);
                          validateDropTime(e.target.value);
                        }}
                        className="p-4 rounded-xl border-2 border-gray-100 w-full"
                      />
                      {dropTimeWarning && (
                        <p className="text-sm text-red-500 mt-3 font-semibold flex items-center gap-2">
                          ⚠️ {dropTimeWarning}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {currentStep === 2 && (
              <div className="animate-in fade-in duration-500">
                <h2
                  className="text-3xl font-bold mb-2"
                  style={{ color: colors.deepNavy }}
                >
                  Select Services
                </h2>
                <p className="text-gray-500 mb-8">
                  Choose items from the pricing list.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {servicesList.map((service) => {
                    const totalItems = getServiceTotal(service.id);
                    const isConfiguring = activeConfig === service.id;

                    return (
                      <div
                        key={service.id}
                        className="p-6 rounded-3xl border-2 transition-all"
                        style={{
                          borderColor: totalItems > 0 ? colors.teal : "#F9FAFB",
                          backgroundColor:
                            totalItems > 0 ? colors.lightGrey : "white",
                        }}
                      >
                        {!isConfiguring ? (
                          <div className="flex justify-between items-center">
                            <div>
                              <h4 className="font-black text-xl">
                                {service.title}
                              </h4>
                              <p className="text-sm opacity-60">
                                Starting from ₹
                                {service.price || service.items?.[0]?.price}
                              </p>
                            </div>
                            <button
                              onClick={() => setActiveConfig(service.id)}
                              className="px-6 py-2 rounded-xl text-white font-bold"
                              style={{ backgroundColor: colors.primaryBlue }}
                            >
                              {totalItems > 0 ? "Edit" : "Add"}
                            </button>
                          </div>
                        ) : (
                          <div className="animate-in zoom-in-95 duration-200">
                            <h4 className="font-black mb-4 flex justify-between">
                              <span>{service.title}</span>
                            </h4>
                            <div className="space-y-3">
                              {(
                                service.items || [
                                  { name: "Quantity", price: service.price },
                                ]
                              ).map((itemObj) => {
                                const itemName =
                                  typeof itemObj === "string"
                                    ? itemObj
                                    : itemObj.name;
                                const itemPrice = itemObj.price;
                                const count =
                                  serviceData[service.id]?.[itemName] ||
                                  (typeof serviceData[service.id] === "number"
                                    ? serviceData[service.id]
                                    : 0);

                                return (
                                  <div
                                    key={itemName}
                                    className="flex justify-between items-center bg-white p-3 rounded-xl shadow-sm"
                                  >
                                    <div className="flex flex-col">
                                      <span className="text-xs font-bold">
                                        {itemName}
                                      </span>
                                      <span className="text-[10px] text-teal-600 font-bold">
                                        ₹{itemPrice} / pc
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                      <button
                                        onClick={() =>
                                          handleUpdateCount(
                                            service.id,
                                            service.items ? itemName : null,
                                            count - 1
                                          )
                                        }
                                        className="w-7 h-7 rounded bg-gray-100 flex items-center justify-center"
                                      >
                                        -
                                      </button>
                                      <span className="font-bold w-4 text-center">
                                        {count}
                                      </span>
                                      <button
                                        onClick={() =>
                                          handleUpdateCount(
                                            service.id,
                                            service.items ? itemName : null,
                                            count + 1
                                          )
                                        }
                                        className="w-7 h-7 rounded text-white flex items-center justify-center"
                                        style={{ backgroundColor: colors.teal }}
                                      >
                                        +
                                      </button>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                            <button
                              onClick={() => setActiveConfig(null)}
                              className="w-full mt-4 py-3 rounded-xl font-black text-white"
                              style={{ backgroundColor: colors.teal }}
                            >
                              Save Selection
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="animate-in fade-in duration-500">
                <h2 className="text-3xl font-bold mb-2">Your Info</h2>
                <p className="text-gray-500 mb-8">
                  Where should we come to pick up?
                </p>
                <div className="space-y-5">
                  <input
                    type="text"
                    name="name"
                    placeholder="Full name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full border-2 border-gray-100 p-4 rounded-xl outline-none focus:border-teal-500 transition-colors"
                  />
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Phone number"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full border-2 border-gray-100 p-4 rounded-xl outline-none focus:border-teal-500 transition-colors"
                  />
                  <textarea
                    name="address"
                    placeholder="Pickup address"
                    rows={2}
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full border-2 border-gray-100 p-4 rounded-xl outline-none resize-none focus:border-teal-500 transition-colors"
                  />
                  <div className="space-y-3">
                    <label className="text-xs font-black uppercase text-gray-400 tracking-widest">
                      Delivery Instructions
                    </label>

                    <div className="flex flex-wrap gap-2 mb-2">
                      {[
                        "Leave at the door",
                        "Leave at Neighbor to the right",
                        "Leave at Neighbor to the left",
                        "Call before arriving",
                      ].map((msg) => (
                        <button
                          key={msg}
                          type="button"
                          onClick={() => {
                            setFormData((prev) => ({ ...prev, message: msg }));
                          }}
                          className={`text-[10px] font-bold px-3 py-2 rounded-lg border transition-all ${
                            formData.message === msg
                              ? "bg-teal-500 border-teal-500 text-white"
                              : "bg-white border-gray-100 text-gray-500 hover:border-teal-200"
                          }`}
                        >
                          {msg}
                        </button>
                      ))}
                    </div>

                    <textarea
                      name="message"
                      placeholder="Any special instructions for the driver?"
                      rows={2}
                      value={formData.message}
                      onChange={handleChange}
                      className="w-full border-2 border-gray-100 p-4 rounded-xl outline-none resize-none focus:border-teal-500 transition-colors text-sm"
                    />
                  </div>
                </div>
              </div>
            )}

            {currentStep === 4 && (
              <div className="animate-in fade-in duration-500">
                <h2
                  className="text-3xl font-bold mb-8 text-center"
                  style={{ color: colors.deepNavy }}
                >
                  Review Details
                </h2>

                <div className="space-y-4">
                  <div className="p-6 rounded-2xl border-2 border-gray-50 bg-gray-50/50 flex justify-between items-start">
                    <div>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
                        Contact & Address
                      </p>
                      <p
                        className="font-bold text-lg"
                        style={{ color: colors.deepNavy }}
                      >
                        {formData.name}
                      </p>
                      <p className="text-sm opacity-70">{formData.phone}</p>
                      <p className="text-sm mt-2 font-medium text-gray-600">
                        {formData.address}
                      </p>
                    </div>
                    <button
                      onClick={() => setCurrentStep(3)}
                      className="font-bold text-xs hover:underline"
                      style={{ color: colors.teal }}
                    >
                      Edit
                    </button>
                  </div>

                  <div className="p-6 rounded-2xl border-2 border-gray-50 bg-gray-50/50 flex justify-between items-start">
                    <div>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">
                        Schedule
                      </p>
                      <p
                        className="font-bold"
                        style={{ color: colors.deepNavy }}
                      >
                        Pickup: {selectedDate} at {selectedTime}
                      </p>
                      {deliveryType === "standard" ? (
                        <p className="font-bold mt-1 text-gray-600">
                          Delivery: {dropDate} at {dropTime}
                        </p>
                      ) : (
                        <p
                          className="font-bold mt-1"
                          style={{ color: colors.teal }}
                        >
                          Express Delivery (5 – 6 Hours)
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => setCurrentStep(1)}
                      className="font-bold text-xs hover:underline"
                      style={{ color: colors.teal }}
                    >
                      Edit
                    </button>
                  </div>

                  <div className="p-6 rounded-3xl border-2 border-gray-100 bg-white shadow-sm">
                    <div className="flex justify-between items-center mb-6">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                        Detailed Order Summary
                      </p>
                      <button
                        onClick={() => setCurrentStep(2)}
                        className="font-bold text-xs hover:underline"
                        style={{ color: colors.teal }}
                      >
                        Add Items
                      </button>
                    </div>

                    <div className="max-h-80 overflow-y-auto pr-2 scrollbar-thin">
                      {Object.entries(serviceData).map(([serviceId, items]) => {
                        const service = servicesList.find(
                          (s) => s.id === serviceId
                        );
                        if (!service) return null;

                        return (
                          <div key={serviceId} className="mb-6 last:mb-0">
                            <h5
                              className="font-black text-xs mb-3 uppercase tracking-wider"
                              style={{ color: colors.primaryBlue }}
                            >
                              {service.title}
                            </h5>

                            {typeof items === "object"
                              ? Object.entries(items).map(
                                  ([itemName, count]) => {
                                    if (count === 0) return null;
                                    const itemPrice =
                                      service.items?.find(
                                        (i) => i.name === itemName
                                      )?.price || 0;

                                    return (
                                      <div
                                        key={itemName}
                                        className="flex justify-between items-center py-3 border-b border-gray-50 last:border-0"
                                      >
                                        <div className="text-sm">
                                          <p
                                            className="font-bold"
                                            style={{ color: colors.deepNavy }}
                                          >
                                            {itemName}
                                          </p>
                                          <p className="text-xs text-gray-400">
                                            ₹{itemPrice} per item
                                          </p>
                                        </div>

                                        <div className="flex items-center gap-3 bg-gray-50 p-1.5 rounded-xl border border-gray-100">
                                          <button
                                            onClick={() =>
                                              handleUpdateCount(
                                                serviceId,
                                                itemName,
                                                count - 1
                                              )
                                            }
                                            className="w-8 h-8 flex items-center justify-center font-bold text-gray-500 hover:text-red-500 transition-colors"
                                          >
                                            -
                                          </button>
                                          <div className="flex flex-col items-center min-w-15">
                                            <span
                                              className="text-xs font-black"
                                              style={{ color: colors.teal }}
                                            >
                                              {count} Qty
                                            </span>
                                            <span className="text-[10px] font-bold text-gray-400">
                                              ₹{itemPrice * count}
                                            </span>
                                          </div>
                                          <button
                                            onClick={() =>
                                              handleUpdateCount(
                                                serviceId,
                                                itemName,
                                                count + 1
                                              )
                                            }
                                            className="w-8 h-8 flex items-center justify-center font-bold hover:text-teal-600 transition-colors"
                                            style={{ color: colors.teal }}
                                          >
                                            +
                                          </button>
                                        </div>
                                      </div>
                                    );
                                  }
                                )
                              : items > 0 && (
                                  <div className="flex justify-between items-center py-3">
                                    <span
                                      className="text-sm font-bold"
                                      style={{ color: colors.deepNavy }}
                                    >
                                      Fixed Service Rate
                                    </span>
                                    <div className="flex items-center gap-3 bg-gray-50 p-1.5 rounded-xl border border-gray-100">
                                      <button
                                        onClick={() =>
                                          handleUpdateCount(
                                            serviceId,
                                            null,
                                            items - 1
                                          )
                                        }
                                        className="w-8 h-8 flex items-center justify-center font-bold"
                                      >
                                        -
                                      </button>
                                      <span
                                        className="font-black"
                                        style={{ color: colors.teal }}
                                      >
                                        ₹{service.price * items}
                                      </span>
                                      <button
                                        onClick={() =>
                                          handleUpdateCount(
                                            serviceId,
                                            null,
                                            items + 1
                                          )
                                        }
                                        className="w-8 h-8 flex items-center justify-center font-bold"
                                      >
                                        +
                                      </button>
                                    </div>
                                  </div>
                                )}
                          </div>
                        );
                      })}
                    </div>

                    {(() => {
                      const normalPrice = Object.entries(serviceData).reduce(
                        (acc, [sId, items]) => {
                          const s = servicesList.find((x) => x.id === sId);
                          if (!s) return acc;
                          if (typeof items === "number")
                            return acc + items * (s.price || 0);
                          return (
                            acc +
                            Object.entries(items).reduce(
                              (sum, [iName, count]) => {
                                const p =
                                  s.items?.find((i) => i.name === iName)
                                    ?.price || 0;
                                return sum + count * p;
                              },
                              0
                            )
                          );
                        },
                        0
                      );

                      const expressExtra =
                        deliveryType === "express" ? normalPrice * 0.5 : 0;
                      const currentTotal = normalPrice + expressExtra;
                      const deliveryCharge =
                        currentTotal < 299 && currentTotal > 0 ? 40 : 0;
                      const finalGrandTotal = currentTotal + deliveryCharge;

                      return (
                        <div className="mt-8 space-y-4 border-t border-gray-100 pt-6">
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-500 font-medium">
                                Items Total:
                              </span>
                              <span className="font-bold text-gray-700">
                                ₹{normalPrice}
                              </span>
                            </div>

                            {deliveryType === "express" && (
                              <div className="flex justify-between text-sm text-teal-600 font-bold">
                                <span>Express Delivery (1.5x):</span>
                                <span>+ ₹{expressExtra}</span>
                              </div>
                            )}

                            {deliveryCharge > 0 && (
                              <div className="flex justify-between text-sm text-orange-600 font-bold">
                                <span>Delivery Fee (Below ₹299):</span>
                                <span>+ ₹{deliveryCharge}</span>
                              </div>
                            )}
                          </div>

                          {deliveryType === "express" && (
                            <div className="p-3 bg-teal-50 rounded-xl border border-teal-100">
                              <p className="text-[11px] text-teal-800 leading-tight">
                                ✨ <strong>Note:</strong> Because you chose{" "}
                                <strong>Express Delivery</strong>, your total is
                                multiplied by 1.5 for 5-6 hour service.
                              </p>
                            </div>
                          )}

                          <div
                            className="p-5 rounded-2xl text-white flex justify-between items-center shadow-lg"
                            style={{
                              background: `linear-gradient(135deg, ${colors.deepNavy} 0%, ${colors.primaryBlue} 100%)`,
                            }}
                          >
                            <div>
                              <span className="font-bold uppercase tracking-widest text-[10px] opacity-80">
                                Total Amount
                              </span>
                              <p className="text-xs opacity-70">Tax Included</p>
                            </div>
                            <span className="text-3xl font-black">
                              ₹{finalGrandTotal}
                            </span>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                </div>
              </div>
            )}

            {currentStep === 5 && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="text-center mb-8">
                  <h2
                    className="text-3xl font-bold"
                    style={{ color: colors.deepNavy }}
                  >
                    Finalize Payment
                  </h2>
                  <p className="text-gray-500">
                    Securely complete your laundry booking
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                  <div className="order-2 md:order-1 flex flex-col justify-between">
                    <div>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">
                        Select Payment Method
                      </p>

                      <PaymentMethod
                        totalAmount={finalTotalToPay}
                        onProceed={(method) => {
                          setSelectedPaymentMethod(method);
                          setTempSelectedMethod(method);
                        }}
                      />
                    </div>

                    <div className="mt-8">
                      <div className="flex gap-4">
                        <button
                          onClick={() => setCurrentStep(4)}
                          className="flex-1 py-5 rounded-2xl font-black uppercase tracking-widest border-2 transition-all flex items-center justify-center gap-2 hover:bg-gray-50"
                          style={{
                            borderColor: colors.deepNavy,
                            color: colors.deepNavy,
                          }}
                        >
                          <ArrowLeft size={18} /> Back
                        </button>

                        <button
                          disabled={!selectedPaymentMethod}
                          onClick={() => {
                            if (!localStorage.getItem("userEmail")) {
                              const event = new Event("open-login-modal");
                              window.dispatchEvent(event);
                              return;
                            }
                            handleGenerateOrder(
                              selectedPaymentMethod,
                              finalTotalToPay
                            );
                          }}
                          className={`flex-2 py-5 rounded-2xl text-white font-black uppercase tracking-widest shadow-xl transition-all transform active:scale-95 ${
                            !selectedPaymentMethod
                              ? "bg-gray-300 cursor-not-allowed"
                              : "hover:brightness-110"
                          }`}
                          style={{
                            backgroundColor:
                              selectedPaymentMethod === "COD"
                                ? colors.deepNavy
                                : selectedPaymentMethod === "UPI"
                                ? colors.teal
                                : "#D1D5DB",
                          }}
                        >
                          {selectedPaymentMethod === "COD"
                            ? "Schedule Now"
                            : selectedPaymentMethod === "UPI"
                            ? `Pay ₹${finalTotalToPay} & Schedule`
                            : "Select Method"}
                        </button>
                      </div>

                      <p className="text-center text-[9px] text-gray-400 font-bold uppercase mt-4 tracking-tighter">
                        By clicking, you agree to our service terms and
                        conditions.
                      </p>
                    </div>
                  </div>

                  <div className="order-1 md:order-2 bg-gray-50 p-6 rounded-3xl border-2 border-gray-100">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">
                      Order Final Summary
                    </p>

                    <div className="space-y-3">
                      <div className="flex justify-between text-sm text-gray-500 font-medium">
                        <span>Items Total</span>
                        <span>₹{basePrice}</span>
                      </div>

                      {deliveryType === "express" && (
                        <div className="flex justify-between text-sm text-teal-600 font-bold">
                          <span>Express Charge (1.5x)</span>
                          <span>+ ₹{expressCharge}</span>
                        </div>
                      )}

                      {deliveryFee > 0 && (
                        <div className="flex justify-between text-sm text-orange-600 font-bold">
                          <span>Delivery Fee</span>
                          <span>+ ₹{deliveryFee}</span>
                        </div>
                      )}

                      <div className="pt-4 border-t-2 border-dashed border-gray-200 flex justify-between items-center">
                        <span className="font-black text-[#061E29]">
                          Amount to Pay
                        </span>
                        <span
                          className="text-3xl font-black"
                          style={{ color: colors.primaryBlue }}
                        >
                          ₹{finalTotalToPay}
                        </span>
                      </div>
                    </div>

                    <div className="mt-6 p-3 bg-white rounded-xl border border-gray-100">
                      <p className="text-[10px] text-gray-400 uppercase font-bold mb-1">
                        Pickup From:
                      </p>
                      <p className="text-xs font-bold text-gray-600">
                        {formData.address}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 6 && (
              <div className="animate-in zoom-in-95 duration-500 py-10">
                <div className="text-center mb-10">
                  <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner">
                    <CheckCircle size={40} />
                  </div>
                  <h2 className="text-3xl font-black text-[#061E29]">
                    Order Placed!
                  </h2>
                  <p className="text-gray-500 font-bold mt-1 uppercase tracking-widest text-xs">
                    ORDER ID: {localStorage.getItem("lastOrderId")}
                  </p>
                </div>

                <div className="max-w-sm mx-auto space-y-5 relative">
                  <div className="relative left-0 top-2 bottom-2 w-0.5 bg-gray-100 -z-10" />

                  {[
                    {
                      title: "Order Confirmed",
                      desc: "Received at Washlane HQ",
                      status: "done",
                    },
                    {
                      title: "Pickup Scheduled",
                      desc: `Executive arriving on ${selectedDate}`,
                      status: "pending",
                    },
                    {
                      title: "Cleaning Process",
                      desc: "Expert cleaning in progress",
                      status: "pending",
                    },
                    {
                      title: "Ready for Delivery",
                      desc: "Fresh & packed clothes",
                      status: "pending",
                    },
                    {
                      title: "order Deliver",
                      desc: "Thank You",
                      status: "pending",
                    },
                  ].map((step, i) => (
                    <div key={i} className="flex gap-6 items-start">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center border-4 border-white shadow-md transition-colors ${
                          step.status === "done"
                            ? "bg-[#5F9598] text-white"
                            : "bg-gray-100 text-gray-400"
                        }`}
                      >
                        {step.status === "done" ? (
                          <CheckCircle size={18} />
                        ) : (
                          i + 1
                        )}
                      </div>
                      <div>
                        <h4
                          className={`font-black text-sm uppercase tracking-tight ${
                            step.status === "done"
                              ? "text-[#061E29]"
                              : "text-gray-300"
                          }`}
                        >
                          {step.title}
                        </h4>
                        <p className="text-[11px] text-gray-400 font-medium leading-tight">
                          {step.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-12 space-y-3">
                  <button
                    onClick={() => (window.location.href = "/")}
                    className="w-full py-4 rounded-2xl bg-[#061E29] text-white font-black uppercase tracking-widest hover:bg-black transition-all shadow-lg"
                  >
                    Return to Home
                  </button>
                  <p className="text-center text-[10px] text-gray-400 font-bold uppercase">
                    Check your email for the detailed invoice.
                  </p>
                </div>
              </div>
            )}

            {currentStep < 5 && (
              <div className="flex gap-4 mt-12">
                <button
                  disabled={currentStep === 1}
                  onClick={() => setCurrentStep((p) => p - 1)}
                  className="w-1/2 py-4 rounded-2xl border-2 font-black transition-all disabled:opacity-20 flex items-center justify-center gap-2"
                  style={{
                    borderColor: colors.deepNavy,
                    color: colors.deepNavy,
                  }}
                >
                  <ArrowLeft size={18} /> Back
                </button>
                <button
                  disabled={
                    (currentStep === 1 &&
                      (timeWarning ||
                        !selectedTime ||
                        (deliveryType === "standard" &&
                          (dropDateWarning || dropTimeWarning)))) ||
                    (currentStep === 2 && !hasAtLeastOneItem) ||
                    (currentStep === 3 && !isStep3Valid)
                  }
                  onClick={() => setCurrentStep((p) => p + 1)}
                  className="w-1/2 py-4 rounded-2xl text-white font-black shadow-xl disabled:bg-gray-200 disabled:shadow-none transition-all flex items-center justify-center gap-2"
                  style={{ backgroundColor: colors.primaryBlue }}
                >
                  {currentStep === 4 ? "Proceed to Payment" : "Continue"}{" "}
                  <ArrowRight size={18} />
                </button>
              </div>
            )}
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
};

export default SchedualPickUp;
