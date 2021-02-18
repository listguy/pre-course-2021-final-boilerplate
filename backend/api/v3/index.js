const { Router } = require("express");
const task = require("./task");

const v3 = Router();

v3.use((req, res, next) => {
  setTimeout(() => next(), 1000);
})

v3.use("/b", task);
v3.use("*", (req, res) => {
  res.send("Not found! :(");
});

module.exports = v3;