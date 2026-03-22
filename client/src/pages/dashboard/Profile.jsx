import React, { useState, useEffect } from "react";
import { profileService } from "../../services/profile.service";
import { User, Camera, Save, Edit2, Trash2, X, Loader2, AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [updating, setUpdating] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await profileService.getMyProfile();
      setProfile(res.data);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setUpdating(true);
    const formData = new FormData(e.target);
    try {
      const res = await profileService.updateProfile(formData);
      if (res.success) {
        setProfile(res.data);
        setIsEditing(false); // Close form on success
      }
    } catch (err) {
      alert("Update failed");
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm("WARNING: This will permanently delete your profile and all data. This action cannot be undone. Proceed?");
    if (confirmDelete) {
      try {
        await profileService.deleteProfile();
        localStorage.clear(); // Clear tokens
        navigate("/login");
      } catch (err) {
        alert("Delete failed.");
      }
    }
  };

  if (loading) return <div className="p-10 text-surface-muted flex items-center gap-2"><Loader2 className="animate-spin"/> Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      
      {/* 1. VIEW MODE: Profile Header Card */}
      {!isEditing ? (
        <div className="bg-surface border border-background-accent p-8 rounded-3xl flex flex-col md:flex-row items-center gap-8 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-primary"></div>
          
          <img 
            src={profile?.avatar || "/default-avatar.png"} 
            className="w-32 h-32 rounded-full object-cover border-4 border-background-accent shadow-2xl"
            alt="Avatar"
          />
          
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl font-black text-surface-text mb-2">{profile?.username}</h1>
            <p className="text-surface-muted text-lg leading-relaxed max-w-xl">
              {profile?.bio || "No bio description provided yet."}
            </p>
            <div className="mt-4 flex items-center justify-center md:justify-start gap-4 text-sm text-surface-muted">
               <span className="bg-background-accent px-3 py-1 rounded-full">Member since 2026</span>
            </div>
          </div>

          <button 
            onClick={() => setIsEditing(true)}
            className="btn-next flex items-center gap-2 px-8"
          >
            <Edit2 size={18} /> Edit Profile
          </button>
        </div>
      ) : (
        /* 2. EDIT MODE: The Form */
        <form onSubmit={handleUpdate} className="bg-surface border border-primary/30 p-8 rounded-3xl shadow-2xl animate-in fade-in zoom-in duration-200">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold text-surface-text flex items-center gap-2">
              <User className="text-primary" /> Edit Your Channel
            </h2>
            <button 
              type="button" 
              onClick={() => setIsEditing(false)}
              className="p-2 text-surface-muted hover:text-white transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          <div className="space-y-6">
            <div className="flex flex-col items-center gap-4 p-4 bg-background/50 rounded-2xl border border-dashed border-background-accent">
               <img src={profile?.avatar} className="w-20 h-20 rounded-full object-cover opacity-50" />
               <label className="bg-primary/10 text-primary hover:bg-primary/20 px-4 py-2 rounded-lg cursor-pointer transition-all text-sm font-bold flex items-center gap-2">
                  <Camera size={16} /> Upload New Photo
                  <input type="file" name="avatar" className="hidden" accept="image/*" />
               </label>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-surface-muted uppercase">Username</label>
              <input name="username" defaultValue={profile?.username} className="input-field" required />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-surface-muted uppercase">Bio</label>
              <textarea name="bio" defaultValue={profile?.bio} className="w-full bg-background border border-background-accent p-4 rounded-xl text-surface-text h-32 focus:border-primary outline-none transition-all resize-none" />
            </div>

            <div className="flex gap-4 pt-4">
              <button disabled={updating} type="submit" className="btn-next flex-1 flex items-center justify-center gap-2">
                {updating ? <Loader2 className="animate-spin" size={18}/> : <Save size={18} />}
                {updating ? "Saving..." : "Save Changes"}
              </button>
              <button 
                type="button" 
                onClick={() => setIsEditing(false)}
                className="flex-1 bg-background-accent text-surface-text font-medium py-2 px-6 rounded-full hover:bg-zinc-700 transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      )}

      {/* 3. DANGER ZONE: Delete Account (Always Visible or inside Edit) */}
      <div className="bg-red-500/5 border border-red-500/20 p-6 rounded-3xl">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-red-500 font-bold flex items-center gap-2">
              <AlertTriangle size={18} /> Danger Zone
            </h3>
            <p className="text-surface-muted text-xs mt-1">Once you delete your account, there is no going back. Please be certain.</p>
          </div>
          <button 
            onClick={handleDelete}
            className="flex items-center gap-2 text-red-500 hover:bg-red-500 hover:text-white px-4 py-2 rounded-xl border border-red-500/30 transition-all text-sm font-bold"
          >
            <Trash2 size={16} /> Delete Account
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;