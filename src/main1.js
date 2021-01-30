//SELECTORS

const textInput = document.querySelector('#text-input');
const priority = document.querySelector('#priority-selector');
const addButton = document.querySelector ('#add-button');
let list = document.querySelector('#todo-list');
let taskCounter = 0;

//EVENT LISTENERS

addButton.addEventListener('click', addToList);


//FUNCTIONS

function addToList(){
    let textValue = textInput.value;
    let priorityValue = priority.value;
    let d = new Date();
    let dateValue = d.getTime();
    if (textValue === '') return;
    let listItemObject = {
        text : textValue,
        priority : priorityValue,
        date : dateValue
    }
    let listItemObjectFixed = JSON.stringify(listItemObject);
    localStorage.setItem(`task${taskCounter}`, listItemObjectFixed);
    taskCounter ++ ;

}
