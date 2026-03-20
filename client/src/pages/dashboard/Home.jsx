import React from 'react';
import { useOutletContext } from 'react-router-dom';
import VideoCard from '../dashboard/VideoCard';

const Home = () => {
  const { searchQuery } = useOutletContext();

  // Mock data (Soon to be from your VideoService)
  const videos = [
    { id: 1, title: "Building an API Gateway with Node.js", duration: "12:45", category: "Microservices", views: "1.2k" },
    { id: 2, title: "Authentication Flow: OTP & JWT", duration: "08:12", category: "Security", views: "850" },
    { id: 3, title: "React Router v7 New Features", duration: "15:20", category: "Frontend", views: "3.1k" },
    { id: 4, title: "MongoDB Aggregation Pipelines", duration: "22:10", category: "Database", views: "600" },
  ];

  const filteredVideos = videos.filter(v => 
    v.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between border-b border-background-accent pb-4">
        <h2 className="text-xl font-bold text-surface-text">Recommended</h2>
        <div className="text-xs text-surface-muted uppercase tracking-tighter">
          {filteredVideos.length} Videos Available
        </div>
      </div>

      {/* Video Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8">
        {filteredVideos.map(video => (
          <VideoCard key={video.id} video={video} />
        ))}
      </div>

      {/* Empty State */}
      {filteredVideos.length === 0 && (
        <div className="text-center py-20 bg-surface/30 rounded-2xl border border-dashed border-background-accent">
          <p className="text-surface-muted">No results found for "{searchQuery}"</p>
        </div>
      )}
    </div>
  );
};

export default Home;