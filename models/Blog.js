const mongoose = require("mongoose");
const slugify = require("slugify");

const blogSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please Provide a unique name for your blog!"],
    unique: true,
    trim: true,
    maxlength: [50, "Name must be under 50 Characters"]
  },
  slug: {
    type: String
  },
  article: {
    type: String,
    required: [true, "Blog Article is required for submission!"],
    trim: true,
    maxlength: [1000, "Description must be under 1000 Characters"]
  },
  createdAt: {
    type: Date,
    default: Date.now()
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true
  }
});

// Pre Save Hook to create the slug for blog

blogSchema.pre("save", function(next) {
  this.slug = slugify(this.name);
  next();
});

module.exports = new mongoose.model("Blog", blogSchema);
