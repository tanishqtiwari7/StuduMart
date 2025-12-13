import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getProducts } from "../features/products/productSlice";
import ProductCard from "../components/ProductCard";
import Loader from "../components/Loader";
import { MapPin, Calendar, Mail, Phone, User as UserIcon } from "lucide-react";
import axios from "axios";

const SellerProfile = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { allProducts, productLoading } = useSelector(
    (state) => state.products
  );
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`/api/auth/${id}`);
        setUser(response.data);
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
    dispatch(getProducts({ user: id }));
  }, [id, dispatch]);

  if (loading) return <Loader />;
  if (!user) return <div className="text-center py-20">User not found</div>;

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mb-8">
          <div className="h-32 bg-gradient-to-r from-indigo-500 to-purple-600"></div>
          <div className="px-8 pb-8">
            <div className="relative flex justify-between items-end -mt-12 mb-6">
              <div className="flex items-end gap-6">
                <div className="w-24 h-24 rounded-full border-4 border-white bg-slate-200 overflow-hidden">
                  {user.profile?.avatar ? (
                    <img
                      src={user.profile.avatar}
                      alt={user.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-400">
                      <UserIcon size={40} />
                    </div>
                  )}
                </div>
                <div className="mb-1">
                  <h1 className="text-2xl font-bold text-slate-900">
                    {user.name}
                  </h1>
                  <p className="text-slate-600">
                    {user.role === "student" ? "Student" : user.role}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="col-span-2 space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">
                    About
                  </h3>
                  <p className="text-slate-600 leading-relaxed">
                    {user.profile?.bio || "No bio provided."}
                  </p>
                </div>

                <div className="flex flex-wrap gap-4">
                  {user.university && (
                    <div className="flex items-center gap-2 text-slate-600 bg-slate-50 px-3 py-1.5 rounded-lg">
                      <MapPin size={18} />
                      <span>{user.university}</span>
                    </div>
                  )}
                  {user.profile?.graduationYear && (
                    <div className="flex items-center gap-2 text-slate-600 bg-slate-50 px-3 py-1.5 rounded-lg">
                      <Calendar size={18} />
                      <span>Class of {user.profile.graduationYear}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-slate-50 rounded-xl p-6 space-y-4">
                <h3 className="font-semibold text-slate-900">Contact Info</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-slate-600">
                    <Mail size={18} />
                    <span>{user.email}</span>
                  </div>
                  {user.phone && (
                    <div className="flex items-center gap-3 text-slate-600">
                      <Phone size={18} />
                      <span>{user.phone}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* User's Listings */}
        <h2 className="text-xl font-bold text-slate-900 mb-6">
          Listings by {user.name}
        </h2>
        {productLoading ? (
          <Loader />
        ) : allProducts?.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {allProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-xl border border-slate-200 border-dashed">
            <p className="text-slate-500">No active listings found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SellerProfile;
