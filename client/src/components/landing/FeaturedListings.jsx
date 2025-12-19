import { Link } from "react-router-dom";
import { ArrowRight, Clock } from "lucide-react";
import { useSelector } from "react-redux";
import { formatPrice, formatTimeAgo } from "../../utils/format";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";

const FeaturedListings = () => {
  const { allProducts, productsLoading } = useSelector(
    (state) => state.products
  );
  const featuredProducts = allProducts.slice(0, 4);

  return (
    <section className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 mb-2">
              Featured Listings
            </h2>
            <p className="text-slate-500">
              Fresh finds from students around you
            </p>
          </div>
          <Link to="/marketplace">
            <Button
              variant="ghost"
              className="text-[#0a0a38] hover:text-[#0a0a38] hover:bg-slate-100"
            >
              View All <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {productsLoading
            ? [...Array(4)].map((_, i) => (
                <Card key={i} className="overflow-hidden border-slate-200">
                  <div className="h-48 bg-slate-200 animate-pulse" />
                  <CardContent className="p-4 space-y-3">
                    <div className="h-4 bg-slate-200 rounded w-3/4 animate-pulse" />
                    <div className="h-3 bg-slate-200 rounded w-1/2 animate-pulse" />
                  </CardContent>
                </Card>
              ))
            : featuredProducts.map((product) => (
                <Link
                  key={product._id}
                  to={`/marketplace/${product._id}`}
                  className="group"
                >
                  <Card className="overflow-hidden border-slate-200 hover:shadow-lg hover:border-blue-200 transition-all duration-300 h-full flex flex-col">
                    <div className="relative h-52 bg-slate-100 overflow-hidden">
                      <img
                        src={
                          product.images?.[0]?.url ||
                          product.itemImage ||
                          "https://via.placeholder.com/300"
                        }
                        alt={product.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 right-3">
                        <Badge className="bg-white/90 text-[#0a0a38] hover:bg-white font-bold shadow-sm backdrop-blur-sm">
                          {formatPrice(product.price)}
                        </Badge>
                      </div>
                      {product.condition && (
                        <div className="absolute bottom-3 left-3">
                          <Badge
                            variant="secondary"
                            className="bg-black/60 text-white hover:bg-black/70 backdrop-blur-sm capitalize border-0"
                          >
                            {product.condition.replace("-", " ")}
                          </Badge>
                        </div>
                      )}
                    </div>
                    <CardContent className="p-5 flex-1 flex flex-col">
                      <div className="flex items-center justify-between mb-3">
                        <Badge
                          variant="outline"
                          className="text-[#0a0a38] bg-slate-100 border-slate-200"
                        >
                          {product.category?.name || "General"}
                        </Badge>
                        <span className="text-xs text-slate-400 flex items-center gap-1">
                          <Clock size={12} />
                          {formatTimeAgo(product.createdAt)}
                        </span>
                      </div>
                      <h3 className="font-bold text-slate-900 mb-1 truncate text-lg group-hover:text-[#0a0a38] transition-colors">
                        {product.title}
                      </h3>
                      <p className="text-sm text-slate-500 truncate mt-auto pt-2 flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-green-400 inline-block"></span>
                        {product.location?.campus || "Main Campus"}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedListings;
