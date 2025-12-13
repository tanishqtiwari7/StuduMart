import axios from "axios";

const API_URL = "/api/auth/";

// Register user
const register = async (formData) => {
  const response = await axios.post(API_URL + "register", formData);
  // If verification is not required (e.g. legacy), save user
  if (!response.data.requiresVerification) {
    localStorage.setItem("user", JSON.stringify(response.data));
  }
  return response.data;
};

// Login user
const login = async (formData) => {
  const response = await axios.post(API_URL + "login", formData);
  // If verification is not required, save user
  if (!response.data.requiresVerification) {
    localStorage.setItem("user", JSON.stringify(response.data));
  }
  return response.data;
};

// Verify OTP
const verifyOTP = async (formData) => {
  const response = await axios.post(API_URL + "verify-otp", formData);
  if (response.data) {
    localStorage.setItem("user", JSON.stringify(response.data));
  }
  return response.data;
};

// Resend OTP
const resendOTP = async (email) => {
  const response = await axios.post(API_URL + "resend-otp", { email });
  return response.data;
};

// Get Branches
const getBranches = async () => {
  const response = await axios.get(API_URL + "branches");
  return response.data;
};

// Forgot Password
const forgotPassword = async (email) => {
  const response = await axios.post(API_URL + "forgot-password", { email });
  return response.data;
};

// Reset Password
const resetPassword = async (token, password) => {
  const response = await axios.put(API_URL + "reset-password/" + token, {
    password,
  });
  return response.data;
};

const authService = {
  register,
  login,
  verifyOTP,
  resendOTP,
  getBranches,
  forgotPassword,
  resetPassword,
};

export default authService;