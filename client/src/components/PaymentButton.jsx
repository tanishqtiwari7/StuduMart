import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createPaymentOrder,
  verifyPayment,
  getRazorpayKey,
} from "../features/payments/paymentSlice";
import { toast } from "react-toastify";

const PaymentButton = ({ eventId, amount, onPaymentSuccess }) => {
  const dispatch = useDispatch();
  const { razorpayKey, currentOrder, isSuccess, isError, message } = useSelector(
    (state) => state.payment
  );
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getRazorpayKey());
  }, [dispatch]);

  // Handle Order Creation Success
  useEffect(() => {
    if (currentOrder && razorpayKey) {
      const options = {
        key: razorpayKey,
        amount: currentOrder.amount,
        currency: currentOrder.currency,
        name: "StuduMart",
        description: `Payment for ${currentOrder.eventName}`,
        // image: "/logo.png", // Add logo if available
        order_id: currentOrder.orderId,
        handler: async function (response) {
          const paymentData = {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          };
          await dispatch(verifyPayment(paymentData));
        },
        prefill: {
          name: currentOrder.userName,
          email: currentOrder.userEmail,
          contact: currentOrder.userPhone,
        },
        theme: {
          color: "#4f46e5", // Indigo-600
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    }
  }, [currentOrder, razorpayKey, dispatch]);

  useEffect(() => {
    if (isSuccess && message === "Payment successful!") {
      toast.success("Payment successful! You are now attending.");
      if (onPaymentSuccess) onPaymentSuccess();
    }
    if (isError) {
      toast.error(message);
    }
  }, [isSuccess, isError, message, onPaymentSuccess]);

  const handlePayment = () => {
    if (!user) {
      toast.error("Please login to pay");
      return;
    }
    dispatch(createPaymentOrder({ eventId, amount }));
  };

  return (
    <button
      onClick={handlePayment}
      className="w-full bg-indigo-600 text-white font-bold py-3 px-6 rounded-xl hover:bg-indigo-700 transition duration-300 shadow-lg hover:shadow-indigo-500/30 flex items-center justify-center gap-2"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
        />
      </svg>
      Pay ₹{amount}
    </button>
  );
};

export default PaymentButton;
