import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { videoService } from "../../services/video.service.js";
import { subscriptionService } from "../../services/subscription.service.js";
import { Play, Loader2, Eye, Calendar } from "lucide-react";

const VideoDetails = () => {
  const { id } = useParams();

  const [video, setVideo] = useState(null);
  const [channel, setChannel] = useState(null);
  const [recommended, setRecommended] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subLoading, setSubLoading] = useState(false);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  useEffect(() => {
    const fetchFullData = async () => {
      try {
        setLoading(true);
        const videoRes = await videoService.getVideoById(id);

        if (videoRes.success) {
          setVideo(videoRes.data);

          const ownerId =
            videoRes.data.owner?._id ||
            videoRes.data.owner?.$oid ||
            videoRes.data.owner;

          if (ownerId) {
            const channelRes =
              await subscriptionService.getChannelSubscribers(ownerId);
            if (channelRes.success) {
              setChannel(channelRes.data);
              setIsSubscribed(channelRes.data.isSubscribedByMe || false);
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

  const handleSubscribe = async () => {
    const ownerId = video.owner?._id || video.owner?.$oid || video.owner;
    setSubLoading(true);
    try {
      const res = await subscriptionService.toggleSubscription(ownerId);
      if (res.success) {
        setIsSubscribed(!isSubscribed);
        setChannel((prev) => ({
          ...prev,
          subscriberCount: isSubscribed
            ? Math.max(0, prev.subscriberCount - 1)
            : (prev.subscriberCount || 0) + 1,
        }));
      }
    } catch (err) {
      console.error("Subscription toggle failed");
    } finally {
      setSubLoading(false);
    }
  };

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-zinc-500">
        <Loader2 className="animate-spin text-primary mb-4" size={40} />
        <p className="font-black uppercase tracking-widest text-[10px]">
          Syncing Stream...
        </p>
      </div>
    );

  if (!video)
    return (
      <div className="text-white text-center p-20 font-black">
        Video Not Found
      </div>
    );

  return (
    <div className="max-w-[1700px] mx-auto p-4 lg:p-10 flex flex-col lg:flex-row gap-10">
      {/* --- MAIN VIDEO COLUMN --- */}
      <div className="flex-1 min-w-0">
        <div className="aspect-video bg-black rounded-3xl overflow-hidden border border-white/5 shadow-2xl">
          <video
            src={video.videoUrl}
            controls
            autoPlay
            className="w-full h-full object-contain"
            poster={video.thumbnailUrl}
          />
        </div>

        <div className="mt-8">
          <h1 className="text-2xl lg:text-3xl font-black text-white tracking-tight">
            {video.title}
          </h1>

          {/* CHANNEL INFO BAR */}
          {/* --- CHANNEL INFO BAR --- */}
<div className="flex items-center gap-4">
  <div className="w-14 h-14 rounded-full bg-zinc-900 overflow-hidden border-2 border-white/5">
    <img
      src={channel?.avatar || "/default-avatar.png"}
      className="w-full h-full object-cover"
      alt="avatar"
    />
  </div>
  <div>
    <h3 className="font-extrabold text-white text-lg leading-none mb-1">
      {channel?.username || "Creator"}
    </h3>
    <p className="text-xs text-zinc-500 font-extrabold">
      {channel?.subscriberCount ?? 0} subscribers
    </p>
  </div>

  {/* 🚀 THE FIX: Only show if we have channel data AND isMe is explicitly false */}
  {channel && channel.isMe === false && (
    <button
      onClick={handleSubscribe}
      disabled={subLoading}
      className={`ml-6 px-8 py-2.5 rounded-full text-xs font-black uppercase transition-all ${
        isSubscribed
          ? "bg-zinc-800 text-zinc-400 border border-white/10"
          : "bg-white text-black hover:bg-zinc-200"
      }`}
    >
      {isSubscribed ? "Unsubscribe" : "Subscribe"}
    </button>
  )}
</div>

              {/* DESCRIPTION BOX */}
          <div className="mt-8 p-6 bg-zinc-900/40 rounded-2xl border border-white/5">
            <div className="flex gap-6 text-[11px] font-black text-zinc-500 mb-4 tracking-widest uppercase">
              <span className="flex items-center gap-2">
                <Eye size={14} className="text-primary" />{" "}
                {video.views?.toLocaleString()} views
              </span>
              <span className="flex items-center gap-2">
                <Calendar size={14} className="text-primary" />{" "}
                {formatDate(video.createdAt)}
              </span>
            </div>
            <p className="text-zinc-400 text-[15px] leading-relaxed font-medium opacity-90 whitespace-pre-wrap">
              {video.description}
            </p>
          </div>
        </div>
      </div>

      {/* --- SIDEBAR --- */}
      <div className="w-full lg:w-[420px] flex flex-col gap-6">
        <h3 className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.3em] mb-2 flex items-center gap-2">
          <Play size={14} className="text-primary fill-primary" /> Up Next
        </h3>
        <div className="flex flex-col gap-5">
          {recommended.map((rec) => (
            <Link
              key={rec._id}
              to={`/watch/${rec._id}`}
              className="flex gap-4 group"
            >
              <div className="w-44 aspect-video rounded-xl overflow-hidden bg-zinc-900 flex-shrink-0 border border-white/5">
                <img
                  src={rec.thumbnailUrl}
                  className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-extrabold text-white line-clamp-2 leading-snug group-hover:text-primary transition-colors">
                  {rec.title}
                </h4>
                <p className="text-[11px] text-zinc-500 mt-2 font-black uppercase tracking-tighter truncate">
                  {rec.owner?.username || "Anonymous"}
                </p>
                <p className="text-[10px] text-zinc-600 mt-0.5 font-bold uppercase tracking-tight">
                  {formatDate(rec.createdAt)}
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
