import axios from "axios";

const API_URL = "/api/superadmin/";

// Get System Stats
const getStats = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.get(API_URL + "stats", config);
  return response.data;
};

// ==================== BRANCHES ====================

const getAllBranches = async (token) => {
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };
  const response = await axios.get(API_URL + "branches", config);
  return response.data;
};

const createBranch = async (branchData, token) => {
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };
  const response = await axios.post(API_URL + "branches", branchData, config);
  return response.data;
};

const updateBranch = async (id, branchData, token) => {
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };
  const response = await axios.put(
    API_URL + "branches/" + id,
    branchData,
    config
  );
  return response.data;
};

const deleteBranch = async (id, token) => {
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };
  const response = await axios.delete(API_URL + "branches/" + id, config);
  return response.data;
};

// ==================== CLUBS ====================

const getAllClubs = async (token) => {
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };
  const response = await axios.get(API_URL + "clubs", config);
  return response.data;
};

const createClub = async (clubData, token) => {
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };
  const response = await axios.post(API_URL + "clubs", clubData, config);
  return response.data;
};

const updateClub = async (id, clubData, token) => {
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };
  const response = await axios.put(API_URL + "clubs/" + id, clubData, config);
  return response.data;
};

const deleteClub = async (id, token) => {
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };
  const response = await axios.delete(API_URL + "clubs/" + id, config);
  return response.data;
};

// ==================== ADMINS ====================

const getAllAdmins = async (token) => {
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };
  const response = await axios.get(API_URL + "admins", config);
  return response.data;
};

const createAdmin = async (adminData, token) => {
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };
  const response = await axios.post(API_URL + "admins", adminData, config);
  return response.data;
};

const updateAdmin = async (id, adminData, token) => {
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };
  const response = await axios.put(API_URL + "admins/" + id, adminData, config);
  return response.data;
};

const deleteAdmin = async (id, token) => {
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };
  const response = await axios.delete(API_URL + "admins/" + id, config);
  return response.data;
};

const deactivateAdmin = async (id, token) => {
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };
  const response = await axios.put(
    API_URL + "admins/" + id + "/deactivate",
    {},
    config
  );
  return response.data;
};

const reactivateAdmin = async (id, token) => {
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };
  const response = await axios.put(
    API_URL + "admins/" + id + "/reactivate",
    {},
    config
  );
  return response.data;
};

const superAdminService = {
  getStats,
  getAllBranches,
  createBranch,
  updateBranch,
  deleteBranch,
  getAllClubs,
  createClub,
  updateClub,
  deleteClub,
  getAllAdmins,
  createAdmin,
  updateAdmin,
  deleteAdmin,
  deactivateAdmin,
  reactivateAdmin,
};

export default superAdminService;
