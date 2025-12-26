import React, { useMemo, useState, useEffect } from "react";
import threeperson from "../images/three.png";

const SchedualPickUp = () => {
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedServices, setSelectedServices] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
  });

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
    if (dates.length) {
      setSelectedDate(dates[0].fullDate);
    }
  }, [dates]);

  const steps = [1, 2, 3, 4, 5];

  const timeSlots = [
    "8:00 AM - 10:00 AM",
    "10:00 AM - 12:00 PM",
    "12:00 PM - 2:00 PM",
    "2:00 PM - 4:00 PM",
    "4:00 PM - 6:00 PM",
    "6:00 PM - 8:00 PM",
  ];

  const timeToMinutes = (time) => {
    let [hour, minute] = time.split(":");
    minute = parseInt(minute);
    hour = parseInt(hour);

    if (time.includes("PM") && hour !== 12) hour += 12;
    if (time.includes("AM") && hour === 12) hour = 0;

    return hour * 60 + minute;
  };

  const isSlotDisabled = (slot) => {
    const [start, end] = slot.split(" - ");
    const midPoint = (timeToMinutes(start) + timeToMinutes(end)) / 2;

    const now = new Date();
    const nowMin = now.getHours() * 60 + now.getMinutes();

    return nowMin >= midPoint;
  };

  const toggleService = (service) => {
    setSelectedServices((prev) =>
      prev.includes(service)
        ? prev.filter((s) => s !== service)
        : [...prev, service]
    );
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const isStep3Valid =
    formData.name.trim() && formData.phone.trim() && formData.address.trim();

  return (
    <>
      <div className="flex flex-col md:flex-row gap-10 w-full bg-black items-center justify-center pt-20 px-4 md:px-20">
        <div className="md:w-1/4 flex justify-center">
          <img src={threeperson} alt="peoples" />
        </div>

        <div className="md:w-1/2 text-center py-5">
          <h1 className="text-white text-2xl md:text-7xl font-semibold font-serif">
            Schedule a Pickup
          </h1>
          <p className="text-white text-xs md:text-lg mt-2">
            Pick a time that works best for you.
          </p>
        </div>
      </div>

      {/* form*/}
      <section className="min-h-screen bg-white flex justify-center items-center px-4 my-5">
        <div className="w-full max-w-4xl border border-black/10 rounded-xl p-6">
          <div className="flex justify-between mb-8 text-xs font-medium">
            {steps.map((step) => (
              <div
                key={step}
                className={`flex-1 text-center pb-2 border-b-2 ${
                  step === currentStep
                    ? "border-black"
                    : "border-black/20 text-black/40"
                }`}
              >
                Step {step}
              </div>
            ))}
          </div>

          {currentStep === 1 && (
            <>
              <h2 className="text-sm md:text-2xl font-semibold mb-1">
                When should we pick up your laundry?
              </h2>
              <p className="text-xs md:text-sm text-black/60 mb-8">
                Choose a convenient date and time for pickup
              </p>

              <h4 className="font-medium mb-4">Select Date</h4>
              <div className="flex gap-3 overflow-x-auto mb-8">
                {dates.map((item) => (
                  <button
                    key={item.fullDate}
                    onClick={() => setSelectedDate(item.fullDate)}
                    className={`min-w-12 p-1 md:min-w-20 md:p-3 rounded-lg border cursor-pointer ${
                      selectedDate === item.fullDate
                        ? "bg-black text-white border-black"
                        : "border-black/20"
                    }`}
                  >
                    <div className="text-xs">{item.day}</div>
                    <div className="text-lg font-semibold">{item.date}</div>
                  </button>
                ))}
              </div>

              <h4 className="font-medium mb-4">Select Time Slot</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
                {timeSlots.map((time) => {
                  const disabled = isSlotDisabled(time);
                  return (
                    <button
                      key={time}
                      disabled={disabled}
                      onClick={() => !disabled && setSelectedTime(time)}
                      className={`p-4 rounded-lg border ${
                        disabled
                          ? "text-black/30 cursor-not-allowed"
                          : selectedTime === time
                          ? "bg-black text-white"
                          : "border-black/20 cursor-pointer"
                      }`}
                    >
                      {time}
                      {disabled && (
                        <span className="block text-xs">(Unavailable)</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </>
          )}

          {currentStep === 2 && (
            <>
              <h2 className="text-sm md:text-2xl font-semibold mb-2">
                What services do you need?
              </h2>
              <p className="text-xs md:text-sm text-black/60 mb-8">
                Select one or more services
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-6 mb-4 md:mb-10">
                {[
                  { id: "wash-fold", title: "Wash & Fold", price: "$1.50/lb" },
                  {
                    id: "dry-clean",
                    title: "Dry Cleaning",
                    price: "$5.99/item",
                  },
                  {
                    id: "wash-iron",
                    title: "Wash & Iron",
                    price: "$2.50/item",
                  },
                  { id: "steam", title: "Steam Press", price: "$3.99/item" },
                ].map((service) => {
                  const active = selectedServices.includes(service.id);
                  return (
                    <button
                      key={service.id}
                      onClick={() => toggleService(service.id)}
                      className={`p-6 rounded-xl border text-left cursor-pointer ${
                        active
                          ? "border-black- ring-2 ring-black-300"
                          : "border-black/20"
                      }`}
                    >
                      <h4 className="font-semibold">{service.title}</h4>
                      <p className="mt-2">{service.price}</p>
                    </button>
                  );
                })}
              </div>
              {selectedServices.length > 0 && (
                <p className="text-xs md:text-sm text-black/60 text-right mt-2">
                  {selectedServices.length}{" "}
                  {selectedServices.length === 1 ? "service" : "services"}{" "}
                  selected
                </p>
              )}
            </>
          )}

          {currentStep === 3 && (
            <>
              <h2 className="text-sm md:text-2xl font-semibold mb-2">
                Pickup details
              </h2>
              <p className="text-xs md:text-sm text-black/60 mb-8">
                Enter your contact and pickup address
              </p>

              <div className="space-y-4 mb-8">
                <input
                  type="text"
                  name="name"
                  placeholder="Full name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full border border-black/20 rounded-lg px-4 py-3 text-sm outline-none focus:border-black"
                />

                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone number"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full border border-black/20 rounded-lg px-4 py-3 text-sm outline-none focus:border-black"
                />

                <textarea
                  name="address"
                  placeholder="Pickup address"
                  rows={3}
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full border border-black/20 rounded-lg px-4 py-3 text-sm outline-none focus:border-black resize-none"
                />
              </div>

              <div className="bg-black/5 border border-black/10 rounded-xl p-4 mb-6">
                <h4 className="font-semibold text-sm mb-3">
                  Pickup Instructions
                </h4>

                <ul className="text-xs md:text-sm text-black/70 space-y-2">
                  <li>
                    • Our driver will arrive during your selected time slot
                  </li>
                  <li>
                    • Please have your laundry bagged and ready for pickup
                  </li>
                  <li>
                    • You'll receive a notification when the driver is nearby
                  </li>
                  <li>• No need to be home – contactless pickup available</li>
                </ul>
              </div>
            </>
          )}
          {currentStep === 4 && (
            <>
              <h2 className="text-sm md:text-2xl font-semibold mb-2">
                Review Your Order
              </h2>
              <p className="text-xs md:text-sm text-black/60 mb-8">
                Please confirm all details before proceeding to payment
              </p>

              <div className="flex justify-between items-start mb-4 border p-4 rounded-lg">
                <div>
                  <h4 className="font-semibold">Pickup Address</h4>
                  <p className="text-sm">
                    {formData.address || "Not provided"}
                  </p>
                  <p className="text-xs mt-1">
                    Phone: {formData.phone || "Not provided"}
                  </p>
                  <p className="text-xs mt-1">
                    Note: {formData.name || "Not provided"}
                  </p>
                </div>
                
                <button
                  onClick={() => setCurrentStep(3)}
                  className="text-black hover:text-gray-700 text-lg cursor-pointer"
                  title="Edit"
                >
                  ✎ Edit
                </button>
              </div>

              <div className="flex justify-between items-start mb-4 border p-4 rounded-lg">
                <div>
                  <h4 className="font-semibold">Selected Services</h4>
                  {selectedServices.length > 0 ? (
                    <ul className="text-sm mt-1">
                      {selectedServices.map((s, i) => (
                        <li key={i}>• {s}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm mt-1">No services selected</p>
                  )}
                </div>
                <button
                  onClick={() => setCurrentStep(2)}
                  className="text-black hover:text-gray-700 text-lg cursor-pointer"
                  title="Edit"
                >
                  ✎ Edit
                </button>
              </div>

              <div className="flex justify-between items-start mb-4 border p-4 rounded-lg">
                <div>
                  <h4 className="font-semibold">Pickup Date & Time</h4>
                  <p className="text-sm mt-1">Date: {selectedDate}</p>
                  <p className="text-sm mt-1">Time: {selectedTime}</p>
                </div>
                <button
                  onClick={() => setCurrentStep(1)}
                  className="text-black hover:text-gray-700 text-lg cursor-pointer"
                  title="Edit"
                >
                  ✎ Edit
                </button>
              </div>
              <div className="bg-black/5 border border-black/10 rounded-xl p-4 mb-6">
                <h4 className="font-semibold text-sm mb-3">
                  Pricing Information
                </h4>
                <p className="text-sm mb-3">Final charges will be calculated based on the actual weight/count of items received.</p>

                <ul className="text-xs md:text-sm text-black/70 space-y-2">
                  <li>
                    • Free pickup and delivery included
                  </li>
                  <li>
                    • Minimum order: $7
                  </li>
                  <li>
                    • Payment collected after service completion
                  </li>
                </ul>
              </div>
            </>
          )}

          <div className="flex gap-4">
            <button
              disabled={currentStep === 1}
              onClick={() => setCurrentStep((p) => p - 1)}
              className={`w-1/2 py-2 md:py-3 rounded-full  border ${
                currentStep === 1
                  ? "text-black/30 cursor-not-allowed"
                  : "border-black cursor-pointer"
              }`}
            >
              ← Back
            </button>

            <button
              disabled={
                (currentStep === 1 && !selectedTime) ||
                (currentStep === 2 && selectedServices.length === 0)
              }
              onClick={() => setCurrentStep((p) => p + 1)}
              className={`w-1/2 py-2 md:py-3 rounded-full ${
                (currentStep === 1 && !selectedTime) ||
                (currentStep === 2 && selectedServices.length === 0)
                  ? "bg-black/20 text-black/40 cursor-not-allowed"
                  : "bg-black text-white cursor-pointer"
              }`}
            >
              Continue →
            </button>
          </div>
        </div>
      </section>
    </>
  );
};

export default SchedualPickUp;
