import React, { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom"; 
import ScrollToTop from "./components/ScrollToTop";
import Navbar from "./components/Navbar"; 
import { Toaster } from 'react-hot-toast';
const Home = lazy(() => import("./components/Home.jsx"));
const About = lazy(() => import("./components/About"));
const SchedualPickUp = lazy(() => import("./components/SchedualPickUp"));

const PageLoader = () => (
  <div className="h-screen w-full flex items-center justify-center bg-white">
    <div className="w-10 h-10 border-4 border-teal-500 border-t-tra