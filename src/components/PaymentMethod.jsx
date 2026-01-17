import React, { useState } from "react";
import { Smartphone, Banknote, Check } from "lucide-react";

const PaymentMethod = ({ totalAmount, onProceed }) => {
  const [method, setMethod] = useState("upi"); 

  return (
    <div className="animate-in fade-in duration-500">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-black text-[#061E29]">Final Payment</h2>
        <p className="text-gray-500">
          Amount to pay:{" "}
          <span className="text-[#1D546D] font-bold">₹{totalAmount}</span>
        </p>
      </div>

      <div className="space-y-4">
        <button
          onClick={() => {
            setMethod("UPI");
            onProceed("UPI"); 
          }}
          className={`w-full p-5 rounded-2xl border-2 flex items-center justify-between transition-all ${
            method === "UPI"
              ? "border-[#5F9598] bg-teal-50/50"
              : "border-gray-100"
          }`}
        >
          <div className="flex items-center gap-4">
            <Smartphone className="text-[#5F9598]" />
            <span className="font-bold text-slate-700">
              UPI (GPay / PhonePe / Paytm)
            </span>
          </div>
          {method === "UPI" && <Check size={20} className="text-[#5F9598]" />}
        </button>

        <button
          onClick={() => {
            setMethod("COD");
            onProceed("COD"); 
          }}
          className={`w-full p-5 rounded-2xl border-2 flex items-center justify-between transition-all ${
            method === "COD"
              ? "border-[#5F9598] bg-teal-50/50"
              : "border-gray-100"
          }`}
        >
          <div className="flex items-center gap-4">
            <Banknote className="text-[#5F9598]" />
            <span className="font-bold text-slate-700">Cash on Delivery</span>
          </div>
          {method === "COD" && <Check size={20} className="text-[#5F9598]" />}
        </button>
      </div>
    </div>
  );
};

export default PaymentMethod;
