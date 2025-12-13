import axios from "axios";

const API_URL = "/api/payments/";

// Get Razorpay Key
const getRazorpayKey = async (token) => {
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };
  const response = await axios.get(API_URL + "key", config);
  return response.data.key;
};

// Create Order
const createOrder = async (orderData, token) => {
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };
  const response = await axios.post(API_URL + "create-order", orderData, config);
  return response.data;
};

// Verify Payment
const verifyPayment = async (paymentData, token) => {
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };
  const response = await axios.post(API_URL + "verify", paymentData, config);
  return response.data;
};

// Get My Payments
const getMyPayments = async (token) => {
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };
  const response = await axios.get(API_URL + "my", config);
  return response.data;
};

const paymentService = {
  getRazorpayKey,
  createOrder,
  verifyPayment,
  getMyPayments,
};

export default paymentService;
