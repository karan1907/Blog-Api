const express = require("express");
const {
  getComments,
  getComment,
  addComment,
  updateComment,
  deleteComment
} = require("../controllers/comment");

const router = express.Router({ mergeParams: true });

const { protect, authorize } = require("../middleware/auth");

router
  .route("/")
  .get(getComments)
  .post(protect, authorize("user", "admin"), addComment);

router
  .route("/:id")
  .get(getComment)
  .put(protect, authorize("user", "admin"), updateComment)
  .delete(protect, authorize("user", "admin"), deleteComment);
module.exports = router;
