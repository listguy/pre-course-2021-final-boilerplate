const express = require("express");
const DB = express();
const port = 3002;
const FS = require("fs");

DB.use(express.json());

DB.get("/b/:fileName", (req, res) => {
  FS.readFile(`./backend/${req.params.fileName}.json`, {}, (err, data) => {
    if (err) {
      res.send(err);
    } else {
      res.status(200).json(JSON.parse(data));
    }
  });
});

DB.get("/b", (req, res) => {
  const dir = FS.readdirSync(`./backend/`);
  const jsonFiles = [];
  let resData = [];
  for (let file of dir) {
    if (file.includes(".json")) {
      jsonFiles.push(file);
    }
  }
  for (let file of jsonFiles) {
    const fileData = FS.readFileSync(`./backend/${file}`);
    resData.push(JSON.parse(fileData));
    console.log(resData);
  }

  console.log(resData);
  res.status(200).json(resData);
});

DB.put("/b/:fileName", (req, res) => {
  if (!FS.existsSync(`./backend/${req.params.fileName}.json`)) {
    res.status(404).send("File does not exist!");
  }
  FS.writeFile(
    `./backend/${req.params.fileName}.json`,
    JSON.stringify(req.body),
    () => {
      res.sendStatus(200);
    }
  );
});

DB.post("/b/:fileName", (req, res) => {
  if (FS.existsSync(`./backend/${req.params.fileName}.json`)) {
    res.status(409).send("File already exists!");
  }
  FS.writeFile(
    `./backend/${req.params.fileName}.json`,
    JSON.stringify(req.body),
    () => {
      res.sendStatus(200);
    }
  );
});

DB.delete("/b/:fileName", (req, res) => {
  if (!FS.existsSync(`./backend/${req.params.fileName}.json`)) {
    res.status(409).send("File does not exist!");
  }
  FS.unlinkSync(`./backend/${req.params.fileName}.json`);
  res.sendStatus(200);
});

DB.listen(port, () => console.log("listening on port 3002"));
