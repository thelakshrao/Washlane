import React from "react";
import hoverBg from "../images/homepic1.webp";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";

const TakingOrder = () => {
  return (
    <section
      id="orders"
      className="w-full flex justify-center items-center py-20 px-6 bg-white"
    >
      <div className="md:hidden w-full rounded-[2.5rem] overflow-hidden shadow-2xl relative h-auto">
        <div
          className="absolute inset-0 transition-transform duration-700 hover:scale-110"
          style={{
            backgroundImage: `url(${hoverBg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#061E29] via-[#061E29]/40 to-transparent" />

        <div className="relative z-10 h-full flex flex-col justify-end p-8 text-white">
          <div className="bg-[#5F9598] w-fit px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest mb-4 flex items-center gap-2">
            <Sparkles size={12} /> Special Offer
          </div>
          <h3 className="text-3xl font-black mb-4 leading-tight">
            Ready for Fresh, <br /> Clean Laundry?
          </h3>
          <p className="text-sm text-white/80 mb-8 font-medium">
            Join thousands of satisfied customers who trust WashLane every day.
          </p>
          <Link 
            to="/schedualpickup" 
            className="bg-white text-[#061E29] py-4 px-6 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-xl active:scale-95 transition-all"
          >
            Book Now <ArrowRight size={18} />
          </Link>
        </div>
      </div>

      <div
        className="hidden md:flex group relative w-full max-w-7xl h-105 rounded-[3rem]
        overflow-hidden items-center transition-all duration-700 shadow-2xl"
      >
        <div 
          className="absolute inset-0 transition-transform duration-1000 group-hover:scale-105"
          style={{
            backgroundImage: `url(${hoverBg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />

        <div className="absolute inset-0 bg-[#061E29]/50 group-hover:bg-[#061E29]/30 transition-all duration-700" />

        <div
          className="absolute z-10
          left-1/2 top-1/2
          -translate-x-1/2 -translate-y-1/2
          group-hover:left-[22%]
          transition-all duration-700 ease-in-out"
        >
          <div className="w-64 h-64 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 flex flex-col items-center justify-center shadow-2xl scale-90 group-hover:scale-100 transition-transform duration-700">
             <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mb-4 rotate-12 group-hover:rotate-0 transition-transform duration-500">
                <Sparkles className="text-[#061E29]" size={24} />
             </div>
            <h1 className="text-2xl font-black tracking-[0.2em] text-white">
              WASHLANE
            </h1>
          </div>
        </div>

        <div
          className="absolute right-12 h-[80%] w-[50%]
          flex items-center
          opacity-0 translate-x-20
          group-hover:opacity-100 group-hover:translate-x-0
          transition-all duration-700 ease-out z-10"
        >
          <div className="w-full rounded-[2.5rem] bg-white/10 backdrop-blur-2xl border border-white/20 p-12 text-white shadow-2xl">
            <h3 className="text-4xl font-black mb-4 leading-tight">
              Ready to Experience <br />
              <span className="text-[#5F9598]">Premium Cleaning?</span>
            </h3>

            <p className="text-white/70 mb-10 text-lg font-medium">
              Free pickup and delivery at your doorstep. Schedule your first wash today.
            </p>

            <Link 
              to="/schedualpickup" 
              className="inline-flex items-center gap-3 bg-white text-[#061E29] px-10 py-5 rounded-2xl font-black hover:bg-[#F3F4F4] transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1 active:translate-y-0"
            >
              Schedule Free Pickup <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TakingOrder