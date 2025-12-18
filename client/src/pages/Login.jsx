import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Loader from "../components/Loader";
import { loginUser, resetAuth } from "../features/auth/authSlice";
import OTPModal from "../components/OTPModal";
import { Mail, Lock, ArrowRight } from "lucide-react";

const Login = () => {
  const { user, isLoading, isSuccess, isError, message, verificationRequired, emailToVerify } = useSelector(
    (state) => state.auth
  );
  
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showOTPModal, setShowOTPModal] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginUser(formData));
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  useEffect(() => {
    if (user) {
      navigate("/");
    }

    // Show OTP modal if verification is required
    if (verificationRequired) {
      setShowOTPModal(true);
    }

    if (isError && message) {
      toast.error(message, { position: "top-center" });
      dispatch(resetAuth());
    }
  }, [isError, message, user, navigate, verificationRequired, dispatch]);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <>
      <OTPModal 
        isOpen={showOTPModal} 
        onClose={() => setShowOTPModal(false)}
        email={emailToVerify || formData.email}
      />

      <div className="min-h-screen bg-slate-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <h2 className="mt-6 text-3xl font-bold text-slate-900">
              Welcome back
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Sign in to your StuduMart account
            </p>
          </div>

          <div className="bg-white py-8 px-4 shadow-lg rounded-xl sm:px-10 border border-slate-100">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-slate-700"
                >
                  Email address
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-lg focus:ring-[#0a0a38] focus:border-[#0a0a38] sm:text-sm transition-colors"
                    placeholder="example@acropolis.in"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between">
                   <label
                    htmlFor="password"
                    className="block text-sm font-medium text-slate-700"
                  >
                    Password
                  </label>
                  <div className="text-sm">
                    <Link
                      to="/forgot-password"
                      className="font-medium text-[#0a0a38] hover:text-indigo-500"
                    >
                      Forgot your password?
                    </Link>
                  </div>
                </div>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-lg focus:ring-[#0a0a38] focus:border-[#0a0a38] sm:text-sm transition-colors"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-[#0a0a38] hover:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isLoading ? "Signing in..." : "Sign in"}
                  {!isLoading && <ArrowRight className="ml-2 h-4 w-4" />}
                </button>
              </div>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-slate-500">
                    New to StuduMart?
                  </span>
                </div>
              </div>

              <div className="mt-6">
                <Link
                  to="/register"
                  className="w-full flex justify-center py-3 px-4 border border-slate-300 rounded-lg shadow-sm bg-white text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  Create an account
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
