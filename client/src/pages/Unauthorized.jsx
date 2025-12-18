import React from "react";
import { Link } from "react-router-dom";
import { ShieldAlert, ArrowLeft } from "lucide-react";

const Unauthorized = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center px-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full text-center border border-slate-100">
        <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <ShieldAlert className="w-10 h-10 text-red-500" />
        </div>
        
        <h1 className="text-2xl font-bold text-slate-900 mb-2">
          Access Denied
        </h1>
        
        <p className="text-slate-600 mb-8">
          You do not have permission to view this page. Please contact your administrator if you believe this is a mistake.
        </p>

        <Link
          to="/"
          className="inline-flex items-center justify-center w-full px-4 py-3 bg-[#0a0a38] text-white rounded-xl hover:bg-slate-900 transition-colors font-medium"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default Unauthorized;
