//SELECTORS

const textInput = document.querySelector('#text-input');
const priority = document.querySelector('#priority-selector');
const addButton = document.querySelector ('#add-button');
let list = document.querySelector('#todo-list');
let taskCounter = JSON.parse(localStorage.getItem("numberOfTasksGiven")) || 1;
for (let i = 1 ; i < localStorage.length ; i++){
    const todoDiv = document.createElement('div');   //div of the list
    const newTodo = document.createElement('li');    //the content of the TODO
    todoDiv.classList.add('todo');
    newTodo.classList.add('todoItem');
    todoDiv.appendChild(newTodo);
    const removeButton = document.createElement('button');//remove from list button
    removeButton.classList.add('remove-button');
    todoDiv.appendChild(removeButton);
    removeButton.innerHTML = 'X';
    list.appendChild(todoDiv);
    //prints to list
    let itemObjectFromStorage = JSON.parse(localStorage.getItem(`task${i}`));
    console.log(itemObjectFromStorage);
    newTodo.innerHTML = `<span style="color:#598cda"><strong>${itemObjectFromStorage.priority}</strong></span> ${itemObjectFromStorage.text}, <i>${itemObjectFromStorage.date}</i>`;

}

//EVENT LISTENERS

addButton.addEventListener('click', addToList);


//FUNCTIONS

function addToList(){
    //adds to local storage
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
    localStorage.setItem("numberOfTasksGiven", taskCounter);
    localStorage.setItem(`task${taskCounter}`, listItemObjectFixed);
    taskCounter ++ ;
    localStorage.setItem('numberOfTasksGiven', taskCounter)
    const todoDiv = document.createElement('div');   //div of the list
    const newTodo = document.createElement('li');    //the content of the TODO
    todoDiv.classList.add('todo');
    newTodo.classList.add('todoItem');
    todoDiv.appendChild(newTodo);
    const removeButton = document.createElement('button');//remove from list button
    removeButton.classList.add('remove-button');
    todoDiv.appendChild(removeButton);
    removeButton.innerHTML = 'X';
    list.appendChild(todoDiv);
    //prints to list
    newTodo.innerHTML = `<span style="color:#598cda"><strong>${priority.value}</strong></span> ${textInput.value}, <i>${startTime()}</i>`;
    textInput.value = '';  //clears input after adding to list
}

function checkTime(i) {
    if (i < 10) {
      i = "0" + i;
    }
    return i;
  }
//saving current time
function startTime() {
    let today = new Date();
    let h = today.getHours();
    let m = today.getMinutes();
    m = checkTime(m);
    return h + ":" + m;
}
