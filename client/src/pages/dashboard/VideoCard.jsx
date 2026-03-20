import React from 'react';

const VideoCard = ({ video }) => {
  return (
    <div className="group cursor-pointer flex flex-col gap-2">
      {/* Thumbnail Container */}
      <div className="relative aspect-video bg-surface rounded-xl overflow-hidden border border-background-accent transition-all duration-300 group-hover:rounded-none group-hover:border-primary/50">
        {/* Placeholder for Video Preview/Image */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20" />
        
        {/* Play Overlay (Visible on Hover) */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
           <svg className="w-12 h-12 text-primary" fill="currentColor" viewBox="0 0 24 24">
             <path d="M8 5v14l11-7z"/>
           </svg>
        </div>

        {/* Timestamp - Using Surface text */}
        <span className="absolute bottom-2 right-2 bg-background/90 px-1.5 py-0.5 rounded text-[10px] font-bold text-surface-text">
          {video.duration}
        </span>
      </div>

      {/* Video Details */}
      <div className="flex flex-col gap-1 px-1">
        <h3 className="text-sm font-semibold text-surface-text line-clamp-2 leading-snug group-hover:text-primary transition-colors">
          {video.title}
        </h3>
        
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-medium text-surface-muted bg-background-secondary px-2 py-0.5 rounded border border-background-accent">
            {video.category}
          </span>
          <span className="text-[11px] text-surface-muted">•</span>
          <span className="text-[11px] text-surface-muted">{video.views || "0"} views</span>
        </div>
      </div>
    </div>
  );
};

export default VideoCard;