"use strict"

let textInput;
let prioritySelector;
let addButton;
let sortButton;
let clearButton;
let counter;
let viewSection;
let todoList;

document.addEventListener("DOMContentLoaded", onLoad);
async function onLoad() {
    //setup
    textInput = document.querySelector("#text-input");
    prioritySelector = document.querySelector("#priority-selector");
    addButton = document.querySelector("#add-button");
    sortButton = document.querySelector("#sort-button");
    clearButton = document.querySelector("#clear-button");
    counter = document.querySelector("#counter");
    viewSection = document.querySelector("#view-section");
    todoList = await getPersistent(DB_NAME);
    if(!todoList) todoList = [];
    renderList();
    //UI elements events
    addButton.onclick = async () => {
        const todo = {
            checked: false,
            text: textInput.value,
            priority: prioritySelector.value,
            date: new Date().getTime()
        };
        todoList.push(todo);
        setPersistent(DB_NAME, todoList);
        renderList();
        textInput.value = "";
    };

    sortButton.onclick = () => {
        todoList.sort( (a,b) => Number(b.priority) - Number(a.priority) );
        renderList();
    };

    clearButton.onclick = event => {
        if(!confirm("Are you sure?")) return;
        const selectedElements = viewSection.querySelectorAll(".selected");
        console.log(selectedElements);
        if (selectedElements.length > 0) {
            event.preventDefault();
            for (const element of selectedElements) {
                removeElement(element);
            }
            counter.innerText = todoList.length;
        } else {
            todoList = [];
            renderList();
        }
        setPersistent(DB_NAME, todoList);
    }

    //selector event listener
    document.addEventListener("click",  event => {
        const item = event.target;
        const todoElements = viewSection.querySelectorAll(".todo-container");
        if (hasClass( item, "todo-container") ) {
            if(!event.ctrlKey) {
                for (const element of todoElements) {
                    element.classList.remove("selected");
                }
            } 
            item.classList.add("selected");
            event.preventDefault();
        } else {
            for (const element of todoElements) {
                element.classList.remove("selected");
            }
        }
    });

    //checkbox
    viewSection.addEventListener("change", event => {
        const checkbox = event.target;
        if( !hasClass(checkbox, "todo-check") ) return;
        let checkboxs = viewSection.querySelectorAll(".todo-check");
        checkboxs = Array.from(checkboxs);
        const index = checkboxs.indexOf(checkbox);
        todoList[index].checked = checkbox.checked;
        setPersistent(DB_NAME, todoList);
    });
}

//helper functions

//clears view-section & inserts items from todoList
function renderList() {
    viewSection.innerHTML = "";
    counter.innerText = todoList.length;
    for(const todo of todoList) {
        const todoElement = createTodoElement(todo);
        console.log(todoElement.querySelector(".todo-check").checked);
        viewSection.appendChild(todoElement);
    }
}

//builds an html element from todo object
function createTodoElement(todo) {
    const container = document.createElement("div");
    const todoCheck = document.createElement("input");
    const todoPriority = document.createElement("div");
    const timeStamp = document.createElement("div");
    const todoText = document.createElement("div");
    container.classList.add("todo-container");
    todoCheck.classList.add("todo-check");
    todoPriority.classList.add("todo-priority");
    timeStamp.classList.add("todo-created-at");
    todoText.classList.add("todo-text");
    todoCheck.setAttribute("Type", "checkbox");
    todoCheck.checked = todo.checked;
    todoPriority.innerText = todo.priority;
    timeStamp.innerText = dateToSQLFormat( new Date(todo.date) );
    todoText.innerText = todo.text;
    container.append(todoCheck,todoPriority, timeStamp, todoText);
    return container;
}

//returns SQL datetime format from Date object
function dateToSQLFormat(date) {
    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1); 
    const day = pad(date.getDate());
    const hour = pad(date.getHours());
    const minutes = pad(date.getMinutes()); 
    const seconds = pad(date.getSeconds()); 
    return `${year}-${month}-${day} ${hour}:${minutes}:${seconds}`;

    function pad(num) {//pads single digit value with 0
        return (num + "").length < 2 ? "0" + num : num;
    }
}

function hasClass(element, className) {
    const classes = element.className.split(" ");
    return classes.indexOf(className) > -1;
}

//removes todo from html and todoList
function removeElement(element) {
    const todoElements = Array.from(viewSection.querySelectorAll(".todo-container"));
    const index = todoElements.indexOf(element);
    element.remove();
    todoList.splice(index, 1);
}