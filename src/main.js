"use strict"
document.addEventListener("DOMContentLoaded", onLoad);

let counter;
let sortButton;
let textInput;
let prioritySelector;
let addButton;
let viewSection;

function onLoad() {
    counter = document.querySelector("#counter");
    sortButton = document.querySelector("#sort-button");
    textInput = document.querySelector("#text-input");
    prioritySelector = document.querySelector("#priority-selector");
    addButton = document.querySelector("#add-button");
    viewSection = document.querySelector("#view-section");

    addButton.onclick = () => {
        const todo = createTodo(textInput.value, prioritySelector.value);
        viewSection.appendChild(todo);
    };
}



function createTodo(text, priority) {
    const container = document.createElement("div");
    const todoPriority = document.createElement("div");
    const timeStamp = document.createElement("div");
    const todoText = document.createElement("div");
    container.classList.add("todo-container");
    todoPriority.classList.add("todo-priority");
    timeStamp.classList.add("todo-created-at");
    todoText.classList.add("todo-text");
    todoPriority.innerText = priority;
    timeStamp.innerText = dateToSQLFormat( new Date() );
    todoText.innerText = text;
    container.append(todoPriority, timeStamp, todoText);
    return container;
}

function dateToSQLFormat(date) {
    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1); 
    const day = pad(date.getDate());
    const hour = pad(date.getHours());
    const minutes = pad(date.getMinutes()); 
    const seconds = pad(date.getSeconds()); 
    return `${year}-${month}-${day} ${hour}:${minutes}:${seconds}`;

    function pad(num) {
        return (num + "").length < 2 ? "0" + num : num;
    }
}