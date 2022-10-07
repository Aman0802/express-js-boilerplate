const express = require("express");
const bodyParser = require("body-parser");
const router = require("./routes");

require("dotenv").config();

const app = express();

const { NODE_ENV, PORT = 3000 } = process.env;
const isProduction = NODE_ENV === "production";

// Body Parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// API Routes
app.use(router);

// Error Handler
app.use((err, req, res, next) =>
  res.status(500).json({
    message: "Internal server error",
    error: isProduction ? null : err,
  })
);

const startServer = () => {
  app.listen(PORT, () =>
    console.log(`Server running on port ${process.env.PORT}`)
  );
};

startServer();

module.exports = app;
