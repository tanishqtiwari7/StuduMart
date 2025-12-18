import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getProducts } from "../features/products/productSlice";
import ProductCard from "../components/ProductCard";
import Loader from "../components/Loader";
import { MapPin, Calendar, Mail, Phone, User as UserIcon } from "lucide-react";
import axios from "axios";
import { Card, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";

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
        <Card className="mb-8 overflow-hidden border-slate-200 shadow-sm">
          <div className="h-32 bg-gradient-to-r from-indigo-500 to-purple-600"></div>
          <CardContent className="px-8 pb-8 pt-0">
            <div className="relative flex justify-between items-end -mt-12 mb-6">
              <div className="flex items-end gap-6">
                <div className="w-24 h-24 rounded-full border-4 border-white bg-slate-200 overflow-hidden flex items-center justify-center">
                  {user.profile?.avatar ? (
                    <img
                      src={user.profile.avatar}
                      alt={user.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <UserIcon size={40} className="text-slate-400" />
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
                    <Badge
                      variant="secondary"
                      className="flex items-center gap-2 px-3 py-1.5 text-sm font-normal"
                    >
                      <MapPin size={16} />
                      <span>{user.university}</span>
                    </Badge>
                  )}
                  {user.profile?.graduationYear && (
                    <Badge
                      variant="secondary"
                      className="flex items-center gap-2 px-3 py-1.5 text-sm font-normal"
                    >
                      <Calendar size={16} />
                      <span>Class of {user.profile.graduationYear}</span>
                    </Badge>
                  )}
                </div>
              </div>

              <Card className="bg-slate-50 border-none shadow-none">
                <CardContent className="p-6 space-y-4">
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
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>

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
          <Card className="border-slate-200 border-dashed shadow-none">
            <CardContent className="p-12 text-center text-slate-500">
              No active listings found.
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default SellerProfile;
