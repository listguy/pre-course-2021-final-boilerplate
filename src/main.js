"use strict";

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
            console.log(priority.value);
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
                const todoPriority = document.createElement('data'); 
                todoPriority.innerText = priority.value;
                todoPriority.classList.add('todo-priority');
                div.append(todoText);
                div.append(todoCreationTime);
                div.append(todoPriority);
            }
        }