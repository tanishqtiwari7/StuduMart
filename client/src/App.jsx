import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Layout from "./components/Layout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { ToastContainer } from "react-toastify";
import Marketplace from "./pages/Marketplace";
import Events from "./pages/Events";
import ProductDetail from "./pages/ProductDetail";
import MyProfile from "./pages/MyProfile";
import SellerProfile from "./pages/SellerProfile";
import Admin from "./pages/Admin";
import SuperAdmin from "./pages/SuperAdmin";
import PrivateComponent from "./components/PrivateComponent";
import PageNotFound from "./pages/PageNotFound";
import EventDetail from "./pages/EventDetail";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Unauthorized from "./pages/Unauthorized";

import SuperAdminRoute from "./components/SuperAdminRoute";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route path="*" element={<PageNotFound />} />
          <Route path="/" element={<Landing />} />
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/marketplace/:pid" element={<ProductDetail />} />
          <Route path="/events" element={<Events />} />
          <Route path="/event/:eid" element={<EventDetail />} />
          <Route path="/profile/:id" element={<SellerProfile />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />

          {/* Private Routes for Authenticated Users */}
          <Route path="/auth" element={<PrivateComponent />}>
            <Route path="myprofile" element={<MyProfile />} />
            <Route path="admin" element={<Admin />} />
          </Route>

          {/* Super Admin Protected Route */}
          <Route path="/auth" element={<SuperAdminRoute />}>
            <Route path="superadmin" element={<SuperAdmin />} />
          </Route>
        </Route>
      </Routes>
      <ToastContainer
        position="bottom-right"
        theme="colored"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </Router>
  );
};

export default App;
