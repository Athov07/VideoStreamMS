import React, { useEffect, useState } from 'react';
import { adminService } from '../../services/admin.service';
import { Search, UserCog, ShieldCheck, User as UserIcon, Loader2, AlertCircle } from 'lucide-react';

const ManageUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [updatingId, setUpdatingId] = useState(null);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await adminService.getUsers();
            setUsers(res.data);
        } catch (err) {
            console.error("Failed to fetch users", err);
        } finally {
            setLoading(false);
        }
    };

    const handleRoleChange = async (userId, currentRole) => {
        const newRole = currentRole === 'admin' ? 'user' : 'admin';
        setUpdatingId(userId);
        try {
            await adminService.updateUserRole(userId, newRole);
            setUsers(users.map(u => u._id === userId ? { ...u, role: newRole } : u));
        } catch (err) {
            alert("Failed to update role");
        } finally {
            setUpdatingId(null);
        }
    };

    const filteredUsers = users.filter(user => 
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.username?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return (
        <div className="flex h-64 items-center justify-center text-primary">
            <Loader2 className="animate-spin" size={40} />
        </div>
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h1 className="text-2xl font-bold">User Management</h1>
                <div className="relative w-full md:w-72">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-muted" size={18} />
                    <input 
                        type="text" 
                        placeholder="Search by email or username..."
                        className="input-field pl-10 w-full rounded-xl bg-surface border-none"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="bg-surface rounded-2xl border border-background-accent overflow-hidden shadow-xl">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-background-secondary/50 text-surface-muted text-xs uppercase tracking-widest font-bold">
                        <tr>
                            <th className="p-4">User</th>
                            <th className="p-4">Status</th>
                            <th className="p-4">Role</th>
                            <th className="p-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-background-accent">
                        {filteredUsers.map((user) => (
                            <tr key={user._id} className="hover:bg-white/5 transition-colors">
                                <td className="p-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-background-accent flex items-center justify-center text-primary font-bold">
                                            {user.email[0].toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="font-medium text-sm">{user.username || "Pending Profile"}</p>
                                            <p className="text-xs text-surface-muted">{user.email}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-4">
                                    {user.isVerified ? (
                                        <span className="px-2 py-1 bg-green-500/10 text-green-500 text-[10px] font-bold rounded-full uppercase">Verified</span>
                                    ) : (
                                        <span className="px-2 py-1 bg-yellow-500/10 text-yellow-500 text-[10px] font-bold rounded-full uppercase">Unverified</span>
                                    )}
                                </td>
                                <td className="p-4">
                                    <div className="flex items-center gap-2">
                                        {user.role === 'admin' ? (
                                            <ShieldCheck size={16} className="text-red-500" />
                                        ) : (
                                            <UserIcon size={16} className="text-blue-500" />
                                        )}
                                        <span className={`text-sm font-semibold ${user.role === 'admin' ? 'text-red-500' : 'text-blue-500'}`}>
                                            {user.role}
                                        </span>
                                    </div>
                                </td>
                                <td className="p-4 text-right">
                                    <button 
                                        disabled={updatingId === user._id}
                                        onClick={() => handleRoleChange(user._id, user.role)}
                                        className="inline-flex items-center gap-2 px-4 py-2 bg-background-accent hover:bg-primary/20 text-surface-text hover:text-primary rounded-lg text-xs font-bold transition-all disabled:opacity-50"
                                    >
                                        {updatingId === user._id ? (
                                            <Loader2 size={14} className="animate-spin" />
                                        ) : (
                                            <UserCog size={14} />
                                        )}
                                        Change Role
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filteredUsers.length === 0 && (
                    <div className="p-20 text-center text-surface-muted flex flex-col items-center gap-3">
                        <AlertCircle size={48} className="opacity-20" />
                        <p>No users found matching your search.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ManageUsers;