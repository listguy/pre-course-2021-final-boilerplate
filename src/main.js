const addButton = document.getElementById("add-button");
const textInput = document.getElementById("text-input");
const numberOfTodo = document.getElementById("counter");
const viewSection = document.getElementById("view");
const counter = document.getElementById("counter");
let storedCounter = localStorage.getItem("counter");
let localJson = localStorage.getItem("json list");
const todoList = [];
let inputValue;
let jsonList = [];

//set counter to stay on refresh
if (storedCounter) {
  counter.innerText = storedCounter;
}
//update counter on every click
addButton.onclick = function () {
  const key = "counter";
  let value = Number(counter.innerText);
  value++;
  counter.innerText = Number(counter.innerText) + 1;
  localStorage.setItem(key, value);
};

//saves the list locally using JSON
if (typeof localJson === "string") {
  jsonList = JSON.parse(localJson);
}

addButton.addEventListener("click", (e) => {
  inputValue = textInput.value;
  const todoJson = JSON.stringify(convertValueToObject(inputValue));
  jsonList.push(todoJson);
  localStorage.setItem("json list", JSON.stringify(jsonList));
});




//removes text from input
addButton.addEventListener("click", (e) => {
  textInput.value = "";
});

function convertValueToObject(value) {
  const current = new Date();
  const creationTime = current.toLocaleString();
  const priority = document.getElementById("priority-selector").value;
  const myTodoItem = {
    text: value,
    date: creationTime,
    priority: priority,
  };
  return myTodoItem;
}

//converts the todo item object into a div container
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

  todoContainer.appendChild(todoText);
  todoContainer.appendChild(todoCreatedAt);
  todoContainer.appendChild(todoPriority);

  return todoContainer;
}

// //creating a div and adding class
// function elementAndClass(divName, className) {
//     divName = document.createElement("div");
//     divName.setAttribute('class', className);
// }
