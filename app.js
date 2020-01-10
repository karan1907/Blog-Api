const express = require("express");
const dotenv = require("dotenv");

// Load env variables
dotenv.config({ path: "./config/config.env" });

const app = express();

app.get("/", (req, res) => {
  res.json({ msg: "Hello World" });
});

const PORT = process.env.PORT || 3000;

app.listen(
  PORT,
  console.log(`App is running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);
