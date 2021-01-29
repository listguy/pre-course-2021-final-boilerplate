window.addEventListener("DOMContentLoaded", main);
async function main() {
	const BIN_ID = "/b/601189173126bb747e9fcc1e";
	const viewSection = document.querySelector("#view-section");
	const textInput = document.querySelector("#text-input");
	const loadingGif = document.querySelector("#loading-gif");
	loadingGif.hidden = false;
	const fetchResponse = await fetch(
		"https://api.jsonbin.io/v3" + BIN_ID + "/latest"
	).then((res) => res.json());
	loadingGif.hidden = true;

	const tasksArray =
		JSON.stringify(fetchResponse.record["my-todo"]) !== `[{}]`
			? fetchResponse.record["my-todo"]
			: [];
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
		task.index = tasksArray.indexOf(task); //adds index proprty for use in other functions.
		printTask(task, viewSection);
	}
	addButton.addEventListener("click", newTask);

	async function newTask(event) {
		if (textInput.value === "" || textInput.value === " ") {
			alert("You have to have somthing to do!");
			textInput.focus();
		} else {
			const toDoContainer = {
				priority: prioritySelector.value,
				text: textInput.value,
				date: Number(new Date()), //for JSON adaptablity
			};
			textInput.value = ""; //resets input field
			tasksArray.push(toDoContainer);
			printTask(toDoContainer, viewSection);
			updateCounter(tasksArray);
			updateJSONBin(tasksArray);
			textInput.focus();
			// localStorage.clear();
			// localStorage.setItem("my-todo", JSON.stringify(tasksArray));
		}
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

	function printTask(toDoContainer, viewSection) {
		const toDoContainerDiv = document.createElement("div");
		toDoContainerDiv.className = "todo-container";
		viewSection.appendChild(toDoContainerDiv); //creates a new div and inserts it to view section.
		const toDoText = document.createElement("div");
		toDoText.className = "todo-text"; //creates new div for to do text
		toDoText.innerText = toDoContainer.text; // gives it the inner text of the input value
		const toDoPriority = document.createElement("div");
		toDoPriority.className = `todo-priority priority${toDoContainer.priority}`;
		toDoPriority.innerText = toDoContainer.priority;
		const toDoDate = document.createElement("div");
		toDoDate.className = "todo-created-at";
		toDoDate.innerText = datePrinter(new Date(toDoContainer.date));
		toDoContainerDiv.appendChild(toDoPriority);
		toDoContainerDiv.appendChild(toDoText);
		toDoContainerDiv.appendChild(toDoDate);
		toDoContainerDiv.index = toDoContainer.index;
	}

	function updateCounter(tasksArray) {
		const counter = document.querySelector("#counter");
		counter.innerHTML = tasksArray.length;
	}

	function datePrinter(date) {
		let out = {
			year: date.getYear() - 100,
			month: date.getMonth() + 1,
			day: date.getDate(),
			hours: date.getHours(),
			minutes: date.getMinutes(),
		};
		for (let number in out) {
			if (Number(out.number) < 10) {
				out.number = "0" + out.number;
				console.log(number);
			}
		}
		return `${out.day}/${out.month}/${out.year} at ${out.hours}:${out.minutes}`;
	}

	async function updateJSONBin(tasksArray) {
		await fetch("https://api.jsonbin.io/v3" + BIN_ID, {
			method: "put",
			headers: {
				"Content-Type": "application/json",
			},
			body: `{"my-todo": ${JSON.stringify(tasksArray)}}`,
		});
	}

	document.addEventListener("mouseover", (event) => {
		if (event.target.classList[0] === "todo-priority") {
			const priority = event.target;
			const tipWindow = document.querySelector("#tip-window");
			tipWindow.innerHTML = "Click to delete task";
			tipWindow.style.left =
				priority.getBoundingClientRect().left +
				priority.getBoundingClientRect().width / 2 -
				70 +
				`px`;
			tipWindow.style.top = priority.getBoundingClientRect().top - 16 + "px";
			tipWindow.hidden = false;
			event.target.addEventListener("click", (clickEvent) => {
				const containerDiv = clickEvent.target.parentNode;
				tasksArray.splice(containerDiv.index, 1);
				containerDiv.hidden = true;
				updateCounter(tasksArray);
				updateJSONBin(tasksArray);
			});
		}
	});
	document.addEventListener("mouseout", (event) => {
		if (event.target.classList[0] === "todo-priority") {
			const priority = event.target;
			const tipWindow = document.querySelector("#tip-window");

			tipWindow.hidden = true;
		}
	});
	document.addEventListener("click", (darkModeEvent) => {
		if (darkModeEvent.target.id === "dark-mode-button") {
			let cssLink = document.head.querySelector("#style-link");
			if (darkModeEvent.target.innerText === "Dark mode") {
				cssLink.href = "./dark-mode.css";
				darkModeEvent.target.innerText = "Normal";
			} else {
				cssLink.href = "./style.css";
				darkModeEvent.target.innerText = "Dark mode";
			}
		}
	});
	document.addEventListener("click", (searchEvent) => {
		if (searchEvent.target["id"] === "search-button") {
			const searchValue = document.querySelector("#search-input").value;
			const printedToDos = document.querySelectorAll(".todo-container");
			if (searchValue === "" || searchValue === " ") {
				alert("Can't search for nothing!");
			} else {
				for (let toDo of printedToDos) {
					toDo.classList.remove("highlighted");
				}
				for (let toDo of printedToDos) {
					if (
						toDo
							.querySelector(".todo-text")
							.innerHTML.toLowerCase()
							.includes(searchValue.toLowerCase())
					) {
						document.querySelector("#search-input").value = "";
						toDo.classList.add("highlighted");
					}
				}
			}
		}
	});
	document.addEventListener("click", (clearEvent) => {
		if (clearEvent.target["id"] === "clear-button") {
			const printedToDos = document.querySelectorAll(".todo-container");
			for (let toDo of printedToDos) {
				toDo.classList.remove("highlighted");
			}
		}
	});
	document.addEventListener("mouseover", (event) => {
		if (event.target.classList[0] === "todo-text") {
			const originalText = event.target;
			const tipWindow = document.querySelector("#tip-window");
			tipWindow.innerHTML = "Double-click to edit task";
			tipWindow.style.left =
				originalText.getBoundingClientRect().left +
				originalText.getBoundingClientRect().width / 2 -
				70 +
				`px`;
			tipWindow.style.top =
				originalText.getBoundingClientRect().top +
				originalText.getBoundingClientRect().height +
				5 +
				"px";
			tipWindow.hidden = false;
			event.target.addEventListener("dblclick", (clickEvent) => {
				clickEvent.preventDefault();
				const containerDiv = clickEvent.target.parentNode;
				const newTextForm = document.querySelector("#edit-text-input");
				newTextForm.style.left =
					originalText.getBoundingClientRect().left +
					originalText.getBoundingClientRect().width / 2 -
					27 +
					`px`;
				newTextForm.style.top = originalText.getBoundingClientRect().top + "px";
				newTextForm.hidden = false;
				newTextInput = newTextForm.querySelector("input");
				newTextInput.focus();
				newTextForm.addEventListener("click", (saveEvent) => {
					saveEvent.preventDefault();

					if (saveEvent.target.id === "edit-text-button") {
						newTextForm.hidden = true;
						if (newTextInput.value !== "" && newTextInput.value !== " ") {
							tasksArray[containerDiv.index]["text"] = newTextInput.value;
							updateCounter(tasksArray);
							updateJSONBin(tasksArray);
							originalText.innerHTML = newTextInput.value;
							newTextInput.value = "";
						}
					}
				});
			});
		}
	});
	document.addEventListener("mouseout", (event) => {
		if (event.target.classList[0] === "todo-text") {
			const originalText = event.target;
			const tipWindow = document.querySelector("#tip-window");

			tipWindow.hidden = true;
		}
	});
}
