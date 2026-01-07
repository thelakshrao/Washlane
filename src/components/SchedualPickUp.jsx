import React, { useMemo, useState, useEffect } from "react";
import threeperson from "../images/three.png";

const SchedualPickUp = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [timeWarning, setTimeWarning] = useState("");
  const [serviceData, setServiceData] = useState({});
  const [activeConfig, setActiveConfig] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
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
    const indiaTime = new Date(
      now.toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
    );
    const current = `${indiaTime
      .getHours()
      .toString()
      .padStart(2, "0")}:${indiaTime.getMinutes().toString().padStart(2, "0")}`;
    setSelectedTime(current);
    validateTime(current);
  }, [dates]);

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
      if (itemName) {
        return { ...prev, [id]: { ...current, [itemName]: count } };
      }
      return { ...prev, [id]: count };
    });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateTime = (time) => {
    const [hour, minute] = time.split(":").map(Number);
    const numeric = hour + minute / 60;
    if (numeric > 22)
      setTimeWarning("Unavailable. Scheduling for tomorrow morning.");
    else if (numeric < 8) setTimeWarning("Available between 8 AM to 10 PM.");
    else setTimeWarning("");
  };

  const isStep3Valid =
    formData.name.trim() && formData.phone.trim() && formData.address.trim();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex flex-col md:flex-row gap-10 w-full bg-black items-center justify-center pt-20 pb-10 px-4 md:px-20">
        <div className="md:w-1/4 flex justify-center">
          <img src={threeperson} alt="people" className="w-48" />
        </div>
        <div className="md:w-1/2 text-center py-5">
          <h1 className="text-white text-4xl md:text-6xl font-semibold">
            Schedule a Pickup
          </h1>
        </div>
      </div>

      <section className="flex justify-center items-center px-4 py-10">
        <div className="w-full max-w-4xl bg-white border border-black/10 rounded-xl p-6 shadow-sm">
          <div className="flex justify-between mb-8 text-xs font-medium">
            {[1, 2, 3, 4, 5].map((step) => (
              <div
                key={step}
                className={`flex-1 text-center pb-2 border-b-2 transition-colors ${
                  step <= currentStep
                    ? "border-black text-black"
                    : "border-gray-200 text-gray-400"
                }`}
              >
                Step {step}
              </div>
            ))}
          </div>

          {currentStep === 1 && (
            <div className="animate-in fade-in duration-300">
              <h2 className="text-xl md:text-2xl font-semibold mb-1">
                When should we pick up?
              </h2>
              <p className="text-sm text-gray-500 mb-6">
                Choose a convenient date and time
              </p>
              <div className="flex gap-3 overflow-x-auto pb-4 mb-6">
                {dates.map((item) => (
                  <button
                    key={item.fullDate}
                    onClick={() => setSelectedDate(item.fullDate)}
                    className={`min-w-18 p-3 rounded-lg border transition-all ${
                      selectedDate === item.fullDate
                        ? "bg-black text-white border-black"
                        : "border-gray-200 hover:border-black"
                    }`}
                  >
                    <div className="text-xs uppercase">{item.day}</div>
                    <div className="text-lg font-bold">{item.date}</div>
                  </button>
                ))}
              </div>
              <label className="block font-medium mb-2">Select Time Slot</label>
              <input
                type="time"
                value={selectedTime}
                onChange={(e) => {
                  setSelectedTime(e.target.value);
                  validateTime(e.target.value);
                }}
                className="p-4 rounded-lg border w-full focus:ring-2 ring-black/5 outline-none"
              />
              {timeWarning && (
                <p className="text-sm text-red-500 mt-2 font-medium">
                  {timeWarning}
                </p>
              )}
            </div>
          )}

          {currentStep === 2 && (
            <div className="relative">
              <h2 className="text-2xl font-semibold mb-2">Select Services</h2>
              <p className="text-gray-500 mb-6">Click a service to add items</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {servicesList.map((service) => {
                  const total = getServiceTotal(service.id);
                  const isConfiguring = activeConfig === service.id;
                  return (
                    <div
                      key={service.id}
                      className={`relative p-5 rounded-2xl border-2 transition-all ${
                        total > 0
                          ? "border-black bg-gray-50"
                          : "border-gray-100"
                      }`}
                    >
                      {!isConfiguring ? (
                        <div className="flex justify-between items-center">
                          <div>
                            <h4 className="font-bold text-lg">
                              {service.title}
                            </h4>
                            <p className="text-sm text-gray-500">
                              {service.price}
                            </p>
                            {total > 0 && (
                              <span className="inline-block mt-2 px-3 py-1 bg-black text-white text-xs rounded-full">
                                {total} Items Added
                              </span>
                            )}
                          </div>
                          <button
                            onClick={() => setActiveConfig(service.id)}
                            className="bg-black text-white px-4 py-2 rounded-lg text-sm"
                          >
                            {total > 0 ? "Edit" : "Add"}
                          </button>
                        </div>
                      ) : (
                        <div className="animate-in fade-in zoom-in duration-200">
                          <h4 className="font-bold mb-4">
                            Configure {service.title}
                          </h4>
                          {service.items ? (
                            <div className="space-y-3 mb-4">
                              {service.items.map((item) => (
                                <div
                                  key={item}
                                  className="flex justify-between items-center"
                                >
                                  <span className="text-sm">{item}</span>
                                  <div className="flex items-center gap-3">
                                    <button
                                      onClick={() =>
                                        handleUpdateCount(
                                          service.id,
                                          item,
                                          (serviceData[service.id]?.[item] ||
                                            0) - 1
                                        )
                                      }
                                      className="w-8 h-8 border rounded-full"
                                    >
                                      -
                                    </button>
                                    <span className="w-4 text-center">
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
                                      className="w-8 h-8 border rounded-full"
                                    >
                                      +
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="flex items-center justify-between mb-4">
                              <span className="text-sm font-medium">
                                Quantity
                              </span>
                              <div className="flex items-center gap-3">
                                <button
                                  onClick={() =>
                                    handleUpdateCount(
                                      service.id,
                                      null,
                                      (serviceData[service.id] || 0) - 1
                                    )
                                  }
                                  className="w-8 h-8 border rounded-full"
                                >
                                  -
                                </button>
                                <span className="w-4 text-center">
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
                                  className="w-8 h-8 border rounded-full"
                                >
                                  +
                                </button>
                              </div>
                            </div>
                          )}
                          <button
                            onClick={() => setActiveConfig(null)}
                            className="w-full bg-black text-white py-2 rounded-lg font-bold"
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
            <div className="animate-in fade-in duration-300">
              <h2 className="text-xl md:text-2xl font-semibold mb-6">
                Pickup Details
              </h2>
              <div className="space-y-4">
                <input
                  type="text"
                  name="name"
                  placeholder="Full name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full border p-3 rounded-lg outline-none focus:border-black"
                />
                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone number"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full border p-3 rounded-lg outline-none focus:border-black"
                />
                <textarea
                  name="address"
                  placeholder="Pickup address"
                  rows={3}
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full border p-3 rounded-lg outline-none resize-none focus:border-black"
                />
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="animate-in fade-in duration-300">
              <h2 className="text-xl md:text-2xl font-semibold mb-6">
                Review Your Order
              </h2>
              <div className="space-y-4">
                <div className="p-4 border rounded-lg flex justify-between">
                  <div>
                    <p className="font-bold">Contact & Address</p>
                    <p className="text-sm">
                      {formData.name} | {formData.phone}
                    </p>
                    <p className="text-sm text-gray-600">{formData.address}</p>
                  </div>
                  <button
                    onClick={() => setCurrentStep(3)}
                    className="text-blue-600 text-sm underline"
                  >
                    Edit
                  </button>
                </div>
                <div className="p-4 border rounded-lg flex justify-between">
                  <div>
                    <p className="font-bold">Schedule</p>
                    <p className="text-sm">
                      {selectedDate} at {selectedTime}
                    </p>
                  </div>
                  <button
                    onClick={() => setCurrentStep(1)}
                    className="text-blue-600 text-sm underline"
                  >
                    Edit
                  </button>
                </div>
                <div className="p-4 border rounded-lg">
                  <div className="flex justify-between mb-2">
                    <p className="font-bold">Services Selected</p>
                    <button
                      onClick={() => setCurrentStep(2)}
                      className="text-blue-600 text-sm underline"
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
                        className="text-sm py-2 border-t border-gray-100"
                      >
                        <p className="font-semibold text-black">
                          • {service?.title} ({total} items)
                        </p>
                        {typeof serviceData[serviceId] === "object" && (
                          <div className="pl-4 text-gray-500 text-xs italic">
                            {Object.entries(serviceData[serviceId])
                              .filter(([_, count]) => count > 0)
                              .map(([name, count]) => `${name}: ${count}`)
                              .join(", ")}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {currentStep === 5 && (
            <div className="text-center py-10">
              <div className="text-6xl mb-4">✅</div>
              <h2 className="text-2xl font-bold mb-2">Order Confirmed!</h2>
              <button
                onClick={() => window.location.reload()}
                className="mt-8 px-8 py-3 bg-black text-white rounded-full"
              >
                Book Another
              </button>
            </div>
          )}

          {currentStep < 5 && (
            <div className="flex gap-4 mt-10">
              <button
                disabled={currentStep === 1}
                onClick={() => setCurrentStep((p) => p - 1)}
                className={`w-1/2 py-3 rounded-full border border-black font-medium ${
                  currentStep === 1
                    ? "opacity-30 cursor-not-allowed"
                    : "hover:bg-gray-50"
                }`}
              >
                ← Back
              </button>
              <button
                disabled={
                  (currentStep === 1 && (timeWarning || !selectedTime)) ||
                  (currentStep === 2 && !hasAtLeastOneItem) ||
                  (currentStep === 3 && !isStep3Valid)
                }
                onClick={() => setCurrentStep((p) => p + 1)}
                className="w-1/2 py-3 rounded-full bg-black text-white font-medium disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                {currentStep === 4 ? "Confirm & Schedule" : "Continue →"}
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default SchedualPickUp;
