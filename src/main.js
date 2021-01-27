let tasks = [];

class Task{
    constructor(priority, createdAt, text){
        this.priority = priority;
        this.createdAt = createdAt;
        this.text = text;
    }
}

function addTask(){
    tasks.push(new Task(
        document.getElementById("priority-selector").value,
        new Date(),
        document.getElementById("text-input").value),);
}

document.getElementById("add-button").addEventListener("click", function() {
    addTask();
    console.log(tasks);
  });



