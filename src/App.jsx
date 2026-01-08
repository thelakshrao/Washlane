import { Routes, Route } from "react-router-dom";
import Home from "./components/Home.jsx"
import SchedualPickUp from "./components/SchedualPickUp";
import About from "./components/About"
import Navbar from "./components/Navbar"; 

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/schedualpickup" element={<SchedualPickUp />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </>
  )
}

export default App;
