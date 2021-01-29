// import axios from 'axios';
"use strict";

let todoArray = [];

async function activateCode() {
    await getJSON();
    console.log(todoArray);
    printTodoList(todoArray);
}

if (document.querySelector('todo-container') === null) {
    activateCode();
}

async function getJSON() {
    const myRequest = new Request('https://api.jsonbin.io/v3/b/6013f95e1de5467ca6bdcc4e');
    // let tempArray = [];
    // const tempObject = {
    //     "text": "",
    //     "priority": "",
    //     "date": ""
    // };
    
    return fetch(myRequest)
        .then(response => response.json())
        .then(data => todoArray = data.record)
        // console.log(data);

    // console.log(obj);
}


const counterDiv = document.querySelector('#counter');
let counter = 0;

document.addEventListener('click', function (event) {
    // console.log(event.target)
    const pressedId = event.target.id;
    switch (pressedId) {
        case 'add-button':
            addItem();
            break;
        case 'sort-button':
            printTodoList(sortList(todoArray));
            break;
        case 'delete-all':
            deleteList();
            break;
        default:
            return;
    }

})

function addItem() {
    const viewSection = document.querySelector('.viewSection');
    const input = document.querySelector('#text-input');
    const priority = document.querySelector('#priority-selector');
    const temp = input.value;
    input.value = "";

    if (temp) {
        const div = document.createElement('div');
        div.classList.add('todo-container');
        viewSection.append(div);
        const todoText = document.createElement('p');
        todoText.classList.add('todo-text');
        todoText.innerText = temp;

        const todoCreationTime = document.createElement('time');
        todoCreationTime.classList.add('todo-created-at');
        const currentDate = new Date().toLocaleString('he-IL');
        todoCreationTime.innerText = currentDate;

        const todoPriority = document.createElement('data');
        todoPriority.innerText = priority.value;
        todoPriority.classList.add('todo-priority');

        div.append(todoText);
        div.append(todoCreationTime);
        div.append(todoPriority);
        const item = {
            "Task": temp,
            "CreationTime": currentDate,
            "priority": Number(priority.value)
        };
        todoArray.push(item);
        counter++;
        counterDiv.innerText = `Items Counter: ${counter}`;
    }
}
function printTodoList(arr) {
    const viewSection = document.querySelector('.viewSection');
    deleteList();
    arr.forEach(element => {
        const div = document.createElement('div');
        div.classList.add('todo-container');
        viewSection.append(div);
        const todoText = document.createElement('p');
        todoText.classList.add('todo-text');
        todoText.innerText = element.Task;

        const todoCreationTime = document.createElement('time');
        todoCreationTime.classList.add('todo-created-at');
        todoCreationTime.innerText = element.CreationTime;

        const todoPriority = document.createElement('data');
        todoPriority.innerText = element.priority;
        todoPriority.classList.add('todo-priority');

        div.append(todoText);
        div.append(todoCreationTime);
        div.append(todoPriority);
    });
    counterDiv.innerText = `Items Counter: ${counter}`;
}

function deleteList() {
    const viewSection = document.querySelector('.viewSection');
    let childOfViewSection = viewSection.firstChild;
    while (childOfViewSection) {
        viewSection.removeChild(childOfViewSection);
        childOfViewSection = viewSection.firstChild;
    }
}

function sortList(arr) {
    const sortedArray = [];
    for (let j = 1; j <= 5; j++) {
        for (let i = 0; i < arr.length; i++) {
            if (arr[i].priority === j) {
                sortedArray.push(arr[i]);
            }
        }
    }
    return sortedArray;
}