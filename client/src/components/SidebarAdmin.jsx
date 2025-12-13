import { useState } from "react";
import {
  LayoutDashboard,
  ShoppingBag,
  Calendar,
  PlusCircle,
  Users,
  Menu,
  X,
} from "lucide-react";

const SidebarAdmin = ({ activeTab, setActiveTab }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: <LayoutDashboard size={20} />,
    },
    {
      id: "products",
      label: "Manage Products",
      icon: <ShoppingBag size={20} />,
    },
    {
      id: "events",
      label: "Manage Events",
      icon: <Calendar size={20} />,
    },
    {
      id: "add",
      label: "Add Event",
      icon: <PlusCircle size={20} />,
    },
    {
      id: "users",
      label: "Users",
      icon: <Users size={20} />,
    },
  ];

  return (
    <>
      <button
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="lg:hidden fixed top-20 left-4 z-40 p-2 bg-white rounded-lg shadow-md border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
        aria-label="Toggle menu"
      >
        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-30 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      <aside
        className={`fixed lg:sticky top-16 left-0 h-[calc(100vh-4rem)] bg-white border-r border-slate-200 w-64 transition-transform duration-300 z-40 overflow-y-auto ${
          mobileMenuOpen
            ? "translate-x-0"
            : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="p-6">
          <h2 className="text-xl font-bold text-slate-900 mb-6 px-2">
            Admin Panel
          </h2>

          <nav className="space-y-1">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                  activeTab === item.id
                    ? "bg-blue-50 text-[#0a0a38]"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </aside>
    </>
  );
};

export default SidebarAdmin;
