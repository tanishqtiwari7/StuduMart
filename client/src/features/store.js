import { configureStore } from "@reduxjs/toolkit";
import auth from "./auth/authSlice";
import admin from "./admin/adminSlice";
import products from "./products/productSlice";
import events from "./events/eventsSlice";
import comments from "./comments/commentsSlice";
import message from "./messages/messageSlice";
import superadmin from "./superadmin/superAdminSlice";
import payment from "./payments/paymentSlice";
import category from "./categories/categorySlice";

const store = configureStore({
  reducer: {
    auth,
    admin,
    products,
    events,
    comments,
    message,
    superadmin,
    payment,
    category,
  },
});

export default store;
