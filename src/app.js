const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const cors = require("cors");
const compression = require("compression");
require("dotenv").config();

const routes = require("./routes");
const errorHandler = require("./middleware/errorHandler");

const app = express(); // ✅ Define app first

// Middlewares
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: [
          "'self'",
          "'unsafe-inline'",
          "https://test.payu.in",
          "https://securegw.payu.in",
        ],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: [
          "'self'",
          "data:",
          "https:",
          "https://test.payu.in",
          "https://securegw.payu.in",
        ],
        connectSrc: [
          "'self'",
          "https://test.payu.in",
          "https://securegw.payu.in",
        ],
        fontSrc: ["'self'"],
        objectSrc: ["'none'"],
        mediaSrc: ["'self'"],
        frameSrc: ["https://test.payu.in", "https://securegw.payu.in"],
        formAction: ["'self'", "https://*.payu.in"],
        baseUri: ["'self'"],
        upgradeInsecureRequests: [],
      },
    },
  })
);

// Debug middleware to log CSP headers
app.use((req, res, next) => {
  console.log("CSP Headers:", {
    "content-security-policy": res.getHeader("content-security-policy"),
    "x-content-type-options": res.getHeader("x-content-type-options"),
    "x-frame-options": res.getHeader("x-frame-options"),
  });
  next();
});

app.use(cors());
app.use(compression());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/v1", routes);

// Error handler (should come last)
app.use(errorHandler); // ✅ Now it's safe to use app here

module.exports = app;
