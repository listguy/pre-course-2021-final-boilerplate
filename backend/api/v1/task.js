const express = require("express");
const fs = require("fs");

const router = express.Router();

router.use(express.json());

router.get("/", (request, response) => {
    const listOfObjectsFound = [];
    try {
        fs.readdirSync('./backend/jsonFiles').forEach(file => {
           const fileContent = fs.readFileSync(
                `./backend/jsonFiles/${file}`,
                { encoding: 'utf8', flag: 'r' });
                const fileContentJson = JSON.parse(fileContent);
                listOfObjectsFound.push(fileContentJson);
        });
        response.send(listOfObjectsFound);
    }
    catch (e) {
        response.status(500).json({
             "message": "Couldn't get files list", 
             "error": e,
             "success": false 
            });
    }
});

router.get("/:id", (request, response) => {
    const { id } = request.params;
    try {
        const data = fs.readFileSync(
            `./backend/jsonFiles/${id}.json`,
            { encoding: 'utf8', flag: 'r' });
            const dataJson = JSON.parse(data);
        response.status(200).send(dataJson);
    }
    catch (e) {
        response.status(422).json({ message: "Bad ID, not found", error: e });
    }
});

router.post("/", (request, response) => {
    const { body } = request;
    try {
        fs.writeFileSync(
            `./backend/jsonFiles/${Date.now()}.json`,
            JSON.stringify(body, null, 4)
        );
        response.status(200).json({
            "body": body,
        })
    } catch (e) {
        response.status(500).json({
            "message": "Couldn't create file",
            "error": e,
            "success": false
        });
    }
});

router.put("/:id", (request, response) => {
    const { id } = request.params;
    const { body } = request;
    const fileExists = fs.existsSync(`./backend/jsonFiles/${id}`);
    if (!fileExists) {
        response.status(404).json(
            {
                "message": "File not found",
                "success": false
            })
        return;
    }
    fs.writeFileSync(`./jsonFiles/tasks-${id}.json`,
        JSON.stringify(body, null, 4))
});

module.exports = router;