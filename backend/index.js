const express = require("express");
const DB = express();
const port = 3002;
const FS = require("fs");

DB.use(express.json());

DB.get("/b/:user/:fileName", (req, res) => {
  FS.readFile(
    `./backend/tasks/${req.params.user}/${req.params.fileName}.json`,
    {},
    (err, data) => {
      if (err) {
        res.send(err);
      } else {
        res.status(200).json(JSON.parse(data));
      }
    }
  );
});

DB.get("/b/:user", (req, res) => {
  const dir = FS.readdirSync(`./backend/tasks/${req.params.user}`);
  const jsonFiles = [];
  let resData = [];
  for (let file of dir) {
    if (file.includes(".json")) {
      jsonFiles.push(file);
    }
  }
  for (let file of jsonFiles) {
    const fileData = FS.readFileSync(
      `./backend/tasks/${req.params.user}/${file}`
    );
    resData.push(JSON.parse(fileData));
  }
  res.status(200).json(resData);
});

DB.put("/b/:user/:fileName", async (req, res) => {
  if (
    !FS.existsSync(
      `./backend/tasks/${req.params.user}/${req.params.fileName}.json`
    )
  ) {
    res.status(404).send("File does not exist!");
  }
  if (req.params.fileName === "user-list") {
    await newUser(req.body["newUser"]);
    res.sendStatus(200);
  } else {
    FS.writeFile(
      `./backend/tasks/${req.params.user}/${req.params.fileName}.json`,
      JSON.stringify(req.body),
      () => {
        res.sendStatus(200);
      }
    );
  }
});

DB.post("/b/:fileName", (req, res) => {
  if (
    FS.existsSync(
      `./backend/tasks/${req.params.user}/${req.params.fileName}.json`
    )
  ) {
    res.status(409).send("File already exists!");
  }
  FS.writeFile(
    `./backend/tasks/${req.params.user}/${req.params.fileName}.json`,
    JSON.stringify(req.body),
    () => {
      res.sendStatus(200);
    }
  );
});

DB.delete("/b/:user/:fileName", (req, res) => {
  if (
    !FS.existsSync(
      `./backend/tasks/${req.params.user}/${req.params.fileName}.json`
    )
  ) {
    res.status(409).send("File does not exist!");
  }
  FS.unlinkSync(
    `./backend/tasks/${req.params.user}/${req.params.fileName}.json`
  );
  res.sendStatus(200);
});

DB.listen(port, () => console.log("listening on port 3002"));

async function newUser(userName) {
  FS.mkdirSync(`./backend/tasks/${userName}`);
  FS.writeFileSync(
    `./backend/tasks/${userName}/task1613571281000.json`,
    `{ "priority": "3", "text": "Welcome", "date": 1613571281000, "index": 0 }
  `
  );
  FS.writeFileSync(
    `./backend/tasks/${userName}/task1613571280928.json`,
    `{ "priority": "3", "text": "${userName}", "date": 1613571280928, "index": 1 }
  `
  );
  const userList = JSON.parse(
    FS.readFileSync(`./backend/tasks/users/user-list.json`)
  );
  console.log(userList);
  userList.push(userName);
  console.log(userList);
  FS.writeFileSync(
    `./backend/tasks/users/user-list.json`,
    JSON.stringify(userList)
  );
  return;
}
