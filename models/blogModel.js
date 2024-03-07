import mongoose from "mongoose";

const blogModelSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    body: {
      type: String,
      required: true,
    },
    coverImageUrl: {
      type: String,
      default: "/uploads/blog.png",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
  },
  { timestamps: true }
);

const blogModel = mongoose.model("blogs", blogModelSchema);

export default blogModel;
