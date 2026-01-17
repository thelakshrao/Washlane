import React from "react";
import { Link } from "react-router-dom";
import { CheckCircle2, Truck, Clock, ArrowRight, Sparkles } from "lucide-react";
import aboutImage from "../images/service4.webp";
import deliveryImage from "../images/delivery.webp";
import Footer from "./Footer";

const About = () => {
  return (
    <>
      <section className="bg-white text-[#061E29] py-16 md:py-24 px-4 md:px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center mb-20 md:mb-32">
            <div className="order-2 lg:order-1">
              <span className="text-[#5F9598] font-bold tracking-widest uppercase text-xs md:text-sm mb-3 block">
                About Washlane
              </span>

              <h2 className="text-3xl md:text-5xl lg:text-6xl font-black leading-[1.15] mb-6 md:mb-8 tracking-tight">
                Redefining Laundry <br />
                <span className="text-[#1D546D]">with Premium Care</span>
              </h2>

              <p className="text-sm md:text-lg text-slate-600 mb-8 md:mb-10 leading-relaxed max-w-lg font-medium">
                WashLane was founded to transform the chore of laundry into a
                seamless, luxurious experience. We combine cutting-edge
                technology with meticulous human care to deliver unparalleled
                garment treatment.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-4 mb-8 md:mb-12">
                {[
                  "Eco-friendly process",
                  "Advanced cleaning",
                  "Personalized care",
                  "Doorstep service",
                ].map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 text-[#061E29] font-bold text-xs md:text-sm"
                  >
                    <div className="bg-[#5F9598]/10 p-1 rounded-full">
                      <CheckCircle2 className="w-3 h-3 md:w-4 md:h-4 text-[#5F9598]" />
                    </div>
                    {item}
                  </div>
                ))}
              </div>

              <Link to="/schedualpickup">
                <button className="bg-[#061E29] hover:bg-[#1D546D] text-white px-6 md:px-10 py-3 md:py-4 rounded-xl md:rounded-2xl font-bold transition-all shadow-xl shadow-gray-200 flex items-center gap-2 md:gap-3 group text-sm md:text-base cursor-pointer">
                  Schedule free Pickup
                  <ArrowRight
                    size={18}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </button>
              </Link>
            </div>

            <div className="relative order-1 lg:order-2 flex justify-center">
              <div className="absolute -right-6 -top-6 w-52 h-52 md:w-72 md:h-72 bg-[#5F9598]/10 rounded-full blur-3xl" />
              <div className="relative z-10 rounded-2xl md:rounded-[3rem] overflow-hidden border-8 md:border-8 border-[#F3F4F4] shadow-2xl rotate-1 hover:rotate-0 transition-all duration-700 w-[80%] md:w-[70%] lg:w-[60%]">
                <img
                  src={aboutImage}
                  alt="Washlane Service"
                  className="w-full aspect-4/5 object-cover scale-105 hover:scale-100 transition-transform duration-700"
                />
              </div>
            </div>
          </div>

          <div className="text-center mb-12 md:mb-20">
            <div className="inline-flex items-center gap-2 bg-[#1D546D]/5 text-[#1D546D] px-3 py-1.5 rounded-full mb-3">
              <Sparkles size={14} />
              <span className="text-[10px] md:text-xs font-black uppercase tracking-widest">
                Delivery Experience
              </span>
            </div>

            <h2 className="text-3xl md:text-5xl font-black text-[#061E29]">
              Fast & Flexible Delivery
            </h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12 items-center">
            <div className="relative flex justify-center">
              <div className="absolute -left-6 -bottom-6 w-52 h-52 md:w-72 md:h-72 bg-[#1D546D]/10 rounded-full blur-3xl" />
              <img
                src={deliveryImage}
                alt="Washlane Delivery"
                className="relative z-10 w-[85%] md:w-[75%] lg:w-[65%] rounded-2xl md:rounded-[3rem] shadow-2xl border-4 md:border-8 border-white -rotate-1 hover:rotate-0 transition-all duration-700"
              />
            </div>

            <div className="space-y-6">
              <div className="bg-white p-5 md:p-8 rounded-2xl md:rounded-[2.5rem] border border-gray-100 shadow-[0_10px_40px_rgba(0,0,0,0.04)] hover:shadow-xl transition-all duration-500 group">
                <div className="flex items-center gap-4 mb-4 md:mb-6">
                  <div className="w-12 h-12 md:w-16 md:h-16 bg-[#F3F4F4] rounded-xl md:rounded-2xl flex items-center justify-center text-[#1D546D] group-hover:bg-[#1D546D] group-hover:text-white transition-all">
                    <Truck size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg md:text-2xl font-black text-[#061E29]">
                      Standard Delivery
                    </h3>
                    <p className="text-[#5F9598] font-bold text-[10px] md:text-xs uppercase tracking-widest mt-1">
                      Free for orders over ₹499
                    </p>
                  </div>
                </div>

                <p className="text-xs md:text-base text-slate-600 font-medium leading-relaxed mb-4 md:mb-6">
                  We pick up, clean, and deliver your clothes within 1 day.
                </p>

                <div className="flex items-center gap-2 text-[#061E29] font-black text-xs md:text-sm">
                  <Clock size={14} />
                  24 Hours Turnaround
                </div>
              </div>

              <div className="bg-[#061E29] p-5 md:p-8 rounded-2xl md:rounded-[2.5rem] shadow-2xl shadow-blue-900/20">
                <div className="flex items-center gap-4 mb-4 md:mb-6">
                  <div className="w-12 h-12 md:w-16 md:h-16 bg-white/10 rounded-xl md:rounded-2xl flex items-center justify-center text-[#5F9598]">
                    <Sparkles size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg md:text-2xl font-black text-white">
                      Express Delivery
                    </h3>
                    <p className="text-[#5F9598] font-bold text-[10px] md:text-xs uppercase tracking-widest mt-1">
                      Priority Service
                    </p>
                  </div>
                </div>

                <p className="text-xs md:text-base text-white/70 font-medium leading-relaxed mb-4 md:mb-6">
                  Get your laundry delivered within 2 hours.
                </p>

                <div className="flex items-center gap-2 text-[#5F9598] font-black text-xs md:text-sm">
                  <Clock size={14} />
                  present Day Delivery
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default About;
