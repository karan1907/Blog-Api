const Blog = require("../models/Blog");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");

exports.getBlogs = asyncHandler(async (req, res, next) => {
  const blogs = await Blog.find();

  if (!blogs) {
    return next(new ErrorResponse("Resource was not found!", 404));
  }

  res.status(200).json({ success: true, count: blogs.length, data: blogs });
});

exports.getBlog = asyncHandler(async (req, res, next) => {
  const blog = await Blog.findById(req.params.id);
  if (!blog) {
    return next(
      new ErrorResponse(
        `Resource with given id ${req.params.id} was not found!`,
        404
      )
    );
  }
  res.status(200).json({ success: true, data: blog });
});

exports.createBlog = asyncHandler(async (req, res, next) => {
  const blog = await Blog.create(req.body);
  res.status(201).json({ success: true, data: blog });
});

exports.updateBlog = asyncHandler(async (req, res, next) => {
  const blog = await Blog.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  if (!blog) {
    return next(
      new ErrorResponse(
        `Resource with given id ${req.params.id} was not found!`,
        404
      )
    );
  }
  res.status(200).json({ success: true, data: blog });
});

exports.deleteBlog = asyncHandler(async (req, res, next) => {
  const blog = await Blog.findByIdAndDelete(req.params.id);
  if (!blog) {
    return next(
      new ErrorResponse(
        `Resource with given id ${req.params.id} was not found!`,
        404
      )
    );
  }
  res
    .status(200)
    .json({ success: true, msg: "Blog Has Been Deleted Successfully" });
});
