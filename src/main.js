const addButton = document.getElementById("add-button");
const textInput = document.getElementById("text-input");
const todoList = [];
//clear input text on click
addButton.addEventListener("click", (e) => {
    textInput.value = "";
});

