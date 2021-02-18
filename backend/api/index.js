const { Router } = require("express");
const v3 = require("./v3");

const api = Router();

api.use("/v3", v3);

module.exports = api;