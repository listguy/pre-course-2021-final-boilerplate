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

//when the page is loaded its content is taken from jsonbin.io and updates the localStorage
document.addEventListener("DOMContentLoaded", async (e) => {
  let response = await fetch(
    "https://api.jsonbin.io/v3/b/6013b6761de5467ca6bdb0ce/latest"
  );
  let jsonResponse = await response.json();
  let objectResponse = jsonResponse["record"];
  jsonList = objectResponse;
  todoList = jsonList["my-todo"];
  counter.innerText = todoList.length;
  localStorage.setItem("my-todo", JSON.stringify(todoList));
  arrayToDiv(todoList);
});

//adds the item to the array and displays it
addButton.addEventListener("click", (e) => {
  counter.innerText = Number(counter.innerText)+1
  inputValue = textInput.value;
  const object = convertValueToObject(inputValue);
  todoList.push(object);
  jsonList["my-todo"] = todoList;
  updateList();
  localStorage.setItem("my-todo", JSON.stringify(todoList));
  viewSection.append(itemObjectToDiv(object));
});

//removes text from input on click
addButton.addEventListener("click", (e) => {
  textInput.value = "";
});

//on click sorts the array
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

//converts the value into the correct object with time and priority
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
  const deleteButton = document.createElement("button");
  const editButton = document.createElement("button");

  todoContainer.setAttribute("class", "todo-container");
  todoPriority.setAttribute("class", "todo-priority");
  todoCreatedAt.setAttribute("class", "todo-created-at");
  todoText.setAttribute("class", "todo-text");
  deleteButton.setAttribute("class", "delete");
  editButton.setAttribute("class", "edit");

  todoPriority.innerText = myTodoItem["priority"];
  todoCreatedAt.innerText = myTodoItem["date"];
  todoText.innerText = myTodoItem["text"];
  deleteButton.innerHTML = "";
  editButton.innerHTML = "edit";

  todoContainer.appendChild(todoCreatedAt);
  todoContainer.appendChild(todoText);
  todoContainer.appendChild(todoPriority);
  todoContainer.appendChild(deleteButton);
  todoContainer.appendChild(editButton);

  return todoContainer;
}

function sortArrayByPriority(array) {
  array.sort(function (a, b) {
    return b.priority - a.priority;
  });
  return array;
}

//updates the list and sends a success/error in console log
async function updateList() {
  await fetch("https://api.jsonbin.io/v3/b/6013b6761de5467ca6bdb0ce", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "X-Master-Key":
        "$2b$10$5P7RliLTaANiyqYHfkRvWepKYlCjfoARhVbWxxlqCTwQexhfzjuES",
    },
    body: JSON.stringify(jsonList),
  })
    .then((response) => response.json())
    .then((jsonList) => {
      console.log("Success:", jsonList);
    })
    .catch((error) => {
      console.error("Error:", jsonList);
    });
}

//prints the array as divs
function arrayToDiv(array) {
  for (const object of array) {
    viewSection.append(itemObjectToDiv(object));
  }
}
