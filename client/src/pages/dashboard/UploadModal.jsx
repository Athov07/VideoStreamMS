import React, { useState } from "react";
import { videoService } from "../../services/video.service.js";
import { X, UploadCloud, Film } from "lucide-react";

const UploadModal = ({ isOpen, onClose, onSuccess }) => {
  const [file, setFile] = useState(null);
  const [formData, setFormData] = useState({ 
    title: "", 
    description: "", 
    isPremium: false 
  });
  const [uploading, setUploading] = useState(false);

  if (!isOpen) return null;

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return alert("Please select a video file");

    const data = new FormData();
    data.append("video", file);
    data.append("title", formData.title);
    data.append("description", formData.description);
    data.append("isPremium", formData.isPremium);

    setUploading(true);
    try {
      const res = await videoService.uploadVideo(data);
      if (res.success) {
        setFile(null);
        setFormData({ title: "", description: "", isPremium: false });
        onSuccess();
        onClose();
      }
    } catch (err) {
      alert("Upload failed. Check your network or file size.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-start sm:items-center justify-center z-50 p-4 overflow-y-auto">
      {/* CSS to hide scrollbar */}
      <style>
        {`
          .no-scrollbar::-webkit-scrollbar { display: none; }
          .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        `}
      </style>

      <div className="bg-surface border border-background-accent w-full max-w-lg p-6 sm:p-8 rounded-2xl shadow-2xl relative my-auto max-h-[90vh] overflow-y-auto no-scrollbar">
        
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-surface-muted hover:text-white transition-colors z-10"
        >
          <X size={20} />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="bg-primary/20 p-2 rounded-lg text-primary">
            <UploadCloud size={24} />
          </div>
          <h2 className="text-xl font-bold text-surface-text">Upload Video</h2>
        </div>

        <form onSubmit={handleUpload} className="space-y-5">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-surface-muted uppercase tracking-wider">Title</label>
            <input
              type="text"
              placeholder="e.g. My Amazing Travel Vlog"
              required
              value={formData.title}
              className="w-full bg-background border border-background-accent p-3 rounded-xl text-surface-text focus:border-primary outline-none transition-all"
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-surface-muted uppercase tracking-wider">Description</label>
            <textarea
              placeholder="Tell viewers about your video..."
              value={formData.description}
              className="w-full bg-background border border-background-accent p-3 rounded-xl text-surface-text h-32 focus:border-primary outline-none transition-all resize-none"
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div className="bg-background-accent/30 p-4 rounded-xl flex items-center justify-between border border-background-accent">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="premium-toggle"
                checked={formData.isPremium}
                onChange={(e) => setFormData({ ...formData, isPremium: e.target.checked })}
                className="w-5 h-5 accent-primary cursor-pointer"
              />
              <label htmlFor="premium-toggle" className="text-sm font-medium text-surface-text cursor-pointer">
                Premium Content
              </label>
            </div>
            <span className="text-[10px] text-surface-muted bg-background px-2 py-1 rounded">Members Only</span>
          </div>

          <div className="group relative border-2 border-dashed border-background-accent hover:border-primary/50 rounded-xl p-8 transition-all flex flex-col items-center justify-center gap-2 cursor-pointer bg-background/50">
            <input
              type="file"
              accept="video/*"
              required
              className="absolute inset-0 opacity-0 cursor-pointer"
              onChange={(e) => setFile(e.target.files[0])}
            />
            <Film className="text-surface-muted group-hover:text-primary transition-colors" size={32} />
            <p className="text-sm font-medium text-surface-text text-center break-all">
              {file ? file.name : "Click to select or drag video file"}
            </p>
            <p className="text-[10px] text-surface-muted">MP4, MKV or MOV (Max 100MB)</p>
          </div>

          <div className="flex items-center gap-4 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 text-sm font-semibold text-surface-muted hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={uploading}
              className="flex-[2] bg-primary text-white py-3 rounded-xl font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:scale-100"
            >
              {uploading ? "Uploading..." : "Publish Video"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UploadModal;