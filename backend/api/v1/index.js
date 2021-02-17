const { Router } = require("express");
const task = require("./task");

const v1 = Router();

v1.use((request, response, next) => {
  console.log("I'm a middleware, and i run before each request");
  next();
});

v1.use("/b", task);
v1.use("*", (req, res) => {
  res.send("Not found! :(");
});

module.exports = v1;