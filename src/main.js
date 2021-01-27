window.addEventListener("DOMContentLoaded", main);
function main() {
	const controlSection = document.querySelector("#control-section");
	const viewSection = document.querySelector("#view-section");
	const textInput = document.querySelector("#text-input");

	const prioritySelector = document.querySelector("#priority-selector");
	const addButton = document.querySelector("#add-button");
	addButton.addEventListener("click", newTask);

	function newTask(event) {
		const toDoContainerDiv = document.createElement("div");
		toDoContainerDiv.className = "todo-container";
		viewSection.appendChild(toDoContainerDiv); //creates a new div and inserts it to view section.
		const toDoText = document.createElement("div");
		toDoText.className = "todo-text";
		toDoText.innerText = textInput.value;
		console.log(textInput);
		console.log(toDoText);
		const toDoPriority = document.createElement("div");
		toDoPriority.className = "todo-priority";
		toDoPriority.innerText = prioritySelector.value;
		const toDoDate = document.createElement("div");
		toDoDate.className = "todo-created-at";
		toDoDate.innerText = new Date();
		toDoContainerDiv.appendChild(toDoPriority);
		toDoContainerDiv.appendChild(toDoDate);
		toDoContainerDiv.appendChild(toDoText);
	}
}
