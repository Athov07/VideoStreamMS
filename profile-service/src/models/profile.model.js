import mongoose from "mongoose";

const profileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      unique: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    avatar: {
      type: String,
      default: "",
    },
    bio: {
      type: String,
      default: "",
    },
    subscriberCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

export const Profile = mongoose.model("Profile", profileSchema);
