import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { MapPin, CheckCircle2, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import homepic1 from "../images/homepic1.webp";
import homepic2 from "../images/homepic2.webp";
import homepic3 from "../images/homepic3.webp";
import Work from "./Work";
import Services from "./Services";
import Takingorder from "./TakingOrder";
import Footer from "./Footer";

const home = () => {
  const [currentImage, setCurrentImage] = useState(0);
  const [initialAddress, setInitialAddress] = useState("");
  const images = [homepic1, homepic2, homepic3];
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const interval = setInterval(
      () => setCurrentImage((prev) => (prev + 1) % images.length),
      4000
    );
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const scrollTo = params.get("scroll");

    if (scrollTo === "services") {
      const el = document.getElementById("services");
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: "smooth" });
        }, 100);
      }
    }
  }, [location]);

  const features = ["Same-day pickup", "Affordable pricing", "100% hygienic"];
  return (
    <>
      <section className="bg-[#F3F4F4] pt-30 pb-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-extrabold text-[#061E29] mb-4">
                Fresh Laundry, <br />
                <span className="text-[#1D546D]">Delivered</span> to Your
                Doorstep
              </h1>

              <p className="text-[#1D546D]/70 mb-6 max-w-md">
                Professional cleaning with free pickup & delivery.
              </p>

              <div className="bg-white p-2 rounded-xl shadow flex flex-col sm:flex-row gap-2 max-w-lg mb-5">
                <div className="flex items-center gap-2 px-3 w-full">
                  <MapPin className="w-4 h-4 text-[#5F9598]" />
                  <input
                    type="text"
                    placeholder="Enter your pickup area"
                    value={initialAddress}
                    onChange={(e) => setInitialAddress(e.target.value)}
                    className="w-full outline-none bg-transparent text-sm"
                  />
                </div>

                <button
                  onClick={() =>
                    initialAddress.trim()
                      ? navigate("/schedualpickup", {
                          state: { address: initialAddress },
                        })
                      : alert("Please enter your pickup address!")
                  }
                  className="bg-[#1D546D] hover:bg-[#061E29] text-white px-4 py-2 rounded-xl flex items-center justify-center gap-2 text-sm cursor-pointer"
                >
                  Book Pickup <ArrowRight size={14} />
                </button>
              </div>

              <div className="flex gap-4 flex-wrap">
                {features.map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-[#5F9598]" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-md aspect-4/3 bg-white rounded-3xl overflow-hidden shadow">
              {images.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  alt="Laundry"
                  className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
                    i === currentImage ? "opacity-100" : "opacity-0"
                  }`}
                />
              ))}
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

export default home;
