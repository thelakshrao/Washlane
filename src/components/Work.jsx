import React from "react";
import { CalendarCheck, Truck, Sparkles, Home } from "lucide-react";

const steps = [
  {
    id: 1,
    icon: <CalendarCheck className="w-7 h-7" />,
    title: "Schedule Pickup",
    desc: "Choose a convenient time for us to collect your laundry",
    color: "bg-blue-50 text-blue-600",
  },
  {
    id: 2,
    icon: <Truck className="w-7 h-7" />,
    title: "We Collect",
    desc: "Our driver picks up your clothes from your doorstep",
    color: "bg-teal-50 text-[#5F9598]",
  },
  {
    id: 3,
    icon: <Sparkles className="w-7 h-7" />,
    title: "We Clean",
    desc: "Professional cleaning, drying, and folding with care",
    color: "bg-indigo-50 text-[#1D546D]",
  },
  {
    id: 4,
    icon: <Home className="w-7 h-7" />,
    title: "We Deliver",
    desc: "Fresh, clean laundry back to your door in 24–48 hours",
    color: "bg-emerald-50 text-emerald-600",
  },
];

const Work = () => {
  return (
    <section id="works" className="bg-[#F3F4F4] py-20 px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Section Heading */}
        <div className="text-center mb-16">
          <span className="text-[#5F9598] font-bold tracking-widest uppercase text-sm">
            Process
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#061E29] mt-3">
            How it Works
          </h2>
          <p className="text-[#1D546D]/60 mt-4 max-w-lg mx-auto font-medium text-sm sm:text-base">
            A seamless experience from the moment you book until your fresh
            clothes arrive.
          </p>
        </div>

        {/* Desktop Layout */}
        <div className="hidden lg:block relative mt-10">
          <div className="absolute top-12 left-[10%] right-[10%] h-[2px] bg-gradient-to-r from-transparent via-[#5F9598]/30 to-transparent"></div>

          <div className="grid grid-cols-4 gap-8">
            {steps.map((step) => (
              <div key={step.id} className="text-center group relative px-4">
                {/* Step number */}
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-white text-[#061E29] w-8 h-8 rounded-full flex items-center justify-center text-sm font-black shadow-md z-20 border border-gray-100 group-hover:bg-[#1D546D] group-hover:text-white transition-colors duration-300">
                  {step.id}
                </div>

                {/* Icon */}
                <div
                  className={`mx-auto w-24 h-24 rounded-[2rem] flex items-center justify-center ${step.color} shadow-sm border border-white z-10 relative group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 ease-out`}
                >
                  {step.icon}
                </div>

                {/* Title & Description */}
                <div className="mt-8">
                  <h3 className="text-xl font-bold text-[#061E29] mb-3">
                    {step.title}
                  </h3>
                  <p className="text-[#1D546D]/70 text-sm leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile Layout: 2x2 Grid */}
        <div className="lg:hidden grid grid-cols-2 gap-6 mt-8">
          {steps.map((step) => (
            <div
              key={step.id}
              className="bg-white rounded-3xl p-5 flex flex-col items-start gap-4 border border-gray-100 shadow-sm"
            >
              {/* Icon with Step Number */}
              <div
                className={`relative w-14 h-14 rounded-2xl flex items-center justify-center ${step.color}`}
              >
                {step.icon}
                <span className="absolute -top-2 -right-2 text-xs font-black text-white bg-[#1D546D] w-5 h-5 flex items-center justify-center rounded-full border border-white">
                  {step.id}
                </span>
              </div>

              {/* Title & Description */}
              <div>
                <h3 className="text-sm sm:text-base font-bold text-[#061E29] mb-1">
                  {step.title}
                </h3>
                <p className="text-gray-500 text-xs sm:text-sm">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Work;
