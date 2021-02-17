const express = require("express");
const DB = express();
const port = 3002;
const FS = require("fs");

DB.use(express.json());

DB.get("/b/:fileName", (req, res) => {
  console.log("get");
  FS.readFile(`./backend/v1/${req.params.fileName}.json`, {}, (err, data) => {
    if (err) {
      res.send(err);
    } else {
      // console.log(data);
      res.status(200).json(JSON.parse(data));
    }
  });
});

DB.put("/b/:fileName", (req, res) => {
  // res.send(req.body);
  FS.writeFile(
    `./backend/v1/${req.params.fileName}.json`,
    JSON.stringify(req.body),
    () => {
      res.sendStatus(200);
    }
  );
});

DB.get("/b/", (req, res) => {
  res.send(req.headers);
});

DB.listen(port);
console.log("listening on port 3002");
