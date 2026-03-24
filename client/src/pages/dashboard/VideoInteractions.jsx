import React, { useState, useEffect } from "react";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import { interactionService } from "../../services/interaction.service.js";

const LikeButtons = ({ videoId }) => {
  const [stats, setStats] = useState({ likes: 0, dislikes: 0 });
  const [userAction, setUserAction] = useState(null); 

  const fetchStats = async () => {
    try {
      const res = await interactionService.getVideoStats(videoId);
      // Ensure your backend returns { likes: X, dislikes: Y, userAction: 'like'|'dislike'|null }
      setStats(res);
      if (res.userAction !== undefined) {
        setUserAction(res.userAction);
      }
    } catch (err) { console.error(err); }
  };

  useEffect(() => { fetchStats(); }, [videoId]);

  const handleAction = async (type) => {
    try {
      // 1. Optimistically update UI for better feel
      const previousAction = userAction;
      const newAction = userAction === type ? null : type;
      setUserAction(newAction);

      // 2. Call the API
      await interactionService.toggleLike(videoId, type);
      
      // 3. Refresh data from server to keep counts accurate
      fetchStats(); 
    } catch (err) { 
      alert("Please login to like/dislike"); 
      // Reset if failed
      setUserAction(null);
    }
  };

  return (
    <div className="flex items-center mt-5">
        <div className="inline-flex items-center bg-zinc-800/80 hover:bg-zinc-800 rounded-full border border-white/10 overflow-hidden">
      {/* LIKE BUTTON */}
      <button 
        onClick={() => handleAction('like')} 
        className="flex items-center gap-2 px-4 py-2 hover:bg-white/10 rounded-l-full transition-colors border-r border-white/10"
      >
        <ThumbsUp 
          size={18} 
          className={userAction === 'like' ? "text-primary fill-primary" : "text-zinc-400"} 
        />
        <span className={userAction === 'like' ? "text-white-500 text-sm font-medium" : "text-zinc-400 text-sm font-medium"}>
          {stats.likes}
        </span>
      </button>

      {/* DISLIKE BUTTON */}
      <button 
        onClick={() => handleAction('dislike')} 
        className="flex items-center gap-2 px-4 py-2 hover:bg-white/10 rounded-r-full transition-colors"
      >
        <ThumbsDown 
          size={18} 
          className={userAction === 'dislike' ? "text-primary fill-primary" : "text-zinc-400"} 
        />
        <span className={userAction === 'dislike' ? "text-white text-sm font-medium" : "text-zinc-400 text-sm font-medium"}>
          {stats.dislikes}
        </span>
      </button>
    </div>
    </div>
  );
};

export default LikeButtons;