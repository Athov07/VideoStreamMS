import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { videoService } from '../../services/video.service.js';
import { profileService } from '../../services/profile.service.js'; // Import our new service
import { Users, Check, Bell, Play } from 'lucide-react';

const VideoDetails = () => {
  const { id } = useParams();
  const [video, setVideo] = useState(null);
  const [channel, setChannel] = useState(null);
  const [recommended, setRecommended] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subLoading, setSubLoading] = useState(false);

  useEffect(() => {
    const fetchFullData = async () => {
      try {
        setLoading(true);
        // 1. Fetch Video
        const videoRes = await videoService.getVideoById(id);
        if (videoRes.success) {
          const videoData = videoRes.data;
          setVideo(videoData);

          // 2. Fetch Channel Info (Using video owner ID)
          // Adjust 'videoData.userId' based on your actual video schema key
          const channelId = videoData.userId?._id || videoData.userId;
          if (channelId) {
            const channelRes = await profileService.getChannelSubscribers(channelId);
            setChannel(channelRes.data);
            // Check if current user is in the subscriber list (logic depends on your backend response)
            setIsSubscribed(channelRes.data?.isSubscribedByMe || false);
          }

          // 3. Fetch Recommended Videos
          const recRes = await videoService.getAllVideos(); // Or a specific 'related' endpoint
          setRecommended(recRes.data?.filter(v => v._id !== id).slice(0, 6));
        }
      } catch (error) {
        console.error("Error loading video details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFullData();
  }, [id]);

  const handleSubscribe = async () => {
    if (!channel) return;
    setSubLoading(true);
    try {
      const channelId = video.userId?._id || video.userId;
      const res = await profileService.toggleSubscription(channelId);
      if (res.success) {
        setIsSubscribed(!isSubscribed);
        // Optionally update local subscriber count
        setChannel(prev => ({
          ...prev,
          subscriberCount: isSubscribed ? prev.subscriberCount - 1 : prev.subscriberCount + 1
        }));
      }
    } catch (err) {
      alert("Could not update subscription");
    } finally {
      setSubLoading(false);
    }
  };

  if (loading) return <div className="p-10 text-surface-muted animate-pulse">Loading Video Environment...</div>;
  if (!video) return <div className="p-10 text-white text-center">Video not found.</div>;

  return (
    <div className="max-w-[1600px] mx-auto p-4 lg:p-8 flex flex-col lg:flex-row gap-8">
      
      {/* LEFT COLUMN: Player & Info */}
      <div className="flex-1 min-w-0">
        <div className="aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl border border-background-accent group relative">
          <video 
            src={video.videoUrl} 
            controls 
            autoPlay
            className="w-full h-full"
            poster={video.thumbnailUrl}
          />
        </div>

        <div className="mt-6">
          <h1 className="text-2xl font-bold text-surface-text line-clamp-2">{video.title}</h1>
          
          {/* Channel Bar & Subscribe */}
          <div className="flex flex-wrap items-center justify-between gap-4 mt-4 py-4 border-b border-background-accent">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-background-accent overflow-hidden border border-background-accent">
                <img src={channel?.avatar || "/default-avatar.png"} alt="avatar" className="w-full h-full object-cover" />
              </div>
              <div>
                <h3 className="font-bold text-surface-text leading-tight">{channel?.username || "Loading..."}</h3>
                <p className="text-xs text-surface-muted">{channel?.subscriberCount || 0} subscribers</p>
              </div>
              <button 
                onClick={handleSubscribe}
                disabled={subLoading}
                className={`ml-4 px-6 py-2 rounded-full text-sm font-bold transition-all flex items-center gap-2 ${
                  isSubscribed 
                  ? "bg-background-accent text-surface-text hover:bg-zinc-700" 
                  : "bg-primary text-white hover:bg-primary-dark"
                }`}
              >
                {isSubscribed ? <><Check size={16}/> Subscribed</> : "Subscribe"}
              </button>
            </div>

            <div className="flex items-center gap-2">
               {video.isPremium && (
                 <span className="bg-yellow-500/10 text-yellow-500 text-[10px] font-black px-3 py-1 rounded-full border border-yellow-500/20 tracking-tighter">
                   PREMIUM
                 </span>
               )}
            </div>
          </div>

          <div className="mt-6 p-4 bg-surface/50 rounded-xl border border-background-accent">
            <p className="text-sm text-surface-muted mb-2 font-medium">
              Uploaded {new Date(video.createdAt).toLocaleDateString(undefined, { dateStyle: 'long' })}
            </p>
            <p className="text-surface-text leading-relaxed whitespace-pre-wrap">
              {video.description || "No description provided."}
            </p>
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: Recommended Videos */}
      <div className="w-full lg:w-[400px] flex flex-col gap-4">
        <h3 className="text-sm font-bold text-surface-muted uppercase tracking-widest flex items-center gap-2">
          <Play size={14} className="text-primary"/> Recommended
        </h3>
        
        <div className="space-y-4">
          {recommended.map((rec) => (
            <Link key={rec._id} to={`/watch/${rec._id}`} className="flex gap-3 group">
              <div className="relative w-40 aspect-video rounded-lg overflow-hidden bg-background flex-shrink-0">
                <img src={rec.thumbnailUrl} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                {rec.isPremium && <div className="absolute top-1 right-1 bg-primary p-0.5 rounded text-[8px] text-white">PRO</div>}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold text-surface-text line-clamp-2 group-hover:text-primary transition-colors">
                  {rec.title}
                </h4>
                <p className="text-[11px] text-surface-muted mt-1">{rec.userId?.username}</p>
                <p className="text-[10px] text-surface-muted">
                   {new Date(rec.createdAt).toLocaleDateString()}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VideoDetails;