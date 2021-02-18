const express = require("express");
const fs = require("fs");
const { v4: uuid } = require('uuid')

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
        response.status(400).json({ message: "Bad ID, not found", error: e });
    }
});

router.post("/", (request, response) => {
    const { body } = request;
    try {
        fs.writeFileSync(
            `./backend/jsonFiles/${uuid()}.json`,
                JSON.stringify(body, null, 4)
        );
        response.status(200).json({
            "body": body,
        })
    } catch (e) {
        response.status(400).json({
            "message": "Couldn't create file",
            "error": e,
            "success": false
        });
    }
});

router.put("/:id", (request, response) => {
    const { id } = request.params;
    const { body } = request;
    const fileExists = fs.existsSync(`./backend/jsonFiles/${id}.json`);
    if (!fileExists) {
        response.status(404).json(
            {
                "message": "File not found",
                "success": false
            });
        return;
    }
    fs.writeFileSync(`./backend/jsonFiles/${id}.json`,
        JSON.stringify(body, null, 4));
        response.status(200).send(body);
});

router.delete("/:id", (request, response) => {
    const { id } = request.params;
    const fileExists = fs.existsSync(`./backend/jsonFiles/${id}.json`);
    if (!fileExists) {
        response.status(401).json(
            {
                "message": "File not found",
                "success": false
            });
    return;
        }
        fs.unlinkSync(`./backend/jsonFiles/${id}.json`);
        response.status(200).json({
            "message": "File deleted",
            "success": true
        });
})

module.exports = router;