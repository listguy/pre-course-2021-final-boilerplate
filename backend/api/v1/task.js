const express = require("express");
const fs = require("fs");

const router = express.Router();

router.use(express.json());

router.get("/", (request, response) => {
    const directoriesFound = [];
    try {
        fs.readdirSync('./jsonFiles').forEach(file => {
            directoriesFound.push(file);
        });
        response.send(directoriesFound);
    }
    catch (e) {
        response.status(500).json({ message: "server failed getting files list", error: e });
    }
});

router.get("/:id", (request, response) => {
    const { id } = request.params;
    try {
        const data = fs.readFileSync(
            `./jsonFiles/tasks-${id}.json`,
            { encoding: 'utf8', flag: 'r' });
        response.status(200).send(data);
    }
    catch (e) {
        response.status(422).json({ message: "Bad ID, not found", error: e });
    }
});

router.post("/", (request, response) => {
    const { body } = request;
    try {
        fs.writeFileSync(
            `./jsonFiles/tasks-${Date.now()}.json`,
            JSON.stringify(body, null, 4)
        );
        response.status(201).send("tasks file created");
    } catch (e) {
        response.status(500).json({ message: "Couldn't create file", error: e });
    }
});

router.put("/:id", (request, response) => {
    const { id } = request.params;
    const { body } = request;
    try {
        fs.writeFileSync(
            `./jsonFiles/tasks-${id}.json`,
            JSON.stringify(body, null, 4)
        );
        response.json(body);
    } catch (e) {
        response.status(500).json({ message: "Error!", error: e });
    }
});

module.exports = router;