import { Routes, Route } from "react-router-dom"; 
import Home from "./components/Home.jsx";
import ScrollToTop from "./components/ScrollToTop";
import SchedualPickUp from "./components/SchedualPickUp";
import About from "./components/About";
import Navbar from "./components/Navbar"; 

function App() {
  return (
    <>
      <Navbar />
      <ScrollToTop /> 
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/schedualpickup" element={<SchedualPickUp />} />
      </Routes>
    </>
  );
}

export default App;
