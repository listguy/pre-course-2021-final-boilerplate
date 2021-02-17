const express = require("express");
const DB = express();
const port = 3002;
const FS = require("fs");

DB.use(express.json());

DB.get("/b/:fileName", (req, res) => {
  FS.readFile(`./${req.params.fileName}.json`, {}, (err, data) => {
    if (err) {
      res.send(err);
    } else {
      res.send(data);
    }
  });
});

DB.put("/b/:fileName", (req, res) => {
  // res.send(req.body);
  FS.writeFile(
    `./${req.params.fileName}.json`,
    JSON.stringify(req.body),
    () => {
      res.send("200");
    }
  );
});

DB.listen(port);
