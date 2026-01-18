import React, { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import Navbar from "./components/Navbar";
import { Toaster } from "react-hot-toast";

const Home = lazy(() => import("./components/Home.jsx"));
const About = lazy(() => import("./components/About"));
const SchedualPickUp = lazy(() => import("./components/SchedualPickUp"));
const AdminDashboard = lazy(() => import("./components/AdminDashboard"));

const PageLoader = () => (
  <div className="h-screen w-full flex items-center justify-center bg-white">
    <div className="w-10 h-10 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
  </div>
);

function App() {
  const isAdmin = localStorage.getItem("userRole") === "admin";

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: { borderRadius: "12px", background: "#061E29", color: "#fff" },
        }}
      />

      <Navbar />
      <ScrollToTop />

      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/schedualpickup" element={<SchedualPickUp />} />

          <Route
            path="/admin-portal-washlane"
            element={isAdmin ? <AdminDashboard /> : <Navigate to="/" />}
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Suspense>
    </>
  );
}

export default App;
