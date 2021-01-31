"use strict";

let counter = 0;
let myTodo = { "my-todo": [] };
getJSON();
const counterDiv = document.querySelector('#counter');

function getJSON() {
    fetch('https://api.jsonbin.io/v3/b/6013f95e1de5467ca6bdcc4e/latest').then(res => res.json())
        .then(res => {
            console.log(res);
            if (res.record['my-todo'].length === 0) {
                return;
            } else {
                myTodo['my-todo'] = res.record['my-todo'];
                printTodoList(myTodo['my-todo']);
            }
        })
}

function updateJSON() {
    fetch('https://api.jsonbin.io/v3/b/6013f95e1de5467ca6bdcc4e', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(myTodo)
    })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
        })
        .catch((error) => {
            console.error('Error:', error);
        });
}

document.addEventListener('click', function (event) {
    const pressedId = event.target.id;
    switch (pressedId) {
        case 'add-button':
            addItem();
            break;
        case 'sort-button':
            sortList();
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
    const dueDateInput = document.querySelector('#dueDate');
    const dueDate = new Date(dueDateInput.value);
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
        const currentDate = new Date();
        console.log(`current date: ${currentDate}`);
        const formattedDate = sqlDate(currentDate);
        console.log(`formatted date: ${formattedDate}`);
        todoCreationTime.innerText = formattedDate;

        const todoPriority = document.createElement('data');
        todoPriority.innerText = priority.value;
        todoPriority.classList.add('todo-priority');

        const todoTimeLeft = document.createElement('p');
        const timeLeft = calculateTimeLeft(currentDate, dueDate);
        todoTimeLeft.innerText = timeLeft;

        div.append(todoText);
        div.append(todoCreationTime);
        div.append(todoPriority);
        const item = {
            "text": temp,
            "date": formattedDate,
            "priority": Number(priority.value),
            "timeLeft": timeLeft
        };

        myTodo['my-todo'].push(item);
        counter++;
        counterDiv.innerText = `Tasks: ${counter}`;
    }
    updateJSON();
}
function printTodoList(arr) {
    const viewSection = document.querySelector('.viewSection');
    deleteList();
    arr.forEach(element => {
        const div = document.createElement('div');
        div.classList.add('todo', 'todo-container');
        viewSection.append(div);

        const todoCheckbox = document.createElement('input');
        todoCheckbox.type = 'checkbox';
        todoCheckbox.name = 'IsDone';

        const todoText = document.createElement('p');
        todoText.classList.add('todo', 'todo-text');
        todoText.innerText = element.text;

        const todoCreationTime = document.createElement('time');
        todoCreationTime.classList.add('todo', 'todo-created-at');
        todoCreationTime.innerText = element.date;

        const todoPriority = document.createElement('data');
        todoPriority.innerText = element.priority;
        todoPriority.classList.add('todo', 'todo-priority');

        const todoTimeLeft = document.createElement('p');
        todoTimeLeft.innerText = element.timeLeft;

        div.append(todoCheckbox);
        div.append(todoText);
        div.append(todoCreationTime);
        div.append(todoPriority);
        div.append(todoTimeLeft)
    });

    const x = document.querySelectorAll('.todo-container');
    counter = x.length;
    counterDiv.innerText = `Tasks: ${counter}`;
}

function deleteList() {
    const viewSection = document.querySelector('.viewSection');
    let childOfViewSection = viewSection.firstChild;
    while (childOfViewSection) {
        viewSection.removeChild(childOfViewSection);
        childOfViewSection = viewSection.firstChild;
    }
}

function sortList() {
    myTodo["my-todo"].sort((a, b) => (a["priority"] > b["priority"]) ? -1 : 1);
    printTodoList(myTodo["my-todo"]);
}

function sqlDate(dt) {
    let dtString = dt.getFullYear()
        + '-' + pad2(dt.getMonth() + 1)
        + '-' + pad2(dt.getDate())
        + ' ' + pad2(dt.getHours())
        + ':' + pad2(dt.getMinutes())
        + ':' + pad2(dt.getSeconds());
    return dtString;
}

function pad2(number) {
    return (number < 10 ? '0' : '') + number
}

function calculateTimeLeft(startDate, finishDate) {
    console.log(`start date:  ${startDate} finish date: ${finishDate}`);
    const miliSeconds = (finishDate - startDate);
    const diffDays = Math.ceil(miliSeconds / (1000 * 60 * 60 * 24));
    const diffHours = Math.ceil(miliSeconds / (1000 * 60 * 60));

    return (diffDays > 1) ? `${diffDays} Days` : `${diffHours} Hours`;
}