import { Link } from "react-router-dom";
import { formatPrice } from "../utils/format";
import { Card, CardContent, CardFooter } from "./ui/card";
import { Badge } from "./ui/badge";

const ProductCard = ({ product }) => {
  return (
    <Card className="h-full overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-slate-200 group flex flex-col">
      <Link
        to={`/marketplace/${product._id}`}
        className="block relative h-48 overflow-hidden bg-slate-100"
      >
        <img
          src={
            product.images?.[0]?.url ||
            product.itemImage ||
            "https://placehold.co/300x200?text=No+Image"
          }
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "https://placehold.co/300x200?text=No+Image";
          }}
        />
        <div className="absolute top-3 left-3">
          <Badge
            variant={product.isAvailable ? "success" : "destructive"}
            className={`backdrop-blur-sm ${
              product.isAvailable
                ? "bg-green-100/90 text-green-700 hover:bg-green-100/90"
                : "bg-red-100/90 text-red-700 hover:bg-red-100/90"
            }`}
          >
            {product.isAvailable ? "For Sale" : "Sold"}
          </Badge>
        </div>
      </Link>

      <CardContent className="p-4 flex flex-col flex-grow">
        <Link to={`/marketplace/${product._id}`}>
          <h3 className="font-semibold text-slate-900 text-lg mb-1 line-clamp-2 group-hover:text-[#0a0a38] transition-colors">
            {product.title}
          </h3>
        </Link>
      </CardContent>

      <CardFooter className="p-4 pt-0 mt-auto flex items-center justify-between">
        <div>
          <p className="text-xl font-bold text-[#0a0a38]">
            {formatPrice(product.price)}
          </p>
          <p className="text-xs text-slate-500 mt-1">
            By {product.user?.name || "Unknown"}
          </p>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
