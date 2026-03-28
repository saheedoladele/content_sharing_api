import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    postId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Post", 
      required: true, 
      index: true 
    },
    parentCommentId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Comment", 
      default: null 
    },
    authorId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User", 
      required: true 
    },
    text: { 
      type: String, 
      required: true, 
      maxlength: 2000 
    },
  },
  { timestamps: true }
);

commentSchema.index({ postId: 1, createdAt: 1 });

export const Comment = mongoose.model("Comment", commentSchema);
