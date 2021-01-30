
"use strict"
let taskList;
let body = document.body;
let view = document.getElementById("View");
let control = document.getElementById("Control");

let taskForm = document.getElementById("add-task-form");
taskForm.addEventListener("submit", addNewTask);
taskForm.addEventListener("click", eraseAll);
let counter = document.getElementById("counter");



pullTodoListFromWeb();
async function pullTodoListFromWeb() {
    let response = await fetch("https://api.jsonbin.io/b/60143f61ef99c57c734b9e06/latest ");
    if (response.ok) {
        taskList = await response.json();
        updateCounter();
        if (taskList[0] != false) {
            for (let task of taskList) {
                insertTaskToHtml(task)
            }
        }
    } else {
        alert("HTTP-Error: " + response.status);
    }
}
function addNewTask(event) {
    let text = document.getElementById("text-input").value;
    let priority = document.getElementById("priority-list").value;
    let task = insertTaskToTaskArray(text, priority);

    insertTaskToHtml(task);
    uploadJson();
    updateCounter()
    taskForm.reset();
    event.preventDefault();
}
function insertTaskToTaskArray(text, priority, date = new Date()) {
    if (taskList[0] === false) {
        taskList = [];
    }
    taskList.push({
        text,
        priority,
        date
    });
    return taskList[taskList.length - 1];
}
function insertTaskToHtml(task) {
    let text = task.text;
    let date = (task.date instanceof Date) ? task.date : new Date(task.date);
    let priority = task.priority;

    let containerTemplate = document.querySelector("[data-template]");
    let todoContainer = containerTemplate.cloneNode(true);
    todoContainer.removeAttribute("data-template");


    let textContainer = todoContainer.querySelector(".todo-text")
    let dateContainer = todoContainer.querySelector(".todo-created-at");
    let priorityContainer = todoContainer.querySelector(".todo-priority");

    dateContainer.append(date);
    textContainer.append(text);
    priorityContainer.append(priority);
    view.append(todoContainer);

}
function uploadJson() {
    fetch("https://api.jsonbin.io/b/60143f61ef99c57c734b9e06", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(taskList),
    })
        .then(response => response.json())
        .then(null, error => {
            alert('Error:', error);
        })
}
function eraseAll(event) {
    let deleteBtn = document.getElementById("delete-button")
    if (event.target != deleteBtn)
        return;
    let answer = confirm("Are you sure you want to delete all existing tasks on the list?");
    if (answer) {
        taskList = [false];
        uploadJson();
        let tasks = document.querySelectorAll(".todo-container");
        updateCounter();
        for (let task of tasks) {
            task.remove();
        }
    }
}
function updateCounter() {
    let i;
    i = (taskList[0] != false) ? taskList.length : 0;
    counter.innerText = "You have: " + i + " tasks.";
}






