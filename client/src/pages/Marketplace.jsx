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
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";

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
      minPrice: filters.priceRange.min,
      maxPrice: filters.priceRange.max,
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
              <Link to="/auth/myprofile?tab=listings&action=add">
                <Button className="bg-[#0a0a38] hover:bg-slate-900">
                  <Plus size={20} className="mr-2" />
                  Sell Item
                </Button>
              </Link>
            </div>
            <div className="relative flex-1 md:w-80">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                size={20}
              />
              <Input
                type="text"
                placeholder="Search items..."
                value={filters.search}
                onChange={handleSearchChange}
                className="pl-10"
              />
            </div>
            <Button
              variant={showFilters ? "secondary" : "outline"}
              size="icon"
              onClick={() => setShowFilters(!showFilters)}
              aria-label="Toggle filters"
            >
              <SlidersHorizontal size={20} />
            </Button>
          </div>
        </div>

        {/* Mobile Sell Button */}
        <div className="md:hidden mb-6">
          <Link to="/auth/myprofile?tab=listings&action=add">
            <Button className="w-full bg-[#0a0a38] hover:bg-slate-900">
              <Plus size={20} className="mr-2" />
              Sell Item
            </Button>
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
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft size={20} />
                    </Button>

                    <span className="text-slate-600 font-medium">
                      Page {currentPage} of {pages}
                    </span>

                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === pages}
                    >
                      <ChevronRight size={20} />
                    </Button>
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
                <Button
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
                  className="mt-6 bg-[#0a0a38] hover:bg-[#121240]"
                >
                  Clear all filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Marketplace;
