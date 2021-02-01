"use strict";

let counter = 0;
let id = 0;
let myTodo = { "my-todo": [] };
getJSON();


function getJSON() {
    fetch('https://api.jsonbin.io/v3/b/6013f95e1de5467ca6bdcc4e/latest').then(res => res.json())
        .then(res => {
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
    const pressedClass = event.target.getAttribute('class');
    switch (pressedId) {
        case 'add-button':
            addItem();
            break;
        case 'sort-button':
            sortListByPriority();
            break;
        case 'delete-all':
            deleteList();
            break;
        case 'sort-date':
            sortListByCreationDate();
            break;
    }
    switch (pressedClass) {
        case 'checkbox':
            break;
        case 'button remove-button':
            removeItem(event);
            break;
        case 'edit-button':
            break;
    }

})

function addItem() {
    const viewSection = document.querySelector('.viewSection');
    const input = document.querySelector('#text-input');
    const priority = document.querySelector('#priority-selector');
    const dueDateInput = document.querySelector('#dueDate');
    const dueDate = new Date(dueDateInput.value);
    const temp = input.value;
    id = counter + 1;
    input.value = "";

    if (temp) {
        const div = document.createElement('div');
        div.classList.add('todo-container');
        div.id = id;
        viewSection.append(div);

        const todoCheckbox = document.createElement('input');
        todoCheckbox.type = 'checkbox';
        todoCheckbox.name = 'IsDone';

        const todoText = document.createElement('p');
        todoText.classList.add('todo', 'todo-text');
        todoText.innerText = temp;

        const todoCreationTime = document.createElement('time');
        todoCreationTime.classList.add('todo', 'todo-created-at');
        const currentDate = new Date();
        const formattedDate = sqlDate(currentDate);
        todoCreationTime.innerText = formattedDate;

        const todoPriority = document.createElement('data');
        todoPriority.innerText = priority.value;
        todoPriority.classList.add('todo', 'todo-priority');

        const todoTimeLeft = document.createElement('p');
        const timeLeft = "-";
        if (dueDateInput.value === "") {
            todoTimeLeft.innerText = timeLeft;
        } else {
            const timeLeft = calculateTimeLeft(currentDate, dueDate);
            todoTimeLeft.innerText = timeLeft;
        }
        todoTimeLeft.classList.add('todo', 'todo-time-left')

        const todoOptions = document.createElement('div');
        todoOptions.classList.add('todo');
        const editButton = document.createElement('button');
        const removeButton = document.createElement('button');
        editButton.classList.add('button', 'edit-button');
        removeButton.classList.add('button', 'remove-button');
        editButton.innerText = 'edit';
        removeButton.innerText = 'remove';
        todoOptions.append(editButton);
        todoOptions.append(removeButton);

        div.append(todoCheckbox);
        div.append(todoText);
        div.append(todoCreationTime);
        div.append(todoPriority);
        div.append(todoTimeLeft);
        div.append(todoOptions);

        const item = {
            "id": id,
            "text": temp,
            "date": formattedDate,
            "priority": Number(priority.value),
            "timeLeft": timeLeft,
            "timeInMS": currentDate.getTime()
        };
        myTodo['my-todo'].push(item);

        id++;
        counter++;
        updateCounter();
    }
    updateJSON();
}
function printTodoList(arr) {
    const viewSection = document.querySelector('.viewSection');
    deleteList();
    arr.forEach(element => {
        const div = document.createElement('div');
        div.classList.add('todo-container');
        div.id = element.id;
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
        todoTimeLeft.classList.add('todo', 'todo-time-left')

        const todoOptions = document.createElement('div');
        todoOptions.classList.add('todo');
        const editButton = document.createElement('button');
        const removeButton = document.createElement('button');
        editButton.classList.add('button', 'edit-button');
        removeButton.classList.add('button', 'remove-button');
        editButton.innerText = 'edit';
        removeButton.innerText = 'remove';
        todoOptions.append(editButton);
        todoOptions.append(removeButton);



        div.append(todoCheckbox);
        div.append(todoText);
        div.append(todoCreationTime);
        div.append(todoPriority);
        div.append(todoTimeLeft);
        div.append(todoOptions);
    });

    const x = document.querySelectorAll('.todo-container');
    counter = x.length;
    updateCounter();
}

function deleteList() {
    const viewSection = document.querySelector('.viewSection');
    let childOfViewSection = viewSection.firstChild;
    while (childOfViewSection) {
        viewSection.removeChild(childOfViewSection);
        childOfViewSection = viewSection.firstChild;
    }
}

function sortListByPriority() {
    myTodo["my-todo"].sort((a, b) => (a["priority"] > b["priority"]) ? -1 : 1);
    printTodoList(myTodo["my-todo"]);
}

function sortListByCreationDate() {
    myTodo['my-todo'].sort((a, b) => (a["timeInMS"] > b["timeInMS"]) ? -1 : 1);
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
    const miliSeconds = (finishDate - startDate);
    const diffDays = Math.ceil(miliSeconds / (1000 * 60 * 60 * 24));
    const diffHours = Math.ceil(miliSeconds / (1000 * 60 * 60));
    if (miliSeconds <= 0) {
        return 'Passed!';
    } else {
        return (diffDays > 1) ? `${diffDays} Days` : `${diffHours} Hours`;
    }
}

function removeItem(event) {
    const selectedItem = event.target.closest('.todo-container');
    let selectedIndex = -1;
    // console.log(Number(selectedItem.id));
    for (let i = 0; i < myTodo["my-todo"].length; i++) {
        if (Number(selectedItem.id) === myTodo["my-todo"][i].id) {
            selectedIndex = i;
        }
    }
    // console.log(selectedIndex);
    const removed = myTodo["my-todo"].splice(selectedIndex, 1);
    console.log(removed);
    selectedItem.remove();
    counter--;
    updateJSON();
    updateCounter();
}

function updateCounter() {
    const counterDiv = document.querySelector('#counter');
    counterDiv.innerText = counter;
}