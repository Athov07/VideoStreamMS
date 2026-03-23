import React, { useState, useEffect } from "react";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import { interactionService } from "../../services/interaction.service.js";

const LikeButtons = ({ videoId }) => {
  const [stats, setStats] = useState({ likes: 0, dislikes: 0 });
  const [userAction, setUserAction] = useState(null); // 'like', 'dislike', or null

  const fetchStats = async () => {
    try {
      const res = await interactionService.getVideoStats(videoId);
      setStats(res);
    } catch (err) { console.error(err); }
  };

  useEffect(() => { fetchStats(); }, [videoId]);

  const handleAction = async (type) => {
    try {
      await interactionService.toggleLike(videoId, type);
      fetchStats(); // Refresh counts
    } catch (err) { alert("Please login to like/dislike"); }
  };

  return (
    <div className="flex items-center bg-zinc-900/60 rounded-full border border-white/5 p-1">
      <button onClick={() => handleAction('like')} className="flex items-center gap-2 px-4 py-2 hover:bg-white/10 rounded-l-full transition-colors border-r border-white/10">
        <ThumbsUp size={18} className={userAction === 'like' ? "text-primary fill-primary" : "text-zinc-400"} />
        <span className="text-sm font-medium">{stats.likes}</span>
      </button>
      <button onClick={() => handleAction('dislike')} className="flex items-center gap-2 px-4 py-2 hover:bg-white/10 rounded-r-full transition-colors">
        <ThumbsDown size={18} className={userAction === 'dislike' ? "text-white fill-white" : "text-zinc-400"} />
        <span className="text-sm font-medium">{stats.dislikes}</span>
      </button>
    </div>
  );
};

export default LikeButtons;