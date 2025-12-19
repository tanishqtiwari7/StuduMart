import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { formatDate, formatPrice, formatTimeAgo } from "../utils/format";
import { useDispatch, useSelector } from "react-redux";
import { getProduct } from "../features/products/productSlice";
import Loader from "../components/Loader";
import { toast } from "react-toastify";
import { addMessage } from "../features/messages/messageSlice";
import {
  ArrowLeft,
  MessageCircle,
  User,
  Calendar,
  Tag,
  CheckCircle,
  AlertCircle,
  MapPin,
  Eye,
  Heart,
  Share2,
  ShieldCheck,
  Clock,
  Star,
  ChevronRight,
} from "lucide-react";

const ProductDetail = () => {
  const { user } = useSelector((state) => state.auth);
  const { product, productLoading, productError, productErrorMessage } =
    useSelector((state) => state.products);
  const { messageLoading, messageError, messageErrorMessage } = useSelector(
    (state) => state.message
  );

  const { pid } = useParams();
  const dispatch = useDispatch();
  const [activeImage, setActiveImage] = useState(0);

  const [sent, setSent] = useState(() => {
    if (!user?.email) return false;
    const storageKey = `sentMessages_${user.email}`;
    const sentMessages = JSON.parse(localStorage.getItem(storageKey) || "[]");
    return sentMessages.includes(pid);
  });

  const sendAlert = async (pid) => {
    if (!user) {
      toast.error("Please login to contact the seller");
      return;
    }
    try {
      await dispatch(addMessage(pid)).unwrap();

      if (user?.email) {
        const storageKey = `sentMessages_${user.email}`;
        const sentMessages = JSON.parse(
          localStorage.getItem(storageKey) || "[]"
        );
        if (!sentMessages.includes(pid)) {
          sentMessages.push(pid);
          localStorage.setItem(storageKey, JSON.stringify(sentMessages));
        }
      }

      setSent(true);
      toast.success(
        "Message Sent Successfully! Seller will contact you soon.",
        { position: "top-center" }
      );
    } catch (error) {
      toast.error("Failed to send message. Please try again.", {
        position: "top-center",
      });
    }
  };

  useEffect(() => {
    dispatch(getProduct(pid));
  }, [pid, dispatch]);

  useEffect(() => {
    if (productError && productErrorMessage) {
      toast.error(productErrorMessage);
    }
    if (messageError && messageErrorMessage) {
      toast.error(messageErrorMessage);
    }
  }, [productError, productErrorMessage, messageError, messageErrorMessage]);

  if (productLoading) {
    return <Loader />;
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">
            Product not found
          </h2>
          <Link to="/marketplace" className="text-[#0a0a38] hover:underline">
            Back to Marketplace
          </Link>
        </div>
      </div>
    );
  }

  const images =
    product.images && product.images.length > 0
      ? product.images
      : [
          {
            url:
              product.itemImage || "https://placehold.co/400x300?text=No+Image",
          },
        ];

  return (
    <div className="min-h-screen bg-slate-50 py-12 pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          to="/marketplace"
          className="inline-flex items-center text-slate-600 hover:text-[#0a0a38] mb-8 font-medium transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Marketplace
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column - Images (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden relative aspect-[4/3]">
              <img
                src={images[activeImage]?.url}
                alt={product.title}
                className="absolute inset-0 w-full h-full object-contain bg-slate-100"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://placehold.co/400x300?text=No+Image";
                }}
              />
              <button className="absolute top-4 right-4 p-2 bg-white/90 backdrop-blur rounded-full shadow-sm hover:bg-white transition-colors text-slate-600 hover:text-red-500">
                <Heart size={20} />
              </button>
            </div>

            {images.length > 1 && (
              <div className="grid grid-cols-5 gap-4">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(idx)}
                    className={`aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                      activeImage === idx
                        ? "border-[#0a0a38]"
                        : "border-transparent hover:border-slate-300"
                    }`}
                  >
                    <img
                      src={img.url}
                      alt=""
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src =
                          "https://placehold.co/100x100?text=No+Image";
                      }}
                    />
                  </button>
                ))}
              </div>
            )}

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-lg font-bold text-slate-900 mb-4">
                Description
              </h3>
              <div className="prose prose-slate max-w-none text-slate-600 whitespace-pre-line">
                {product.description}
              </div>
            </div>
          </div>

          {/* Right Column - Details (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 lg:p-8">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 mb-2">
                    {product.title}
                  </h1>
                  <div className="flex items-center gap-4 text-sm text-slate-500">
                    <span className="flex items-center gap-1">
                      <MapPin size={16} />
                      {product.location?.campus || "Main Campus"}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={16} />
                      {formatTimeAgo(product.createdAt)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Eye size={16} />
                      {product.views || 0} views
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-end gap-3 mb-6">
                <span className="text-4xl font-bold text-[#0a0a38]">
                  {formatPrice(product.price)}
                </span>
                {product.condition && (
                  <span className="px-3 py-1 rounded-full text-sm font-medium bg-slate-100 text-slate-700 mb-2">
                    {product.condition.replace("-", " ")}
                  </span>
                )}
              </div>

              <div className="space-y-3 mb-8">
                {user?._id !== product.user?._id ? (
                  <button
                    onClick={() => !sent && sendAlert(product._id)}
                    disabled={sent || !product.isAvailable}
                    className={`w-full py-4 px-6 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all ${
                      sent
                        ? "bg-green-50 text-green-600 cursor-default border border-green-200"
                        : !product.isAvailable
                        ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                        : "bg-[#0a0a38] text-white hover:bg-[#050520] shadow-lg hover:shadow-xl"
                    }`}
                  >
                    {sent ? (
                      <>
                        <CheckCircle size={24} />
                        Interest Expressed
                      </>
                    ) : !product.isAvailable ? (
                      <>
                        <AlertCircle size={24} />
                        Item Sold
                      </>
                    ) : (
                      <>
                        <MessageCircle size={24} />
                        Message Seller
                      </>
                    )}
                  </button>
                ) : (
                  <div className="w-full py-4 px-6 bg-slate-50 text-slate-500 rounded-xl text-center font-medium border border-slate-200">
                    This is your listing
                  </div>
                )}

                <button className="w-full py-3 px-6 rounded-xl font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 flex items-center justify-center gap-2 transition-colors">
                  <Share2 size={20} />
                  Share Listing
                </button>
              </div>

              <div className="border-t border-slate-100 pt-6">
                <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-4">
                  Seller Information
                </h3>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 overflow-hidden">
                    {product.user?.profile?.avatar ? (
                      <img
                        src={product.user.profile.avatar}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User size={24} />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-bold text-slate-900">
                        {product.user?.name || "Unknown User"}
                      </h4>
                      {product.user?.verificationStatus?.studentID && (
                        <ShieldCheck size={16} className="text-green-500" />
                      )}
                    </div>
                    <div className="flex items-center gap-1 text-sm text-slate-500 mb-2">
                      <Star
                        size={14}
                        className="fill-yellow-400 text-yellow-400"
                      />
                      <span className="font-medium text-slate-900">
                        {product.user?.reputation?.rating || "New"}
                      </span>
                      <span>
                        ({product.user?.reputation?.totalRatings || 0} reviews)
                      </span>
                    </div>
                    <div className="text-xs text-slate-400">
                      Member since {formatDate(product.user?.createdAt)}
                    </div>
                  </div>
                  <Link
                    to={`/profile/${product.user?._id}`}
                    className="text-sm font-medium text-[#0a0a38] hover:underline"
                  >
                    View Profile
                  </Link>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
              <h3 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                <ShieldCheck size={20} />
                Safety Tips
              </h3>
              <ul className="text-sm text-slate-600 space-y-2 list-disc list-inside">
                <li>Meet in a public place like the library or cafeteria.</li>
                <li>Check the item carefully before paying.</li>
                <li>Avoid sharing personal financial information.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
