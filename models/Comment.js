const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema({
  comment: {
    type: String,
    trim: true,
    required: [true, "Please add a comment"],
    maxlength: 500
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  blog: {
    type: mongoose.Schema.ObjectId,
    ref: "Blog",
    required: true
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true
  }
});

module.exports = mongoose.model("Comment", CommentSchema);
