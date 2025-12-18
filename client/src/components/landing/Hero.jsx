import { Link } from "react-router-dom";
import { ShoppingBag, Calendar } from "lucide-react";
import { Button } from "../ui/button";

const Hero = () => {
  return (
    <section className="relative bg-[#0a0a38] overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')] bg-cover bg-center opacity-10 mix-blend-overlay"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a38]/90 to-[#050520]/90"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight leading-tight">
            Buy, Sell & Connect <br />
            <span className="text-blue-200">Exclusively for Students</span>
          </h1>
          <p className="text-xl text-blue-100 mb-10 font-light leading-relaxed max-w-2xl mx-auto">
            Verified student-only community. Meet on campus safely. Discover
            events happening now.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/marketplace">
              <Button
                size="lg"
                className="h-14 px-8 text-lg bg-white text-[#0a0a38] hover:bg-blue-50 border-0"
              >
                <ShoppingBag className="mr-2 h-5 w-5" />
                Explore Marketplace
              </Button>
            </Link>
            <Link to="/events">
              <Button
                size="lg"
                variant="outline"
                className="h-14 px-8 text-lg bg-[#1e1e50]/50 border-blue-400/30 text-white hover:bg-[#2a2a60] hover:text-white hover:border-blue-400/50 backdrop-blur-sm"
              >
                <Calendar className="mr-2 h-5 w-5" />
                Find Events
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Curve Divider */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          viewBox="0 0 1440 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-12 text-slate-50"
          preserveAspectRatio="none"
        >
          <path
            d="M0 48H1440V0C1440 0 1140 48 720 48C300 48 0 0 0 0V48Z"
            fill="currentColor"
          />
        </svg>
      </div>
    </section>
  );
};

export default Hero;
