import React from "react";
import {
  Instagram,
  Facebook,
  Mail,
  Phone,
  MapPin,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { Link } from "react-router-dom";
import { HashLink } from "react-router-hash-link";

const Footer = () => {
  const socialLinks = [
    { icon: <Instagram size={20} />, link: "#" },
    { icon: <Facebook size={20} />, link: "#" },
    { icon: <Mail size={20} />, link: "mailto:hello@washlane.com" },
  ];

  const exploreLinks = [
    { name: "Home", path: "/" },
    { name: "Service", path: "/#services", hash: true },
    { name: "About", path: "/about" },
    { name: "Schedule Pickup", path: "/schedualpickup" },
  ];

  return (
    <footer className="bg-[#061E29] text-white pt-16 overflow-hidden relative">
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#1D546D]/20 rounded-full blur-[100px] z-0" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-16">
          <div className="flex flex-col gap-4 sm:gap-6">
            <Link
              to="/"
              className="font-black text-xl sm:text-2xl flex items-center gap-2"
            >
              <div className="w-7 h-7 sm:w-8 sm:h-8 bg-[#5F9598] rounded-lg flex items-center justify-center">
                <Sparkles size={16} className="text-white" />
              </div>
              WASHLANE
            </Link>

            <p className="text-gray-400 text-xs sm:text-sm leading-relaxed max-w-xs">
              Redefining laundry with premium care and effortless convenience.
              Your clothes deserve the professional touch of WashLane.
            </p>

            <div className="flex gap-2 sm:gap-3">
              {socialLinks.map((social, i) => (
                <a
                  key={i}
                  href={social.link}
                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center hover:bg-[#5F9598] hover:border-[#5F9598] transition-all duration-300 group"
                >
                  <span className="group-hover:scale-110 transition-transform">
                    {social.icon}
                  </span>
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-white font-bold text-sm sm:text-lg mb-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-[#5F9598] rounded-full" />
              Explore
            </h3>

            <ul className="grid grid-cols-2 sm:grid-cols-1 gap-2 text-gray-400 font-medium text-xs sm:text-sm">
              {exploreLinks.map((item, i) => (
                <li key={i} className="group">
                  {item.hash ? (
                    <HashLink
                      to="/#services"
                      scroll={(el) => {
                        setTimeout(() => {
                          el.scrollIntoView({
                            behavior: "smooth",
                            block: "start",
                          });
                        }, 100);
                      }}
                      className="flex items-center gap-1 hover:text-[#5F9598] transition-colors"
                    >
                      <ArrowRight
                        size={12}
                        className="opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all"
                      />
                      <span className="group-hover:translate-x-1 transition-transform">
                        {item.name}
                      </span>
                    </HashLink>
                  ) : (
                    <Link
                      to={item.path}
                      onClick={() => {
                        if (window.location.pathname === item.path) {
                          window.scrollTo({ top: 0, behavior: "smooth" });
                        }
                      }}
                      className="flex items-center gap-1 hover:text-[#5F9598] transition-colors"
                    >
                      <ArrowRight
                        size={12}
                        className="opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all"
                      />
                      <span className="group-hover:translate-x-1 transition-transform">
                        {item.name}
                      </span>
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white font-bold text-sm sm:text-lg mb-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-[#5F9598] rounded-full" />
              Contact
            </h3>

            <ul className="space-y-3 sm:space-y-5 text-gray-400 text-xs sm:text-sm">
              <li className="flex items-center gap-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-white/5 flex items-center justify-center">
                  <Phone size={16} />
                </div>
                <span className="font-medium">(123) 456-7890</span>
              </li>

              <li className="flex items-center gap-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-white/5 flex items-center justify-center">
                  <Mail size={16} />
                </div>
                <span className="font-medium">hello@washlane.com</span>
              </li>

              <li className="flex items-start gap-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-white/5 flex items-center justify-center">
                  <MapPin size={16} />
                </div>
                <span className="font-medium leading-relaxed">
                  123 Laundry Street, <br /> Clean City, CC 12345
                </span>
              </li>
            </ul>
          </div>

          <div className="bg-white/5 rounded-2xl p-4 sm:p-6 border border-white/10">
            <h3 className="text-white font-bold text-sm sm:text-base mb-2">
              Join the Freshness
            </h3>

            <p className="text-xs sm:text-sm text-gray-400 mb-3 leading-relaxed">
              Subscribe for exclusive laundry tips and special discounts.
            </p>

            <div className="relative">
              <input
                type="email"
                placeholder="Your email"
                className="w-full bg-[#061E29] border border-white/10 rounded-xl py-2 px-3 text-xs sm:text-sm focus:outline-none focus:border-[#5F9598] transition-all"
              />
              <button className="absolute right-1 top-1/2 -translate-y-1/2 bg-[#5F9598] p-1.5 rounded-lg hover:bg-[#1D546D] transition-colors">
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>

        <div className="pt-6 pb-8 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-3 text-gray-500 text-[10px] sm:text-xs font-semibold uppercase tracking-widest">
          <p>© 2026 WASHLANE. CRAFTED FOR CLEANLINESS.</p>
          <div className="flex gap-4 sm:gap-6">
            <Link
              to="/privacy-policy"
              className="hover:text-white transition-colors"
            >
              Privacy Policy
            </Link>
            <Link to="/terms" className="hover:text-white transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
