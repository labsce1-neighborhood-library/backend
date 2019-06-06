const express = require("express");
const cors = require("cors");
const helmet = require("helmet");

const { userRouter, bookRouter } = require("../routers/index.js");

// const testRouter = require("../routers/testRouter.js");
// const userRouter = require("../routers/userRouter.js");
// const bookRouter = require("../routers/bookRouter.js");

module.exports = server => {
  // middleware
  server.use(express.json());
  server.use(cors());
  server.use(helmet());
  server.use(morgan("dev"));

  // express routers
  // server.use("/test", testRouter);
  server.use("/user", userRouter);
  server.use("/book", bookRouter);
};
