const express = require("express");
const {
  getBlogs,
  getBlog,
  createBlog,
  updateBlog,
  deleteBlog
} = require("../controllers/blogs");

//Include other resource routers
const commentRouter = require("./comment");

const { protect } = require("../middleware/auth");

const router = express.Router();

//Re-route into other resource routes
router.use("/:blogId/comments", commentRouter);

router
  .route("/")
  .get(getBlogs)
  .post(protect, createBlog);
router
  .route("/:id")
  .get(getBlog)
  .put(protect, updateBlog)
  .delete(protect, deleteBlog);

module.exports = router;
