const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.json({ msg: "Get All Blogs" });
});

router.get("/:id", (req, res) => {
  res.json({ msg: "Get Single Blog" });
});

router.post("/", (req, res) => {
  res.json({ msg: "Create New Blog" });
});

router.put("/:id", (req, res) => {
  res.json({ msg: "Update blog using id" });
});

router.delete("/:id", (req, res) => {
  res.json({ msg: "Delete blog using id" });
});

module.exports = router;
