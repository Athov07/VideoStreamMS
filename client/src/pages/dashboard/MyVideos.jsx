import React, { useEffect, useState } from 'react';
import { videoService } from '../../services/video.service.js';
import VideoManager from '../dashboard/VideoManager.jsx';
import UploadModal from '../dashboard/UploadModal.jsx';
import { 
  Film, 
  Plus, 
  LayoutDashboard, 
  Loader2, 
  Search 
} from 'lucide-react';

const MyVideos = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchVideos = async () => {
    try {
      setLoading(true);
      const res = await videoService.getMyVideos();
      if (res.success) {
        // Ensure we are setting an array even if the backend returns null
        setVideos(res.data || []);
      }
    } catch (err) {
      console.error("Studio Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  // Filter videos locally
  const filteredVideos = videos.filter(v => 
    v.title?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto animate-in fade-in duration-500 min-h-screen text-surface-text">
      
      {/* 1. Header & Quick Actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-black flex items-center gap-3">
            <LayoutDashboard className="text-primary" size={32} />
            Channel Content
          </h1>
          <p className="text-surface-muted text-sm mt-1">Manage your videos and performance.</p>
        </div>
        
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-primary/25 active:scale-95"
        >
          <Plus size={20} />
          Upload Video
        </button>
      </div>

      {/* 2. Channel Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-surface border border-background-accent p-5 rounded-2xl shadow-sm">
          <p className="text-surface-muted text-xs font-bold uppercase tracking-widest">Total Uploads</p>
          <h3 className="text-2xl font-bold mt-1">{videos.length}</h3>
        </div>
        <div className="bg-surface border border-background-accent p-5 rounded-2xl shadow-sm">
          <p className="text-surface-muted text-xs font-bold uppercase tracking-widest">Total Views</p>
          <h3 className="text-2xl font-bold text-blue-500 mt-1">
            {videos.reduce((acc, curr) => acc + (curr.views || 0), 0)}
          </h3>
        </div>
        <div className="bg-surface border border-background-accent p-5 rounded-2xl shadow-sm">
          <p className="text-surface-muted text-xs font-bold uppercase tracking-widest">Premium Content</p>
          <h3 className="text-2xl font-bold text-yellow-500 mt-1">
            {videos.filter(v => v.isPremium).length}
          </h3>
        </div>
      </div>

      {/* 3. Search Bar */}
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-muted" size={18} />
        <input 
          type="text"
          placeholder="Search within your channel..."
          className="w-full bg-surface border border-background-accent py-3 pl-12 pr-4 rounded-xl text-surface-text focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* 4. Video List Container */}
      <div className="space-y-4">
        {loading ? (
          <div className="flex flex-col items-center py-20 text-surface-muted gap-4">
            <Loader2 className="animate-spin text-primary" size={40} />
            <p className="font-medium animate-pulse">Syncing your content...</p>
          </div>
        ) : filteredVideos.length > 0 ? (
          <div className="bg-surface/30 border border-background-accent rounded-2xl overflow-hidden space-y-2">
            {filteredVideos.map((v, index) => (
              <div key={v._id?.$oid || v._id} className={index !== 0 ? "border-t border-background-accent" : ""}>
                <VideoManager 
                  video={v} 
                  onUpdate={fetchVideos} 
                />
              </div>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-24 text-center bg-surface/20 rounded-3xl border-2 border-dashed border-background-accent">
            <div className="bg-background-accent/50 p-6 rounded-full mb-4">
              <Film size={48} className="text-surface-muted" />
            </div>
            <h2 className="text-xl font-bold">
              {searchQuery ? "No results found" : "Ready for your first upload?"}
            </h2>
            <p className="text-surface-muted text-sm max-w-xs mt-2 mx-auto">
              {searchQuery 
                ? "Try checking your spelling or clearing the search." 
                : "Your studio is empty! Let's get some content on your channel."}
            </p>
            {!searchQuery && (
              <button 
                onClick={() => setIsModalOpen(true)}
                className="mt-6 px-6 py-2 bg-primary/10 text-primary rounded-full font-bold hover:bg-primary/20 transition-all"
              >
                Upload Video →
              </button>
            )}
          </div>
        )}
      </div>

      {/* 5. Upload Modal Component */}
      <UploadModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={fetchVideos}
      />
    </div>
  );
};

export default MyVideos;