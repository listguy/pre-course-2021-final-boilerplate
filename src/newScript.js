const addButton = document.getElementById("add-button");
const textInput = document.getElementById("text-input");
const numberOfTodo = document.getElementById("counter");
const viewSection = document.getElementById("view");
const counter = document.getElementById("counter");
const sortButton = document.getElementById("sort-button");
let storedCounter = localStorage.getItem("counter");
let inputValue;
let jsonList = {"my-todo":[]};
let todoList = [];
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

document.addEventListener("DOMContentLoaded", async e => {
  let response = await fetch('https://api.jsonbin.io/v3/b/6013b6761de5467ca6bdb0ce/latest');
  let jsonResponse = await response.json(); 
  let objectResponse = jsonResponse["record"];
  jsonList = objectResponse;
  todoList = jsonList["my-todo"];
  localStorage.setItem("my-todo", JSON.stringify(todoList));
  arrayToDiv(todoList);
})

//adds the item to the array and displays it
addButton.addEventListener("click", (e) => {
  inputValue = textInput.value;
  const object = convertValueToObject(inputValue);
  todoList.push(object);
  jsonList["my-todo"].push(object);
  updateList();
  localStorage.setItem("my-todo", JSON.stringify(todoList));
  viewSection.append(itemObjectToDiv(object));
});

//removes text from input on click
addButton.addEventListener("click", (e) => {
  textInput.value = "";
});

//on click sorts the array

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

function sortArrayByPriority(array) {
  array.sort(function (a, b) {
    return b.priority - a.priority;
  });
  return array;
}

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