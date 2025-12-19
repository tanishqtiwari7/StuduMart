import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { formatPrice } from "../utils/format";
import { useDispatch, useSelector } from "react-redux";
import {
  editEvent,
  resetEdit,
  getAllEvents,
  getAllListings,
  getAllUsers,
  updateListing,
  updateUser,
  inviteUser,
} from "../features/admin/adminSlice";
import { toast } from "react-toastify";
import Loader from "../components/Loader";
import AddEvent from "../components/AddEvent";
import SidebarAdmin from "../components/SidebarAdmin";
import { Input } from "../components/ui/input";
import {
  ShoppingBag,
  Calendar,
  Users,
  Trash2,
  Plus,
  ArrowLeft,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";

const Admin = () => {
  const { user } = useSelector((state) => state.auth);
  const {
    allUsers,
    allEvents,
    allListings,
    adminLoading,
    adminError,
    adminErrorMessage,
    edit,
  } = useSelector((state) => state.admin);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [activeTab, setActiveTab] = useState("dashboard");
  const [userSearch, setUserSearch] = useState("");

  const isEditMode = edit?.isEdit;

  // Edit Event
  const handleEditEvent = (event) => {
    dispatch(editEvent(event));
    setActiveTab("add"); // Switch to Add/Edit tab
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
      navigate("/auth/myprofile");
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

  const StatsCard = ({ title, value, icon, gradient }) => (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-slate-600 mb-1">{title}</p>
            <p className="text-3xl font-bold text-slate-900 mb-2">{value}</p>
          </div>
          <div className={`p-3 rounded-xl bg-gradient-to-br ${gradient}`}>
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const getDashboardTitle = () => {
    const orgType = user?.organizationType?.toLowerCase();
    if (orgType === "branch") {
      return user?.organizationId?.name
        ? `${user.organizationId.name} Dashboard`
        : "Department Dashboard";
    }
    if (orgType === "club") {
      return user?.organizationId?.name
        ? `${user.organizationId.name} Dashboard`
        : "Club Dashboard";
    }
    return "Admin Dashboard";
  };

  const getDashboardDescription = () => {
    const orgType = user?.organizationType?.toLowerCase();
    if (orgType === "branch")
      return "Manage department students and resources.";
    if (orgType === "club") return "Manage club members, events, and requests.";
    return "Manage organization activities and settings.";
  };

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <StatsCard
                title="Total Products"
                value={allListings?.length || 0}
                gradient="from-[#0a0a38] to-blue-900"
                icon={<ShoppingBag className="w-6 h-6 text-white" />}
              />
              <StatsCard
                title="Total Events"
                value={allEvents?.length || 0}
                gradient="from-slate-700 to-slate-800"
                icon={<Calendar className="w-6 h-6 text-white" />}
              />
              <StatsCard
                title="Total Users"
                value={allUsers?.length || 0}
                gradient="from-blue-900 to-slate-900"
                icon={<Users className="w-6 h-6 text-white" />}
              />
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-500">
                  Welcome to the admin dashboard. Use the sidebar to manage
                  different sections.
                </p>
              </CardContent>
            </Card>
          </div>
        );
      case "products":
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-slate-900">
                Manage Products
              </h2>
            </div>
            <Card className="border-slate-200 shadow-sm">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>Seller</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {Array.isArray(allListings) && allListings.length > 0 ? (
                      allListings.map((product) => (
                        <TableRow key={product._id}>
                          <TableCell>
                            <div className="flex items-center">
                              <div className="h-10 w-10 flex-shrink-0">
                                <img
                                  className="h-10 w-10 rounded-lg object-cover"
                                  src={
                                    product.images?.[0]?.url ||
                                    product.itemImage ||
                                    "https://via.placeholder.com/40"
                                  }
                                  alt=""
                                />
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-slate-900">
                                  {product.title}
                                </div>
                                <div className="text-sm text-slate-500">
                                  {product.category?.name || "Uncategorized"}
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-slate-500">
                            <div className="flex flex-col">
                              <span className="font-medium text-slate-900">
                                {product.user?.name}
                              </span>
                              <span className="text-xs text-slate-400">
                                {product.user?.email}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="font-medium text-slate-900">
                            {formatPrice(product.price)}
                          </TableCell>
                          <TableCell>
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                product.status === "approved"
                                  ? "bg-green-100 text-green-800"
                                  : product.status === "rejected"
                                  ? "bg-red-100 text-red-800"
                                  : "bg-yellow-100 text-yellow-800"
                              }`}
                            >
                              {product.status
                                ? product.status.charAt(0).toUpperCase() +
                                  product.status.slice(1)
                                : "Pending"}
                            </span>
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              {product.status === "pending" && (
                                <>
                                  <Button
                                    size="sm"
                                    className="bg-green-600 hover:bg-green-700 text-white h-8"
                                    onClick={() =>
                                      dispatch(
                                        updateListing({
                                          _id: product._id,
                                          status: "approved",
                                        })
                                      )
                                    }
                                  >
                                    Approve
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="destructive"
                                    className="h-8"
                                    onClick={() =>
                                      dispatch(
                                        updateListing({
                                          _id: product._id,
                                          status: "rejected",
                                        })
                                      )
                                    }
                                  >
                                    Reject
                                  </Button>
                                </>
                              )}
                              {product.status === "approved" && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="text-red-600 hover:bg-red-50 h-8"
                                  onClick={() =>
                                    dispatch(
                                      updateListing({
                                        _id: product._id,
                                        status: "rejected",
                                      })
                                    )
                                  }
                                >
                                  Revoke
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={5}
                          className="text-center py-8 text-slate-500"
                        >
                          No products found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </Card>
          </div>
        );
      case "events":
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-slate-900">
                Manage Events
              </h2>
              <Button
                onClick={() => {
                  dispatch(resetEdit());
                  setActiveTab("add");
                }}
                className="bg-[#0a0a38] hover:bg-[#1a1a4a]"
              >
                <Plus size={16} className="mr-2" /> Add Event
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.isArray(allEvents) && allEvents.length > 0 ? (
                allEvents.map((event) => (
                  <Card
                    key={event._id}
                    className="overflow-hidden border-slate-200 shadow-sm"
                  >
                    <img
                      src={event.eventImage}
                      alt={event.eventName}
                      className="w-full h-48 object-cover"
                    />
                    <CardContent className="p-4">
                      <h3 className="font-bold text-lg mb-2">
                        {event.eventName}
                      </h3>
                      <p className="text-slate-600 text-sm mb-4 line-clamp-2">
                        {event.description}
                      </p>
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-[#0a0a38]">
                          {formatPrice(event.price)}
                        </span>
                        <Button
                          variant="link"
                          onClick={() => handleEditEvent(event)}
                          className="text-[#0a0a38] hover:text-[#1a1a4a] p-0 h-auto font-medium"
                        >
                          Edit Event
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="col-span-full text-center py-12 text-slate-500">
                  <Calendar className="mx-auto h-12 w-12 opacity-20 mb-4" />
                  <p>No events found. Create your first event!</p>
                </div>
              )}
            </div>
          </div>
        );
      case "add":
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                onClick={() => {
                  setActiveTab("events");
                  dispatch(resetEdit());
                }}
              >
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Events
              </Button>
              <h2 className="text-2xl font-bold text-slate-900">
                {isEditMode ? "Edit Event" : "Add New Event"}
              </h2>
            </div>
            <AddEvent />
          </div>
        );
      case "users":
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-slate-900">
                Manage Users
              </h2>
              <Input
                placeholder="Search by email..."
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                className="max-w-xs"
              />
            </div>
            <Card className="border-slate-200 shadow-sm">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {Array.isArray(allUsers) && allUsers.length > 0 ? (
                      allUsers
                        .filter((u) =>
                          u.email
                            .toLowerCase()
                            .includes(userSearch.toLowerCase())
                        )
                        .map((userItem) => (
                          <TableRow key={userItem._id}>
                            <TableCell>
                              <div className="flex items-center">
                                <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-900 font-bold">
                                  {userItem.name.charAt(0)}
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-slate-900">
                                    {userItem.name}
                                  </div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="text-slate-500">
                              {userItem.email}
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant={
                                  userItem.isAdmin ? "default" : "secondary"
                                }
                                className={
                                  userItem.isAdmin
                                    ? "bg-[#0a0a38] text-white hover:bg-[#0a0a38]"
                                    : "bg-slate-100 text-slate-800 hover:bg-slate-100"
                                }
                              >
                                {userItem.isAdmin ? "Admin" : "Student"}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {!userItem.isAdmin && (
                                <div className="flex items-center gap-2">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() =>
                                      dispatch(updateUser(userItem._id))
                                    }
                                    className="text-red-600 hover:text-red-900 hover:bg-red-50"
                                  >
                                    <Trash2 size={16} className="mr-1" /> Delete
                                  </Button>
                                  {user?.organizationType === "Club" && (
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => {
                                        dispatch(inviteUser(userItem._id))
                                          .unwrap()
                                          .then((res) => {
                                            toast.success(res.message);
                                          })
                                          .catch((err) => {
                                            toast.error(err);
                                          });
                                      }}
                                    >
                                      Invite
                                    </Button>
                                  )}
                                </div>
                              )}
                            </TableCell>
                          </TableRow>
                        ))
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={4}
                          className="text-center py-8 text-slate-500"
                        >
                          No users found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </Card>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 pt-20">
      <div className="flex">
        <SidebarAdmin activeTab={activeTab} setActiveTab={setActiveTab} />
        <main className="flex-1 p-8 overflow-y-auto h-[calc(100vh-5rem)]">
          <div className="max-w-6xl mx-auto space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                  {getDashboardTitle()}
                </h1>
                <p className="text-slate-500 mt-1">
                  {getDashboardDescription()}
                </p>
              </div>
            </div>

            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Admin;
