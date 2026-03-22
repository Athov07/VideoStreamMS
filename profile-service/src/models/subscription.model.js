import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema(
  {
    subscriberId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Profile",
      required: true,
    }, // Who is subbing
    channelId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Profile",
      required: true,
    }, // Who is being subbed to
  },
  { timestamps: true },
);

export const Subscription = mongoose.model("Subscription", subscriptionSchema);
