//--------------------------------------------------SELECTORS--------------------------------------------------------
const textInput = document.querySelector('#text-input');
const priority = document.querySelector('#priority-selector');
const addButton = document.querySelector ('#add-button');
let list = document.querySelector('#todo-list');
let listCounter = document.querySelector('#counter');
const sortButton = document.querySelector('#sort-button');
const clearButton = document.querySelector('#clear-button');
let addSectionWindow = document.querySelector('#add-section');
let openAddSectionWindowButton = document.querySelector('#open-add-section');
addSectionWindow.hidden = true;

//COMMAND TO START WINDOW
let taskCounter = JSON.parse(localStorage.getItem("numberOfTasksGiven")) || 1;
printFromLocalStorage();
numberOfToDos();  //counts the number of tasks
let removedItems = JSON.parse(localStorage.getItem('removedItems')) || 0;

//--------------------------------------------------EVENT LISTENERS--------------------------------------------------
addButton.addEventListener('click', addToList);
textInput.addEventListener('keyup', enterAddToList);
sortButton.addEventListener('click', sortListItems);
clearButton.addEventListener('click', removeAll);
list.addEventListener('click', removeItemFromList);
openAddSectionWindowButton.addEventListener('click', opensAddSectionWindow)

//--------------------------------------------------FUNCTIONS--------------------------------------------------------
//Adds item to list and local storage
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
        date : dateValue,
        id : taskCounter
    }
    let listItemObjectFixed = JSON.stringify(listItemObject);
    localStorage.setItem("numberOfTasksGiven", taskCounter);
    localStorage.setItem(`my-todo${taskCounter}`, listItemObjectFixed);
    taskCounter ++ ;
    localStorage.setItem('numberOfTasksGiven', taskCounter)
    const todoDiv = document.createElement('div');   //div of the list
    const newTodo = document.createElement('li');    //the content of the TODO
    newTodo.id = `${listItemObject.id}`;
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
    todoCreatedAt.innerText = startTime(dateValue);
    textInput.value = '';  //clears input after adding to list
    numberOfToDos();       //counts the number of tasks
}

//by pressing enter the item will be added
function enterAddToList(event) {
    if (event.keyCode === 13) {
        addToList();
    } else {
        return;
    }
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
    let month = today.getMonth() + 1;
    let day = today.getDate();
    m = checkTime(m);
    return h + ":" + m + ', ' + day + '.' + month;
}

function numberOfToDos() {
    listCounter.innerText = document.querySelectorAll('.todo-list-container').length
}

//Sorts list By Priority
function sortListItems(a, b) {
    let listArrSort = [];
    listArrSort.push(JSON.parse(localStorage.getItem('numberOfTasksGiven')));
    for (let i = 1 ; i < localStorage.length ; i++){
        if ( JSON.parse(localStorage.getItem(`my-todo${i}`)) === null) {i++}
        listArrSort.push(JSON.parse(localStorage.getItem(`my-todo${i}`)));
    }
    const comparator = (a, b) => {
        return b.priority - a.priority;
    }
    listArrSort = listArrSort.sort(comparator);
    localStorage.clear();
    list.innerHTML = '';
    localStorage.setItem(`numberOfTasksGiven`, listArrSort[0]);
    for (let i = 1 ; i < listArrSort.length ; i++) {
        let listArrSortObject = JSON.stringify(listArrSort[i]);
        localStorage.setItem(`my-todo${i}`, listArrSortObject);
    }
    printFromLocalStorage();
}

//Clears all the List
function removeAll(){
    localStorage.clear();
    location.reload();
}

//Prints data from localStorage
function printFromLocalStorage() {
    for (let i = 1 ; i < localStorage.length + JSON.parse(localStorage.getItem(`removedItems`)) ; i++){
        for (let j = 0 ; j < localStorage.length ; j++) { 
            if ( JSON.parse(localStorage.getItem(`my-todo${i}`)) === null) {i++}
        }
        if ( JSON.parse(localStorage.getItem(`my-todo${i}`)) === null) {return}
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
        newTodo.id = `${itemObjectFromStorage.id}`;
        todoPriority.innerText = itemObjectFromStorage.priority;
        todoText.innerText = itemObjectFromStorage.text;
        todoCreatedAt.innerText = startTime(itemObjectFromStorage.date);
        
    }
}

// removes Item From List
function removeItemFromList(event) {
    if (event.target.className !== 'remove-button') return;
    let item = event.target.closest('.todo-list-container');
    item.classList.add('remove-animation');
    item.addEventListener('transitionend', function(){
        item.remove();
        numberOfToDos();
    });
    removedItems++;
    localStorage.setItem('removedItems', removedItems);
    localStorage.removeItem(`my-todo${item.id}`);
}

//opens add section
function opensAddSectionWindow() {
    if (addSectionWindow.hidden = true) {
        addSectionWindow.hidden = false;
        document.getElementById("text-input").focus();
    } 
    addSectionWindow.classList.add('fade-in');
}