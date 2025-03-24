
import React, { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";

import MainLayout from "./layouts/MainLayout";
import ScrollToTop from "./components/ScrollToTop";

const Index = lazy(() => import("./pages/Index"));
const ProductPage = lazy(() => import("./pages/ProductPage"));
const CategoryPage = lazy(() => import("./pages/CategoryPage"));
const SearchResultsPage = lazy(() => import("./pages/SearchResultsPage"));
const CartPage = lazy(() => import("./pages/CartPage"));
const CheckoutPage = lazy(() => import("./pages/CheckoutPage"));
const PaymentSuccessPage = lazy(() => import("./pages/PaymentSuccessPage"));
const NotFound = lazy(() => import("./pages/NotFound"));
const HowItWorksPage = lazy(() => import("./pages/HowItWorksPage"));
const AccountPage = lazy(() => import("./pages/AccountPage"));
const AddressFormPage = lazy(() => import("./pages/AddressFormPage"));
const ChangePasswordPage = lazy(() => import("./pages/ChangePasswordPage"));

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Suspense fallback={<div>Chargement...</div>}>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Index />} />
            <Route path="product/:productId" element={<ProductPage />} />
            <Route path="category/:categoryId" element={<CategoryPage />} />
            <Route path="search" element={<SearchResultsPage />} />
            <Route path="cart" element={<CartPage />} />
            <Route path="checkout" element={<CheckoutPage />} />
            <Route path="payment/success" element={<PaymentSuccessPage />} />
            <Route path="how-it-works" element={<HowItWorksPage />} />
            <Route path="account" element={<AccountPage />} />
            <Route path="account/address" element={<AddressFormPage />} />
            <Route path="account/change-password" element={<ChangePasswordPage />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </Suspense>
      <Toaster />
    </BrowserRouter>
  );
}

export default App;
