import { Link } from "react-router-dom";
import {
  ShoppingBag,
  Calendar,
  Mail,
  Facebook,
  Instagram,
  Twitter,
  User as UserIcon,
} from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="p-2 bg-[#0a0a38] rounded-lg">
                <ShoppingBag className="text-white" size={24} />
              </div>
              <span className="text-2xl font-bold text-white">StuduMart</span>
            </div>
            <p className="text-sm text-slate-400 max-w-md leading-relaxed">
              Your premier campus marketplace and event hub. Connect with
              students, find great deals, and stay updated with the latest
              campus activities. Safe, secure, and student-focused.
            </p>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4 tracking-wide uppercase text-sm">
              Quick Links
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/marketplace"
                  className="text-sm hover:text-white transition-colors flex items-center gap-2"
                >
                  <ShoppingBag size={16} />
                  Marketplace
                </Link>
              </li>
              <li>
                <Link
                  to="/events"
                  className="text-sm hover:text-white transition-colors flex items-center gap-2"
                >
                  <Calendar size={16} />
                  Events
                </Link>
              </li>
              <li>
                <Link
                  to="/login"
                  className="text-sm hover:text-white transition-colors flex items-center gap-2"
                >
                  <UserIcon />
                  Login
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4 tracking-wide uppercase text-sm">
              Connect
            </h3>
            <div className="flex space-x-4">
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-[#0a0a38] hover:text-white transition-all duration-300"
                aria-label="Facebook"
              >
                <Facebook size={20} />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-[#0a0a38] hover:text-white transition-all duration-300"
                aria-label="Instagram"
              >
                <Instagram size={20} />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-[#0a0a38] hover:text-white transition-all duration-300"
                aria-label="Twitter"
              >
                <Twitter size={20} />
              </a>
            </div>
            <div className="mt-6">
              <a
                href="mailto:support@studumart.com"
                className="flex items-center gap-2 text-sm hover:text-white transition-colors"
              >
                <Mail size={16} />
                support@studumart.com
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-slate-500">
            &copy; {new Date().getFullYear()} StuduMart. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-slate-500">
            <Link to="/privacy" className="hover:text-slate-300">
              Privacy Policy
            </Link>
            <Link to="/terms" className="hover:text-slate-300">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
