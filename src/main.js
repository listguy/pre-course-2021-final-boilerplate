let tasks = {"my-todo":[{}]};
fetchTasks();

class Task{
    constructor(priority, text){
        this.priority = priority;
        this.createdAt = getSQLDate(new Date());
        this.text = text;
    }
}

document.getElementById("add-button").addEventListener("click", function() {
    addTask();
  });


async function addTask(){
        if (JSON.stringify(tasks) == '{"my-todo":[{}]}')
            tasks["my-todo"] = [];

        tasks["my-todo"].push(new Task(
            document.getElementById("priority-selector").value,
            document.getElementById("text-input").value),);

        document.getElementById("text-input").value = "";
        refreshCounter();
        sendToServer(tasks);
}

// function sendToServer(tasks){
//     let req = new XMLHttpRequest();

//     req.onreadystatechange = () => {
//       if (req.readyState == XMLHttpRequest.DONE) {
//         console.log(req.responseText);
//         displayTasks(tasks);
//       }
//     };
    
//     req.open("PUT", "https://api.jsonbin.io/b/6011936f3126bb747e9fd00f", true);
//     req.setRequestHeader("Content-Type", "application/json");
//     req.send(JSON.stringify(tasks));
// }

async function sendToServer(tasks){
    await fetch("https://api.jsonbin.io/b/6011936f3126bb747e9fd00f",{method:"put",headers: {"Content-Type": "application/json",},body: JSON.stringify(tasks)});
    displayTasks(tasks);
}

async function fetchTasks(){
    let controlSection = document.getElementById("control-section");
    while(controlSection.firstChild){
        controlSection.removeChild(controlSection.firstChild);
    }

    let response = await fetch('https://api.jsonbin.io/b/6011936f3126bb747e9fd00f/latest');

    if (response.ok) {
        tasks = await response.json();
        console.log("response-status:" + response.status);
        if (JSON.stringify(tasks) !== '{"my-todo":[{}]}'){
            for(task of tasks["my-todo"]){
                let todoContainer = document.createElement('div');
                todoContainer.classList.add('todo-container');

                let todoPriority = document.createElement('div');
                todoPriority.classList.add('todo-priority');
                todoPriority.append(task["priority"]);
        
                let todoCreatedAt = document.createElement('div');
                todoCreatedAt.classList.add('todo-created-at');
                todoCreatedAt.append(task["createdAt"]);
        
                let todoText = document.createElement('div');
                todoText.classList.add('todo-text');
                todoText.append(task["text"]);
                
                todoContainer.append(todoPriority);
                todoContainer.append(todoCreatedAt);
                todoContainer.append(todoText);

                controlSection.append(todoContainer);
            }
        }
    }
    else {
        alert("HTTP-Error: " + response.status);
    }
    refreshCounter();
}

function displayTasks(tasks){
    let controlSection = document.getElementById("control-section");
    while(controlSection.firstChild){
        controlSection.removeChild(controlSection.firstChild);
    }
            for(task of tasks["my-todo"]){
                let todoContainer = document.createElement('div');
                todoContainer.classList.add('todo-container');

                let todoPriority = document.createElement('div');
                todoPriority.classList.add('todo-priority');
                todoPriority.append(task["priority"]);
        
                let todoCreatedAt = document.createElement('div');
                todoCreatedAt.classList.add('todo-created-at');
                todoCreatedAt.append(task["createdAt"]);
        
                let todoText = document.createElement('div');
                todoText.classList.add('todo-text');
                todoText.append(task["text"]);
                
                todoContainer.append(todoPriority);
                todoContainer.append(todoCreatedAt);
                todoContainer.append(todoText);

                controlSection.append(todoContainer);
            }
            refreshCounter();
}

function refreshCounter(){
    counter = document.getElementById("counter");
    counter.innerText = "";
    counter.append(tasks["my-todo"].length);
}

function getSQLDate(date){
    return date.getFullYear() + "-" +
     addZero(date.getMonth() + 1) + "-" +
     addZero(date.getDate()) + " " +
     addZero(date.getHours()) + ":" +
     addZero(date.getMinutes()) + ":" +
     addZero(date.getSeconds());

    function addZero(number){
        if (number < 10)
            return "0" + number;
        else
            return number;
    }
}