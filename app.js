const express = require("express");
const dotenv = require("dotenv");

// Load Routes
const Blogs = require("./routes/blogs");

// Load env variables
dotenv.config({ path: "./config/config.env" });

const app = express();

// Mount Routes
app.use("/api/v1/blogs", Blogs);

const PORT = process.env.PORT || 3000;

app.listen(
  PORT,
  console.log(`App is running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);
