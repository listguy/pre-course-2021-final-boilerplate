displayTasks();

class Task{
    constructor(priority, text){
        this.priority = priority;
        this.createdAt = new Date().toLocaleString("SQL").replace(',','').replace('.','-').replace('.','-');
        this.text = text;
    }
}

document.getElementById("add-button").addEventListener("click", function() {
    addTask();
  });

function addTask(){
    let requestURL = 'https://api.jsonbin.io/b/6011936f3126bb747e9fd00f/latest';
    let request = new XMLHttpRequest();
    request.open('GET', requestURL);
    request.responseType = 'json';
    request.send();

    request.onload = function() {
        let binTasks = request.response;
        
        if (JSON.stringify(binTasks) === "[{}]")
            binTasks = []

        binTasks.push(new Task(
            document.getElementById("priority-selector").value,
            document.getElementById("text-input").value),);
    
        document.getElementById("text-input").value = "";
        sendToServer(binTasks);
    }

}

function sendToServer(binTasks){
    let req = new XMLHttpRequest();

    req.onreadystatechange = () => {
      if (req.readyState == XMLHttpRequest.DONE) {
        console.log(req.responseText);
        displayTasks();
      }
    };
    
    req.open("PUT", "https://api.jsonbin.io/b/6011936f3126bb747e9fd00f", true);
    req.setRequestHeader("Content-Type", "application/json");
    req.send(JSON.stringify(binTasks));
}

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
        let binTasks = request.response;
        if (JSON.stringify(binTasks) !== "[{}]"){
            for(task of binTasks){
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
}

function refreshCounter(){
    counter = document.getElementById("counter");
    counter.innerText = "";
    counter.append(tasks.length);
}
