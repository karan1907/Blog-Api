const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema({
  name: {
    type: String,
    required: "Please Give A Unique Name To Your Blog",
    unique: true,
    trim: true,
    maxlength: [50, "Name must be under 50 Characters"]
  },
  slug: {
    type: String
  },
  article: {
    type: String,
    required: true,
    trim: true,
    maxlength: [1000, "Description must be under 1000 Characters"]
  },
  createdAt: {
    type: Date,
    default: Date.now()
  }
});

module.exports = new mongoose.model("Blog", blogSchema);
