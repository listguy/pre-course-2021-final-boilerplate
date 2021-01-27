"use strict"
document.addEventListener("DOMContentLoaded", onLoad);

let counter;
let sortButton;
let textInput;
let prioritySelector;
let addButton;
let viewSection;
let todoList;

async function onLoad() {
    counter = document.querySelector("#counter");
    sortButton = document.querySelector("#sort-button");
    textInput = document.querySelector("#text-input");
    prioritySelector = document.querySelector("#priority-selector");
    addButton = document.querySelector("#add-button");
    viewSection = document.querySelector("#view-section");
    // todoList = JSON.parse( localStorage.getItem(DB_NAME) );
    todoList = await getPersistent(DB_NAME);
    if(!todoList) {
        todoList = [];
        setPersistent(DB_NAME, todoList);
    }
    renderList();
    
    addButton.onclick = async () => {
        const todo = {
            text: textInput.value,
            priority: prioritySelector.value,
            date: new Date().getTime()
        };
        todoList.push(todo); console.log(todo);
        setPersistent("my-todo", todoList);
        renderList();
        textInput.value = "";
    };
}

function renderList() {
    viewSection.innerHTML = "";
    for(const todo of todoList) {
        const todoElement = createTodoElement(todo);
        viewSection.appendChild(todoElement);
    }
}

function createTodoElement(todo) {

    const container = document.createElement("div");
    const todoPriority = document.createElement("div");
    const timeStamp = document.createElement("div");
    const todoText = document.createElement("div");
    container.classList.add("todo-container");
    todoPriority.classList.add("todo-priority");
    timeStamp.classList.add("todo-created-at");
    todoText.classList.add("todo-text");
    todoPriority.innerText = todo.priority;
    timeStamp.innerText = dateToSQLFormat( new Date(todo.date) );
    todoText.innerText = todo.text;
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