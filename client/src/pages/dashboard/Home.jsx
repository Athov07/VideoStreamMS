import React, { useEffect, useState } from 'react';
import { useOutletContext, Link } from 'react-router-dom';
import { videoService } from '../../services/video.service.js';

const Home = () => {
  const { searchQuery } = useOutletContext();
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await videoService.getAllVideos();
        
        if (response.success) {
          setVideos(response.data);
        }
      } catch (error) {
        console.error("Error fetching videos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  // Filter real videos based on the search query from Navbar
  const filteredVideos = videos.filter(video =>
    video.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center py-40">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-300">
      <div className="mb-8 border-b border-background-accent pb-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-surface-text">Browse Library</h1>
        <span className="text-xs text-surface-muted uppercase tracking-widest bg-background-secondary px-3 py-1 rounded">
          {filteredVideos.length} Results
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredVideos.map(video => (
          <Link to={`/watch/${video._id}`} key={video._id} className="group cursor-pointer">
            {/* Card Thumbnail - Real Cloudinary Image */}
            <div className="aspect-video bg-surface rounded-lg mb-3 border border-background-accent overflow-hidden relative transition-transform duration-200 group-hover:scale-[1.02]">
              <img 
                src={video.thumbnailUrl || 'https://via.placeholder.com/300x200?text=Processing...'} 
                alt={video.title}
                className="w-full h-full object-cover"
              />
              
              {/* Duration (if you add this field later, otherwise static/hidden) */}
              <div className="absolute bottom-2 right-2 bg-background/90 text-surface-text px-2 py-0.5 rounded text-[10px] font-bold">
                 {video.duration || "Video"}
              </div>
            </div>

            {/* Title */}
            <h3 className="font-semibold text-surface-text group-hover:text-primary transition-colors line-clamp-2 text-sm">
              {video.title}
            </h3>

            {/* Category / Meta Data */}
            <div className="flex justify-between items-center mt-1">
               <span className="text-xs text-surface-muted block">
                 {video.category || "General"}
               </span>
               {video.isPremium && (
                 <span className="text-[10px] text-yellow-500 font-bold border border-yellow-500 px-1 rounded">
                   PRO
                 </span>
               )}
            </div>
          </Link>
        ))}
      </div>

      {filteredVideos.length === 0 && (
        <div className="flex flex-col items-center justify-center py-40">
          <p className="text-surface-muted text-sm italic">
            {videos.length === 0 ? "No videos uploaded yet." : `No results for "${searchQuery}"`}
          </p>
        </div>
      )}
    </div>
  );
};

export default Home;