import { Link } from "react-router-dom";
import { Home, Search, AlertTriangle } from "lucide-react";

const PageNotFound = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="max-w-lg w-full text-center">
        <div className="inline-flex items-center justify-center w-24 h-24 bg-blue-50 rounded-full mb-8">
          <AlertTriangle className="w-12 h-12 text-[#0a0a38]" />
        </div>

        <h1 className="text-9xl font-bold text-[#0a0a38] mb-4">404</h1>
        <h2 className="text-3xl font-bold text-slate-900 mb-4">
          Page Not Found
        </h2>
        <p className="text-slate-600 mb-8 text-lg">
          Oops! The page you are looking for might have been removed, had its
          name changed, or is temporarily unavailable.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/"
            className="inline-flex items-center justify-center px-6 py-3 bg-[#0a0a38] text-white rounded-xl font-medium hover:bg-[#050520] transition-colors"
          >
            <Home className="w-5 h-5 mr-2" />
            Back to Home
          </Link>
          <Link
            to="/marketplace"
            className="inline-flex items-center justify-center px-6 py-3 bg-white text-slate-700 border border-slate-200 rounded-xl font-medium hover:bg-slate-50 transition-colors"
          >
            <Search className="w-5 h-5 mr-2" />
            Browse Marketplace
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PageNotFound;
