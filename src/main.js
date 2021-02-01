"use strict";

const mode = localStorage.getItem("mode"); 
const isDarkMode = window.matchMedia && 
    window.matchMedia('(prefers-color-scheme: dark)').matches;
if (isDarkMode && mode !== 'light') {
    localStorage.setItem("mode", "dark");
}

if (mode === 'dark') {
    const theme = document.querySelector("#theme-link");
    theme.href = "darkStyle.css";
}
let counter = 0;
let id = 0;
let tasks = { "my-todo": [] };
getJSON();


function getJSON() {
    fetch('https://api.jsonbin.io/v3/b/6013f95e1de5467ca6bdcc4e/latest').then(res => res.json())
        .then(res => {
            if (res.record['my-todo'].length === 0) {
                return;
            } else {
                tasks['my-todo'] = res.record['my-todo'];
                printTodoList(tasks['my-todo']);
            }
        })
}

function updateJSON() {
    fetch('https://api.jsonbin.io/v3/b/6013f95e1de5467ca6bdcc4e', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(tasks)
    })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
        })
        .catch((error) => {
            console.error('Error:', error);
        });
}

document.addEventListener('click', function (event) { //manages all the clicks
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
        case 'sort-dueDate':
            sortListByDueDate();
            break;
        case 'mode-button':
        const theme = document.querySelector("#theme-link");
        if (theme.getAttribute("href") == "lightStyle.css") {
            theme.href = "darkStyle.css";
            localStorage.setItem("mode", "dark");
        } else {
            theme.href = "lightStyle.css";
            localStorage.setItem("mode", "light");
        }
        break;
    }
    switch (pressedClass) {
        case 'checkbox':
            break;
        case 'button remove-button':
            removeItem(event);
            break;
        case 'button edit-button':
            editItem(event);
            break;
    }

})

function addItem() { //adds an task locally, and to the array as object.
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
            const timeLeft = calculateTimeLeft(dueDate.getTime());
            todoTimeLeft.innerHTML = timeLeft;
        }
        todoTimeLeft.classList.add('todo', 'todo-time-left')

        const todoOptions = document.createElement('div');
        todoOptions.classList.add('todo', 'options-buttons');
        const editButton = document.createElement('button');
        const removeButton = document.createElement('button');
        editButton.classList.add('button', 'edit-button');
        removeButton.classList.add('button', 'remove-button');
        editButton.innerText = 'edit';
        removeButton.innerText = 'remove';
        todoOptions.append(editButton);
        todoOptions.append(removeButton);

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
            "timeInMS": currentDate.getTime(),
            "dueDateRaw": dueDate.getTime()
        };

        tasks['my-todo'].push(item);
        id++;
        counter++;
        updateCounter();
    }
    updateJSON();
}
function printTodoList(arr) { //display the tasks from the array.
    const viewSection = document.querySelector('.viewSection');
    deleteList();
    arr.forEach(element => {
        const div = document.createElement('div');
        div.classList.add('todo-container');
        div.id = element.id;
        viewSection.append(div);

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
        todoTimeLeft.innerHTML = calculateTimeLeft(element.dueDateRaw);
        todoTimeLeft.classList.add('todo', 'todo-time-left')

        const todoOptions = document.createElement('div');
        todoOptions.classList.add('todo', 'options-buttons');
        const editButton = document.createElement('button');
        const removeButton = document.createElement('button');
        editButton.classList.add('button', 'edit-button');
        removeButton.classList.add('button', 'remove-button');
        editButton.innerText = 'edit';
        removeButton.innerText = 'remove';
        todoOptions.append(editButton);
        todoOptions.append(removeButton);

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

function deleteList() { //clears the tasks area
    const viewSection = document.querySelector('.viewSection');
    let childOfViewSection = viewSection.firstChild;
    while (childOfViewSection) {
        viewSection.removeChild(childOfViewSection);
        childOfViewSection = viewSection.firstChild;
    }
}

function sortListByPriority() {
    const sortPriorityButton = document.querySelector('.sortByPriority');

    if (sortPriorityButton.id === 'AscendingPriority') {
        tasks["my-todo"].sort((a, b) => (a["priority"] > b["priority"]) ? -1 : 1);
        sortPriorityButton.id = 'DescendingPriority';
    } else {
        tasks["my-todo"].sort((a, b) => (a["priority"] > b["priority"]) ? 1 : -1);
        sortPriorityButton.id = 'AscendingPriority';
    }
    printTodoList(tasks["my-todo"]);
}

function sortListByCreationDate() {
    const sortDateButton = document.querySelector('.sortByDate');

    if (sortDateButton.id === 'AscendingDate') {
        tasks['my-todo'].sort((a, b) => (a["timeInMS"] > b["timeInMS"]) ? -1 : 1);
        sortDateButton.id = 'DescendingDate';
    } else {
        tasks["my-todo"].sort((a, b) => (a["timeInMS"] > b["timeInMS"]) ? 1 : -1);
        sortDateButton.id = 'AscendingDate';
    }
    printTodoList(tasks["my-todo"]);
}

function sortListByDueDate() {
    const sortDueDateButton = document.querySelector('.sortByDueDate');

    if (sortDueDateButton.id === 'AscendingDueDate') {
        tasks['my-todo'].sort((a, b) => (a["dueDateRaw"] > b["dueDateRaw"]) ? -1 : 1);
        sortDueDateButton.id = 'DescendingDueDate';
    } else {
        tasks["my-todo"].sort((a, b) => (a["dueDateRaw"] > b["dueDateRaw"]) ? 1 : -1);
        sortDueDateButton.id = 'AscendingDueDate';
    }
    printTodoList(tasks["my-todo"]);
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

function calculateTimeLeft(finishDate) {
    const now = new Date().getTime();;
    const miliSeconds = (finishDate - now);
    const diffDays = Math.ceil(miliSeconds / (1000 * 60 * 60 * 24));
    const diffHours = Math.ceil(miliSeconds / (1000 * 60 * 60));
    if (miliSeconds <= 0) {
        return 'Passed!';
    } else {
        return (diffDays > 1) ? `<i class="material-icons">access_time</i> &nbsp; &nbsp; ${diffDays} Days` : `<i class="material-icons">access_time</i> &nbsp; &nbsp; ${diffHours} Hours`;
    }
}

function removeItem(event) {
    const selectedItem = event.target.closest('.todo-container');
    let selectedIndex = -1;
    for (let i = 0; i < tasks["my-todo"].length; i++) {
        if (Number(selectedItem.id) === tasks["my-todo"][i].id) {
            selectedIndex = i;
        }
    }
    tasks["my-todo"].splice(selectedIndex, 1);
    selectedItem.remove();
    counter--;
    updateJSON();
    updateCounter();
}

function editItem(event) {
    const selectedItem = event.target.closest('.todo-container');
    let selectedIndex = -1;
    for (let i = 0; i < tasks["my-todo"].length; i++) {
        if (Number(selectedItem.id) === tasks["my-todo"][i].id) {
            selectedIndex = i;
        }
    }
    const newText = prompt('Enter the task text.');
    if (newText === '') {
        return;
    } else {
    tasks["my-todo"][selectedIndex].text = newText;
    printTodoList(tasks["my-todo"]);
    updateJSON();
    }
}

function updateCounter() {
    const counterDiv = document.querySelector('#counter');
    counterDiv.innerText = counter;
}