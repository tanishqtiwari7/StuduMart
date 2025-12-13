import { X } from "lucide-react";

const FilterPanel = ({ filters, setFilters, onClose }) => {
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

  const resetFilters = () => {
    setFilters({
      priceRange: { min: 0, max: 100000 },
      sortBy: "newest",
      search: "",
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-slate-900">Filters</h2>
        <button
          onClick={onClose}
          className="md:hidden p-2 hover:bg-slate-100 rounded-lg transition-colors"
          aria-label="Close filters"
        >
          <X size={20} />
        </button>
      </div>

      <div className="space-y-6">
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
                <input
                  type="number"
                  value={
                    filters.priceRange.min === 0 ? "" : filters.priceRange.min
                  }
                  onChange={(e) => handlePriceChange(e, "min")}
                  min="0"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0a0a38] text-sm"
                  placeholder="0"
                />
              </div>
              <div className="flex-1">
                <label className="block text-xs text-slate-500 mb-1">
                  Max (₹)
                </label>
                <input
                  type="number"
                  value={
                    filters.priceRange.max === 100000
                      ? ""
                      : filters.priceRange.max
                  }
                  onChange={(e) => handlePriceChange(e, "max")}
                  min="0"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0a0a38] text-sm"
                  placeholder="Max"
                />
              </div>
            </div>
            <div className="bg-blue-50 rounded-lg p-3 text-center">
              <p className="text-sm text-[#0a0a38] font-medium">
                ₹{filters.priceRange.min.toLocaleString()} - ₹
                {filters.priceRange.max.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-3">
            Sort By
          </label>
          <select
            value={filters.sortBy}
            onChange={handleSortChange}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 bg-white text-sm"
          >
            <option value="newest">Newest First</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
          </select>
        </div>

        <button
          onClick={resetFilters}
          className="w-full py-2 px-4 border border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900 text-sm"
        >
          Reset Filters
        </button>
      </div>
    </div>
  );
};

export default FilterPanel;
