
"use strict"
let todoListJson;
let body = document.body;
let view = document.getElementById("View");
pullTodoList(todoListJson);

async function pullTodoList(todoListJson) {
    let response = await fetch("https://api.jsonbin.io/b/60143f61ef99c57c734b9e06");
    if (response.ok) {
        todoListJson = await response.json();
        insertTodoList(todoListJson);
    } else {
        alert("HTTP-Error: " + response.status);
    }
}

function insertTodoList(todoListJson) {
    if (todoListJson === {}){
        alert ("empty list");
        return;
    }
    for (let todo of todoListJson) {

        let textContainer = document.createElement("div");
        textContainer.classList.add("todo-text");
        let text = todo.text;
        textContainer.append(text);

        let dateContainer = document.createElement("div");
        dateContainer.classList.add("todo-created-at");
        let date = new Date(todo.date);
        dateContainer.append(date);


        let priorityContainer = document.createElement("div");
        priorityContainer.classList.add("todo-priority");
        let priority = todo.priority;
        priorityContainer.append(priority);

        let todoContainer = document.createElement("div");
        todoContainer.classList.add("todo-container");
        todoContainer.append(priorityContainer, dateContainer, textContainer);

        view.append(todoContainer);

    }
}



