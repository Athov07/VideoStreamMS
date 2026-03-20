import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { videoService } from '../../services/video.service.js';

const VideoDetails = () => {
  const { id } = useParams();
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const response = await videoService.getVideoById(id);
        if (response.success) {
          setVideo(response.data);
        }
      } catch (error) {
        console.error("Error loading video:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchVideo();
  }, [id]);

  if (loading) return <div className="p-10 text-white">Loading Player...</div>;
  if (!video) return <div className="p-10 text-white">Video not found.</div>;

  return (
    <div className="max-w-6xl mx-auto p-4 animate-in fade-in duration-500">
      {/* Video Player Section */}
      <div className="aspect-video bg-black rounded-xl overflow-hidden shadow-2xl border border-background-accent">
        <video 
          src={video.videoUrl} 
          controls 
          autoPlay
          className="w-full h-full"
          poster={video.thumbnailUrl}
        />
      </div>

      {/* Video Info */}
      <div className="mt-6">
        <h1 className="text-2xl font-bold text-surface-text">{video.title}</h1>
        <div className="flex items-center gap-4 mt-2 pb-4 border-b border-background-accent">
          <span className="text-sm text-surface-muted">
            Uploaded {new Date(video.createdAt).toLocaleDateString()}
          </span>
          {video.isPremium && (
            <span className="bg-yellow-500/10 text-yellow-500 text-[10px] font-bold px-2 py-0.5 rounded border border-yellow-500/20">
              PREMIUM CONTENT
            </span>
          )}
        </div>
        <p className="mt-4 text-surface-muted leading-relaxed">
          {video.description || "No description provided."}
        </p>
      </div>
    </div>
  );
};

export default VideoDetails;