const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const colors = require("colors");
const cookieParser = require("cookie-parser");
const errorHandler = require("./middleware/error");
const connectDB = require("./config/db");

// Load Routes
const Blogs = require("./routes/blogs");
const Auth = require("./routes/auth");

// Load env variables
dotenv.config({ path: "./config/config.env" });

const app = express();

// Body Parser
app.use(express.json());

//Cookie Parser
app.use(cookieParser());

// Connect to DB
connectDB();

// Logger middleware

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Mount Routes
app.use("/api/v1/blogs", Blogs);
app.use("/api/v1/auth", Auth);

app.use(errorHandler);

const PORT = process.env.PORT || 3000;

const server = app.listen(
  PORT,
  console.log(
    `App is running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold
  )
);

// Handle unhandled promise rejection
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`.red.bold);
  //Close server & exit
  server.close(() => process.exit(1));
});
