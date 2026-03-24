import React, { useEffect, useState } from "react";
import { adminService } from "../../services/admin.service.js";
import {
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  Eye,
  RefreshCw,
  AlertCircle,
  Loader2,
  BarChart3,
  PlayCircle,
  Activity
} from "lucide-react";

const ManageInteractions = () => {
  const [interactionData, setInteractionData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchMergedData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const [videoRes, interactionRes] = await Promise.all([
        adminService.getAllVideos(),
        adminService.getAllVideoStats(),
      ]);

      const videos = videoRes?.data || [];
      const statsArray = interactionRes?.data || [];

      const merged = videos.map((video) => {
        const stats = Array.isArray(statsArray)
          ? statsArray.find((s) => s.videoId === video._id)
          : null;

        return {
          ...video, 
          likes: stats?.likes || 0,
          dislikes: stats?.dislikes || 0,
          totalComments: stats?.totalComments || 0,
        };
      });
      setInteractionData(merged);
    } catch (err) {
      setError("Error syncing interaction data with video records.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMergedData();
  }, []);

  const filteredData = interactionData.filter(
    (item) =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item._id.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  if (isLoading)
    return (
      <div className="flex h-64 items-center justify-center text-primary">
        <Loader2 className="animate-spin" size={40} />
      </div>
    );

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2"><Activity className="text-primary" />Interaction Management</h1>
          <p className="text-surface-muted text-xs mt-1 uppercase tracking-wider">
            Engagement metrics across all content
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative w-full md:w-72">
            <BarChart3
              className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-muted"
              size={18}
            />
            <input
              type="text"
              placeholder="Search videos..."
              className="input-field pl-10 w-full rounded-xl bg-surface border-none text-sm focus:ring-1 focus:ring-primary/30"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button
            onClick={fetchMergedData}
            className="p-2.5 bg-surface hover:bg-background-accent rounded-xl transition-all text-primary shadow-sm"
          >
            <RefreshCw size={20} />
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 flex items-center gap-3 text-sm">
          <AlertCircle size={18} /> {error}
        </div>
      )}

      {/* Table Container */}
      <div className="bg-surface rounded-2xl border border-background-accent overflow-hidden shadow-xl">
        <table className="w-full text-left border-collapse">
          <thead className="bg-background-secondary/50 text-surface-muted text-xs uppercase tracking-widest font-bold">
            <tr>
              <th className="p-4 w-24 text-center">Preview</th>
              <th className="p-4">Video Content</th>
              <th className="p-4 text-center">Views</th>
              <th className="p-4 text-center">Engagement Stats</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-background-accent">
            {filteredData.map((item) => (
              <tr key={item._id} className="hover:bg-white/5 transition-colors">
                {/* Thumbnail Column */}
                <td className="p-4">
                  <div className="relative w-24 aspect-video rounded-lg overflow-hidden bg-background-accent border border-white/10 flex items-center justify-center">
                    {item.thumbnailUrl ? (
                      <img
                        src={item.thumbnailUrl}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <PlayCircle
                        size={24}
                        className="text-surface-muted opacity-30"
                      />
                    )}
                  </div>
                </td>

                <td className="p-4">
                  <div className="flex flex-col">
                    <span className="font-semibold text-sm text-surface-text line-clamp-1">
                      {item.title}
                    </span>
                    <span className="text-[10px] text-surface-muted font-mono mt-1 uppercase tracking-tighter">
                      ID: {item._id}
                    </span>
                  </div>
                </td>

                <td className="p-4 text-center">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-500/10 text-blue-400 rounded-lg text-xs font-bold">
                    <Eye size={14} />
                    {item.views?.toLocaleString() || 0}
                  </div>
                </td>

                <td className="p-4">
                  <div className="flex items-center justify-center gap-8">
                    <div className="flex flex-col items-center">
                      <span className="text-green-500 font-bold text-base leading-none">
                        {item.likes}
                      </span>
                      <div className="flex items-center gap-1 text-[9px] text-surface-muted uppercase mt-1">
                        <ThumbsUp size={10} className="opacity-70" /> Likes
                      </div>
                    </div>

                    <div className="flex flex-col items-center">
                      <span className="text-red-500 font-bold text-base leading-none">
                        {item.dislikes}
                      </span>
                      <div className="flex items-center gap-1 text-[9px] text-surface-muted uppercase mt-1">
                        <ThumbsDown size={10} className="opacity-70" /> Dislikes
                      </div>
                    </div>

                    <div className="flex flex-col items-center">
                      <span className="text-primary font-bold text-base leading-none">
                        {item.totalComments}
                      </span>
                      <div className="flex items-center gap-1 text-[9px] text-surface-muted uppercase mt-1">
                        <MessageSquare size={10} className="opacity-70" />{" "}
                        Comments
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredData.length === 0 && (
          <div className="p-20 text-center text-surface-muted flex flex-col items-center gap-3">
            <AlertCircle size={48} className="opacity-20" />
            <p>No video content found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageInteractions;
