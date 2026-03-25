import React from 'react';

const PlanCard = ({ plan, onBuy }) => {
  return (
    <div className="border rounded-lg p-6 shadow-md bg-white flex flex-col items-center">
      <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
      <p className="text-gray-600 mb-4 text-center">{plan.description}</p>
      <div className="text-3xl font-bold mb-4">₹{plan.price}</div>
      <p className="text-sm text-gray-500 mb-6 underline">Valid for {plan.durationInDays} days</p>
      <button 
        onClick={() => onBuy(plan._id)}
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
      >
        Buy Now
      </button>
    </div>
  );
};

export default PlanCard;