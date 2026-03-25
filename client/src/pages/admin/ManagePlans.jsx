import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/admin.service';
import { 
  Plus, 
  Trash2, 
  IndianRupee, 
  Calendar, 
  Layers, 
  Info, 
  Loader2, 
  LayoutGrid,
  AlertCircle,
  Edit3,
  X
} from 'lucide-react';

const ManagePlans = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState(null); // Track which plan is being edited
  const [formData, setFormData] = useState({ name: '', price: '', durationInDays: '', description: '' });

  const fetchPlans = async () => {
    try {
      setLoading(true);
      const res = await adminService.getAllPlans();
      // res.data contains the array of plans
      setPlans(res.data);
    } catch (err) {
      console.error("Failed to fetch plans", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPlans(); }, []);

  // Pre-fill form for editing
  const startEdit = (plan) => {
    setEditingId(plan._id);
    setFormData({
      name: plan.name,
      price: plan.price,
      durationInDays: plan.durationInDays,
      description: plan.description || ''
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setFormData({ name: '', price: '', durationInDays: '', description: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (editingId) {
        // Call update API
        await adminService.updatePlan(editingId, formData);
      } else {
        // Call create API
        await adminService.createPlan(formData);
      }
      cancelEdit();
      fetchPlans();
    } catch (err) {
      alert(editingId ? "Update failed" : "Creation failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to deactivate this plan? It will no longer be visible to users.")) {
      try {
        await adminService.deletePlan(id);
        fetchPlans();
      } catch (err) {
        alert("Delete failed");
      }
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-background-accent pb-6">
        <div>
          <h2 className="text-3xl font-black text-surface-text tracking-tight flex items-center gap-3">
            <LayoutGrid className="text-primary" size={32} />
            Subscription Engine
          </h2>
          <p className="text-surface-muted text-sm mt-1">Configure monetization tiers and access durations</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* --- 1. Form (Create or Edit) --- */}
        <div className="lg:col-span-1">
          <form onSubmit={handleSubmit} className={`bg-surface border ${editingId ? 'border-primary/50' : 'border-background-accent'} p-6 rounded-3xl shadow-xl transition-all duration-300 sticky top-6`}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-surface-text flex items-center gap-2">
                {editingId ? <Edit3 size={20} className="text-primary" /> : <Plus size={20} className="text-primary" />}
                {editingId ? "Edit Subscription" : "New Subscription"}
              </h3>
              {editingId && (
                <button type="button" onClick={cancelEdit} className="text-surface-muted hover:text-white transition-colors">
                  <X size={18} />
                </button>
              )}
            </div>
            
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-surface-muted uppercase">Plan Identity</label>
                <div className="relative">
                  <Layers className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-muted" size={16} />
                  <input 
                    className="input-field pl-10" 
                    placeholder="Plan Name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required 
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-surface-muted uppercase">Price (₹)</label>
                  <div className="relative">
                    <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-muted" size={16} />
                    <input 
                      type="number"
                      className="input-field pl-10" 
                      placeholder="0"
                      value={formData.price}
                      onChange={(e) => setFormData({...formData, price: e.target.value})}
                      required 
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-surface-muted uppercase">Validity</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-muted" size={16} />
                    <input 
                      type="number"
                      className="input-field pl-10" 
                      placeholder="Days"
                      value={formData.durationInDays}
                      onChange={(e) => setFormData({...formData, durationInDays: e.target.value})}
                      required 
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-surface-muted uppercase">Description</label>
                <div className="relative">
                  <Info className="absolute left-3 top-3 text-surface-muted" size={16} />
                  <textarea 
                    className="w-full bg-background border border-background-accent p-3 pl-10 rounded-xl text-surface-text h-24 focus:border-primary outline-none transition-all resize-none text-sm"
                    placeholder="What do users get?"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                  />
                </div>
              </div>

              <button 
                disabled={isSubmitting}
                className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-all shadow-lg active:scale-95 ${
                  editingId ? 'bg-primary text-white shadow-primary/20' : 'bg-white text-black hover:bg-zinc-200'
                }`}
              >
                {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : (editingId ? <Edit3 size={18} /> : <Plus size={18} />)}
                {isSubmitting ? "Syncing..." : (editingId ? "Save Changes" : "Deploy Plan")}
              </button>
            </div>
          </form>
        </div>

        {/* --- 2. Live Tiers List --- */}
        <div className="lg:col-span-2">
          <div className="bg-surface border border-background-accent rounded-3xl shadow-xl overflow-hidden">
            {loading && plans.length === 0 ? (
              <div className="p-20 flex flex-col items-center justify-center gap-4">
                <Loader2 className="animate-spin text-primary" size={32} />
              </div>
            ) : plans.length === 0 ? (
              <div className="p-20 text-center">
                <AlertCircle size={48} className="mx-auto text-surface-muted/20 mb-4" />
                <p className="text-surface-muted">No active plans available.</p>
              </div>
            ) : (
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-background-accent/20 text-[10px] font-black uppercase tracking-[0.2em] text-surface-muted border-b border-background-accent">
                    <th className="p-5">Tier</th>
                    <th className="p-5">Cost</th>
                    <th className="p-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-background-accent/50">
                  {plans.map(plan => (
                    <tr key={plan._id} className={`group transition-colors ${editingId === plan._id ? 'bg-primary/5' : 'hover:bg-background-accent/10'}`}>
                      <td className="p-5">
                        <div className="font-bold text-surface-text flex items-center gap-2">
                          {plan.name}
                          {editingId === plan._id && <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>}
                        </div>
                        <div className="text-[10px] text-surface-muted">{plan.durationInDays} Days Validity</div>
                      </td>
                      <td className="p-5 font-black text-surface-text italic">₹{plan.price}</td>
                      <td className="p-5 text-right space-x-2">
                        <button 
                          onClick={() => startEdit(plan)}
                          className="p-2 text-surface-muted hover:text-primary hover:bg-primary/10 rounded-lg transition-all"
                          title="Edit Plan"
                        >
                          <Edit3 size={18} />
                        </button>
                        <button 
                          onClick={() => handleDelete(plan._id)}
                          className="p-2 text-surface-muted hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                          title="Deactivate Plan"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default ManagePlans;