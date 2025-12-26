import React from "react";
import { FaBox, FaTruck, FaRegStar, FaHome } from "react-icons/fa";

const steps = [
  {
    id: 1,
    icon: <FaBox />,
    title: "Schedule Pickup",
    desc: "Choose a convenient time for us to collect your laundry",
  },
  {
    id: 2,
    icon: <FaTruck />,
    title: "We Collect",
    desc: "Our driver picks up your clothes from your doorstep",
  },
  {
    id: 3,
    icon: <FaRegStar />,
    title: "We Clean",
    desc: "Professional cleaning, drying, and folding with care",
  },
  {
    id: 4,
    icon: <FaHome />,
    title: "We Deliver",
    desc: "Fresh, clean laundry back to your door in 24–48 hours",
  },
];

const Work = () => {
  return (
    <section id="works" className="bg-white text-black py-20 px-6">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-bold mb-3">How it Works</h2>
        <p className="text-gray-400">
          Simple 4-step process from pickup to delivery
        </p>
      </div>

      <div className="hidden md:block relative max-w-6xl mx-auto">
        <div className="absolute top-7 left-0 right-0 h-1 bg-gray-600"></div>

        <div className="grid grid-cols-4 gap-12">
          {steps.map((step) => (
            <div key={step.id} className="text-center relative">
              <div className="mx-auto w-14 h-14 rounded-full border-2 border-balck flex items-center justify-center bg-white z-10 relative">
                {step.icon}
              </div>

              <div className="mx-auto mt-4 w-8 h-8 rounded-full bg-white text-black flex items-center justify-center text-sm font-bold">
                {step.id}
              </div>

              <h3 className="mt-4 text-lg font-semibold">{step.title}</h3>
              <p className="mt-2 text-sm text-gray-400">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="md:hidden grid grid-cols-2 gap-6 max-w-md mx-auto">
        {steps.map((step) => (
          <div
            key={step.id}
            className="text-center bg-black rounded-lg p-4 flex flex-col items-center"
          >
            <div className="w-10 h-10 rounded-full border border- flex items-center justify-center mb-2 text-white text-xs">
              {React.cloneElement(step.icon, { size: 20 })}
            </div>

            <div className="w-6 h-6 rounded-full bg-white text-black flex items-center justify-center text-xs font-bold mb-2">
              {step.id}
            </div>

            <h3 className="text-sm text-white font-semibold mb-1">{step.title}</h3>
            <p className="text-xs text-gray-400">{step.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Work;
