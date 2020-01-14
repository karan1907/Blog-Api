const Blog = require("../models/Blog");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");

exports.getBlogs = asyncHandler(async (req, res, next) => {
  let query;
  const reqQuery = { ...req.query };

  //fields to use
  const removeFields = ["select", "sort", "page", "limit"];

  // loop over removeFields and remove from req.query
  removeFields.forEach(param => delete reqQuery[param]);

  // create Query String

  let queryStr = JSON.stringify(reqQuery);

  // Finding resource
  query = Blog.find(JSON.parse(queryStr));

  // Select Fields
  if (req.query.select) {
    const fields = req.query.select.split(",").join(" ");
    query = query.select(fields);
  }

  // Sort By fields or by creation date
  if (req.query.sort) {
    const sortBy = req.query.sort.split(",").join(" ");
    query = query.sort(sortBy);
  } else {
    query = query.sort("-createdAt");
  }

  // Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const skip = (page - 1) * limit;
  const end = page * limit;
  const total = await Blog.countDocuments();

  query = query.skip(skip).limit(limit);

  //Executing query
  const blogs = await query;

  //Pagination Part
  const pagination = {};

  if (end < total) {
    pagination.next = {
      page: page + 1,
      limit
    };
  }
  if (skip > 0) {
    pagination.prev = {
      page: page - 1,
      limit
    };
  }

  //Sending Response

  res.status(200).json({
    success: true,
    count: blogs.length,
    pagination,
    data: {
      blogs
    }
  });
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
