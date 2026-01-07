import React, { useEffect, useState } from "react";
import { MapPin, CheckCircle2, Sparkles, ArrowRight } from "lucide-react";
import homepic1 from "../images/homepic1.webp";
import homepic2 from "../images/homepic2.webp";
import homepic3 from "../images/homepic3.webp";
import Work from "./Work";
import Services from "./Services";
import Takingorder from "./TakingOrder";
import Footer from "./Footer";

const Home = () => {
  const [currentImage, setCurrentImage] = useState(0);
  const images = [homepic1, homepic2, homepic3];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [images.length]);

  const features = ["Same-day pickup", "Affordable pricing", "100% hygienic"];

  return (
    <>
      <section className="relative bg-gradient-to-b from-[#F3F4F4] via-[#F3F4F4] to-white pt-20 pb-16 overflow-hidden">
        <div className="absolute top-[-10%] right-[-5%] w-72 h-72 md:w-96 md:h-96 bg-[#5F9598]/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 left-[-5%] w-56 h-56 md:w-72 md:h-72 bg-[#1D546D]/5 rounded-full blur-[80px]" />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <div className="flex flex-col">
              <div className="flex items-center gap-2 bg-[#1D546D]/10 text-[#1D546D] px-3 py-1.5 rounded-full w-fit mb-4 border border-[#1D546D]/20 animate-fade-in text-xs md:text-sm font-bold uppercase tracking-wider">
                <Sparkles size={16} />
                Premium Care for Your Clothes
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#061E29] leading-tight mb-4 tracking-tight">
                Fresh Laundry, <br />
                <span className="text-[#1D546D]">Delivered</span> to Your <br />
                Doorstep
              </h1>

              <p className="text-[#1D546D]/70 text-sm sm:text-base md:text-lg mb-6 max-w-md leading-relaxed">
                Experience the ultimate convenience. Professional cleaning with
                free pickup and delivery, starting at your area.
              </p>
              <div className="bg-white p-2 rounded-2xl shadow-[0_20px_50px_rgba(6,30,41,0.08)] flex flex-col sm:flex-row items-center gap-2 max-w-lg border border-[#F3F4F4] mb-6 transition-transform hover:scale-[1.02]">
                <div className="flex items-center gap-3 px-3 flex-grow w-full py-2">
                  <MapPin className="text-[#5F9598] w-4 h-4 sm:w-5 sm:h-5" />
                  <input
                    type="text"
                    placeholder="Enter your pickup area"
                    className="outline-none text-[#061E29] w-full bg-transparent font-medium placeholder:text-gray-400 text-sm sm:text-base"
                  />
                </div>
                <button className="bg-[#1D546D] hover:bg-[#061E29] text-white px-6 py-3 sm:px-8 sm:py-4 rounded-xl font-bold transition-all w-full sm:w-auto flex items-center justify-center gap-2 group text-sm sm:text-base">
                  Book Pickup
                  <ArrowRight
                    size={16}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </button>
              </div>

              <div className="flex flex-wrap gap-4 sm:gap-6">
                {features.map((feature, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 text-[#5F9598] font-semibold text-xs sm:text-sm"
                  >
                    <div className="bg-[#5F9598]/10 p-1 rounded-full">
                      <CheckCircle2 className="w-3 h-3 sm:w-4 sm:h-4" />
                    </div>
                    <span className="text-[#061E29]/80">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative animate-float mt-10 lg:mt-0">
              <div className="absolute -right-6 -bottom-6 w-48 h-48 md:w-64 md:h-64 bg-[#5F9598]/20 rounded-full blur-3xl -z-10 animate-pulse"></div>

              <div className="relative w-full aspect-[4/3] lg:aspect-square bg-white rounded-3xl md:rounded-[48px] overflow-hidden shadow-[0_32px_64px_rgba(6,30,41,0.15)] border-[8px] md:border-[12px] border-white">
                {images.map((img, index) => (
                  <img
                    key={index}
                    src={img}
                    alt="Laundry Service"
                    className={`absolute inset-0 w-full h-full object-cover transition-all duration-1000 ease-in-out
                      ${
                        index === currentImage
                          ? "opacity-100 scale-100"
                          : "opacity-0 scale-110"
                      }`}
                  />
                ))}
              </div>

              <div className="absolute -left-4 bottom-8 md:bottom-12 bg-white/90 backdrop-blur-md p-3 rounded-2xl shadow-xl border border-white flex items-center gap-2 md:gap-3 animate-bounce-slow text-xs sm:text-sm">
                <div className="bg-[#5F9598] p-1.5 md:p-2 rounded-lg text-white">
                  <CheckCircle2 size={16} />
                </div>
                <div>
                  <p className="text-[#061E29] font-bold">Growing with Care</p>
                  <p className="text-[#1D546D]">
                    Every cloth, handled with love
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Work />
      <Services />
      <Takingorder />
      <Footer />
    </>
  );
};

export default Home;
