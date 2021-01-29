
"use strict"
let todoListJson;
let body = document.body;
pullTodoList(todoListJson);
insertTodoList(todoListJson);

async function pullTodoList(todoListJson) {
    let response = await fetch("https://api.jsonbin.io/b/60143f61ef99c57c734b9e06");
    if (response.ok) {
        todoListJson = await response.json();
        insertTodoList(todoListJson);
    } else {
        alert("HTTP-Error: " + response.status);
    }
}

function insertTodoList(todoListJson){
    
}



