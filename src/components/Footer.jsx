import React from "react";
import {
  FaInstagram,
  FaFacebookF,
  FaEnvelope,
  FaPhoneAlt,
  FaMapMarkerAlt,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-black text-white pt-16">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <h2 className="text-xl font-semibold">WashLane</h2>
          </div>
          <p className="text-gray-400 leading-relaxed">
            Professional laundry service with free pickup and delivery right to
            your doorstep.
          </p>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
          <ul className="space-y-3 text-gray-400">
            <li className="hover:text-white cursor-pointer">Services</li>
            <li className="hover:text-white cursor-pointer">Pricing</li>
            <li className="hover:text-white cursor-pointer">Track Order</li>
            <li className="hover:text-white cursor-pointer">
              Schedule Pickup
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
          <ul className="space-y-4 text-gray-400">
            <li className="flex items-center gap-3">
              <FaPhoneAlt />
              <span>(123) 456-7890</span>
            </li>
            <li className="flex items-center gap-3">
              <FaEnvelope />
              <span>hello@washlane.com</span>
            </li>
            <li className="flex items-start gap-3">
              <FaMapMarkerAlt className="mt-1" />
              <span>
                123 Laundry Street, Clean City, CC <br /> 12345
              </span>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
          <div className="flex gap-4">
            <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center hover:bg-white hover:text-black transition cursor-pointer">
              <FaInstagram />
            </div>
            <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center hover:bg-white hover:text-black transition cursor-pointer">
              <FaFacebookF />
            </div>
            <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center hover:bg-white hover:text-black transition cursor-pointer">
              <FaEnvelope />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-16 border-t border-white/10 py-6 text-center text-gray-400 text-sm">
        © 2024 WashLane. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
