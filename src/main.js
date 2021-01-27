const addButton = document.getElementById("add-button");
const textInput = document.getElementById("text-input");
const numberOfTodo = document.getElementById("counter");
const viewSection = document.getElementById("view");
const todoList = [];
let inputValue;

// clear input text on click and save input value
addButton.addEventListener("click", (e) => {
  inputValue = textInput.value;
  textInput.value = "";
  const inputObject = convertValueToObject(inputValue);
  todoList.push(inputObject);
  numberOfTodo.innerText = Number(numberOfTodo.innerText) + 1;
  viewSection.append(itemObjectToDiv(inputObject));
});

addButton.addEventListener("click", (e) => {});

function convertValueToObject(value) {
  const current = new Date();
  const creationTime = current.toLocaleString();
  const priority = document.getElementById("priority-selector").value;
  const myTodoItem = {
    "text": value,
    "date": creationTime,
    "priority": priority,
  };
  return myTodoItem;
}

// //creating a div and adding class 
// function elementAndClass(divName, className) {
//     divName = document.createElement("div");
//     divName.setAttribute('class', className);
// }

function itemObjectToDiv(myTodoItem) {
    const todoContainer = document.createElement("div");
    const todoPriority = document.createElement("div");
    const todoCreatedAt = document.createElement("div");
    const todoText = document.createElement("div");
    
    todoContainer.setAttribute("class", "todo-container");
    todoPriority.setAttribute("class", "todo-priority");
    todoCreatedAt.setAttribute("class", "todo-created-at");
    todoText.setAttribute("class", "todo-text");
    
    todoPriority.innerText = myTodoItem["priority"];
    todoCreatedAt.innerText = myTodoItem["date"];
    todoText.innerText = myTodoItem["text"];
    
    todoContainer.appendChild(todoPriority);
    todoContainer.appendChild(todoCreatedAt);
    todoContainer.appendChild(todoText);

    return todoContainer;
}
