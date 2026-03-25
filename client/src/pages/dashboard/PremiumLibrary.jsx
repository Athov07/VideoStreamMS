import React, { useEffect, useState } from 'react';
import { useOutletContext, Link, useNavigate } from 'react-router-dom';
import { videoService } from '../../services/video.service';

const PremiumLibrary = () => {
  const { searchQuery } = useOutletContext();
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPremiumVideos = async () => {
      try {
        const response = await videoService.getAllVideos();
        if (response.success) {
          // Filter only the premium content
          const premiumOnly = response.data.filter(v => v.isPremium === true);
          setVideos(premiumOnly);
        }
      } catch (error) {
        console.error("Error fetching premium videos:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPremiumVideos();
  }, []);

  const filteredVideos = videos.filter(video =>
    video.title.toLowerCase().includes(searchQuery?.toLowerCase() || "")
  );

  if (loading) return <div className="flex justify-center py-40"><div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary"></div></div>;

  return (
    <div className="animate-in fade-in duration-500">
      <div className="mb-8 border-b border-yellow-500/30 pb-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-yellow-500">✨ Premium Pro Library</h1>
        <span className="text-xs bg-yellow-500/10 text-yellow-500 px-3 py-1 rounded-full border border-yellow-500/20">
          {filteredVideos.length} Exclusive Videos
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredVideos.map(video => (
          <Link to={`/watch/${video._id}`} key={video._id} className="group">
            <div className="aspect-video bg-surface rounded-lg mb-3 overflow-hidden relative border border-yellow-500/20 group-hover:border-yellow-500 transition-all">
              <img src={video.thumbnailUrl} alt={video.title} className="w-full h-full object-cover" />
              <div className="absolute top-2 left-2 bg-yellow-500 text-black text-[10px] font-bold px-2 py-0.5 rounded">PRO</div>
            </div>
            <h3 className="font-semibold text-surface-text group-hover:text-yellow-500 transition-colors line-clamp-2 text-sm">
              {video.title}
            </h3>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default PremiumLibrary;