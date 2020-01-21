const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const colors = require("colors");
const cookieParser = require("cookie-parser");
const mongoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");
const xss = require("xss-clean");
const rateLimit = require("express-rate-limit");
const hpp = require("hpp");
const cors = require("cors");
const path = require("path");
const errorHandler = require("./middleware/error");
const connectDB = require("./config/db");

// Load Routes
const Blogs = require("./routes/blogs");
const Auth = require("./routes/auth");
const User = require("./routes/user");
const Comment = require("./routes/comment");

// Load env variables
dotenv.config({ path: "./config/config.env" });

const app = express();

// Body Parser
app.use(express.json());

//Cookie Parser
app.use(cookieParser());

// Connect to DB
connectDB();

//Serving static files
app.use(express.static(path.join(__dirname, "public")));

// Logger middleware

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Prevent NOSQL Injection
app.use(mongoSanitize());

// XSS Headers
app.use(helmet());

//Prevent XSS Attacks
app.use(xss());

// Params pollution prevention (HPP)
app.use(hpp());

// Rate limiter
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

//  apply to all requests
app.use(limiter);

// CROSS ORIGIN Request
app.use(cors());

// Mount Routes
app.use("/api/v1/blogs", Blogs);
app.use("/api/v1/auth", Auth);
app.use("/api/v1/user", User);
app.use("/api/v1/comments", Comment);

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
