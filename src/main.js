//SLECTORS
const textInput = document.querySelector('#text-input');
const priority = document.querySelector('#priority-selector');
const addButton = document.querySelector ('#add-button');
let list = document.querySelector('#todo-list');



//EVENT Listeners
addButton.addEventListener('click', addToList);


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
    const completeButton = document.createElement('button');   //completed task button
    removeButton.classList.add('remove-button');
    completeButton.classList.add('complete-button');
    todoDiv.appendChild(removeButton);
    todoDiv.appendChild(completeButton);
    completeButton.innerHTML = '<i class="fas fa-check"></i>';
    removeButton.innerHTML = '<i class="far fa-trash-alt"></i>';
    list.appendChild(todoDiv);
    
    newTodo.innerText = priority.value + textInput.value;
    textInput.value = '';           //clears input after adding to list



}
