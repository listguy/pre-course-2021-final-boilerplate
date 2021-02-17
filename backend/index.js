const express = require("express");
const DB = express();
const port = 3002;
const FS = require("fs");

DB.use(express.json());

DB.listen(port);
