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
  const [initialAddress, setInitialAddress] = useState("");
  const [loadingLocation, setLoadingLocation] = useState(false);

  const images = [homepic1, homepic2, homepic3];
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    setLoadingLocation(true);
    setInitialAddress("Detecting your location...");

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );

          const data = await response.json();

          setInitialAddress(
            data.display_name ||
              `Lat ${latitude.toFixed(4)}, Lng ${longitude.toFixed(4)}`
          );
        } catch (error) {
          setInitialAddress(
            `Lat ${latitude.toFixed(4)}, Lng ${longitude.toFixed(4)}`
          );
        } finally {
          setLoadingLocation(false);
        }
      },
      (error) => {
        setLoadingLocation(false);
        setInitialAddress("");
        alert("Please allow location access to continue");
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  return (
    <>
      <section className="relative bg-gradient-to-b from-[#F3F4F4] via-[#F3F4F4] to-white pt-16 pb-12 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

            {/* LEFT */}
            <div>
              <div className="flex items-center gap-2 bg-[#1D546D]/10 text-[#1D546D] px-3 py-1 rounded-full w-fit mb-3 text-xs font-bold">
                <Sparkles size={14} />
                Premium Care for Your Clothes
              </div>

              <h1 className="text-4xl md:text-5xl font-extrabold text-[#061E29] mb-4">
                Fresh Laundry, <br />
                <span className="text-[#1D546D]">Delivered</span> to Your Doorstep
              </h1>

              <p className="text-[#1D546D]/70 mb-6 max-w-md">
                Professional cleaning with free pickup & delivery, starting in
                your area.
              </p>

              {/* LOCATION BOX */}
              <div className="bg-white p-2 rounded-xl shadow-lg flex flex-col sm:flex-row gap-2 max-w-lg border mb-5">
                <div className="flex items-center gap-2 px-3 flex-grow">
                  <MapPin className="text-[#5F9598] w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Enter your pickup area"
                    value={initialAddress}
                    onChange={(e) => setInitialAddress(e.target.value)}
                    className="w-full outline-none text-sm bg-transparent"
                  />
                </div>

                <button
                  onClick={getCurrentLocation}
                  disabled={loadingLocation}
                  className="text-xs font-bold px-3 py-2 rounded-lg border text-gray-600 hover:bg-gray-100"
                >
                  {loadingLocation ? "Locating..." : "Use Current Location"}
                </button>

                <button
                  onClick={() => {
                    if (!initialAddress.trim()) {
                      alert("Please enter your pickup address");
                      return;
                    }
                    navigate("/schedualpickup", {
                      state: { address: initialAddress },
                    });
                  }}
                  className="bg-[#1D546D] hover:bg-[#061E29] text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2 text-sm"
                >
                  Book Pickup
                  <ArrowRight size={14} />
                </button>
              </div>

              {/* FEATURES */}
              <div className="flex gap-4 flex-wrap">
                {["Same-day pickup", "Affordable pricing", "100% hygienic"].map(
                  (item, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-[#5F9598]" />
                      <span className="font-semibold text-[#061E29]/80">
                        {item}
                      </span>
                    </div>
                  )
                )}
              </div>
            </div>

            {/* RIGHT IMAGE */}
            <div className="relative">
              <div className="relative w-full max-w-md mx-auto aspect-[4/3] rounded-3xl overflow-hidden shadow-xl">
                {images.map((img, index) => (
                  <img
                    key={index}
                    src={img}
                    alt=""
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
