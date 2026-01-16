import React, { useState } from "react";
import { CreditCard, Smartphone, Banknote, Check } from "lucide-react";

const PaymentMethod = ({ totalAmount, onProceed }) => {
  const [method, setMethod] = useState("upi");

  return (
    <div className="animate-in fade-in duration-500">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-black text-[#061E29]">Final Payment</h2>
        <p className="text-gray-500">Amount to pay: <span className="text-[#1D546D] font-bold">₹{totalAmount}</span></p>
      </div>

      <div className="space-y-4">
        <button 
          onClick={() => setMethod("upi")}
          className={`w-full p-5 rounded-2xl border-2 flex items-center justify-between transition-all ${method === 'upi' ? 'border-[#5F9598] bg-teal-50/50' : 'border-gray-100'}`}
        >
          <div className="flex items-center gap-4">
            <Smartphone className="text-[#5F9598]" />
            <span className="font-bold text-slate-700">UPI (GPay / PhonePe / Paytm)</span>
          </div>
          {method === 'upi' && <Check size={20} className="text-[#5F9598]" />}
        </button>

        {/* cod */}
        <button 
          onClick={() => setMethod("cod")}
          className={`w-full p-5 rounded-2xl border-2 flex items-center justify-between transition-all ${method === 'cod' ? 'border-[#5F9598] bg-teal-50/50' : 'border-gray-100'}`}
        >
          <div className="flex items-center gap-4">
            <Banknote className="text-[#5F9598]" />
            <span className="font-bold text-slate-700">Cash on Delivery</span>
          </div>
          {method === 'cod' && <Check size={20} className="text-[#5F9598]" />}
        </button>
      </div>

      <button 
        onClick={() => onProceed(method)}
        className="w-full mt-10 bg-[#061E29] text-white py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-black shadow-xl transition-all"
      >
        Pay ₹{totalAmount} & Schedule Now
      </button>
    </div>
  );
};

export default PaymentMethod;