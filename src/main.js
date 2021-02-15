/*
WEBSITE START
*/
const spinner = document.getElementById("spinner");
let tasks = [{}];
setMode();
fetchTasks();

/*
EVENT LISTENERS
*/
// pressing on add button
document.getElementById("add-button").addEventListener("click", function() {
    if (document.getElementById("text-input").value === "") // no input
        alert("Please enter text");
    else
        addTask();
});

// pressing on sort button
document.getElementById("sort-button").addEventListener("click", function() {
    let buttonText = document.getElementById('sort-button').innerText;
    if (buttonText === 'Sort by priority 🠋' || buttonText === 'Sort by priority ✖'){
        sortTasks('higherUp');
        sortButton.innerText = 'Sort by priority 🠉'
    } else {
        sortTasks('higherDown');
        sortButton.innerText = 'Sort by priority 🠋';
    }
});

// switch between dark and light mode. saves the preference to localStorage
let modeButton = document.getElementById("mode-button");
modeButton.addEventListener("click", function() {
    if (modeButton.innerText === 'Light Mode'){
        localStorage.setItem('mode', 'light');
        setMode();
    } else {
        localStorage.setItem('mode', 'dark');
        setMode();
    }
});

// pressing on delete button for task
document.body.addEventListener('click', function (event) {
    if (event.target.className === 'delete-button') {
        let todoContainer = event.target.parentNode;

        let createdAt;
        for (let i = 0; i < todoContainer.childNodes.length; i++) {
            if (todoContainer.childNodes[i].className == "todo-created-at") {
              createdAt = todoContainer.childNodes[i].innerText;
              deleteTask(createdAt);
              break;
            }   
        }
    }
}, false);

/*
TASK CLASS
*/
class Task{
    constructor(priority, text){
        this.priority = priority;
        this.createdAt = getSQLDate(new Date());
        this.text = text;
    }
}

/*
FUNCTIONS
*/

// sets the mode on page load in accordance with the localStorage value
function setMode() {
    let mode = localStorage.getItem('mode');
    let modeButton = document.getElementById("mode-button");
    let cssLink = document.getElementById('stylesheet');
    if (mode === 'light'){
        modeButton.innerText = 'Dark Mode';
        cssLink.setAttribute('href', './lightmode.css');
    } else {
        modeButton.innerText = 'Light Mode';
        cssLink.setAttribute('href', './darkmode.css');
    }
}

// updates jsonbin.io with current tasks and refresh the tasks
async function putTasks(){
    showSpinner();
    fetch("https://api.jsonbin.io/v3/b/6011936f3126bb747e9fd00f",{method:"put",headers: {"Content-Type": "application/json",},body: JSON.stringify({"my-todo": tasks})})
    .then(response => {
        showTasks();
        hideSpinner();
    });
}

// displays tasks from jsonbin.io
function fetchTasks(){
    showSpinner();
    fetch('https://api.jsonbin.io/v3/b/6011936f3126bb747e9fd00f/latest')
        .then(response => response.json())
        .then(data => {tasks = data["record"]["my-todo"];
        showTasks();
        hideSpinner();
    });
}

// adds a task, refreshes the counter and updates jsonbin.io
async function addTask(){
        if (JSON.stringify(tasks) == '[{}]')
            tasks = [];

        tasks.push(new Task(
            document.getElementById("priority-selector").value,
            document.getElementById("text-input").value),);

        document.getElementById("text-input").value = "";
        document.getElementById("text-input").focus();
        putTasks();
}

// deletes a task and updates jsonbin.io
function deleteTask(createdAt){
    for (let i = 0; i < tasks.length; i++){
        if (tasks[i]["createdAt"] === createdAt){
            tasks.splice(i,1);
            putTasks();
        }
    }
}

// sorts tasks by priority
function sortTasks(direction){
    if (JSON.stringify(tasks) !== '[{}]')
        if (direction === "higherUp")
            tasks.sort((a, b) => (a["priority"] > b["priority"]) ? -1 : 1);
        else
            tasks.sort((a, b) => (a["priority"] > b["priority"]) ? 1 : -1);
    showTasks();
}

// displays tasks
function showTasks(){

    // clearing the current tasks from the document
    let viewSection = document.getElementById("view-section");
    while(viewSection.firstChild){
        viewSection.removeChild(viewSection.firstChild);
    }

    // shows the tasks on the document
    if (JSON.stringify(tasks) !== '[]'){
        for(task of tasks){
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
            

            let deleteButton = document.createElement('button');
            deleteButton.classList.add('delete-button');
            deleteButton.append("X");
            
            if (task["priority"] === '3') todoPriority.classList.add('yellow-text');
            if (task["priority"] === '4') todoPriority.classList.add('orange-text');
            if (task["priority"] === '5') todoPriority.classList.add('red-text');
            
            todoContainer.append(todoText);
            todoContainer.append(todoPriority);
            todoContainer.append(todoCreatedAt);
            todoContainer.append(deleteButton);
            
            viewSection.append(todoContainer);
        }
    }
    refreshCounter();
}

// refreshes the counter to correctly show task amount
function refreshCounter(){
    let counter = document.getElementById("counter");
    counter.innerText = "";
    if (JSON.stringify(tasks) === '[{}]')
        counter.append('0');
    else
        counter.append(tasks.length);
}

// receives date object, returns string with the date in SQL format
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

/*
LOADING SPINNER
*/
function showSpinner() {
    spinner.className = "show";
    setTimeout(() => {
      spinner.className = spinner.className.replace("show", "");
    }, 15000);
  }
  
  function hideSpinner() {
    spinner.className = spinner.className.replace("show", "");
  }
