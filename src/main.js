const addButton = document.getElementById("add-button");
const textInput = document.getElementById("text-input");
const numberOfTodo = document.getElementById("counter");
const todoList = [];
let inputValue;

// clear input text on click and save input value
addButton.addEventListener("click", (e) => {
  inputValue = textInput.value;
  textInput.value = "";
  todoList.push(convertValueToObject(inputValue));
  numberOfTodo.innerText = Number(numberOfTodo.innerText) + 1;
});

addButton.addEventListener("click", (e) => {
    
});

function convertValueToObject(value) {
  const current = new Date();
  const creationTime = current.toLocaleString();
  const priority = document.getElementById("priority-selector").value;
  const myTodoItem = {
    "todo text": value,
    "created at": creationTime,
    priority: priority,
  };
  return myTodoItem;
}
