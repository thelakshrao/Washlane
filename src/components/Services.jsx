import React from "react";
import { Shirt, Sparkles, Ribbon, Bed, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";

const services = [
  {
    title: "Wash & Fold",
    desc: "Perfect for everyday clothes and regular wear",
    price: "₹99",
    unit: "per kg",
    features: ["Wash & dry", "Neatly folded", "24–48 hour delivery"],
    icon: <Shirt className="w-7 h-7 text-[#1D546D]" />,
    iconBg: "bg-blue-50",
  },
  {
    title: "Wash & Iron",
    desc: "Crisp and ready-to-wear garments",
    price: "₹149",
    unit: "per kg",
    features: ["Wash & dry", "Professional ironing", "48–72 hour delivery"],
    icon: <Sparkles className="w-7 h-7 text-[#5F9598]" />,
    iconBg: "bg-teal-50",
  },
  {
    title: "Dry Cleaning",
    desc: "Premium care for delicate fabrics",
    price: "₹299",
    unit: "per piece",
    features: ["Specialized cleaning", "Stain removal", "3–5 day delivery"],
    icon: <Ribbon className="w-7 h-7 text-purple-500" />,
    iconBg: "bg-purple-50",
  },
  {
    title: "Bedding & Curtains",
    desc: "Deep cleaning for home textiles",
    price: "₹199",
    unit: "per piece",
    features: ["Deep cleaning", "Sanitization", "3–5 day delivery"],
    icon: <Bed className="w-7 h-7 text-orange-500" />,
    iconBg: "bg-orange-50",
  },
];

const Services = () => {
  const navigate = useNavigate();

  return (
    <section className="scroll-mt-28 bg-white py-8 px-4 sm:px-6">
      <div id="services" className="text-center mb-10 pt-8">
        <span className="text-[#5F9598] font-bold tracking-widest uppercase text-sm">
          Pricing
        </span>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#061E29] mt-3 mb-4">
          Our Services & Pricing
        </h2>
        <p className="text-[#1D546D]/60 max-w-lg mx-auto font-medium text-sm sm:text-base">
          Professional laundry solutions tailored for every type of garment.
        </p>
      </div>

      <div className="max-w-7xl mx-auto">
        <div className="flex lg:hidden gap-6 overflow-x-auto py-4 px-2 scrollbar-hide">
          {services.map((item, index) => (
            <div
              key={index}
              className="shrink-0 w-[85vw] max-w-[320px] bg-white rounded-[2.5rem] p-6 border border-gray-100 shadow-[0_10px_30px_rgba(0,0,0,0.03)] transition-all duration-500 hover:shadow-[0_20px_50px_rgba(29,84,109,0.1)] hover:-translate-y-2 flex flex-col"
            >
              <div
                className={`w-14 h-14 ${item.iconBg} rounded-2xl flex items-center justify-center mb-6`}
              >
                {item.icon}
              </div>

              <div className="w-full flex-1">
                <h3 className="text-lg font-black text-[#061E29] mb-2">
                  {item.title}
                </h3>

                <p className="text-[#1D546D]/60 text-sm mb-5 leading-relaxed font-medium">
                  {item.desc}
                </p>

                <div className="mb-5 pt-3 border-t border-gray-100 flex items-baseline gap-1">
                  <span className="text-2xl font-black text-[#1D546D]">
                    {item.price}
                  </span>
                  <span className="text-[#5F9598] font-bold text-sm tracking-tight">
                    {item.unit}
                  </span>
                </div>

                <ul className="space-y-2 mb-6">
                  {item.features.map((feature, idx) => (
                    <li
                      key={idx}
                      className="flex items-center text-sm font-semibold text-[#061E29]/70"
                    >
                      <div className="mr-3 bg-emerald-50 p-1 rounded-full">
                        <Check className="text-emerald-500 w-3 h-3 stroke-[4px]" />
                      </div>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              <button
                onClick={() =>
                  navigate("/schedualpickup", {
                    state: { selectedService: item.title },
                  })
                }
                className="w-full py-3 px-6 bg-[#061E29] hover:bg-[#1D546D] text-white font-bold rounded-2xl transition-all shadow-lg active:scale-95"
              >
                Select Service
              </button>
            </div>
          ))}
        </div>

        <div className="hidden lg:grid lg:grid-cols-4 gap-8 justify-items-center">
          {services.map((item, index) => (
            <div
              key={index}
              className="w-full max-w-[320px] bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-[0_10px_30px_rgba(0,0,0,0.03)] transition-all duration-500 hover:shadow-[0_20px_50px_rgba(29,84,109,0.1)] hover:-translate-y-2 flex flex-col"
            >
              <div
                className={`w-16 h-16 ${item.iconBg} rounded-2xl flex items-center justify-center mb-8`}
              >
                {item.icon}
              </div>

              <div className="flex-1">
                <h3 className="text-2xl font-black text-[#061E29] mb-3">
                  {item.title}
                </h3>
                <p className="text-[#1D546D]/60 text-sm mb-8 leading-relaxed font-medium">
                  {item.desc}
                </p>

                <div className="mb-8 pt-6 border-t border-gray-50 flex items-baseline gap-1">
                  <span className="text-4xl font-black text-[#1D546D]">
                    {item.price}
                  </span>
                  <span className="text-[#5F9598] font-bold text-sm tracking-tight">
                    {item.unit}
                  </span>
                </div>

                <ul className="space-y-4 mb-10">
                  {item.features.map((feature, idx) => (
                    <li
                      key={idx}
                      className="flex items-center text-sm font-semibold text-[#061E29]/70"
                    >
                      <div className="mr-3 bg-emerald-50 p-1 rounded-full">
                        <Check className="text-emerald-500 w-3 h-3 stroke-[4px]" />
                      </div>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              <button
                onClick={() =>
                  navigate("/schedualpickup", {
                    state: { selectedService: item.title },
                  })
                }
                className="w-full py-3 px-6 bg-[#061E29] hover:bg-[#1D546D] text-white font-bold rounded-2xl transition-all shadow-lg active:scale-95"
              >
                Select Service
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
