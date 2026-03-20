import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      index: true,
      lowercase: true,
    },
    firstName: String,
    lastName: String,
    username: {
      type: String,
      unique: true,
      sparse: true,
    }, // Sparse allows null until registration
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    googleId: {
      type: String,
      unique: true,
      sparse: true,
    },
    refreshToken: { type: String },
  },
  { timestamps: true },
);

const User = mongoose.model("User", userSchema);
export default User;
