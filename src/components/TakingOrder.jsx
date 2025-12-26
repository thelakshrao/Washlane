import React from "react";
import hoverBg from "../images/homepic1.webp";
import { Link } from "react-router-dom";

const TakingOrder = () => {
  return (
    <section
      id="orders"
      className="w-full flex justify-center items-center py-16 px-4"
    >
      <div className="md:hidden w-full overflow-x-auto snap-x snap-mandatory flex rounded-3xl">
        <div
          className="min-w-full h-105 snap-center relative flex items-center justify-center px-5"
          style={{
            backgroundImage: `url(${hoverBg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 bg-black/45" />

          <div className="relative z-10 w-full rounded-2xl bg-white/20 backdrop-blur-lg border border-white/30 p-8 text-white text-center">
            <h3 className="text-2xl font-bold mb-4">
              Ready to Experience Fresh, Clean Laundry?
            </h3>

            <p className="text-sm text-white/80 mb-6">
              Join thousands of satisfied customers who trust WashLane
            </p>

            <Link to="/schedualpickup" className="bg-white text-sm text-black py-2 px-2 md:px-6 md:py-3 rounded-lg font-semibold hover:bg-gray-200 transition">
              Schedule Pickup Now →
            </Link>
          </div>
        </div>
      </div>

      <div
        className="hidden md:flex group relative w-full max-w-7xl h-105 rounded-3xl
        overflow-hidden items-center transition-all duration-700"
        style={{
          backgroundImage: `url(${hoverBg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/25 transition-all duration-700" />

        <div
          className="absolute z-10
          left-1/2 top-1/2
          -translate-x-1/2 -translate-y-1/2
          group-hover:left-[25%]
          transition-all duration-700 ease-in-out"
        >
          <div className="w-56 h-56 rounded-full bg-white/20 backdrop-blur-lg border border-white/30 flex items-center justify-center">
            <h1 className="text-3xl font-bold tracking-widest text-white">
              WASHLANE
            </h1>
          </div>
        </div>

        <div
          className="absolute right-0 top-0 h-full w-[55%]
          flex items-center px-10
          opacity-0 translate-x-80
          group-hover:opacity-100 group-hover:translate-x-0
          transition-all duration-700 ease-out z-10"
        >
          <div className="w-full rounded-2xl bg-white/20 backdrop-blur-lg border border-white/30 p-10 text-white">
            <h3 className="text-3xl font-bold mb-4">
              Ready to Experience Fresh, Clean Laundry?
            </h3>

            <p className="text-white/80 mb-8">
              Join thousands of satisfied customers who trust WashLane
            </p>

            <Link to="/schedualpickup" className="bg-white text-black px-8 py-4 rounded-lg font-semibold hover:bg-gray-200 cursor-pointer transition">
              Schedule Pickup Now →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TakingOrder;
