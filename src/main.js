"use strict";

const todoArray = [];


const counterDiv = document.querySelector('#counter');
let counter = 0;

document.addEventListener('click', function (event) {
    // console.log(event.target)
    const pressedId = event.target.id;
    switch (pressedId) {
        case 'add-button':
            addItem();
            break
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
        counterDiv.innerText = counter;
    }
}