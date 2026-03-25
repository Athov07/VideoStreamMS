import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import navigate
import { paymentService } from '../../services/payment.service';
import { authService } from '../../services/auth.service'; // 1. Import authService
import PlanCard from '../dashboard/PlanCard';
import { BadgeIndianRupee } from "lucide-react";

const Subscription = () => {
  const [plans, setPlans] = useState([]);
  const navigate = useNavigate();

  // 2. Get the user object so it's available for prefill
  const user = authService.getCurrentUser();

  useEffect(() => {
    paymentService.getPlans().then(res => setPlans(res.data));
  }, []);

  const handlePayment = async (planId) => {
    try {
      const response = await paymentService.createOrder(planId);
      const { order, razorpay_key } = response;

      if (!razorpay_key) {
        alert("Configuration error: Razorpay key not found.");
        return;
      }

      const options = {
        key: razorpay_key,
        amount: order.amount,
        currency: order.currency,
        name: "MyStream Pro",
        description: "Premium Subscription",
        order_id: order.id,
        handler: async (response) => {
          const verifyData = {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            planId
          };

          const result = await paymentService.verifyPayment(verifyData);
          
          if (result.success) {
            alert("Payment Verified! Unlocking Premium Content...");
            // Force a hard refresh to update the DashboardLayout sidebar state
            window.location.href = "/dashboard/premium-content";
          }
        },
        prefill: {
          // This was causing the error because 'user' wasn't defined
          email: user?.email || "", 
          name: `${user?.firstName || ""} ${user?.lastName || ""}`.trim()
        },
        theme: { color: "#2563eb" }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error("Payment initiation failed", err);
      alert("Could not initiate payment. Please try again.");
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8 flex align-center gap-3"><BadgeIndianRupee className='text-primary' size={35}/>Upgrade to Premium</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map(plan => (
          <PlanCard key={plan._id} plan={plan} onBuy={handlePayment} />
        ))}
      </div>
    </div>
  );
};

export default Subscription;