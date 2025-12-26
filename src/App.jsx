import { Routes, Route } from "react-router-dom";
import Home from "./components/Home"
import SchedualPickUp from "./components/SchedualPickUp";
import Navbar from "./components/Navbar"; 

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/schedualpickup" element={<SchedualPickUp />} />
      </Routes>
    </>
  )
}

export default App;
