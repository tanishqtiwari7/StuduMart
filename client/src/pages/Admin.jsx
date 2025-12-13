import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SidebarAdmin from "../components/SidebarAdmin";
import StatsCard from "../components/StatsCard";
import { formatPrice, formatDate } from "../utils/format";
import { useDispatch, useSelector } from "react-redux";
import {
  editEvent,
  resetEdit,
  getAllEvents,
  getAllListings,
  getAllUsers,
  updateListing,
  updateUser,
} from "../features/admin/adminSlice";
import { toast } from "react-toastify";
import Loader from "../components/Loader";
import AddEvent from "../components/AddEvent";
import { ShoppingBag, Calendar, Users, Check, X, Trash2 } from "lucide-react";

const Admin = () => {
  const { user } = useSelector((state) => state.auth);
  const {
    allUsers,
    allEvents,
    allListings,
    adminLoading,
    adminError,
    adminErrorMessage,
  } = useSelector((state) => state.admin);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [activeTab, setActiveTab] = useState("dashboard");

  // Edit Event
  const handleEditEvent = (event) => {
    dispatch(editEvent(event));
    setActiveTab("add");
  };

  // Handle tab change
  const handleTabChange = (tab) => {
    if (tab === "add" && activeTab !== "events") {
      dispatch(resetEdit());
    }
    setActiveTab(tab);
  };

  // Check admin access
  useEffect(() => {
    if (!user) {
      toast.error("Please login first", { position: "top-center" });
      navigate("/login");
      return;
    }

    if (!user.isAdmin) {
      toast.error("Access denied. Admin privileges required.", {
        position: "top-center",
      });
      navigate("/my-profile");
      return;
    }
  }, [user, navigate]);

  // Fetch admin data
  useEffect(() => {
    if (user?.isAdmin) {
      dispatch(getAllUsers());
      dispatch(getAllEvents());
      dispatch(getAllListings());
    }
  }, [user, dispatch]);

  useEffect(() => {
    if (adminError && adminErrorMessage) {
      toast.error(adminErrorMessage, { position: "top-center" });
    }
  }, [adminError, adminErrorMessage]);

  if (adminLoading) {
    return <Loader />;
  }

  const DashboardView = () => (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 mb-2">
          Dashboard Overview
        </h1>
        <p className="text-slate-600">
          Welcome back, Admin! Here's what's happening today.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatsCard
          title="Total Products"
          value={allListings.length}
          gradient="from-[#0a0a38] to-blue-900"
          icon={<ShoppingBag className="w-6 h-6 text-white" />}
        />
        <StatsCard
          title="Total Events"
          value={allEvents.length}
          gradient="from-slate-700 to-slate-800"
          icon={<Calendar className="w-6 h-6 text-white" />}
        />
        <StatsCard
          title="Total Users"
          value={allUsers.length}
          gradient="from-blue-900 to-slate-900"
          icon={<Users className="w-6 h-6 text-white" />}
        />
      </div>
    </div>
  );

  const ProductsView = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-900">Manage Products</h2>
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Seller
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {allListings.map((product) => (
                <tr key={product._id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0">
                        <img
                          className="h-10 w-10 rounded-lg object-cover"
                          src={product.itemImage}
                          alt=""
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-slate-900">
                          {product.title}
                        </div>
                        <div className="text-sm text-slate-500">
                          {product.category}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                    {product.user?.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                    {formatPrice(product.price)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        product.isAvailable
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {product.isAvailable ? "Available" : "Sold"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => dispatch(updateListing(product._id))}
                      className="text-red-600 hover:text-red-900 flex items-center gap-1"
                    >
                      <Trash2 size={16} /> Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const EventsView = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-900">Manage Events</h2>
        <button
          onClick={() => handleTabChange("add")}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <Calendar size={16} /> Add Event
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {allEvents.map((event) => (
          <div
            key={event._id}
            className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden"
          >
            <img
              src={event.eventImage}
              alt={event.eventName}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="font-bold text-lg mb-2">{event.eventName}</h3>
              <p className="text-slate-600 text-sm mb-4 line-clamp-2">
                {event.description}
              </p>
              <div className="flex justify-between items-center">
                <span className="font-bold text-blue-600">
                  {formatPrice(event.price)}
                </span>
                <button
                  onClick={() => handleEditEvent(event)}
                  className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                >
                  Edit Event
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const UsersView = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-900">Manage Users</h2>
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {allUsers.map((userItem) => (
                <tr key={userItem._id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                        {userItem.name.charAt(0)}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-slate-900">
                          {userItem.name}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                    {userItem.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        userItem.isAdmin
                          ? "bg-[#0a0a38] text-white"
                          : "bg-slate-100 text-slate-800"
                      }`}
                    >
                      {userItem.isAdmin ? "Admin" : "Student"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {!userItem.isAdmin && (
                      <button
                        onClick={() => dispatch(updateUser(userItem._id))}
                        className="text-red-600 hover:text-red-900 flex items-center gap-1"
                      >
                        <Trash2 size={16} /> Delete
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <SidebarAdmin activeTab={activeTab} setActiveTab={handleTabChange} />

          <main className="flex-1 min-w-0">
            {activeTab === "dashboard" && <DashboardView />}
            {activeTab === "products" && <ProductsView />}
            {activeTab === "events" && <EventsView />}
            {activeTab === "add" && <AddEvent />}
            {activeTab === "users" && <UsersView />}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Admin;
