
"use strict"
let todoListJson;
let body = document.body;
let view = document.getElementById("View");
let control = document.getElementById("Control");

pullTodoList();
async function pullTodoList() {
    let response = await fetch("https://api.jsonbin.io/b/60143f61ef99c57c734b9e06/latest ");
    if (response.ok) {
        todoListJson = await response.json();
        for (let task of todoListJson) {
            insertTask(task)
        }
    } else {
        alert("HTTP-Error: " + response.status);
    }
}

let taskForm = document.getElementById("add-task");
taskForm.addEventListener("submit", addTodoItem);

function addTodoItem(event) {
    let text = document.getElementById("text-input").value;
    let priority = document.getElementById("priority-selector").value;
    let task = newTask(text, priority);
    insertTask(task);
    uploadJson();
    event.preventDefault();
}

function newTask(text, priority, date = new Date()) {
    todoListJson.push({
        text,
        priority,
        date
    });
    return todoListJson[todoListJson.length - 1];

}

function insertTask(task) {
    let text = task.text;
    let date = (task.date instanceof Date) ? task.date : new Date(task.date);
    let priority = task.priority;

    let textContainer = document.createElement("div");
    textContainer.classList.add("todo-text");
    let dateContainer = document.createElement("div");
    dateContainer.classList.add("todo-created-at");
    let priorityContainer = document.createElement("div");
    priorityContainer.classList.add("todo-priority");

    dateContainer.append(date);
    textContainer.append(text);
    priorityContainer.append(priority);

    let todoContainer = document.createElement("div");
    todoContainer.classList.add("todo-container");
    todoContainer.append(priorityContainer, dateContainer, textContainer);
    view.append(todoContainer);

}

function uploadJson() {
    fetch("https://api.jsonbin.io/b/60143f61ef99c57c734b9e06", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(todoListJson),
    })
        .then(response => response.json())
        .then(null,error => {
            alert('Error:', error);
        })
}





