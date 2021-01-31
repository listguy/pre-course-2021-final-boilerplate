//SELECTORS
const textInput = document.querySelector('#text-input');
const priority = document.querySelector('#priority-selector');
const addButton = document.querySelector ('#add-button');
let list = document.querySelector('#todo-list');
let listCounter = document.querySelector('#counter');


//PRINTS FROM LOCAL STORAGE
let taskCounter = JSON.parse(localStorage.getItem("numberOfTasksGiven")) || 1;
for (let i = 1 ; i < localStorage.length ; i++){
    const todoDiv = document.createElement('div');   //div of the list
    const newTodo = document.createElement('li');    //the content of the TODO
    todoDiv.classList.add('todo-container');
    newTodo.classList.add('todo-list-container');
    newTodo.appendChild(todoDiv);
    const removeButton = document.createElement('button');//remove from list button
    removeButton.classList.add('remove-button');
    newTodo.appendChild(removeButton);
    removeButton.innerHTML = 'X';
    list.appendChild(newTodo);
    const todoText = document.createElement('div')
    const todoPriority = document.createElement('div')
    const todoCreatedAt = document.createElement('div')
    todoText.classList.add('todo-text');
    todoCreatedAt.classList.add('todo-created-at');
    todoPriority.classList.add('todo-priority');
    todoDiv.appendChild(todoPriority);
    todoDiv.appendChild(todoText);
    todoDiv.appendChild(todoCreatedAt);
    //prints to list
    let itemObjectFromStorage = JSON.parse(localStorage.getItem(`my-todo${i}`));
    todoPriority.innerText = itemObjectFromStorage.priority;
    todoText.innerText = itemObjectFromStorage.text;
    todoCreatedAt.innerText = itemObjectFromStorage.date;
}
numberOfToDos();  //counts the number of tasks


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
    localStorage.setItem(`my-todo${taskCounter}`, listItemObjectFixed);
    taskCounter ++ ;
    localStorage.setItem('numberOfTasksGiven', taskCounter)
    const todoDiv = document.createElement('div');   //div of the list
    const newTodo = document.createElement('li');    //the content of the TODO
    todoDiv.classList.add('todo-container');
    newTodo.classList.add('todo-list-container');
    newTodo.appendChild(todoDiv);
    const removeButton = document.createElement('button');//remove from list button
    removeButton.classList.add('remove-button');
    newTodo.appendChild(removeButton);
    removeButton.innerHTML = 'X';
    list.appendChild(newTodo);
    const todoText = document.createElement('div')
    const todoPriority = document.createElement('div')
    const todoCreatedAt = document.createElement('div')
    todoText.classList.add('todo-text');
    todoCreatedAt.classList.add('todo-created-at');
    todoPriority.classList.add('todo-priority');
    todoDiv.appendChild(todoPriority);
    todoDiv.appendChild(todoText);
    todoDiv.appendChild(todoCreatedAt);
    //prints to list
    todoPriority.innerText = priorityValue;
    todoText.innerText = textValue;
    todoCreatedAt.innerText = dateValue;
    textInput.value = '';  //clears input after adding to list
    numberOfToDos();//counts the number of tasks
}

function numberOfToDos() {
    listCounter.innerText = document.querySelectorAll(".todo-list-container").length

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

