let tasks = [];

class Task{
    constructor(priority, text){
        this.priority = priority;
        date = new Date();
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

function displayTasks(){

    let controlSection = document.getElementById("control-section");
    while(controlSection.firstChild){
        controlSection.removeChild(controlSection.firstChild);
    }

    for(task of tasks){
        let todoContainer = document.createElement('div');
        todoContainer.classList.add('todo-container');

        let todoPriority = document.createElement('div');
        todoPriority.classList.add('todo-priority');
        todoPriority.append(task.priority);

        let todoCreatedAt = document.createElement('div');
        todoCreatedAt.classList.add('todo-created-at');
        todoCreatedAt.append(task.createdAt);

        let todoText = document.createElement('div');
        todoText.classList.add('todo-text');
        todoText.append(task.text);
        
        todoContainer.append(todoPriority);
        todoContainer.append(todoCreatedAt);
        todoContainer.append(todoText);

        controlSection.append(todoContainer);
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

function getData(){
    let req = new XMLHttpRequest();

    req.onreadystatechange = () => {
      if (req.readyState == XMLHttpRequest.DONE) {
        console.log(req.responseText);
      }
    };
    
    req.open("GET", "https://api.jsonbin.io/b/6011936f3126bb747e9fd00f", true);
    req.send();

    return req.responseText;
}

console.log(getData());