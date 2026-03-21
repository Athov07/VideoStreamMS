import React, { useEffect, useState } from 'react';
import { videoService } from '../../services/video.service.js';
import VideoManager from '../dashboard/VideoManager.jsx';
import UploadModal from '../dashboard/UploadModal.jsx';

// const MyVideos = () => {
//   const [myVideos, setMyVideos] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const fetchMyContent = async () => {
//     try {
//       const response = await videoService.getAllVideos();
//       // Filter videos where you are the owner (optional if backend does it)
//       setMyVideos(response.data);
//     } catch (error) {
//       console.error("Error loading your videos", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchMyContent();
//   }, []);

//   if (loading) return <div className="p-10 text-surface-muted">Loading your studio...</div>;

//   return (
//     <div className="p-6 animate-in fade-in duration-500">
//       <div className="flex justify-between items-center mb-8">
//         <h1 className="text-2xl font-bold text-surface-text">My Video Library</h1>
//         <button className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-primary/90">
//           + Upload New
//         </button>
//       </div>

//       {myVideos.length === 0 ? (
//         <div className="text-center py-20 border-2 border-dashed border-background-accent rounded-xl">
//           <p className="text-surface-muted">You haven't uploaded any videos yet.</p>
//         </div>
//       ) : (
//         <div className="space-y-4">
//           {myVideos.map((vid) => (
//             <VideoManager 
//               key={vid._id} 
//               video={vid} 
//               onUpdate={fetchMyContent} 
//             />
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };
// export default MyVideos;



const MyVideos = () => {
  const [videos, setVideos] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchVideos = async () => {
    const res = await videoService.getAllVideos();
    setVideos(res.data);
  };

  useEffect(() => { fetchVideos(); }, []);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-surface-text">My Studio</h1>
        {/* 🚀 CLICKING THIS NOW OPENS THE MODAL */}
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-primary text-white px-4 py-2 rounded-lg font-bold"
        >
          + Upload Video
        </button>
      </div>

      <div className="space-y-4">
        {videos.map(v => (
          <VideoManager key={v._id} video={v} onUpdate={fetchVideos} />
        ))}
      </div>

      {/* 🚀 THE MODAL COMPONENT */}
      <UploadModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={fetchVideos}
      />
    </div>
  );
};

export default MyVideos;