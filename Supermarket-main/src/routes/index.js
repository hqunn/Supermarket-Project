import * as React from "react";
import { Routes, Route } from "react-router-dom";
import BlankLayout from "../layouts/BlankLayout";
import MainLayout from "../layouts/MainLayout";
import DetailPage from "../pages/DetailPage";
import HomePage from "../pages/HomePage";
import LoginPage from "../pages/LoginPage";
import SignUpPage from "../pages/SignUpPage";
import NotFoundPage from "../pages/NotFoundPage";
import AuthRequire from "./AuthRequire";
import CustomerProfilePage from "../pages/CustomerProfilePage";
import OrderPage from "../pages/OrderPage";
import PaymentPage from "../pages/PaymentPage";
import PaymentSuccessPage from "../pages/PaymentSuccessPage";
import PaymentPageAll from "../pages/PaymentPageAll";
import AddProductPage from "../pages/AddProductPage";
import CustomerListPage from "../pages/CustomerListPage";
import CustomerDetailsPage from "../pages/CustomerDetailsPage";

function Router() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <AuthRequire>
            <MainLayout />
          </AuthRequire>
        }
      >
        <Route index element={<HomePage />} />
        <Route path="product/:id" element={<DetailPage />} />
        <Route path="profile" element={<CustomerProfilePage />} />
        <Route path="payment" element={<PaymentPageAll />} />
        <Route path="payment/:productid" element={<PaymentPage />} />
        <Route path="/orders" element={<OrderPage />} />
        <Route
          path="payment-success/:productid"
          element={<PaymentSuccessPage />}
        />
        {/* Add new routes for product management and customer list */}
        <Route path="/add-product" element={<AddProductPage />} />
        <Route path="/customer-list" element={<CustomerListPage />} />
        <Route path="/customer-details/:id" element={<CustomerDetailsPage />} />
      </Route>

      <Route element={<BlankLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

export default Router;