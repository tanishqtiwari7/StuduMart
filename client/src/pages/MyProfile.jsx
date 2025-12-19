import {
  User,
  Package,
  MessageSquare,
  Mail,
  Phone,
  Edit,
  Trash2,
  Plus,
  X,
  Image as ImageIcon,
  LogOut,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../components/Loader";
import {
  addProduct,
  editProduct,
  getProducts,
  updateProduct,
  deleteProduct,
  markSoldProduct,
} from "../features/products/productSlice";
import { toast } from "react-toastify";
import { useNavigate, useLocation } from "react-router-dom";
import { getMessages } from "../features/messages/messageSlice";
import { logoutUser } from "../features/auth/authSlice";
import { getCategories } from "../features/categories/categorySlice";
import { formatPrice } from "../utils/format";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "../components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../components/ui/dialog";
import { Badge } from "../components/ui/badge";
import axios from "axios";

const MyProfile = () => {
  const { user } = useSelector((state) => state.auth);
  const { edit, allProducts, productLoading } = useSelector(
    (state) => state.products
  );
  const { allMessages, messageLoading } = useSelector((state) => state.message);
  const { categories } = useSelector((state) => state.category);

  const [activeTab, setActiveTab] = useState("listings");
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    isAvailable: true,
    price: "",
    itemImage: "",
    description: "",
    category: "",
  });

  const [myProducts, setMyProducts] = useState([]);
  const [myMessages, setMyMessages] = useState([]);

  const [selectedFiles, setSelectedFiles] = useState([]);
  const [existingImages, setExistingImages] = useState([]);

  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const [emailData, setEmailData] = useState({
    buyerId: "",
    buyerName: "",
    subject: "",
    message: "",
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const handleOpenEmailModal = (buyer) => {
    setEmailData({
      buyerId: buyer._id,
      buyerName: buyer.name,
      subject: "Regarding your interest in my product",
      message: "",
    });
    setEmailModalOpen(true);
  };

  const handleSendEmail = async () => {
    if (!emailData.subject || !emailData.message) {
      toast.error("Please fill all fields");
      return;
    }
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      await axios.post(
        "/api/message/email",
        {
          buyerId: emailData.buyerId,
          subject: emailData.subject,
          message: emailData.message,
        },
        config
      );
      toast.success("Email sent successfully");
      setEmailModalOpen(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send email");
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tab = params.get("tab");
    const action = params.get("action");

    if (tab) {
      setActiveTab(tab);
    }

    if (action === "add") {
      setFormData({
        title: "",
        isAvailable: true,
        price: "",
        itemImage: "",
        description: "",
        category: "",
      });
      setSelectedFiles([]);
      setShowAddModal(true);
    }
  }, [location]);

  const handleChange = (e) => {
    const value =
      e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setFormData({
      ...formData,
      [e.target.name]: value,
    });
  };

  const handleFileChange = (e) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      if (selectedFiles.length + existingImages.length + newFiles.length > 3) {
        toast.error("You can only have up to 3 images total");
        return;
      }
      setSelectedFiles([...selectedFiles, ...newFiles]);
    }
  };

  const removeFile = (index) => {
    setSelectedFiles(selectedFiles.filter((_, i) => i !== index));
  };

  const removeExistingImage = (index) => {
    setExistingImages(existingImages.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !formData.title ||
      !formData.price ||
      !formData.description ||
      !formData.category
    ) {
      toast.error("Please fill all required fields");
      return;
    }

    const data = new FormData();
    data.append("title", formData.title);
    data.append("price", formData.price);
    data.append("description", formData.description);
    data.append("category", formData.category);
    if (formData.itemImage) data.append("itemImage", formData.itemImage);

    // Append existing images as JSON string
    data.append("images", JSON.stringify(existingImages));

    selectedFiles.forEach((file) => {
      data.append("images", file);
    });

    try {
      if (edit.isEdit) {
        await dispatch(updateProduct({ id: formData._id, data })).unwrap();
        toast.success("Product Updated Successfully");
      } else {
        await dispatch(addProduct(data)).unwrap();
        toast.info("Product submitted for approval!");
      }
      setShowAddModal(false);
      setFormData({
        title: "",
        isAvailable: true,
        price: "",
        itemImage: "",
        description: "",
        category: "",
      });
      setSelectedFiles([]);
    } catch (error) {
      toast.error("Operation failed");
    }
  };

  const handleEdit = (product) => {
    dispatch(editProduct(product));
    setFormData({
      ...product,
      category: product.category?._id || product.category, // Handle populated category
    });
    setExistingImages(product.images || []);
    setSelectedFiles([]);
    setShowAddModal(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this listing?")) {
      dispatch(deleteProduct(id));
    }
  };

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/login");
  };

  useEffect(() => {
    if (!user) {
      // If user is null, check if we have a token in localStorage (handled by authSlice init)
      // If authSlice init failed or token expired, then redirect.
      // But here, we rely on 'user' state.
      // If page refresh happens, 'user' might be null initially if not persisted correctly.
      // Assuming authSlice reads from localStorage on init.
      const storedUser = JSON.parse(localStorage.getItem("user"));
      if (!storedUser) {
        navigate("/login");
      }
    } else {
      dispatch(getProducts({ user: user._id, status: "all" }));
      dispatch(getMessages());
      dispatch(getCategories("listing"));
    }
  }, [user, dispatch, navigate]);

  useEffect(() => {
    if (allProducts && user) {
      setMyProducts(
        allProducts.filter(
          (product) => product.user && product.user.email === user.email
        )
      );
    }
  }, [allProducts, user]);

  useEffect(() => {
    if (allMessages) {
      setMyMessages(allMessages);
    }
  }, [allMessages]);

  if (productLoading || messageLoading) return <Loader />;

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="text-center border-slate-200 shadow-sm">
              <CardContent className="pt-6">
                <div className="w-24 h-24 bg-[#0a0a38] rounded-full flex items-center justify-center mx-auto mb-4 text-white text-3xl font-bold">
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
                <h2 className="text-xl font-bold text-slate-900">
                  {user?.name}
                </h2>
                <p className="text-slate-500 text-sm mb-6">{user?.email}</p>

                <div className="space-y-2">
                  <Button
                    variant={activeTab === "listings" ? "secondary" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => setActiveTab("listings")}
                  >
                    <Package size={20} className="mr-2" />
                    My Listings
                  </Button>
                  <Button
                    variant={activeTab === "messages" ? "secondary" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => setActiveTab("messages")}
                  >
                    <MessageSquare size={20} className="mr-2" />
                    Messages
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                    onClick={handleLogout}
                  >
                    <LogOut size={20} className="mr-2" />
                    Logout
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {activeTab === "listings" && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-slate-900">
                    My Listings
                  </h2>
                  <Button
                    onClick={() => {
                      setFormData({
                        title: "",
                        isAvailable: true,
                        price: "",
                        itemImage: "",
                        description: "",
                        category: "General",
                      });
                      setShowAddModal(true);
                    }}
                    className="bg-[#0a0a38] hover:bg-slate-900"
                  >
                    <Plus size={20} className="mr-2" />
                    Add New Listing
                  </Button>
                </div>

                {myProducts.length === 0 ? (
                  <Card className="border-slate-200 shadow-sm">
                    <CardContent className="p-12 text-center">
                      <Package
                        size={48}
                        className="mx-auto text-slate-300 mb-4"
                      />
                      <h3 className="text-lg font-medium text-slate-900 mb-2">
                        No listings yet
                      </h3>
                      <p className="text-slate-500">
                        Start selling by adding your first product.
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {myProducts.map((product) => (
                      <Card
                        key={product._id}
                        className="overflow-hidden border-slate-200 shadow-sm flex flex-col"
                      >
                        <div className="relative h-48">
                          <img
                            src={product.itemImage}
                            alt={product.title}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute top-3 right-3 flex gap-2">
                            <Button
                              size="icon"
                              variant="secondary"
                              className="h-8 w-8 bg-white/90 backdrop-blur-sm hover:bg-white text-[#0a0a38]"
                              onClick={() => handleEdit(product)}
                            >
                              <Edit size={16} />
                            </Button>
                            <Button
                              size="icon"
                              variant="secondary"
                              className="h-8 w-8 bg-white/90 backdrop-blur-sm hover:bg-white text-red-600"
                              onClick={() => handleDelete(product._id)}
                            >
                              <Trash2 size={16} />
                            </Button>
                          </div>
                        </div>
                        <CardContent className="p-4 flex-grow flex flex-col">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="font-bold text-slate-900 line-clamp-1">
                              {product.title}
                            </h3>
                            <Badge
                              variant={
                                product.status === "approved"
                                  ? "success"
                                  : product.status === "pending"
                                  ? "warning"
                                  : product.status === "rejected"
                                  ? "destructive"
                                  : "secondary"
                              }
                              className={
                                product.status === "approved"
                                  ? "bg-green-100 text-green-800 hover:bg-green-100"
                                  : product.status === "pending"
                                  ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                                  : product.status === "rejected"
                                  ? "bg-red-100 text-red-800 hover:bg-red-100"
                                  : "bg-slate-100 text-slate-800 hover:bg-slate-100"
                              }
                            >
                              {product.status}
                            </Badge>
                          </div>
                          <p className="text-slate-500 text-sm line-clamp-2 mb-4 flex-grow">
                            {product.description}
                          </p>
                          <div className="flex justify-between items-center mt-auto">
                            <div className="font-bold text-[#0a0a38] text-lg">
                              {formatPrice(product.price)}
                            </div>
                            {product.status === "approved" && (
                              <Button
                                size="sm"
                                className="bg-slate-900 hover:bg-slate-700 text-xs h-7"
                                onClick={() => {
                                  if (
                                    window.confirm(
                                      "Mark this item as sold? It will be hidden from the marketplace."
                                    )
                                  ) {
                                    dispatch(markSoldProduct(product._id));
                                  }
                                }}
                              >
                                Mark Sold
                              </Button>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === "messages" && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-slate-900">Messages</h2>
                {myMessages.length === 0 ? (
                  <Card className="border-slate-200 shadow-sm">
                    <CardContent className="p-12 text-center">
                      <MessageSquare
                        size={48}
                        className="mx-auto text-slate-300 mb-4"
                      />
                      <h3 className="text-lg font-medium text-slate-900 mb-2">
                        No messages yet
                      </h3>
                      <p className="text-slate-500">
                        Messages from interested buyers will appear here.
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  <Card className="border-slate-200 shadow-sm">
                    <div className="divide-y divide-slate-100">
                      {myMessages.map((msg) => (
                        <div
                          key={msg._id}
                          className="p-6 hover:bg-slate-50 transition-colors"
                        >
                          <div className="flex justify-between items-start mb-2">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-slate-900">
                                {msg.user?.name || "Unknown User"}
                              </span>
                              <span className="text-slate-400 text-sm">•</span>
                              <span className="text-slate-500 text-sm">
                                Interested in: {msg.listing?.title || "Product"}
                              </span>
                            </div>
                            <span className="text-xs text-slate-400">
                              {new Date(msg.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-slate-700 mb-4">{msg.text}</p>
                          <div className="flex gap-4 mt-4">
                            {msg.user?.email && (
                              <Button
                                variant="secondary"
                                size="sm"
                                onClick={() => handleOpenEmailModal(msg.user)}
                                className="flex items-center gap-2"
                              >
                                <Mail size={16} />
                                Email Buyer
                              </Button>
                            )}
                            {msg.user?.phone && (
                              <div className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-lg text-sm font-medium">
                                <Phone size={16} />
                                {msg.user.phone}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add/Edit Product Modal */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {edit.isEdit ? "Edit Listing" : "Add New Listing"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">
                Title
              </label>
              <Input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="What are you selling?"
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">
                  Price (₹)
                </label>
                <Input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="0.00"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">
                  Category
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0a0a38] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">
                Images (Max 3)
              </label>

              {/* Existing Images */}
              {existingImages.length > 0 && (
                <div className="mb-2">
                  <p className="text-xs text-slate-500 mb-1">Current Images:</p>
                  <div className="flex gap-2 flex-wrap">
                    {existingImages.map((img, index) => (
                      <div
                        key={index}
                        className="relative w-20 h-20 border border-slate-200 rounded-lg overflow-hidden group"
                      >
                        <img
                          src={img.url}
                          alt="existing"
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => removeExistingImage(index)}
                          className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* New Files */}
              {selectedFiles.length > 0 && (
                <div className="mb-2">
                  <p className="text-xs text-slate-500 mb-1">New Uploads:</p>
                  <div className="flex gap-2 flex-wrap">
                    {selectedFiles.map((file, index) => (
                      <div
                        key={index}
                        className="relative w-20 h-20 border border-slate-200 rounded-lg overflow-hidden group"
                      >
                        <img
                          src={URL.createObjectURL(file)}
                          alt="preview"
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => removeFile(index)}
                          className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <Input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileChange}
                className="cursor-pointer"
                disabled={selectedFiles.length + existingImages.length >= 3}
              />
              <p className="text-xs text-slate-500">
                {3 - (selectedFiles.length + existingImages.length)} slots
                remaining
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">
                Image URL (Legacy/Optional)
              </label>
              <div className="relative">
                <ImageIcon
                  className="absolute left-3 top-2.5 text-slate-400"
                  size={20}
                />
                <Input
                  type="text"
                  name="itemImage"
                  value={formData.itemImage}
                  onChange={handleChange}
                  className="pl-10"
                  placeholder="https://..."
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="flex min-h-[80px] w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0a0a38] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Describe your item..."
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowAddModal(false)}
              >
                Cancel
              </Button>
              <Button type="submit" className="bg-[#0a0a38] hover:bg-slate-900">
                {edit.isEdit ? "Save Changes" : "Post Listing"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      {/* Email Buyer Modal */}
      <Dialog open={emailModalOpen} onOpenChange={setEmailModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Email {emailData.buyerName}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">
                Subject
              </label>
              <Input
                value={emailData.subject}
                onChange={(e) =>
                  setEmailData({ ...emailData, subject: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">
                Message
              </label>
              <textarea
                className="flex min-h-[120px] w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0a0a38] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={emailData.message}
                onChange={(e) =>
                  setEmailData({ ...emailData, message: e.target.value })
                }
                placeholder="Write your message here..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEmailModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSendEmail}>Send Email</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MyProfile;
