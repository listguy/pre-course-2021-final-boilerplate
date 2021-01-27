const addButton = document.getElementById("add-button");
const textInput = document.getElementById("text-input");

addButton.addEventListener("click", (e) => {
    textInput.value = "";
});
