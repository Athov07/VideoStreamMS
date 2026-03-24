import React, { useEffect, useState } from 'react';
import { adminService } from '../../services/admin.service';
import { 
    Search, 
    Film, 
    Trash2, 
    Star, 
    Eye, 
    Loader2, 
    AlertCircle, 
    ShieldAlert,
    ExternalLink
} from 'lucide-react';

const AdminContent = () => {
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [actionId, setActionId] = useState(null);

    useEffect(() => {
        fetchVideos();
    }, []);

    const fetchVideos = async () => {
        try {
            const res = await adminService.getAllVideos();
            setVideos(res.data);
        } catch (err) {
            console.error("Failed to fetch videos", err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (videoId) => {
        if (!window.confirm("Are you sure you want to delete this video? This cannot be undone.")) return;
        
        setActionId(videoId);
        try {
            await adminService.deleteVideo(videoId);
            setVideos(videos.filter(v => v._id !== videoId));
        } catch (err) {
            alert("Failed to delete video");
        } finally {
            setActionId(null);
        }
    };

    const handlePremiumToggle = async (videoId) => {
        setActionId(videoId);
        try {
            const res = await adminService.togglePremium(videoId);
            setVideos(videos.map(v => v._id === videoId ? { ...v, isPremium: res.data.isPremium } : v));
        } catch (err) {
            alert("Failed to update status");
        } finally {
            setActionId(null);
        }
    };

    const filteredVideos = videos.filter(video => 
        video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        video.owner.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return (
        <div className="flex h-64 items-center justify-center text-primary">
            <Loader2 className="animate-spin" size={40} />
        </div>
    );

    return (
        <div className="space-y-6">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h1 className="text-2xl font-bold flex items-center gap-2">
                    <Film className="text-primary" /> Video Moderation
                </h1>
                <div className="relative w-full md:w-72">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-muted" size={18} />
                    <input 
                        type="text" 
                        placeholder="Search by title or owner ID..."
                        className="input-field pl-10 w-full rounded-xl bg-surface border-none focus:ring-2 focus:ring-primary/50 transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Content Table */}
            <div className="bg-surface rounded-2xl border border-background-accent overflow-hidden shadow-xl">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-background-secondary/50 text-surface-muted text-xs uppercase tracking-widest font-bold">
                        <tr>
                            <th className="p-4">Video Info</th>
                            <th className="p-4">Owner ID</th>
                            <th className="p-4">Views</th>
                            <th className="p-4">Type</th>
                            <th className="p-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-background-accent">
                        {filteredVideos.map((video) => (
                            <tr key={video._id} className="hover:bg-white/5 transition-colors">
                                <td className="p-4">
                                    <div className="flex items-center gap-4">
                                        <div className="relative w-24 h-14 rounded-lg overflow-hidden bg-background-accent flex-shrink-0">
                                            <img 
                                                src={video.thumbnailUrl} 
                                                alt="" 
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div className="max-w-[200px]">
                                            <p className="font-medium text-sm truncate">{video.title}</p>
                                            <p className="text-[10px] text-surface-muted font-mono truncate">{video._id}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-4">
                                    <div className="flex items-center gap-2 text-surface-muted">
                                        <span className="text-xs font-mono bg-background-accent px-2 py-1 rounded">
                                            {video.owner.substring(0, 8)}...
                                        </span>
                                    </div>
                                </td>
                                <td className="p-4">
                                    <div className="flex items-center gap-1.5 text-sm text-surface-text">
                                        <Eye size={14} className="text-surface-muted" />
                                        {video.views.toLocaleString()}
                                    </div>
                                </td>
                                <td className="p-4">
                                    {video.isPremium ? (
                                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-500/10 text-yellow-500 text-[10px] font-bold rounded-full uppercase">
                                            <Star size={10} className="fill-yellow-500" /> Premium
                                        </span>
                                    ) : (
                                        <span className="px-2 py-1 bg-blue-500/10 text-blue-500 text-[10px] font-bold rounded-full uppercase">Free</span>
                                    )}
                                </td>
                                <td className="p-4 text-right">
                                    <div className="flex justify-end gap-2">
                                        <button 
                                            disabled={actionId === video._id}
                                            onClick={() => handlePremiumToggle(video._id)}
                                            className="p-2 bg-background-accent hover:bg-yellow-500/20 text-surface-text hover:text-yellow-500 rounded-lg transition-all disabled:opacity-50"
                                            title="Toggle Premium Status"
                                        >
                                            {actionId === video._id ? <Loader2 size={16} className="animate-spin" /> : <Star size={16} />}
                                        </button>
                                        <button 
                                            disabled={actionId === video._id}
                                            onClick={() => handleDelete(video._id)}
                                            className="p-2 bg-background-accent hover:bg-red-500/20 text-surface-text hover:text-red-500 rounded-lg transition-all disabled:opacity-50"
                                            title="Delete Video"
                                        >
                                            {actionId === video._id ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Empty State */}
                {filteredVideos.length === 0 && (
                    <div className="p-20 text-center text-surface-muted flex flex-col items-center gap-3">
                        <ShieldAlert size={48} className="opacity-20" />
                        <p>No videos found matching your search criteria.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminContent;