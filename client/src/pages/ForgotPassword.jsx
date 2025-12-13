import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { forgotPassword, resetAuth } from "../features/auth/authSlice";
import { toast } from "react-toastify";
import Loader from "../components/Loader";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { ArrowLeft, Mail } from "lucide-react";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const dispatch = useDispatch();
  const { isLoading, isSuccess, isError, message } = useSelector(
    (state) => state.auth
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(forgotPassword(email));
  };

  useEffect(() => {
    if (isError && message) {
      toast.error(message);
      dispatch(resetAuth());
    }
    if (isSuccess && message) {
      toast.success(message);
      dispatch(resetAuth());
    }
  }, [isError, isSuccess, message, dispatch]);

  if (isLoading) return <Loader />;

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Card className="max-w-md w-full">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Forgot Password</CardTitle>
          <CardDescription className="text-center">
             Enter your email address and we'll send you a link to reset your password.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
               <label htmlFor="email" className="text-sm font-medium text-slate-700">Email Address</label>
               <div className="relative">
                 <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                 <Input 
                    type="email" 
                    placeholder="name@acropolis.in" 
                    className="pl-9"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                 />
               </div>
            </div>
            
            <Button type="submit" className="w-full">
               Send Reset Link
            </Button>
            
            <div className="text-center">
                <Link to="/login" className="inline-flex items-center text-sm text-slate-600 hover:text-[#0a0a38]">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back to Login
                </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ForgotPassword;
