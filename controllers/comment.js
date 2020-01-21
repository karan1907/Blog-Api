const ErrorResponse = require("../utils/errorResponse");
const asycHandler = require("../middleware/async");
const Comment = require("../models/Comment");
const Blog = require("../models/Blog");

//Get All Comments
exports.getComments = asycHandler(async (req, res, next) => {
  if (req.params.blogId) {
    const comments = await Comment.find({ blog: req.params.blogId });

    return res.status(200).json({
      success: true,
      count: comments.length,
      data: comments
    });
  } else {
    const comments = await Comment.find().populate({
      path: "blog",
      select: "name article"
    });

    return res.status(200).json({
      success: true,
      count: comments.length,
      data: comments
    });
  }
});

// Get Single Review
exports.getComment = asycHandler(async (req, res, next) => {
  const comment = await Comment.findById(req.params.id).populate({
    path: "blog",
    select: "name, article"
  });

  if (!comment) {
    return next(
      new ErrorResponse(`No review found with ID of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: comment
  });
});

// Add a comment
exports.addComment = asycHandler(async (req, res, next) => {
  req.body.blog = req.params.blogId;
  req.body.user = req.user.id;

  const blog = await Blog.findById(req.params.blogId);

  if (!blog) {
    return next(
      new ErrorResponse(`No Blog with the ID ${req.params.blogID} found!`, 404)
    );
  }

  const comment = await Comment.create(req.body);

  res.status(201).json({
    success: true,
    data: comment
  });
});

// Update a Comment
exports.updateComment = asycHandler(async (req, res, next) => {
  let comment = await Comment.findById(req.params.id);

  if (!comment) {
    return next(
      new ErrorResponse(`No Comment with the ID ${req.params.id} found!`, 404)
    );
  }

  if (comment.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(new ErrorResponse(`Not Authorized to update a comment`, 401));
  }

  comment = await Comment.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  res.status(200).json({
    success: true,
    data: comment
  });
});

//Delete Comment
exports.deleteComment = asycHandler(async (req, res, next) => {
  let comment = await Comment.findById(req.params.id);

  if (!comment) {
    return next(
      new ErrorResponse(`No Comment with ID ${req.params.id} found!`, 404)
    );
  }

  if (comment.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(new ErrorResponse(`Not Authorized to update a comment`, 401));
  }

  await comment.remove();

  res.status(200).json({
    success: true,
    data: {}
  });
});
