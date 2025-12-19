const fs = require("fs");
const path = require("path");

const errorHandler = (err, req, res, next) => {
  const logPath = path.join(__dirname, "../error.log");
  const logMessage = `[${new Date().toISOString()}] ${req.method} ${
    req.originalUrl
  }\nError: ${err.message}\nStack: ${err.stack}\n\n`;

  try {
    fs.appendFileSync(logPath, logMessage);
  } catch (e) {
    console.error("Could not write to error log:", e);
  }

  let statusCode = res.statusCode <= 200 ? 500 : res.statusCode;
  res.status(statusCode);
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === "development" ? err.stack : null,
  });

  next();
};

module.exports = errorHandler;
