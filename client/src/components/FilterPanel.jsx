import { X } from "lucide-react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCategories } from "../features/categories/categorySlice";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

const FilterPanel = ({ filters, setFilters, onClose }) => {
  const dispatch = useDispatch();
  const { categories } = useSelector((state) => state.category);

  useEffect(() => {
    dispatch(getCategories("listing"));
  }, [dispatch]);

  const handlePriceChange = (e, type) => {
    const value = e.target.value === "" ? 0 : parseInt(e.target.value);
    setFilters({
      ...filters,
      priceRange: {
        ...filters.priceRange,
        [type]: value,
      },
    });
  };

  const handleSortChange = (e) => {
    setFilters({ ...filters, sortBy: e.target.value });
  };

  const handleCategoryChange = (e) => {
    setFilters({ ...filters, category: e.target.value });
  };

  const resetFilters = () => {
    setFilters({
      priceRange: { min: 0, max: 100000 },
      sortBy: "newest",
      search: "",
      category: "",
    });
  };

  return (
    <Card className="border-slate-200 shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-lg font-bold text-slate-900">
          Filters
        </CardTitle>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="md:hidden h-8 w-8"
          aria-label="Close filters"
        >
          <X size={20} />
        </Button>
      </CardHeader>

      <CardContent className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-3">
            Price Range
          </label>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <label className="block text-xs text-slate-500 mb-1">
                  Min (₹)
                </label>
                <Input
                  type="number"
                  value={
                    filters.priceRange.min === 0 ? "" : filters.priceRange.min
                  }
                  onChange={(e) => handlePriceChange(e, "min")}
                  min="0"
                  placeholder="0"
                />
              </div>
              <div className="flex-1">
                <label className="block text-xs text-slate-500 mb-1">
                  Max (₹)
                </label>
                <Input
                  type="number"
                  value={
                    filters.priceRange.max === 100000
                      ? ""
                      : filters.priceRange.max
                  }
                  onChange={(e) => handlePriceChange(e, "max")}
                  min="0"
                  placeholder="Max"
                />
              </div>
            </div>
            <div className="bg-slate-50 rounded-lg p-3 text-center">
              <p className="text-sm text-[#0a0a38] font-medium">
                ₹{filters.priceRange.min.toLocaleString()} - ₹
                {filters.priceRange.max.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-3">
            Category
          </label>
          <select
            value={filters.category}
            onChange={handleCategoryChange}
            className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0a0a38] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-3">
            Sort By
          </label>
          <select
            value={filters.sortBy}
            onChange={handleSortChange}
            className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0a0a38] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="newest">Newest First</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
          </select>
        </div>

        <Button variant="outline" onClick={resetFilters} className="w-full">
          Reset Filters
        </Button>
      </CardContent>
    </Card>
  );
};

export default FilterPanel;
