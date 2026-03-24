import React, { useEffect, useState } from 'react';
import { adminService } from '../../services/admin.service';
import { 
    Search, 
    UserCircle, 
    Users, 
    Edit3, 
    Loader2, 
    AlertCircle, 
    TrendingUp,
    Check
} from 'lucide-react';

const ManageProfiles = () => {
    const [profiles, setProfiles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [updatingId, setUpdatingId] = useState(null);
    const [stats, setStats] = useState({ total: 0 });

    useEffect(() => {
        fetchInitialData();
    }, []);

    const fetchInitialData = async () => {
        try {
            const [profileRes, statsRes] = await Promise.all([
                adminService.getAllProfiles(),
                adminService.getSubscriptionStats()
            ]);
            setProfiles(profileRes.data);
            setStats(statsRes);
        } catch (err) {
            console.error("Failed to fetch profile data", err);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateBio = async (profileId, currentBio) => {
        const newBio = prompt("Enter new bio:", currentBio);
        if (newBio === null || newBio === currentBio) return;

        setUpdatingId(profileId);
        try {
            await adminService.updateProfileByAdmin(profileId, { bio: newBio });
            setProfiles(profiles.map(p => p._id === profileId ? { ...p, bio: newBio } : p));
        } catch (err) {
            alert("Failed to update profile bio");
        } finally {
            setUpdatingId(null);
        }
    };

    const filteredProfiles = profiles.filter(profile => 
        profile.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        profile.userId.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return (
        <div className="flex h-64 items-center justify-center text-primary">
            <Loader2 className="animate-spin" size={40} />
        </div>
    );

    return (
        <div className="space-y-6">
            {/* Stats Overview Card */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-surface p-6 rounded-2xl border border-background-accent shadow-lg flex items-center gap-4">
                    <div className="p-3 bg-primary/10 rounded-xl text-primary">
                        <Users size={24} />
                    </div>
                    <div>
                        <p className="text-xs text-surface-muted uppercase font-bold tracking-wider">Total Profiles</p>
                        <p className="text-2xl font-bold">{profiles.length}</p>
                    </div>
                </div>
            </div>

            {/* Header & Search */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h1 className="text-2xl font-bold flex items-center gap-2">
                    <UserCircle className="text-primary" /> Profile Management
                </h1>
                <div className="relative w-full md:w-72">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-muted" size={18} />
                    <input 
                        type="text" 
                        placeholder="Search username or UserID..."
                        className="input-field pl-10 w-full rounded-xl bg-surface border-none"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Profiles Table */}
            <div className="bg-surface rounded-2xl border border-background-accent overflow-hidden shadow-xl">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-background-secondary/50 text-surface-muted text-xs uppercase tracking-widest font-bold">
                        <tr>
                            <th className="p-4">Profile</th>
                            <th className="p-4">Bio</th>
                            <th className="p-4">Subscribers</th>
                            <th className="p-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-background-accent">
                        {filteredProfiles.map((profile) => (
                            <tr key={profile._id} className="hover:bg-white/5 transition-colors">
                                <td className="p-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full overflow-hidden bg-background-accent border border-background-accent">
                                            {profile.avatar ? (
                                                <img src={profile.avatar} alt="" className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center bg-primary/20 text-primary font-bold">
                                                    {profile.username[0].toUpperCase()}
                                                </div>
                                            )}
                                        </div>
                                        <div>
                                            <p className="font-medium text-sm">@{profile.username}</p>
                                            <p className="text-[10px] text-surface-muted font-mono">{profile.userId}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-4">
                                    <p className="text-sm text-surface-muted max-w-xs truncate italic">
                                        {profile.bio || "No bio set."}
                                    </p>
                                </td>
                                <td className="p-4">
                                    <div className="flex items-center gap-2">
                                        <span className="px-2 py-1 bg-primary/10 text-primary text-xs font-bold rounded-lg">
                                            {profile.subscriberCount.toLocaleString()}
                                        </span>
                                    </div>
                                </td>
                                <td className="p-4 text-right">
                                    <button 
                                        disabled={updatingId === profile._id}
                                        onClick={() => handleUpdateBio(profile._id, profile.bio)}
                                        className="inline-flex items-center gap-2 px-3 py-1.5 bg-background-accent hover:bg-primary/20 text-surface-text hover:text-primary rounded-lg text-xs font-bold transition-all disabled:opacity-50"
                                    >
                                        {updatingId === profile._id ? (
                                            <Loader2 size={14} className="animate-spin" />
                                        ) : (
                                            <Edit3 size={14} />
                                        )}
                                        Edit Profile
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {filteredProfiles.length === 0 && (
                    <div className="p-20 text-center text-surface-muted flex flex-col items-center gap-3">
                        <AlertCircle size={48} className="opacity-20" />
                        <p>No profiles found.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ManageProfiles;