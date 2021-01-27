let tasks = [];

class Task{
    constructor(priority, text){
        this.priority = priority;
        let date = new Date();
        this.createdAt = date.toLocaleString("SQL");
        this.text = text;
    }
}

function addTask(){
    tasks.push(new Task(
        document.getElementById("priority-selector").value,
        document.getElementById("text-input").value),);

    document.getElementById("text-input").value = "";
    displayTasks();
}

function sendToServer(){
    let req = new XMLHttpRequest();

    req.onreadystatechange = () => {
      if (req.readyState == XMLHttpRequest.DONE) {
        console.log(req.responseText);
      }
    };
    
    req.open("PUT", "https://api.jsonbin.io/b/6011936f3126bb747e9fd00f", true);
    req.setRequestHeader("Content-Type", "application/json");
    req.send('[{"priority":3,"date":"2021-01-27 18:11:03","text":"apple"},{"priority": 4, "date": "2021-01-26 18:11:03","text": "orange"}]');
}

sendToServer();
displayTasks();

function displayTasks(){

    let controlSection = document.getElementById("control-section");
    while(controlSection.firstChild){
        controlSection.removeChild(controlSection.firstChild);
    }

    let requestURL = 'https://api.jsonbin.io/b/6011936f3126bb747e9fd00f/latest';
    let request = new XMLHttpRequest();
    request.open('GET', requestURL);
    request.responseType = 'json';
    request.send();

    request.onload = function() {
        let superHeroes = request.response;
    
        for(task of superHeroes){
            let todoContainer = document.createElement('div');
            todoContainer.classList.add('todo-container');

            let todoPriority = document.createElement('div');
            todoPriority.classList.add('todo-priority');
            todoPriority.append(task["priority"]);
    
            let todoCreatedAt = document.createElement('div');
            todoCreatedAt.classList.add('todo-created-at');
            todoCreatedAt.append(task["date"]);
    
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

document.getElementById("add-button").addEventListener("click", function() {
    addTask();
    refreshCounter();
  });

function refreshCounter(){
    counter = document.getElementById("counter");
    counter.innerText = "";
    counter.append(tasks.length);
}
