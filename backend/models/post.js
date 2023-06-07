import mongoose from 'mongoose';

const PostSchema = new mongoose.Schema({
    author: { type: mongoose.Types.ObjectId, required: true },
    timestamp: { type: Date, default: Date.now, required: true, },
    content: { type: String, required: true },
  });

mongoose.model("Post", PostSchema);