import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/admin.service';

const ManagePlans = () => {
  const [plans, setPlans] = useState([]);
  const [formData, setFormData] = useState({ name: '', price: '', durationInDays: '', description: '' });

  const fetchPlans = async () => {
    const res = await adminService.getAllPlans(); // Add this to admin.service
    setPlans(res.data);
  };

  useEffect(() => { fetchPlans(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await adminService.createPlan(formData);
    setFormData({ name: '', price: '', durationInDays: '', description: '' });
    fetchPlans();
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Subscription Plan Management</h2>
      
      {/* Create Plan Form */}
      <form onSubmit={handleSubmit} className="bg-gray-100 p-4 rounded-lg mb-8 grid grid-cols-2 gap-4">
        <input type="text" placeholder="Plan Name" className="p-2 border" 
          onChange={(e) => setFormData({...formData, name: e.target.value})} value={formData.name} required />
        <input type="number" placeholder="Price (INR)" className="p-2 border" 
          onChange={(e) => setFormData({...formData, price: e.target.value})} value={formData.price} required />
        <input type="number" placeholder="Duration (Days)" className="p-2 border" 
          onChange={(e) => setFormData({...formData, durationInDays: e.target.value})} value={formData.durationInDays} required />
        <input type="text" placeholder="Description" className="p-2 border" 
          onChange={(e) => setFormData({...formData, description: e.target.value})} value={formData.description} />
        <button className="bg-green-600 text-white p-2 rounded col-span-2">Create Plan</button>
      </form>

      {/* Plans List */}
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b bg-gray-50">
            <th className="p-3">Name</th>
            <th className="p-3">Price</th>
            <th className="p-3">Duration</th>
            <th className="p-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {plans.map(plan => (
            <tr key={plan._id} className="border-b">
              <td className="p-3">{plan.name}</td>
              <td className="p-3">₹{plan.price}</td>
              <td className="p-3">{plan.durationInDays} Days</td>
              <td className="p-3">
                <button onClick={() => adminService.deletePlan(plan._id).then(fetchPlans)} 
                  className="text-red-500 hover:underline">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManagePlans;