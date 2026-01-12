import React, { useState } from "react";

const WashLaneLogin = () => {
  const [showModal, setShowModal] = useState(false);
  const [step, setStep] = useState(1); // 1: Login info, 2: OTP
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState({ name: "", phone: "" });
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    // Here you would trigger the WhatsApp OTP API
    setStep(2);
  };

  const handleOtpSubmit = (e) => {
    e.preventDefault();
    // Verify OTP logic here
    setIsLoggedIn(true);
    setShowModal(false);

    // Logic to send email to you (e.g., via EmailJS)
    console.log("New Login:", user);
  };

  return (
    <div style={{ fontFamily: "Arial, sans-serif", padding: "20px" }}>
      {/* --- NAVBAR SECTION --- */}
      <nav
        style={{
          display: "flex",
          justifyContent: "flex-end",
          borderBottom: "1px solid #ddd",
          padding: "10px",
        }}
      >
        {!isLoggedIn ? (
          <button
            onClick={() => setShowModal(true)}
            style={{
              backgroundColor: "#25D366",
              color: "white",
              padding: "10px 20px",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Login
          </button>
        ) : (
          <div style={{ position: "relative" }}>
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              style={{
                background: "none",
                border: "1px solid #ccc",
                padding: "10px",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              {user.name}'s Account ▼
            </button>

            {showDropdown && (
              <div
                style={{
                  position: "absolute",
                  right: 0,
                  top: "45px",
                  backgroundColor: "white",
                  boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                  width: "200px",
                  borderRadius: "8px",
                  zIndex: 10,
                }}
              >
                <div
                  style={{ padding: "15px", borderBottom: "1px solid #eee" }}
                >
                  <div style={{ fontWeight: "bold" }}>{user.name}</div>
                  <div style={{ fontSize: "12px", color: "gray" }}>
                    {user.phone}
                  </div>
                </div>
                <div style={{ padding: "10px", cursor: "pointer" }}>
                  Saved Address
                </div>
                <div
                  style={{ padding: "10px", cursor: "pointer", color: "red" }}
                  onClick={() => setIsLoggedIn(false)}
                >
                  Logout
                </div>
              </div>
            )}
          </div>
        )}
      </nav>

      {/* --- LOGIN MODAL --- */}
      {showModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              padding: "30px",
              borderRadius: "15px",
              width: "350px",
              textAlign: "center",
            }}
          >
            <h2 style={{ margin: 0, color: "#007bff" }}>WashLane</h2>
            <p style={{ color: "#666", fontSize: "14px" }}>
              Freshness Delivered to Your Doorstep
            </p>

            {step === 1 ? (
              <form onSubmit={handleLoginSubmit}>
                <input
                  type="text"
                  placeholder="Your Name"
                  required
                  style={inputStyle}
                  onChange={(e) => setUser({ ...user, name: e.target.value })}
                />
                <input
                  type="tel"
                  placeholder="WhatsApp Number"
                  required
                  style={inputStyle}
                  onChange={(e) => setUser({ ...user, phone: e.target.value })}
                />
                <button type="submit" style={btnStyle}>
                  Send OTP
                </button>
              </form>
            ) : (
              <form onSubmit={handleOtpSubmit}>
                <p>Enter the OTP sent to {user.phone}</p>
                <input
                  type="text"
                  placeholder="6-digit OTP"
                  required
                  style={inputStyle}
                />
                <button type="submit" style={btnStyle}>
                  Verify & Login
                </button>
              </form>
            )}
            <button
              onClick={() => setShowModal(false)}
              style={{
                background: "none",
                border: "none",
                marginTop: "10px",
                color: "gray",
                cursor: "pointer",
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const inputStyle = {
  width: "100%",
  padding: "12px",
  margin: "10px 0",
  borderRadius: "5px",
  border: "1px solid #ccc",
  boxSizing: "border-box",
};
const btnStyle = {
  width: "100%",
  padding: "12px",
  backgroundColor: "#25D366",
  color: "white",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
  fontWeight: "bold",
};

export default WashLaneLogin;
