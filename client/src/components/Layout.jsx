import { Outlet, useLocation } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

const Layout = () => {
  const location = useLocation();

  // Define paths where Header/Footer should be hidden
  const hideLayoutPaths = ["/login", "/register", "/forgot-password"];
  const isAuthPage =
    hideLayoutPaths.includes(location.pathname) ||
    location.pathname.startsWith("/reset-password");

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      {!isAuthPage && <Header />}
      <main className="flex-grow">
        <Outlet />
      </main>
      {!isAuthPage && location.pathname === "/" && <Footer />}
    </div>
  );
};

export default Layout;
