import React, { useEffect, useState } from "react";
import { MapPin, CheckCircle2, Sparkles, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
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
  const [initialAddress, setInitialAddress] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [images.length]);

  const features = ["Same-day pickup", "Affordable pricing", "100% hygienic"];

  return (
    <>
      <section className="relative bg-gradient-to-b from-[#F3F4F4] via-[#F3F4F4] to-white pt-16 pb-12 overflow-hidden">
        <div className="absolute top-[-10%] right-[-5%] w-64 h-64 md:w-80 md:h-80 bg-[#5F9598]/10 rounded-full blur-[90px]" />
        <div className="absolute bottom-0 left-[-5%] w-48 h-48 md:w-64 md:h-64 bg-[#1D546D]/5 rounded-full blur-[70px]" />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="flex flex-col">
              <div className="flex items-center gap-2 bg-[#1D546D]/10 text-[#1D546D] px-3 py-1 rounded-full w-fit mb-3 border border-[#1D546D]/20 text-xs font-bold uppercase tracking-wider">
                <Sparkles size={14} />
                Premium Care for Your Clothes
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#061E29] leading-tight mb-3 tracking-tight">
                Fresh Laundry, <br />
                <span className="text-[#1D546D]">Delivered</span> to Your <br />
                Doorstep
              </h1>

              <p className="text-[#1D546D]/70 text-sm sm:text-base mb-5 max-w-md leading-relaxed">
                Professional cleaning with free pickup & delivery, starting in
                your area.
              </p>

              <div className="bg-white p-2 rounded-xl shadow-[0_16px_40px_rgba(6,30,41,0.08)] flex flex-col sm:flex-row items-center gap-2 max-w-full sm:max-w-lg border border-[#F3F4F4] mb-5">
                <div className="flex items-center gap-3 px-3 flex-grow w-full py-1">
                  <MapPin className="text-[#5F9598] w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Enter your pickup area"
                    value={initialAddress}
                    onChange={(e) => setInitialAddress(e.target.value)}
                    className="outline-none text-[#061E29] w-full bg-transparent font-medium placeholder:text-gray-400 text-sm"
                  />
                </div>

                <button
                  onClick={() => {
                    if (initialAddress.trim()) {
                      navigate("/schedualpickup", {
                        state: { address: initialAddress },
                      });
                    } else {
                      alert("Please enter your pickup address!");
                    }
                  }}
                  className="bg-[#1D546D] hover:bg-[#061E29] text-white px-4 py-2 rounded-xl font-bold transition-all w-full sm:w-auto flex items-center justify-center gap-2 group text-sm cursor-pointer"
                >
                  Book Pickup
                  <ArrowRight
                    size={14}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </button>
              </div>

              <div className="flex flex-wrap gap-4">
                {features.map((feature, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs sm:text-sm">
                    <div className="bg-[#5F9598]/10 p-1 rounded-full">
                      <CheckCircle2 className="w-3 h-3 text-[#5F9598]" />
                    </div>
                    <span className="text-[#061E29]/80 font-semibold">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative mt-8 lg:mt-0">
              <div className="relative mx-auto w-full max-w-md aspect-[4/3] bg-white rounded-3xl overflow-hidden shadow-[0_24px_48px_rgba(6,30,41,0.15)] border-[6px] border-white">
                {images.map((img, index) => (
                  <img
                    key={index}
                    src={img}
                    alt="Laundry Service"
                    className={`absolute inset-0 w-full h-full object-cover transition-all duration-3000 ${
                      index === currentImage
                        ? "opacity-100 scale-100"
                        : "opacity-0 scale-110"
                    }`}
                  />
                ))}
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
