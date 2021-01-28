//SLECTORS
const textInput = document.querySelector('#text-input');
const priority = document.querySelector('#priority-selector');
const addButton = document.querySelector ('#add-button');
let list = document.querySelector('#todo-list');



//EVENT Listeners
addButton.addEventListener('click', addToList);
list.addEventListener('click', removes)

//FUNCTIONS


function addToList (event){         //adds the text from the input to the List.
    if (textInput.value === '') return;   //if input is empty not adds to list
    event.preventDefault();
    const todoDiv = document.createElement('div');            //div of the list
    const newTodo = document.createElement('li');             //the content of the TODO
    todoDiv.classList.add('todo');
    newTodo.classList.add('todoItem');
    todoDiv.appendChild(newTodo);
    const removeButton = document.createElement('button');      //remove from list button
    removeButton.classList.add('remove-button');
    todoDiv.appendChild(removeButton);
    removeButton.innerHTML = 'X';
    list.appendChild(todoDiv);
    let prioritySpan = document.createElement('span');
    prioritySpan.innerText = priority.value;
    //print to input
    newTodo.innerText = prioritySpan.innerText + '- ' + textInput.value + ' ' +startTime();
    textInput.value = '';           //clears input after adding to list
}


// add a zero in front of numbers<10
function checkTime(i) {
    if (i < 10) {
      i = "0" + i;
    }
    return i;
  }
  //saving current time
  function startTime() {
    var today = new Date();
    var h = today.getHours();
    var m = today.getMinutes();
    m = checkTime(m);
    return h + ":" + m;
  }


function removes(event){
    if (event.target.className !== 'remove-button') return;
    console.log(event.target);
    let item = event.target.closest('.todo');
    item.remove();
}
