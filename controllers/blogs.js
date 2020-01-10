const Blog = require("../models/Blog");

exports.getBlogs = async (req, res, next) => {
  try {
    const blogs = await Blog.find();

    if (!blogs) {
      return res.status(404).json({ success: true, msg: "No Blog Exists Yet" });
    }

    res.status(200).json({ success: true, data: blogs });
  } catch (err) {
    res.status(500).json({ success: false, msg: "Internal Server Error" });
  }
};

exports.getBlog = async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res
        .status(404)
        .json({ success: true, msg: "No Blog With Given Id Was Found!" });
    }
    res.status(200).json({ success: true, data: blog });
  } catch (err) {
    res.status(500).json({ success: false, msg: "Internal Server Error" });
  }
};

exports.createBlog = async (req, res, next) => {
  try {
    const blog = await Blog.create(req.body);
    res.status(201).json({ success: true, data: blog });
  } catch (err) {
    res.status(400).json({ success: false });
  }
};

exports.updateBlog = async (req, res, next) => {
  try {
    const blog = await Blog.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!blog) {
      return res
        .status(404)
        .json({ success: true, msg: "Blog With Given Id was not found!" });
    }
    res.status(200).json({ success: true, data: blog });
  } catch (err) {
    res.status(500).json({ success: false, msg: "Internal Server" });
  }
};

exports.deleteBlog = async (req, res, next) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);
    if (!blog) {
      return res
        .status(404)
        .json({ success: true, msg: "Blog With Given Id was not found!" });
    }
    res
      .status(200)
      .json({ success: true, msg: "Blog Has Been Deleted Successfully" });
  } catch (err) {
    res.status(500).json({ success: false, msg: "Internal Server" });
  }
};
