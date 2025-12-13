import { Link } from "react-router-dom";
import { formatPrice, formatTimeAgo } from "../utils/format";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getProducts } from "../features/products/productSlice";
import { ArrowRight, ShoppingBag, Calendar, Shield, Users, MessageCircle, BookOpen, Laptop, Armchair, Ticket, Clock } from "lucide-react";

const Landing = () => {
  const { allProducts, productsLoading } = useSelector(
    (state) => state.products
  );
  const dispatch = useDispatch();

  const featuredProducts = allProducts.slice(0, 4);

  useEffect(() => {
    dispatch(getProducts());
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section className="relative bg-[#0a0a38] overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')] bg-cover bg-center opacity-10 mix-blend-overlay"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a38]/90 to-[#050520]/90"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight">
              Buy, Sell & Connect—Exclusively for Students
            </h1>
            <p className="text-xl text-blue-100 mb-10 font-light leading-relaxed">
              Verified student-only community • Meet on campus safely • Discover events happening now
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                to="/marketplace"
                className="px-8 py-4 bg-white text-[#0a0a38] rounded-lg font-semibold text-lg hover:bg-blue-50 transition-all duration-200 shadow-lg flex items-center gap-2"
              >
                <ShoppingBag size={20} />
                Explore Marketplace
              </Link>
              <Link
                to="/events"
                className="px-8 py-4 bg-[#1e1e50] border border-[#0a0a38] text-white rounded-lg font-semibold text-lg hover:bg-[#2a2a60] transition-all duration-200 flex items-center gap-2"
              >
                <Calendar size={20} />
                Find Events
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
          >
            <path
              d="M0 48H1440V0C1440 0 1140 48 720 48C300 48 0 0 0 0V48Z"
              fill="#F8FAFC"
            />
          </svg>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100 text-center hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-blue-50 text-[#0a0a38] rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">
                Verified Students Only
              </h3>
              <p className="text-slate-600">
                Only students with verified .edu emails can join. No scammers. No strangers. Just your campus community.
              </p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100 text-center hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-blue-50 text-[#0a0a38] rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">
                Easy & Safe Transactions
              </h3>
              <p className="text-slate-600">
                List in 30 seconds. Message sellers instantly. Meet on campus safely with in-app chat and seller ratings.
              </p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100 text-center hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-blue-50 text-[#0a0a38] rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">
                Never Miss Campus Events
              </h3>
              <p className="text-slate-600">
                Hackathons, club meetings, parties, and study groups—all in one place. RSVP and sync with your calendar.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Categories */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-8">Popular Categories</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link to="/marketplace?category=textbooks" className="p-6 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors flex flex-col items-center text-center group">
              <BookOpen size={32} className="text-[#0a0a38] mb-3 group-hover:scale-110 transition-transform" />
              <span className="font-medium text-slate-900">Textbooks</span>
            </Link>
            <Link to="/marketplace?category=electronics" className="p-6 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors flex flex-col items-center text-center group">
              <Laptop size={32} className="text-[#0a0a38] mb-3 group-hover:scale-110 transition-transform" />
              <span className="font-medium text-slate-900">Electronics</span>
            </Link>
            <Link to="/marketplace?category=furniture" className="p-6 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors flex flex-col items-center text-center group">
              <Armchair size={32} className="text-[#0a0a38] mb-3 group-hover:scale-110 transition-transform" />
              <span className="font-medium text-slate-900">Furniture</span>
            </Link>
            <Link to="/marketplace?category=tickets" className="p-6 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors flex flex-col items-center text-center group">
              <Ticket size={32} className="text-[#0a0a38] mb-3 group-hover:scale-110 transition-transform" />
              <span className="font-medium text-slate-900">Tickets</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Listings */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-slate-900">Featured Listings</h2>
            <Link to="/marketplace" className="text-[#0a0a38] font-medium hover:underline flex items-center gap-1">
              View All <ArrowRight size={16} />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {productsLoading ? (
              [...Array(4)].map((_, i) => (
                <div key={i} className="bg-white rounded-xl h-80 animate-pulse"></div>
              ))
            ) : (
              featuredProducts.map((product) => (
                <Link key={product._id} to={`/marketplace/${product._id}`} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-all group">
                  <div className="relative h-48 bg-slate-100 overflow-hidden">
                    <img 
                      src={product.images?.[0]?.url || product.itemImage || "https://via.placeholder.com/300"} 
                      alt={product.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2 right-2 bg-white/90 backdrop-blur px-2 py-1 rounded-md text-xs font-bold text-[#0a0a38]">
                      {formatPrice(product.price)}
                    </div>
                    {product.condition && (
                      <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur px-2 py-1 rounded-md text-xs font-medium text-white capitalize">
                        {product.condition.replace('-', ' ')}
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                        {product.category || "General"}
                      </span>
                      <span className="text-xs text-slate-400 flex items-center gap-1">
                        <Clock size={12} />
                        {formatTimeAgo(product.createdAt)}
                      </span>
                    </div>
                    <h3 className="font-bold text-slate-900 mb-1 truncate">{product.title}</h3>
                    <p className="text-sm text-slate-500 truncate">{product.location?.campus || "Main Campus"}</p>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;
