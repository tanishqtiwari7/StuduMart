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
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";

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

  const SidebarContent = () => (
    <div className="space-y-2">
      {menuItems.map((item) => (
        <Button
          key={item.id}
          variant={activeTab === item.id ? "secondary" : "ghost"}
          className={`w-full justify-start ${
            activeTab === item.id
              ? "bg-slate-100 text-slate-900 hover:bg-slate-200"
              : "text-slate-600 hover:bg-slate-50"
          }`}
          onClick={() => {
            setActiveTab(item.id);
            setMobileMenuOpen(false);
          }}
        >
          <span className="mr-3">{item.icon}</span>
          {item.label}
        </Button>
      ))}
    </div>
  );

  return (
    <>
      <Button
        variant="outline"
        size="icon"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="lg:hidden fixed top-24 left-4 z-40 bg-white shadow-md"
        aria-label="Toggle menu"
      >
        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </Button>

      {/* Mobile Sidebar Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden backdrop-blur-sm"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <div
        className={`fixed lg:static inset-y-0 left-0 z-40 w-64 transform transition-transform duration-300 ease-in-out lg:transform-none ${
          mobileMenuOpen
            ? "translate-x-0"
            : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <Card className="h-full lg:h-full border-r lg:border border-slate-200 shadow-sm lg:shadow-none rounded-none lg:rounded-none">
          <CardContent className="p-4 pt-20 lg:pt-4">
            <div className="lg:hidden mb-6 px-2">
              <h2 className="text-xl font-bold text-[#0a0a38]">Admin Panel</h2>
            </div>
            <SidebarContent />
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default SidebarAdmin;
