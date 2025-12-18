import { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import FilterPanel from "../components/FilterPanel";
import { useDispatch, useSelector } from "react-redux";
import { getProducts } from "../features/products/productSlice";
import { toast } from "react-toastify";
import Loader from "../components/Loader";
import { Link } from "react-router-dom";
import {
  Search,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  Plus,
} from "lucide-react";

const Marketplace = () => {
  const {
    allProducts,
    productLoading,
    productError,
    productErrorMessage,
    page,
    pages,
    total,
  } = useSelector((state) => state.products);
  const dispatch = useDispatch();

  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    priceRange: { min: 0, max: 100000 },
    sortBy: "newest",
    search: "",
    category: "",
    condition: "",
  });
  const [currentPage, setCurrentPage] = useState(1);

  // Debounce search
  const [debouncedSearch, setDebouncedSearch] = useState(filters.search);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(filters.search);
    }, 500);
    return () => clearTimeout(timer);
  }, [filters.search]);

  useEffect(() => {
    const params = {
      page: currentPage,
      search: debouncedSearch,
      sort: filters.sortBy,
      "price[gte]": filters.priceRange.min,
      "price[lte]": filters.priceRange.max,
    };

    if (filters.category) params.category = filters.category;
    if (filters.condition) params.condition = filters.condition;

    dispatch(getProducts(params));
  }, [
    dispatch,
    currentPage,
    debouncedSearch,
    filters.sortBy,
    filters.priceRange,
    filters.category,
    filters.condition,
  ]);

  useEffect(() => {
    if (productError && productErrorMessage) {
      toast.error(productErrorMessage);
    }
  }, [productError, productErrorMessage]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pages) {
      setCurrentPage(newPage);
      window.scrollTo(0, 0);
    }
  };

  const handleSearchChange = (e) => {
    setFilters({ ...filters, search: e.target.value });
    setCurrentPage(1); // Reset to page 1 on search
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header & Search */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Marketplace</h1>
            <p className="text-slate-600 mt-1">
              Find textbooks, electronics, and more from other students
            </p>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            {/* Sell Button for Students */}
             <div className="hidden md:block">
                <Link
                    to="/my-profile"
                    className="flex items-center gap-2 px-4 py-2.5 bg-[#0a0a38] text-white rounded-xl hover:bg-slate-900 transition-colors font-medium shadow-md hover:shadow-lg"
                >
                    <Plus size={20} />
                    <span>Sell Item</span>
                </Link>
             </div>
            <div className="relative flex-1 md:w-80">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Search items..."
                value={filters.search}
                onChange={handleSearchChange}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-sm"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`p-2.5 rounded-xl border transition-colors ${
                showFilters
                  ? "bg-indigo-50 border-indigo-200 text-indigo-600"
                  : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
              aria-label="Toggle filters"
            >
              <SlidersHorizontal size={20} />
            </button>
          </div>
        </div>

        {/* Mobile Sell Button */}
        <div className="md:hidden mb-6">
            <Link
                to="/my-profile?tab=listings&action=add" // Optional query params if I want to auto-open
                className="w-full flex justify-center items-center gap-2 px-4 py-3 bg-[#0a0a38] text-white rounded-xl hover:bg-slate-900 transition-colors font-medium shadow-sm"
            >
                <Plus size={20} />
                <span>Sell Item</span>
            </Link>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div
            className={`lg:w-64 flex-shrink-0 ${
              showFilters ? "block" : "hidden lg:block"
            }`}
          >
            <FilterPanel
              filters={filters}
              setFilters={(newFilters) => {
                setFilters(newFilters);
                setCurrentPage(1); // Reset page on filter change
              }}
              onClose={() => setShowFilters(false)}
            />
          </div>

          {/* Product Grid */}
          <div className="flex-1">
            {productLoading ? (
              <div className="flex justify-center items-center h-64">
                <Loader />
              </div>
            ) : allProducts?.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {allProducts.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>

                {/* Pagination */}
                {pages > 1 && (
                  <div className="mt-12 flex justify-center items-center gap-4">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronLeft size={20} />
                    </button>

                    <span className="text-slate-600 font-medium">
                      Page {currentPage} of {pages}
                    </span>

                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === pages}
                      className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronRight size={20} />
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-20 bg-white rounded-2xl border border-slate-200 border-dashed">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="text-slate-400" size={32} />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-1">
                  No items found
                </h3>
                <p className="text-slate-500 max-w-md mx-auto">
                  We couldn't find any items matching your search. Try adjusting
                  your filters or search terms.
                </p>
                <button
                  onClick={() => {
                    setFilters({
                      priceRange: { min: 0, max: 100000 },
                      sortBy: "newest",
                      search: "",
                      category: "",
                      condition: "",
                    });
                    setCurrentPage(1);
                  }}
                  className="mt-6 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Marketplace;
