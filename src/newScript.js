const addButton = document.getElementById("add-button");
const textInput = document.getElementById("text-input");
const numberOfTodo = document.getElementById("counter");
const viewSection = document.getElementById("view");
const counter = document.getElementById("counter");
const sortButton = document.getElementById("sort-button");
let storedCounter = localStorage.getItem("counter");
let inputValue;
let jsonList = { "my-todo": [] };
let todoList = [];



//Adds the item to the array and displays it
addButton.addEventListener("click", (e) => {
  if (textInput.value === "") {
    alert("Enter a To Do item");
    return;
  }
  counter.innerText = Number(counter.innerText) + 1;
  inputValue = textInput.value;
  const object = convertValueToObject(inputValue);
  todoList.push(object);
  jsonList["my-todo"] = todoList;
  updateList();
  localStorage.setItem("my-todo", JSON.stringify(todoList));
  viewSection.append(itemObjectToDiv(object));
});

//Removes text from input on click
addButton.addEventListener("click", (e) => {
  textInput.value = "";
});

//On click sorts the array
sortButton.addEventListener("click", (e) => {
  sortArrayByPriority(jsonList["my-todo"]);
  todoList = jsonList["my-todo"];
  localStorage.setItem("my-todo", JSON.stringify(todoList));
  for (let i = 0; i < todoList.length; i++) {
    viewSection.removeChild(document.querySelectorAll(".todo-container")[0]);
  }
  for (let i = 0; i < todoList.length; i++) {
    viewSection.append(itemObjectToDiv(todoList[i]));
  }
});

//-----------------------------------Functions-----------------------------------//

//Converts the value into the correct object with time and priority
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

//Converts the todo item object into a div container
function itemObjectToDiv(myTodoItem) {
  const todoContainer = document.createElement("div");
  const todoPriority = document.createElement("div");
  const todoCreatedAt = document.createElement("div");
  const todoText = document.createElement("div");
  const deleteButton = document.createElement("button");
  const doneButton = document.createElement("button");
  const editButton = document.createElement("button");
  //Setting the attributes
  todoContainer.setAttribute("class", "todo-container");
  todoPriority.setAttribute("class", "todo-priority");
  todoCreatedAt.setAttribute("class", "todo-created-at");
  todoText.setAttribute("class", "todo-text");
  deleteButton.setAttribute("class", "delete");
  doneButton.setAttribute("class", "done");
  doneButton.setAttribute("hidden", "true");
  editButton.setAttribute("class", "edit");
  //Setting the inner text
  todoPriority.innerText = myTodoItem["priority"];
  todoCreatedAt.innerText = myTodoItem["date"];
  todoText.innerText = myTodoItem["text"];
  deleteButton.innerHTML = "";
  doneButton.innerHTML = "";
  editButton.innerHTML = "";
  //Appending into the to-do container
  todoContainer.appendChild(todoCreatedAt);
  todoContainer.appendChild(todoText);
  todoContainer.appendChild(todoPriority);
  todoContainer.appendChild(deleteButton);
  todoContainer.appendChild(doneButton);
  todoContainer.appendChild(editButton);

  return todoContainer;
}

function sortArrayByPriority(array) {
  array.sort(function (a, b) {
    return b.priority - a.priority;
  });
  return array;
}


//Prints the array as div elements
function arrayToDiv(array) {
  for (const object of array) {
    viewSection.append(itemObjectToDiv(object));
  }
}
