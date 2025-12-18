import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { verifyOTP, resendOTP, resetAuth } from "../features/auth/authSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const OTPModal = ({ isOpen, onClose, email }) => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(600); // 10 minutes
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isLoading, isSuccess, isError, message } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    let interval;
    if (isOpen && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isOpen, timer]);

  useEffect(() => {
    if (isSuccess && isOpen) {
        // Close modal and redirect only after successful verification
      toast.success("Email verified successfully!");
      onClose();
      dispatch(resetAuth());
      navigate("/");
    }
    if (isError && isOpen) {
      toast.error(message);
      dispatch(resetAuth()); 
    }
  }, [isSuccess, isError, message, isOpen, onClose, dispatch, navigate]);

  const handleChange = (element, index) => {
    if (isNaN(element.value)) return false;

    setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);

    // Focus next input
    if (element.nextSibling) {
      element.nextSibling.focus();
    }
  };

  const handleVerify = () => {
    const otpString = otp.join("");
    if (otpString.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP");
      return;
    }
    dispatch(verifyOTP({ email, otp: otpString }));
  };

  const handleResend = () => {
    dispatch(resendOTP(email));
    setTimer(600);
    setOtp(["", "", "", "", "", ""]);
    toast.info("Resending OTP...");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl transform transition-all">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-slate-800 mb-2">
            Verify Email
          </h2>
          <p className="text-slate-500 mb-8">
            Enter the 6-digit code sent to <br />
            <span className="font-semibold text-slate-700">{email}</span>
          </p>

          <div className="flex justify-center gap-2 mb-8">
            {otp.map((data, index) => (
              <input
                className="w-12 h-12 text-center text-2xl font-bold border-2 border-slate-200 rounded-lg focus:border-[#0a0a38] focus:outline-none transition-colors"
                type="text"
                name="otp"
                maxLength="1"
                key={index}
                value={data}
                onChange={(e) => handleChange(e.target, index)}
                onFocus={(e) => e.target.select()}
                onKeyDown={(e) => {
                    if (e.key === "Backspace" && !otp[index] && e.target.previousSibling) {
                        e.target.previousSibling.focus();
                    }
                }}
              />
            ))}
          </div>

          <button
            onClick={handleVerify}
            disabled={isLoading}
            className="w-full bg-[#0a0a38] text-white font-bold py-3 px-4 rounded-xl hover:bg-slate-900 transition duration-300 shadow-lg hover:shadow-slate-500/30 disabled:opacity-50"
          >
            {isLoading ? "Verifying..." : "Verify Email"}
          </button>

          <div className="mt-6 flex justify-between items-center text-sm">
            <span className="text-slate-500">
              Expires in: {Math.floor(timer / 60)}:
              {(timer % 60).toString().padStart(2, "0")}
            </span>
            <button
              onClick={handleResend}
              disabled={timer > 0}
              className={`font-semibold ${
                timer > 0
                  ? "text-slate-300 cursor-not-allowed"
                  : "text-[#0a0a38] hover:text-slate-700"
              }`}
            >
              Resend Code
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OTPModal;
