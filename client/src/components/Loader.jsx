import React from "react";

const Loader = () => {
  return (
    <div className="min-h-[50vh] flex items-center justify-center flex-col">
      <div className="relative w-16 h-16 mb-4">
        <div className="absolute inset-0 rounded-full border-4 border-slate-200"></div>
        <div className="absolute inset-0 rounded-full border-4 border-[#0a0a38]border-t-transparent animate-spin"></div>
      </div>
      <p className="text-slate-500 font-medium animate-pulse">Loading...</p>
    </div>
  );
};

export default Loader;
