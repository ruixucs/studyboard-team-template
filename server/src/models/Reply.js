import mongoose from 'mongoose';

const replySchema = new mongoose.Schema(
  {
    postId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true, index: true },
    authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    body: { type: String, required: true, minlength: 1, maxlength: 5000 },
  },
  { timestamps: true }
);

export const Reply = mongoose.model('Reply', replySchema);
