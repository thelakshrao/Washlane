import React, { useMemo, useState, useEffect } from "react";
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
  });

  const servicesList = useMemo(
    () => [
      {
        id: "wash-fold",
        title: "Wash & Fold",
        price: "$1.50/lb",
        items: [
          "Shirts/T-shirt",
          "Trouser",
          "Suits",
          "Blazers",
          "Sarees",
          "Dresses",
        ],
      },
      {
        id: "wash-iron",
        title: "Wash & Iron",
        price: "$2.50/item",
        items: [
          "Shirts/T-shirt",
          "Trouser",
          "Suits",
          "Blazers",
          "Sarees",
          "Dresses",
        ],
      },
      {
        id: "only-iron",
        title: "Only Ironing",
        price: "$1.99/item",
        items: [
          "Shirts/T-shirt",
          "Trouser",
          "Suits",
          "Blazers",
          "Sarees",
          "Dresses",
        ],
      },
      {
        id: "dry-clean",
        title: "Dry Cleaning",
        price: "$5.99/item",
        items: ["Suits", "Blazers", "Sarees", "Dresses", "Jackets", "Woolens"],
      },
      { id: "bedsheet", title: "Bedsheet Cleaning", price: "$3.50/item" },
      { id: "blanket", title: "Blanket / Quilt Wash", price: "$4.50/item" },
      { id: "curtain", title: "Curtain Cleaning", price: "$3.99/item" },
      { id: "sofa", title: "Sofa Cover Cleaning", price: "$6.50/item" },
      { id: "shoes", title: "Shoe Laundry", price: "$2.99/item" },
      { id: "bags", title: "Bag Cleaning", price: "$2.50/item" },
      { id: "soft-toys", title: "Soft Toy Cleaning", price: "$3.00/item" },
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

          <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0]">
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

        <section className="flex justify-center items-start px-4 -mt-10 pb-20 relative z-20">
          <div className="w-full max-w-4xl bg-white rounded-3xl p-8 md:p-12 shadow-2xl shadow-blue-900/10">
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
                      className={`min-w-[80px] py-4 px-2 rounded-2xl border-2 transition-all duration-300 ${
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
                    <div className="mt-6 p-5 rounded-2xl bg-gradient-to-r from-[#1D546D] to-[#5F9598] text-white animate-in fade-in slide-in-from-bottom-3 duration-500">
                      <h4 className="text-lg font-black mb-1">
                        Express Delivery Activated
                      </h4>
                      <p className="text-sm opacity-90">
                        Your clothes will be picked up and delivered within
                      </p>
                      <p className="text-xl font-black mt-1">2 – 3 Hours</p>
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
                  What are we cleaning for you today?
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {servicesList.map((service) => {
                    const total = getServiceTotal(service.id);
                    const isConfiguring = activeConfig === service.id;
                    return (
                      <div
                        key={service.id}
                        className={`relative p-6 rounded-3xl border-2 transition-all duration-300 ${
                          total > 0 ? "shadow-md" : "border-gray-50"
                        }`}
                        style={{
                          borderColor: total > 0 ? colors.teal : "#F9FAFB",
                          backgroundColor:
                            total > 0 ? colors.lightGrey : "white",
                        }}
                      >
                        {!isConfiguring ? (
                          <div className="flex justify-between items-center">
                            <div>
                              <h4
                                className="font-black text-xl"
                                style={{ color: colors.deepNavy }}
                              >
                                {service.title}
                              </h4>
                              <p
                                className="text-sm font-bold opacity-60"
                                style={{ color: colors.primaryBlue }}
                              >
                                {service.price}
                              </p>
                              {total > 0 && (
                                <span
                                  className="inline-block mt-3 px-4 py-1 text-white text-[10px] font-black rounded-full"
                                  style={{ backgroundColor: colors.teal }}
                                >
                                  {total} ITEMS
                                </span>
                              )}
                            </div>
                            <button
                              onClick={() => setActiveConfig(service.id)}
                              className="px-6 py-2 rounded-xl text-sm font-bold text-white transition-transform active:scale-95 shadow-md"
                              style={{ backgroundColor: colors.primaryBlue }}
                            >
                              {total > 0 ? "Edit" : "Add"}
                            </button>
                          </div>
                        ) : (
                          <div className="animate-in zoom-in-95 duration-200">
                            <h4 className="font-black mb-6 flex justify-between items-center">
                              <span>{service.title}</span>
                              <span
                                className="text-xs px-2 py-1 rounded bg-white"
                                style={{ color: colors.teal }}
                              >
                                Configuring
                              </span>
                            </h4>
                            {service.items ? (
                              <div className="space-y-4 mb-6">
                                {service.items.map((item) => (
                                  <div
                                    key={item}
                                    className="flex justify-between items-center"
                                  >
                                    <span className="text-sm font-medium">
                                      {item}
                                    </span>
                                    <div className="flex items-center gap-4">
                                      <button
                                        onClick={() =>
                                          handleUpdateCount(
                                            service.id,
                                            item,
                                            (serviceData[service.id]?.[item] ||
                                              0) - 1
                                          )
                                        }
                                        className="w-8 h-8 rounded-lg bg-white shadow-sm border border-gray-100 flex items-center justify-center font-bold"
                                      >
                                        -
                                      </button>
                                      <span className="w-4 text-center font-bold">
                                        {serviceData[service.id]?.[item] || 0}
                                      </span>
                                      <button
                                        onClick={() =>
                                          handleUpdateCount(
                                            service.id,
                                            item,
                                            (serviceData[service.id]?.[item] ||
                                              0) + 1
                                          )
                                        }
                                        className="w-8 h-8 rounded-lg text-white shadow-md flex items-center justify-center font-bold"
                                        style={{ backgroundColor: colors.teal }}
                                      >
                                        +
                                      </button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className="flex items-center justify-between mb-6">
                                <span className="text-sm font-bold">
                                  Quantity
                                </span>
                                <div className="flex items-center gap-4">
                                  <button
                                    onClick={() =>
                                      handleUpdateCount(
                                        service.id,
                                        null,
                                        (serviceData[service.id] || 0) - 1
                                      )
                                    }
                                    className="w-10 h-10 rounded-xl bg-white shadow-sm border border-gray-100 font-bold"
                                  >
                                    -
                                  </button>
                                  <span className="w-6 text-center text-lg font-black">
                                    {serviceData[service.id] || 0}
                                  </span>
                                  <button
                                    onClick={() =>
                                      handleUpdateCount(
                                        service.id,
                                        null,
                                        (serviceData[service.id] || 0) + 1
                                      )
                                    }
                                    className="w-10 h-10 rounded-xl text-white shadow-md font-bold"
                                    style={{ backgroundColor: colors.teal }}
                                  >
                                    +
                                  </button>
                                </div>
                              </div>
                            )}
                            <button
                              onClick={() => setActiveConfig(null)}
                              className="w-full py-3 rounded-xl font-black text-white shadow-lg shadow-teal-900/20"
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
                    rows={3}
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full border-2 border-gray-100 p-4 rounded-xl outline-none resize-none focus:border-teal-500 transition-colors"
                  />
                </div>
              </div>
            )}

            {currentStep === 4 && (
              <div className="animate-in fade-in duration-500">
                <h2 className="text-3xl font-bold mb-8 text-center">
                  Review Details
                </h2>
                <div className="space-y-4">
                  <div className="p-6 rounded-2xl border-2 border-gray-50 bg-gray-50/50 flex justify-between items-start">
                    <div>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
                        Contact & Address
                      </p>
                      <p className="font-bold text-lg">{formData.name}</p>
                      <p className="text-sm opacity-70">{formData.phone}</p>
                      <p className="text-sm mt-2 font-medium">
                        {formData.address}
                      </p>
                    </div>
                    <button
                      onClick={() => setCurrentStep(3)}
                      className="text-teal-600 font-bold text-xs hover:underline"
                    >
                      Edit
                    </button>
                  </div>

                  <div className="p-6 rounded-2xl border-2 border-gray-50 bg-gray-50/50 flex justify-between items-start">
                    <div>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">
                        Schedule
                      </p>

                      <p className="font-bold">
                        Pickup: {selectedDate} at {selectedTime}
                      </p>

                      {deliveryType === "standard" && (
                        <p className="font-bold mt-2">
                          Delivery: {dropDate} at {dropTime}
                        </p>
                      )}

                      {deliveryType === "express" && (
                        <p className="font-bold mt-2 text-teal-700">
                          Express Delivery (2–3 Hours)
                        </p>
                      )}
                    </div>

                    <button
                      onClick={() => setCurrentStep(1)}
                      className="text-teal-600 font-bold text-xs hover:underline"
                    >
                      Edit
                    </button>
                  </div>

                  <div className="p-6 rounded-2xl border-2 border-gray-50 bg-gray-50/50">
                    <div className="flex justify-between items-center mb-4">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                        Order Summary
                      </p>
                      <button
                        onClick={() => setCurrentStep(2)}
                        className="text-teal-600 font-bold text-xs hover:underline"
                      >
                        Edit
                      </button>
                    </div>
                    {Object.keys(serviceData).map((serviceId) => {
                      const total = getServiceTotal(serviceId);
                      if (total === 0) return null;
                      const service = servicesList.find(
                        (s) => s.id === serviceId
                      );
                      return (
                        <div
                          key={serviceId}
                          className="py-3 border-t border-gray-100"
                        >
                          <p className="font-bold flex justify-between">
                            <span>{service?.title}</span>
                            <span style={{ color: colors.teal }}>
                              {total} Items
                            </span>
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {currentStep === 5 && (
              <div className="text-center py-10 animate-in zoom-in duration-500">
                <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-4xl mx-auto mb-6">
                  ✓
                </div>
                <h2
                  className="text-4xl font-black mb-4"
                  style={{ color: colors.deepNavy }}
                >
                  Order Confirmed!
                </h2>
                <p className="text-gray-500 mb-10 max-w-sm mx-auto">
                  We've received your request. A driver will be assigned to your
                  location shortly.
                </p>
                <button
                  onClick={() => window.location.reload()}
                  className="px-12 py-4 text-white font-black rounded-2xl shadow-xl transition-transform hover:scale-105 active:scale-95"
                  style={{ backgroundColor: colors.deepNavy }}
                >
                  Book Another
                </button>
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
                  {currentStep === 4 ? "Schedule Now" : "Continue"}{" "}
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
