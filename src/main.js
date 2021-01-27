window.addEventListener("DOMContentLoaded", main);
async function main() {
	const BIN_ID = "/b/601189173126bb747e9fcc1e";
	const viewSection = document.querySelector("#view-section");
	const textInput = document.querySelector("#text-input");
	const fetchResponse = await fetch(
		"https://api.jsonbin.io/v3" + BIN_ID + "/latest"
	).then((res) => res.json());

	console.log(fetchResponse.record);
	const tasksArray =
		JSON.stringify(fetchResponse.record) !== `[{}]` ? fetchResponse.record : [];
	// console.log(
	// 	await fetch("https://api.jsonbin.io/v3" + BIN_ID.then((res) => res.json())
	// );
	console.log(tasksArray);
	// const tasksArray =
	// 	localStorage.getItem("my-todo") !== null
	// 		? JSON.parse(localStorage.getItem("my-todo"))
	// 		: [];
	const prioritySelector = document.querySelector("#priority-selector");
	const addButton = document.querySelector("#add-button");
	const sortButton = document.querySelector("#sort-button");
	sortButton.sorted = false;
	updateCounter(tasksArray);
	for (let task of tasksArray) {
		printTask(task, viewSection);
	}
	addButton.addEventListener("click", newTask);

	async function newTask(event) {
		const toDoContainer = {
			priority: prioritySelector.value,
			text: textInput.value,
			date: Number(new Date()), //for JSON adaptablity
		};
		textInput.value = ""; //resets input field
		tasksArray.push(toDoContainer);
		printTask(toDoContainer, viewSection);
		updateCounter(tasksArray);
		await fetch("https://api.jsonbin.io/v3" + BIN_ID, {
			method: "put",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(tasksArray),
		});
		// localStorage.clear();
		// localStorage.setItem("my-todo", JSON.stringify(tasksArray));
	}

	sortButton.addEventListener("click", (sort) => {
		let sortedTasksArray = [];
		if (sortButton.sorted) {
			sortedTasksArray = tasksArray;
			sortButton.innerText = "Sort by priority";
		} else {
			sortButton.innerText = "Sort by date";
			for (let i = 5; i >= 1; i--) {
				for (let task of tasksArray) {
					if (Number(task.priority) === i) {
						sortedTasksArray.push(task);
					}
				}
			}
		}
		viewSection.innerHTML = "";
		for (let task of sortedTasksArray) {
			printTask(task, viewSection);
		}
		sortButton.sorted = !sortButton.sorted;
	});
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
	toDoDate.innerText = new Date(toDoContainer.date);
	toDoContainerDiv.appendChild(toDoPriority);
	toDoContainerDiv.appendChild(toDoDate);
	toDoContainerDiv.appendChild(toDoText);
}

function updateCounter(tasksArray) {
	const counter = document.querySelector("#counter");
	counter.innerHTML = tasksArray.length;
}
