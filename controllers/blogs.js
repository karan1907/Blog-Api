exports.getBlogs = (req, res, next) => {
  res.json({ msg: "Get All Blogs" });
};

exports.getBlog = (req, res, next) => {
  res.json({ msg: "Get Single Blog" });
};

exports.createBlog = (req, res, next) => {
  res.json({ msg: "Create New Blog" });
};

exports.updateBlog = (req, res, next) => {
  res.json({ msg: "Update blog using id" });
};

exports.deleteBlog = (req, res, next) => {
  res.json({ msg: "Delete blog using id" });
};
