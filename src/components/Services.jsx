import React, { useRef, useState } from "react";
import service1 from "../images/service1.webp";
import service2 from "../images/service2.webp";
import service3 from "../images/service3.webp";
import service4 from "../images/service4.webp";

const services = [
  {
    title: "Professional Washing",
    desc: "State-of-the-art machines for deep cleaning",
    img: service1,
  },
  {
    title: "Expert Ironing",
    desc: "Crisp, wrinkle-free clothes every time",
    img: service2,
  },
  {
    title: "Dry Cleaning",
    desc: "Gentle care for delicate fabrics",
    img: service3,
  },
  {
    title: "Careful Folding",
    desc: "Neatly organized and ready to wear",
    img: service4,
  },
];

const Services = () => {
  const scrollRef = useRef(null);
  const [showLeft, setShowLeft] = useState(false);

  const handleScroll = () => {
    if (scrollRef.current.scrollLeft > 20) {
      setShowLeft(true);
    } else {
      setShowLeft(false);
    }
  };

  const scroll = (dir) => {
    scrollRef.current.scrollBy({
      left: dir === "right" ? 300 : -300, 
      behavior: "smooth",
    });
  };

  return (
    <section id="services" className="bg-white py-20 px-4 sm:px-6">
      <div className="text-center mb-14">
        <h2 className="text-4xl font-semibold text-black mb-2">
          Our Professional Services
        </h2>
        <p className="text-gray-600">
          See the quality and care we put into every garment
        </p>
      </div>

      <div className="relative max-w-7xl mx-auto">
        {showLeft && (
          <button
            onClick={() => scroll("left")}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-md w-10 h-10 rounded-full flex items-center justify-center"
          >
            ‹
          </button>
        )}

        <button
          onClick={() => scroll("right")}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-md w-10 h-10 rounded-full flex items-center justify-center"
        >
          ›
        </button>

        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex gap-6 sm:gap-8 overflow-x-auto scroll-smooth scrollbar-hide p-2 sm:px-10"
        >
          {services.map((item, index) => (
            <div
              key={index}
              className="min-w-70 sm:min-w-80 bg-white rounded-2xl overflow-hidden transition-all duration-300
              hover:shadow-[0_0_40px_rgba(0,0,0,0.6)]"
            >

              <div className="overflow-hidden">
                <img
                  src={item.img}
                  alt={item.title}
                  className="w-full h-52 sm:h-66 object-cover transition-transform duration-500 hover:scale-110"
                />
              </div>

              <div className="p-4 sm:p-6">
                <h3 className="text-lg font-semibold text-black mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-600 text-sm">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
