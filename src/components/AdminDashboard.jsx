import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import {
  collectionGroup,
  query,
  getDocs,
  doc,
  updateDoc,
  orderBy,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import {
  CheckCircle,
  Circle,
  MessageCircle,
  Package,
  IndianRupee,
  MapPin,
  Phone,
  History,
} from "lucide-react";
import toast from "react-hot-toast";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("pending");

  const ADMIN_EMAIL = "raolaksh6@gmail.com";
  const steps = [
    "Order Confirmed",
    "Pickup Scheduled",
    "Cleaning Process",
    "Ready for Delivery",
    "Order Delivered",
  ];

  useEffect(() => {
    const adminName = localStorage.getItem("userName") || "Admin";
    toast.success(`Welcome back, ${adminName}!`, {
      icon: "👤",
      style: {
        borderRadius: "16px",
        background: "#061E29",
        color: "#fff",
      },
    });
  }, []);

  useEffect(() => {
    const userEmail = localStorage.getItem("userEmail");
    if (userEmail !== ADMIN_EMAIL) {
      toast.error("Unauthorized Access");
      navigate("/");
    } else {
      fetchGlobalOrders();
    }
  }, []);

  const fetchGlobalOrders = async () => {
    setLoading(true);
    try {
      const q = query(
        collectionGroup(db, "userOrders"),
        orderBy("createdAt", "desc"),
      );
      const querySnapshot = await getDocs(q);
      const allOrders = querySnapshot.docs.map((doc) => ({
        docId: doc.id,
        parentPath: doc.ref.path,
        ...doc.data(),
      }));
      setOrders(allOrders);

      const storedName = localStorage.getItem("userName") || "Admin";

      if (!sessionStorage.getItem("adminWelcomed")) {
        toast.success(`Welcome Back, ${storedName}`, { icon: "👋" });
        sessionStorage.setItem("adminWelcomed", "true");
      }
    } catch (error) {
      console.error("Firebase Error:", error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (order, nextStatus) => {
    try {
      const orderRef = doc(db, order.parentPath);
      await updateDoc(orderRef, { status: nextStatus });
      toast.success(`Updated: ${nextStatus}`);
      fetchGlobalOrders();
    } catch (e) {
      toast.error("Update failed");
    }
  };

  const filteredOrders = orders.filter((o) =>
    filter === "completed"
      ? o.status === "Order Delivered"
      : o.status !== "Order Delivered",
  );

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center bg-white">
        <div className="w-10 h-10 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );

  return (
    <div className="min-h-screen bg-[#F8FAFC] pt-28 pb-20 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-4">
          <div>
            <h1 className="text-4xl font-black text-[#061E29]">
              Command Center
            </h1>
            <p className="text-gray-400 font-bold text-[10px] uppercase tracking-[0.3em] mt-2">
              Manage All Washlane Orders
            </p>
          </div>

          <div className="flex bg-white p-1.5 rounded-2xl shadow-sm border border-gray-100">
            <button
              onClick={() => setFilter("pending")}
              className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${filter === "pending" ? "bg-[#061E29] text-white shadow-lg" : "text-gray-400"}`}
            >
              Active
            </button>
            <button
              onClick={() => setFilter("completed")}
              className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${filter === "completed" ? "bg-[#061E29] text-white shadow-lg" : "text-gray-400"}`}
            >
              History
            </button>
          </div>
        </div>

        <div className="grid gap-6">
          {filteredOrders.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-4xl border-2 border-dashed border-gray-100">
              <History size={48} className="mx-auto text-gray-200 mb-4" />
              <p className="text-gray-400 font-bold uppercase text-[10px]">
                No orders found in {filter}
              </p>
            </div>
          ) : (
            filteredOrders.map((order) => (
              <div
                key={order.orderId}
                className="bg-white rounded-4xl p-6 md:p-8 border border-gray-100 shadow-sm animate-in fade-in duration-500"
              >
                <div className="flex flex-col lg:flex-row gap-8">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="bg-teal-50 text-teal-600 px-3 py-1 rounded-lg text-[10px] font-black uppercase">
                        {order.orderId}
                      </span>
                      <span
                        className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase ${order.paymentMethod === "UPI" ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"}`}
                      >
                        {order.paymentMethod}{" "}
                        {order.paymentMethod === "UPI" ? "• PAID" : "• COD"}
                      </span>
                    </div>

                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <h2 className="text-2xl font-black text-[#061E29]">
                          {order.customerName}
                        </h2>
                        <div className="space-y-1 mt-2">
                          <p className="text-sm font-bold text-gray-500 flex items-center gap-2 truncate max-w-sm">
                            <MapPin
                              size={14}
                              className="text-teal-500 shrink-0"
                            />{" "}
                            {order.address}
                          </p>
                          <p className="text-sm font-bold text-gray-500 flex items-center gap-2">
                            <Phone
                              size={14}
                              className="text-teal-500 shrink-0"
                            />{" "}
                            {order.phone}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <a
                          href={`https://wa.me/91${order.phone}`}
                          target="_blank"
                          rel="noreferrer"
                          className="w-12 h-12 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center hover:bg-green-600 hover:text-white transition-all shadow-sm"
                        >
                          <MessageCircle size={22} />
                        </a>
                      </div>
                    </div>

                    <div className="bg-gray-50/80 rounded-2xl p-4">
                      <p className="text-[9px] font-black text-gray-400 uppercase mb-3 tracking-widest">
                        Order Summary
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {Object.entries(order.items || {}).map(
                          ([category, details]) =>
                            Object.entries(details).map(([name, qty]) => (
                              <div
                                key={name}
                                className="bg-white border border-gray-100 px-3 py-1.5 rounded-xl flex items-center gap-2 shadow-sm"
                              >
                                <span className="text-[11px] font-bold text-[#061E29]">
                                  {name}
                                </span>
                                <span className="text-[11px] font-black text-teal-600">
                                  x{qty}
                                </span>
                              </div>
                            )),
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="lg:w-87.5 border-t lg:border-t-0 lg:border-l border-gray-100 pt-8 lg:pt-0 lg:pl-8 flex flex-col justify-center">
                    <p className="text-[10px] font-black text-gray-400 uppercase mb-8 text-center tracking-widest">
                      Update Tracking Step
                    </p>
                    <div className="flex justify-between relative px-2">
                      <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-50 -translate-y-1/2 z-0"></div>
                      {steps.map((step, idx) => {
                        const isPast = steps.indexOf(order.status) > idx;
                        const isCurrent = order.status === step;
                        return (
                          <button
                            key={step}
                            onClick={() => updateStatus(order, step)}
                            className="relative z-10 group"
                            title={step}
                          >
                            <div
                              className={`w-10 h-10 rounded-full flex items-center justify-center border-4 transition-all ${isPast ? "bg-teal-500 border-white text-white shadow-md" : isCurrent ? "bg-[#061E29] border-white text-white scale-125 shadow-xl" : "bg-white border-gray-50 text-gray-200"}`}
                            >
                              {isPast ? (
                                <CheckCircle size={16} />
                              ) : (
                                <Circle
                                  size={14}
                                  fill={isCurrent ? "white" : "none"}
                                />
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                    <div className="mt-10 bg-teal-50 py-3 rounded-2xl border border-teal-100">
                      <p className="text-center text-[10px] font-black text-teal-600 uppercase tracking-widest italic">
                        {order.status}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
