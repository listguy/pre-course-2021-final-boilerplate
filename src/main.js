window.addEventListener("DOMContentLoaded", main);
function main() {
	const controlSection = document.querySelector("#control-section");
	const viewSection = document.querySelector("#view-section");
	const textInput = document.querySelector("#text-input");
	const tasksArray = [];
	const prioritySelector = document.querySelector("#priority-selector");
	const addButton = document.querySelector("#add-button");
	addButton.addEventListener("click", newTask);

	function newTask(event) {
		const toDoContainer = {
			priority: prioritySelector.value,
			text: textInput.value,
			date: new Date(),
		};
		textInput.value = ""; //resets input field
		tasksArray.push(toDoContainer);
		printTask(toDoContainer, viewSection);
		console.log(tasksArray);
	}
}

function printTask(toDoContainer, viewSection) {
	const toDoContainerDiv = document.createElement("div");
	toDoContainerDiv.className = "todo-container";
	viewSection.appendChild(toDoContainerDiv); //creates a new div and inserts it to view section.
	const toDoText = document.createElement("div");
	toDoText.className = "todo-text"; //creates new div for to do text
	toDoText.innerText = toDoContainer.text; // gives it the inner text of the input value
	const toDoPriority = document.createElement("div");
	toDoPriority.className = "todo-priority";
	toDoPriority.innerText = toDoContainer.priority;
	const toDoDate = document.createElement("div");
	toDoDate.className = "todo-created-at";
	toDoDate.innerText = toDoContainer.date;
	toDoContainerDiv.appendChild(toDoPriority);
	toDoContainerDiv.appendChild(toDoDate);
	toDoContainerDiv.appendChild(toDoText);
}
