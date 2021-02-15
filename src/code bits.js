// fetch with async/await
async function getTaskListFromWeb() {
    let response = await fetch(API_KEY_LATEST);
    if (!response.ok) {
        throw new Error("HTTP-Error: " + response.status);
    }
    jsonBin = await response.json();
    taskList = jsonBin.record["my-todo"];
}
