import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { MapPin, CheckCircle2, ArrowRight, X } from "lucide-react"; 
import homepic1 from "../images/homepic1.webp";
import homepic2 from "../images/homepic2.webp";
import homepic3 from "../images/homepic3.webp";
import Work from "./Work";
import Services from "./Services";
import Takingorder from "./TakingOrder";
import Footer from "./Footer";

const Home = () => {
  const [currentImage, setCurrentImage] = useState(0);
  const [initialAddress, setInitialAddress] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const images = [homepic1, homepic2, homepic3];
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const interval = setInterval(
      () => setCurrentImage((prev) => (prev + 1) % images.length),
      4000
    );
    return () => clearInterval(interval);
  }, [images.length]);

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

  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    setIsLoading(true);
    setShowDropdown(false);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`,
            {
              headers: {
                "User-Agent": "WashlaneLaundryApp/1.0",
              },
            }
          );

          if (!response.ok) throw new Error("Failed to fetch address");

          const data = await response.json();
          setInitialAddress(data.display_name || "");
        } catch (error) {
          console.error("Error fetching address:", error);
          alert("Could not get exact address. Please type manually.");
        } finally {
          setIsLoading(false);
        }
      },
      (error) => {
        setIsLoading(false);
        alert("Location Access Error: " + error.message);
      },
      { 
        enableHighAccuracy: true, 
        timeout: 15000,         
        maximumAge: 0             
      }
    );
  };

  const features = ["Same-day pickup", "Affordable pricing", "100% hygienic"];

  return (
    <>
      <section className="bg-[#F3F4F4] pt-30 pb-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-extrabold text-[#061E29] mb-4">
                Fresh Laundry, <br />
                <span className="text-[#1D546D]">Delivered</span> to Your Doorstep
              </h1>

              <p className="text-[#1D546D]/70 mb-6 max-w-md">
                Professional cleaning with free pickup & delivery.
              </p>

              <div className="bg-white p-2 rounded-xl shadow flex flex-col sm:flex-row gap-2 max-w-lg mb-5">
                <div className="relative w-full">
                  <div className="flex items-center gap-2 px-3 w-full border border-gray-100 rounded-xl py-2 bg-transparent">
                    <MapPin className="w-4 h-4 text-[#5F9598]" />
                    <input
                      type="text"
                      placeholder={isLoading ? "Locating..." : "Enter your pickup area"}
                      value={initialAddress}
                      onFocus={() => !initialAddress && setShowDropdown(true)}
                      onChange={(e) => {
                        setInitialAddress(e.target.value);
                        setShowDropdown(false); 
                      }}
                      className="w-full outline-none bg-transparent text-sm"
                    />

                    {initialAddress && (
                      <button onClick={() => setInitialAddress("")} className="p-1">
                        <X size={14} className="text-gray-400 hover:text-red-500" />
                      </button>
                    )}
                  </div>

                  {showDropdown && !isLoading && (
                    <div className="absolute top-full left-0 w-full bg-white border mt-1 rounded-xl shadow-lg z-50 overflow-hidden">
                      <button
                        type="button"
                        onClick={handleGetCurrentLocation}
                        className="w-full text-left px-4 py-4 text-sm hover:bg-[#F3F4F4] flex items-center gap-3 text-[#1D546D] font-semibold"
                      >
                        <MapPin size={18} className="text-[#5F9598]" /> 
                        Use current location
                      </button>
                    </div>
                  )}
                </div>

                <button
                  onClick={() =>
                    initialAddress.trim()
                      ? navigate("/schedualpickup", {
                          state: { address: initialAddress },
                        })
                      : alert("Please enter your pickup address!")
                  }
                  disabled={isLoading}
                  className="bg-[#1D546D] hover:bg-[#061E29] text-white px-4 py-2 rounded-xl flex items-center justify-center gap-2 text-sm cursor-pointer min-w-30 disabled:bg-gray-400 transition-colors"
                >
                  {isLoading ? "Wait..." : "Book Pickup"} <ArrowRight size={14} />
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

export default Home;