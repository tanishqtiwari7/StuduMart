import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { getProducts } from "../features/products/productSlice";
import Hero from "../components/landing/Hero";
import Features from "../components/landing/Features";
import Categories from "../components/landing/Categories";
import FeaturedListings from "../components/landing/FeaturedListings";

const Landing = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getProducts());
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-slate-50">
      <Hero />
      <Features />
      <Categories />
      <FeaturedListings />
    </div>
  );
};

export default Landing;
