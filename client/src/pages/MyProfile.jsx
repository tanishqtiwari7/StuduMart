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
  updateProduct,
  deleteProduct,
  markSoldProduct,
} from "../features/products/productSlice";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { getMessages } from "../features/messages/messageSlice";
import { logoutUser } from "../features/auth/authSlice";
import { formatPrice } from "../utils/format";

const MyProfile = () => {
  const { user } = useSelector((state) => state.auth);
  const { edit, allProducts, productLoading } = useSelector(
    (state) => state.products
  );
  const { allMessages, messageLoading } = useSelector((state) => state.message);

  const [activeTab, setActiveTab] = useState("listings");
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    isAvailable: true,
    price: "",
    itemImage: "",
    description: "",
    category: "General",
  });

  const [myProducts, setMyProducts] = useState([]);
  const [myMessages, setMyMessages] = useState([]);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const value =
      e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setFormData({
      ...formData,
      [e.target.name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.price || !formData.description) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      if (edit.isEdit) {
        await dispatch(updateProduct(formData)).unwrap();
        toast.success("Product Updated Successfully");
      } else {
        await dispatch(addProduct(formData)).unwrap();
        toast.info("Product submitted for approval!");
      }
      setShowAddModal(false);
      setFormData({
        title: "",
        isAvailable: true,
        price: "",
        itemImage: "",
        description: "",
        category: "General",
      });
    } catch (error) {
      toast.error("Operation failed");
    }
  };

  const handleEdit = (product) => {
    dispatch(editProduct(product));
    setFormData(product);
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
      navigate("/login");
    } else {
      dispatch(getProducts());
      dispatch(getMessages());
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
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 text-center">
              <div className="w-24 h-24 bg-[#0a0a38] rounded-full flex items-center justify-center mx-auto mb-4 text-white text-3xl font-bold">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <h2 className="text-xl font-bold text-slate-900">{user?.name}</h2>
              <p className="text-slate-500 text-sm mb-6">{user?.email}</p>

              <div className="space-y-2">
                <button
                  onClick={() => setActiveTab("listings")}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-medium transition-all ${
                    activeTab === "listings"
                      ? "bg-blue-50 text-[#0a0a38]"
                      : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <Package size={20} />
                  <span>My Listings</span>
                </button>
                <button
                  onClick={() => setActiveTab("messages")}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-medium transition-all ${
                    activeTab === "messages"
                      ? "bg-blue-50 text-[#0a0a38]"
                      : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <MessageSquare size={20} />
                  <span>Messages</span>
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-medium text-red-600 hover:bg-red-50 transition-all"
                >
                  <LogOut size={20} />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {activeTab === "listings" && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-slate-900">
                    My Listings
                  </h2>
                  <button
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
                    className="px-4 py-2 bg-[#0a0a38] text-white rounded-lg font-medium hover:bg-[#050520] transition-colors flex items-center gap-2"
                  >
                    <Plus size={20} />
                    Add New Listing
                  </button>
                </div>

                {myProducts.length === 0 ? (
                  <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-12 text-center">
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
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {myProducts.map((product) => (
                      <div
                        key={product._id}
                        className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col"
                      >
                        <div className="relative h-48">
                          <img
                            src={product.itemImage}
                            alt={product.title}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute top-3 right-3 flex gap-2">
                            <button
                              onClick={() => handleEdit(product)}
                              className="p-2 bg-white/90 backdrop-blur-sm rounded-full text-blue-600 hover:bg-white transition-colors"
                            >
                              <Edit size={16} />
                            </button>
                            <button
                              onClick={() => handleDelete(product._id)}
                              className="p-2 bg-white/90 backdrop-blur-sm rounded-full text-red-600 hover:bg-white transition-colors"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                        <div className="p-4 flex-grow flex flex-col">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="font-bold text-slate-900 line-clamp-1">
                              {product.title}
                            </h3>
                            <span
                              className={`px-2 py-0.5 rounded text-xs font-medium capitalize ${
                                product.status === "approved"
                                  ? "bg-green-100 text-green-800"
                                  : product.status === "pending"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : product.status === "rejected"
                                  ? "bg-red-100 text-red-800"
                                  : "bg-slate-100 text-slate-800"
                              }`}
                            >
                              {product.status}
                            </span>
                          </div>
                          <p className="text-slate-500 text-sm line-clamp-2 mb-4 flex-grow">
                            {product.description}
                          </p>
                          <div className="flex justify-between items-center mt-auto">
                            <div className="font-bold text-[#0a0a38] text-lg">
                                {formatPrice(product.price)}
                            </div>
                            {product.status === "approved" && (
                                <button
                                    onClick={() => {
                                        if(window.confirm("Mark this item as sold? It will be hidden from the marketplace.")) {
                                            dispatch(markSoldProduct(product._id));
                                        }
                                    }}
                                    className="text-xs px-3 py-1 bg-slate-900 text-white rounded-md hover:bg-slate-700 transition"
                                >
                                    Mark Sold
                                </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === "messages" && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-slate-900">Messages</h2>
                {myMessages.length === 0 ? (
                  <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-12 text-center">
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
                  </div>
                ) : (
                  <div className="bg-white rounded-2xl shadow-sm border border-slate-200 divide-y divide-slate-100">
                    {myMessages.map((msg) => (
                      <div
                        key={msg._id}
                        className="p-6 hover:bg-slate-50 transition-colors"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900">
                              {msg.sender?.name || "Unknown User"}
                            </span>
                            <span className="text-slate-400 text-sm">•</span>
                            <span className="text-slate-500 text-sm">
                              Interested in: {msg.product?.title || "Product"}
                            </span>
                          </div>
                          <span className="text-xs text-slate-400">
                            {new Date(msg.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex gap-4 mt-4">
                          <a
                            href={`mailto:${msg.sender?.email}`}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors"
                          >
                            <Mail size={16} />
                            Email Buyer
                          </a>
                          {msg.sender?.phone && (
                            <a
                              href={`tel:${msg.sender.phone}`}
                              className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-lg text-sm font-medium hover:bg-green-100 transition-colors"
                            >
                              <Phone size={16} />
                              Call Buyer
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add/Edit Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-xl">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h3 className="text-xl font-bold text-slate-900">
                {edit.isEdit ? "Edit Listing" : "Add New Listing"}
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-2 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X size={24} className="text-slate-500" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0a0a38] focus:border-transparent"
                  placeholder="What are you selling?"
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Price (₹)
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0a0a38] focus:border-transparent"
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Category
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0a0a38] focus:border-transparent"
                  >
                    <option value="General">General</option>
                    <option value="Books">Books</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Furniture">Furniture</option>
                    <option value="Clothing">Clothing</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Image URL
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-grow">
                    <ImageIcon
                      className="absolute left-3 top-2.5 text-slate-400"
                      size={20}
                    />
                    <input
                      type="text"
                      name="itemImage"
                      value={formData.itemImage}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0a0a38] focus:border-transparent"
                      placeholder="https://..."
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0a0a38] focus:border-transparent"
                  placeholder="Describe your item..."
                />
              </div>

              {/* Moved logic: Removed isAvailable checkbox as status is handled by backend */ }

              <div className="pt-4 border-t border-slate-100 flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-6 py-2 border border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#0a0a38] text-white rounded-lg font-medium hover:bg-[#050520] transition-colors"
                >
                  {edit.isEdit ? "Save Changes" : "Post Listing"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyProfile;
