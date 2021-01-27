const addButton = document.getElementById("add-button");
const textInput = document.getElementById("text-input");
const todoList = [];
let inputValue;

// clear input text on click and save input value
addButton.addEventListener("click", (e) => {
  inputValue = textInput.value;
  textInput.value = "";
});

function convertValueToObject(value) {
    const current = new Date();
    const creationTime = current.toLocaleString;
    const priority = getElementById('priority-selector');
}
