import React, { useState } from "react";
import { videoService } from "../../services/video.service.js";
import { Trash2, Edit, Save, X, Lock } from "lucide-react";

const VideoManager = ({ video, onUpdate }) => {
  if (!video) return null;

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editData, setEditData] = useState({
    title: video.title,
    description: video.description,
    isPremium: video.isPremium,
  });

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await videoService.editVideo(video._id, editData);
      if (response.success) {
        setIsEditing(false);
        onUpdate();
      }
    } catch (err) {
      alert("Update failed: " + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Permanently delete this video?")) {
      try {
        await videoService.deleteVideo(video._id);
        onUpdate();
      } catch (err) {
        alert("Delete failed.");
      }
    }
  };

  return (
    <div className="bg-surface border border-background-accent p-4 rounded-xl flex items-start gap-4 transition-all hover:border-primary/30">
      {/* Thumbnail */}
      <div className="relative flex-shrink-0">
        <img
          src={video.thumbnailUrl}
          className="w-32 aspect-video object-cover rounded-lg border border-background-accent"
          alt={video.title}
        />
        {video.isPremium && (
          <div className="absolute top-1 right-1 bg-primary p-1 rounded-md shadow-lg">
            <Lock size={12} className="text-white" />
          </div>
        )}
      </div>

      {/* Content Area */}
      <div className="flex-1 min-w-0">
        {isEditing ? (
          <form onSubmit={handleUpdate} className="flex flex-col gap-2">
            <input
              className="bg-background text-sm p-2 rounded border border-primary outline-none text-surface-text"
              value={editData.title}
              onChange={(e) => setEditData({ ...editData, title: e.target.value })}
              placeholder="Title"
              required
            />
            <textarea
              className="bg-background text-xs p-2 rounded border border-background-accent outline-none text-surface-muted resize-none h-16"
              value={editData.description}
              onChange={(e) => setEditData({ ...editData, description: e.target.value })}
              placeholder="Description"
            />
            <div className="flex items-center justify-between mt-1">
              <label className="text-[11px] text-surface-muted flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={editData.isPremium}
                  onChange={(e) => setEditData({ ...editData, isPremium: e.target.checked })}
                  className="accent-primary"
                />
                Premium Content
              </label>
              <div className="flex gap-2">
                <button 
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="p-1.5 text-surface-muted hover:text-white"
                >
                  <X size={16} />
                </button>
                <button 
                  type="submit" 
                  disabled={loading}
                  className="bg-primary text-white p-1.5 rounded-lg flex items-center gap-1 text-xs font-semibold px-3 disabled:opacity-50"
                >
                  <Save size={14} /> {loading ? "Saving..." : "Save"}
                </button>
              </div>
            </div>
          </form>
        ) : (
          <div className="h-full flex flex-col justify-center">
            <h4 className="text-surface-text font-semibold text-base truncate">
              {video.title}
            </h4>
            <p className="text-surface-muted text-xs line-clamp-2 mt-1">
              {video.description || "No description provided."}
            </p>
          </div>
        )}
      </div>

      {/* Actions */}
      {!isEditing && (
        <div className="flex flex-col gap-1">
          <button
            onClick={() => setIsEditing(true)}
            className="p-2 text-surface-muted hover:bg-background-accent hover:text-primary rounded-lg transition-colors"
          >
            <Edit size={18} />
          </button>
          <button
            onClick={handleDelete}
            className="p-2 text-surface-muted hover:bg-red-500/10 hover:text-red-500 rounded-lg transition-colors"
          >
            <Trash2 size={18} />
          </button>
        </div>
      )}
    </div>
  );
};

export default VideoManager;