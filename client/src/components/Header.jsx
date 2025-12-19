import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../features/auth/authSlice";
import {
  Home,
  ShoppingBag,
  Calendar,
  Menu,
  X,
  LogOut,
  User,
  LayoutDashboard,
} from "lucide-react";
import { Button } from "./ui/button";
import { cn } from "../lib/utils";

const Header = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/login");
  };

  const getNavLinks = () => {
    const links = [{ path: "/", label: "Home", icon: <Home size={20} /> }];

    if (user?.role === "student") {
      links.push(
        {
          path: "/marketplace",
          label: "Marketplace",
          icon: <ShoppingBag size={20} />,
        },
        { path: "/events", label: "Events", icon: <Calendar size={20} /> }
      );
    } else if (user?.role === "admin") {
      let label = "Dashboard";
      const orgType = user?.organizationType?.toLowerCase();

      if (orgType === "branch") {
        label = "Department Admin";
      } else if (orgType === "club") {
        label = "Club Admin";
      } else {
        label = "Admin Dashboard";
      }
      links.push({
        path: "/auth/admin",
        label: label,
        icon: <LayoutDashboard size={20} />,
      });
    } else if (user?.role === "superadmin") {
      links.push({
        path: "/auth/superadmin",
        label: "Admin Panel",
        icon: <LayoutDashboard size={20} />,
      });
    } else {
      links.push(
        {
          path: "/marketplace",
          label: "Marketplace",
          icon: <ShoppingBag size={20} />,
        },
        { path: "/events", label: "Events", icon: <Calendar size={20} /> }
      );
    }
    return links;
  };

  const navLinks = getNavLinks();
  const isActive = (path) => location.pathname === path;

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-white shadow-md border-b border-slate-100"
          : "bg-[#0a0a38] shadow-lg"
      )}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo Section */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div
              className={cn(
                "p-2 rounded-lg transition-colors",
                scrolled ? "bg-[#0a0a38] text-white" : "bg-white text-[#0a0a38]"
              )}
            >
              <ShoppingBag size={24} strokeWidth={2.5} />
            </div>
            <span
              className={cn(
                "text-xl font-bold tracking-tight",
                scrolled ? "text-slate-900" : "text-white"
              )}
            >
              StuduMart
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  "flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200",
                  isActive(link.path)
                    ? scrolled
                      ? "bg-slate-100 text-[#0a0a38]"
                      : "bg-white/10 text-white"
                    : scrolled
                    ? "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    : "text-slate-200 hover:bg-white/10 hover:text-white"
                )}
              >
                {link.icon}
                <span>{link.label}</span>
              </Link>
            ))}
          </div>

          {/* User Menu / Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                <Link
                  to="/auth/myprofile"
                  className={cn(
                    "flex items-center space-x-2 text-sm font-medium",
                    scrolled
                      ? "text-slate-700 hover:text-slate-900"
                      : "text-white hover:text-slate-200"
                  )}
                >
                  <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-[#0a0a38]">
                    <User size={16} />
                  </div>
                  <span>{user.name}</span>
                </Link>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleLogout}
                  className={cn(
                    "rounded-full",
                    scrolled
                      ? "text-slate-400 hover:text-red-600 hover:bg-red-50"
                      : "text-slate-200 hover:text-white hover:bg-white/10"
                  )}
                  title="Logout"
                >
                  <LogOut size={20} />
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link to="/login">
                  <Button
                    variant="ghost"
                    className={cn(
                      scrolled
                        ? "text-slate-600 hover:text-slate-900"
                        : "text-white hover:text-slate-200 hover:bg-white/10"
                    )}
                  >
                    Login
                  </Button>
                </Link>
                <Link to="/register">
                  <Button
                    className={cn(
                      scrolled
                        ? "bg-[#0a0a38] text-white hover:bg-slate-900"
                        : "bg-white text-[#0a0a38] hover:bg-slate-100"
                    )}
                  >
                    Register
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`p-2 rounded-md ${
                scrolled ? "text-slate-600" : "text-white"
              }`}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-slate-100 shadow-lg">
          <div className="px-4 pt-2 pb-4 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center space-x-3 px-3 py-3 rounded-md text-base font-medium ${
                  isActive(link.path)
                    ? "bg-slate-100 text-[#0a0a38]"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                {link.icon}
                <span>{link.label}</span>
              </Link>
            ))}
            <div className="border-t border-slate-100 my-2 pt-2">
              {user ? (
                <>
                  <Link
                    to="/auth/myprofile"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center space-x-3 px-3 py-3 rounded-md text-base font-medium text-slate-600 hover:bg-slate-50"
                  >
                    <User size={20} />
                    <span>My Profile</span>
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center space-x-3 px-3 py-3 rounded-md text-base font-medium text-red-600 hover:bg-red-50"
                  >
                    <LogOut size={20} />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <div className="grid grid-cols-2 gap-4 px-3 pt-2">
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex justify-center px-4 py-2 border border-slate-300 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-50"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex justify-center px-4 py-2 bg-[#0a0a38] border border-transparent rounded-md text-sm font-medium text-white hover:bg-slate-800"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
