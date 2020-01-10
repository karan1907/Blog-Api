const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const connectDB = require("./config/db");

// Load Routes
const Blogs = require("./routes/blogs");

// Load env variables
dotenv.config({ path: "./config/config.env" });

const app = express();

// Connect to DB
connectDB();

// Logger middleware

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Mount Routes
app.use("/api/v1/blogs", Blogs);

const PORT = process.env.PORT || 3000;

const server = app.listen(
  PORT,
  console.log(`App is running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);

// Handle unhandled promise rejection
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`);
  //Close server & exit
  server.close(() => process.exit(1));
});
