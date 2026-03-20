import mongoose from 'mongoose';

const videoSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    videoUrl: { type: String, required: true },
    thumbnailUrl: { type: String },
    publicId: { type: String, required: true }, // For Cloudinary deletion
    owner: { type: mongoose.Schema.Types.ObjectId, required: true }, // User ID from Auth Service
    isPremium: { type: Boolean, default: false },
    views: { type: Number, default: 0 }
}, { timestamps: true });

export const Video = mongoose.model('Video', videoSchema);