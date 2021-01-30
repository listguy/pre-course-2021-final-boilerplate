"use strict";

let counter = 0;
let myTodo = {
        "my-todo": []
    };
const counterDiv = document.querySelector('#counter');

// resetJSON(); //used to reset the JSON.
getJSON();

// function resetJSON() {
// const resetData = {
//     "my-todo": []
// }
//     fetch('https://api.jsonbin.io/v3/b/6013f95e1de5467ca6bdcc4e', {
//         method: 'PUT',
//         headers: {
//             'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(resetData)
//     })
//         .then(response => response.json())
//         .then(data => {
//             console.log('Success:', data);
//         })
//         .catch((error) => {
//             console.error('Error:', error);
//         });
// }

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
            sortList()
            printTodoList(myTodo['my-todo']);
            updateJSON();
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
            "text": temp,
            "date": currentDate,
            "priority": Number(priority.value)
        };
        myTodo['my-todo'].push(item);
        counter++;
        counterDiv.innerText = `Items Counter: ${counter}`;
    }
    updateJSON();
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
        todoText.innerText = element.text;

        const todoCreationTime = document.createElement('time');
        todoCreationTime.classList.add('todo-created-at');
        todoCreationTime.innerText = element.date;

        const todoPriority = document.createElement('data');
        todoPriority.innerText = element.priority;
        todoPriority.classList.add('todo-priority');

        div.append(todoText);
        div.append(todoCreationTime);
        div.append(todoPriority);
    });
    const x = document.querySelectorAll('.todo-container');
    counter = x.length;
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

function sortList() {
    const sortedArray = [];
    for (let j = 1; j <= 5; j++) {
        for (let i = 0; i < myTodo['my-todo'].length; i++) {
            if (myTodo['my-todo'][i].priority === j) {
                sortedArray.push(myTodo['my-todo'][i]);
            }
        }
    }
    myTodo['my-todo'] = sortedArray;
}