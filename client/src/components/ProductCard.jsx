import { Link } from "react-router-dom";
import { formatPrice } from "../utils/format";

const ProductCard = ({ product }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:-translate-y-1 hover:shadow-lg transition-all duration-300 group h-full flex flex-col">
      <Link
        to={`/marketplace/${product._id}`}
        className="block relative h-48 overflow-hidden bg-slate-100"
      >
        <img
          src={product.itemImage}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 left-3">
          <span
            className={`px-3 py-1 text-xs font-semibold rounded-full backdrop-blur-sm ${
              product.isAvailable
                ? "bg-green-100/90 text-green-700"
                : "bg-red-100/90 text-red-700"
            }`}
          >
            {product.isAvailable ? "For Sale" : "Sold"}
          </span>
        </div>
      </Link>

      <div className="p-4 flex flex-col flex-grow">
        <Link to={`/marketplace/${product._id}`}>
          <h3 className="font-semibold text-slate-900 text-lg mb-1 line-clamp-2 group-hover:text-[#0a0a38] transition-colors">
            {product.title}
          </h3>
        </Link>

        <div className="mt-auto pt-4 flex items-center justify-between">
          <div>
            <p className="text-xl font-bold text-[#0a0a38]">
              {formatPrice(product.price)}
            </p>
            <p className="text-xs text-slate-500 mt-1">
              By {product.user?.name || "Unknown"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
