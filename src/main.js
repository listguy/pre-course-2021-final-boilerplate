"use strict";

let counter = 0;
let todoArray = [];
const counterDiv = document.querySelector('#counter');

// resetJSON(); //used to reset the JSON.
getJSON();

// function resetJSON() {
// const resetData = [{"taskText": ""}]
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
            // console.log(res.record[0].taskText === "");
            if (res.record[0].taskText === "") {
                return;
            } else {
                todoArray = res.record;
                console.log(todoArray);
                printTodoList(todoArray);
            }
        })
}

function updateJSON() {
    fetch('https://api.jsonbin.io/v3/b/6013f95e1de5467ca6bdcc4e', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(todoArray)
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
            "taskText": temp,
            "creationTime": currentDate,
            "priority": Number(priority.value)
        };
        console.log(todoArray)
        todoArray.push(item);
        counter++;
        counterDiv.innerText = `Items Counter: ${counter}`;
    }
    updateJSON();
}
function printTodoList(arr) {
    console.log(arr);
    if (arr.length === 0) {
        return;
    }
    const viewSection = document.querySelector('.viewSection');
    deleteList();
    arr.forEach(element => {
        const div = document.createElement('div');
        div.classList.add('todo-container');
        viewSection.append(div);
        const todoText = document.createElement('p');
        todoText.classList.add('todo-text');
        todoText.innerText = element.taskText;

        const todoCreationTime = document.createElement('time');
        todoCreationTime.classList.add('todo-created-at');
        todoCreationTime.innerText = element.creationTime;

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