import mongoose from "mongoose";

const commentModelSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
    },
    blogId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "blogs",
    },
    author: {
      type: String,
      default: "anoynomous",
    },
  },
  { timestamps: true }
);
const commentModel = mongoose.model("comments", commentModelSchema);

export default commentModel;
