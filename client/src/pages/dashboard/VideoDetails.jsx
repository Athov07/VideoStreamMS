import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { videoService } from "../../services/video.service.js";
import { profileService } from "../../services/profile.service.js"; 
import { subscriptionService } from "../../services/subscription.service.js";
import { Play, Loader2, Eye, Calendar } from "lucide-react";
import LikeButtons from "../dashboard/VideoInteractions.jsx";
import CommentSection from "../dashboard/CommentSection.jsx";

const VideoDetails = () => {
  const { id } = useParams();

  const [video, setVideo] = useState(null);
  const [channel, setChannel] = useState(null);
  const [recommended, setRecommended] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subLoading, setSubLoading] = useState(false);
  const [extraNames, setExtraNames] = useState({});

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getAuthHeader = () => {
    const token = localStorage.getItem("accessToken");
    return { headers: { Authorization: token ? `Bearer ${token}` : "" } };
  };

  useEffect(() => {
    const fetchFullData = async () => {
      try {
        setLoading(true);
        const videoRes = await videoService.getVideoById(id);

        if (videoRes.success) {
          setVideo(videoRes.data);
          const ownerId = videoRes.data.owner?._id || videoRes.data.owner?.$oid || videoRes.data.owner;

          if (ownerId) {
            try {
              const subRes = await subscriptionService.getChannelSubscribers(ownerId, getAuthHeader());
              if (subRes.success) {
                setChannel(subRes.data);
                setIsSubscribed(subRes.data.isSubscribedByMe || false);
              }
            } catch (err) {
              setChannel({ username: videoRes.data.owner?.username || "Creator", subscriberCount: 0 });
            }
          }

          const recRes = await videoService.getAllVideos();
          if (recRes.success) {
            setRecommended(recRes.data.filter((v) => v._id !== id).slice(0, 8));
          }
        }
      } catch (error) {
        console.error("Fetch Error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFullData();
  }, [id]);

  useEffect(() => {
    const hydrateSidebarNames = async () => {
      if (recommended.length === 0) return;
      const allOwnerIds = recommended.map(v => String(v.owner?._id || v.owner?.$oid || v.owner));
      const mainId = String(channel?.userId || "");
      const missingIds = [...new Set(allOwnerIds)].filter(id => id !== mainId && !extraNames[id]);
      if (missingIds.length === 0) return;

      try {
        const res = await profileService.getBatchProfiles(missingIds.join(','));
        if (res.success) {
          const newMap = {};
          res.data.forEach(p => { newMap[p.userId] = p.username });
          setExtraNames(prev => ({ ...prev, ...newMap }));
        }
      } catch (err) {
        console.error("Sidebar name trace failed:", err);
      }
    };
    hydrateSidebarNames();
  }, [recommended, channel]);

  const handleSubscribe = async () => {
    const ownerId = video.owner?._id || video.owner?.$oid || video.owner;
    setSubLoading(true);
    try {
      const res = await subscriptionService.toggleSubscription(ownerId, getAuthHeader());
      if (res.success) {
        setIsSubscribed(!isSubscribed);
        setChannel((prev) => ({
          ...prev,
          subscriberCount: isSubscribed ? Math.max(0, prev.subscriberCount - 1) : (prev.subscriberCount || 0) + 1,
        }));
      }
    } catch (err) {
      console.error("Subscription toggle failed");
    } finally {
      setSubLoading(false);
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-zinc-500">
      <Loader2 className="animate-spin text-primary mb-4" size={40} />
      <p className="font-normal uppercase tracking-widest text-[10px]">Syncing Stream...</p>
    </div>
  );

  if (!video) return <div className="text-white text-center p-20 font-normal">Video Not Found</div>;

  return (
    <div className="max-w-[1700px] mx-auto p-1 lg:p-1 flex flex-col lg:flex-row gap-8">
      <div className="flex-1 min-w-0">
        {/* Video Player */}
        <div className="aspect-video bg-black rounded-3xl overflow-hidden border border-white/5 shadow-2xl">
          <video src={video.videoUrl} controls autoPlay className="w-full h-full object-contain" poster={video.thumbnailUrl} />
        </div>

        <div className="mt-8">
          {/* Title */}
          <h1 className="text-lg lg:text-lg font-medium text-white tracking-tight">
            {video.title}
          </h1>
            <LikeButtons videoId={id} />

          {/* PROFILE BAR */}
          <div className="mt-6 py-6 border-t border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-zinc-900 overflow-hidden border-2 border-white/5">
                <img src={channel?.avatar || "/default-avatar.png"} className="w-full h-full object-cover" alt="avatar" />
              </div>
              <div>
                <h3 className="text-white text-lg leading-none mb-1 font-normal">
                  {channel?.username || "Creator"}
                </h3>
                <p className="text-xs text-zinc-500 font-normal">
                  {channel?.subscriberCount ?? 0} subscribers
                </p>
              </div>
              
            </div>

            {channel && channel.isMe === false && (
              <button onClick={handleSubscribe} disabled={subLoading}
                className={`px-8 py-2.5 rounded-full text-xs font-bold uppercase transition-all ${
                  isSubscribed ? "bg-zinc-800 text-zinc-600 border border-white/10" : "bg-red-600 text-black hover:bg-zinc-200"
                }`}>
                {isSubscribed ? "Unsubscribe" : "Subscribe"}
              </button>
            )}
          </div>

          {/* Description Box */}
          <div className="mt-8 p-6 bg-zinc-900/40 rounded-2xl border border-white/5">
            <div className="flex gap-6 text-[11px] font-normal text-zinc-500 mb-4 tracking-widest uppercase">
              <span className="flex items-center gap-2"><Eye size={14} className="text-primary" /> {video.views?.toLocaleString()} views</span>
              <span className="flex items-center gap-2"><Calendar size={14} className="text-primary" /> {formatDate(video.createdAt)}</span>
            </div>
            <p className="text-zinc-400 text-[15px] leading-relaxed font-normal opacity-90 whitespace-pre-wrap">{video.description}</p>
          </div>
          <CommentSection videoId={id} />
        </div>
      </div>

      {/* Sidebar */}
      <div className="w-full lg:w-[420px] flex flex-col gap-6">
        <h2 className="text-[15px] font-normal text-[#F1F1F1] uppercase tracking-[0.3em] mb-2 flex items-center gap-2">
          <Play size={20} className="text-primary fill-primary" /> Up Next
        </h2>
        <div className="flex flex-col gap-5">
          {recommended.map((rec) => {
            const recOwnerId = String(rec.owner?._id || rec.owner?.$oid || rec.owner || "");
            const mainAuthId = String(channel?.userId || "");
            const ownerName = (recOwnerId === mainAuthId) ? channel.username : (extraNames[recOwnerId] || "Creator");
            return (
              <Link key={rec._id} to={`/watch/${rec._id}`} className="flex gap-4 group hover:bg-white/5 p-2 rounded-2xl transition-all duration-300">
                <div className="w-40 aspect-video rounded-xl overflow-hidden bg-zinc-900 flex-shrink-0 border border-white/5 shadow-lg">
                  <img src={rec.thumbnailUrl} alt={rec.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                </div>
                <div className="flex-1 min-w-0 flex flex-col justify-center">
                  <h4 className="text-sm font-medium text-[#F1F1F1] line-clamp-2 leading-snug group-hover:text-primary transition-colors">{rec.title}</h4>
                  <p className="text-[10px] text-zinc-400 mt-2 font-normal uppercase tracking-[0.2em] truncate group-hover:text-white transition-colors">{ownerName}</p>
                  <p className="text-[9px] text-zinc-600 mt-1 font-normal uppercase tracking-tight">{formatDate(rec.createdAt)}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default VideoDetails;