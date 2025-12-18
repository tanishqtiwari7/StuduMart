import axios from "axios";

const API_URL = "/api/categories/";

// Get all categories
const getCategories = async (type) => {
  const response = await axios.get(API_URL + (type ? `?type=${type}` : ""));
  return response.data;
};

const categoryService = {
  getCategories,
};

export default categoryService;
