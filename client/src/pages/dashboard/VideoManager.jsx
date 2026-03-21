import React, { useState } from 'react';
import { videoService } from '../../services/video.service.js';
import { Trash2, Edit, UploadCloud } from 'lucide-react'; 

const VideoManager = ({ video, onUpdate }) => {
  if (!video) return null;
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ title: video.title, description: video.description });
  const [loading, setLoading] = useState(false);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Logic for editing metadata (and optionally a new file)
      const response = await videoService.editVideo(video._id, editData);
      if (response.success) {
        setIsEditing(false);
        onUpdate(); // Refresh the list
      }
    } catch (err) {
      alert("Update failed");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this video?")) {
      await videoService.deleteVideo(video._id);
      onUpdate();
    }
  };

  return (
    <div className="bg-surface border border-background-accent p-4 rounded-lg flex items-center gap-4">
      <img src={video.thumbnailUrl} className="w-24 aspect-video object-cover rounded" alt="" />
      
      <div className="flex-1">
        {isEditing ? (
          <form onSubmit={handleUpdate} className="flex flex-col gap-2">
            <input 
              className="bg-background text-sm p-1 rounded border border-primary"
              value={editData.title}
              onChange={(e) => setEditData({...editData, title: e.target.value})}
            />
            <button className="text-[10px] bg-primary px-2 py-1 rounded w-fit">Save</button>
          </form>
        ) : (
          <>
            <h4 className="text-surface-text font-medium text-sm">{video.title}</h4>
            <p className="text-surface-muted text-xs line-clamp-1">{video.description}</p>
          </>
        )}
      </div>

      <div className="flex gap-2">
        <button onClick={() => setIsEditing(!isEditing)} className="p-2 hover:bg-background-accent rounded">
          <Edit size={16} className="text-surface-muted" />
        </button>
        <button onClick={handleDelete} className="p-2 hover:bg-red-500/10 rounded">
          <Trash2 size={16} className="text-red-500" />
        </button>
      </div>
    </div>
  );
};

export default VideoManager;