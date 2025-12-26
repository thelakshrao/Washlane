import React, {useEffect, useState } from "react";
import { Link } from "react-router-dom";
import homepic1 from "../images/homepic1.webp";
import homepic2 from "../images/homepic2.webp";
import homepic3 from "../images/homepic3.webp";
import Work from "./Work";
import Services from "./Services";
import Takingorder from "./TakingOrder";
import Footer from "./Footer";

const Home = () => {
  const [current, setCurrent] = useState(0);
  const images = [homepic1, homepic2, homepic3];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
    <section className="bg-black text-white pt-20 pb-14 mt-10">
      <div className="max-w-7xl mx-auto w-full px-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-start">
          <div className="flex flex-col justify-center text-center md:text-left">
            <h1 className="text-3xl md:text-5xl font-bold leading-snug md:leading-tight mb-4">
              Fresh Laundry Delivered <br className="hidden md:block" /> to Your Doorstep
            </h1>
            <p className="text-gray-400 text-sm md:text-lg mb-6 max-w-xl mx-auto md:mx-0">
              Professional laundry service with free pickup and delivery. Schedule
              your wash, sit back, and relax.
            </p>
            <Link to="/schedualpickup" className="mx-auto md:mx-0 w-fit bg-white text-black px-6 py-3 rounded-full text-sm md:text-base font-semibold hover:bg-gray-200 transition cursor-pointer">
              Schedule Pickup Now →
            </Link>
          </div>

          <div className="flex justify-center items-center">
            <div className="relative w-full max-w-xs md:max-w-md h-50 md:h-80 overflow-hidden rounded-2xl md:rounded-3xl border border-white/20">
              {images.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt="Laundry Service"
                  className={`absolute inset-0 w-full h-full object-cover transition-all duration-3000 ease-out
                    ${index === current ? "opacity-100 scale-100" : "opacity-0 scale-110"}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
    <Work/>
    <Services/>
    <Takingorder/>
    <Footer/>
    </>
  );
}
export default Home;