window.addEventListener("DOMContentLoaded", main); //makes sure everything runs only after page loads
async function main() {
  const styleLink = document.head.querySelector("#style-link");
  if (localStorage.getItem("mode") === "dark") {
    //dark mode on local storage
    styleLink.href = "./dark-mode.css";
    const darkModeButton = document.querySelector("#dark-mode-button");
    darkModeButton.innerText = "Normal";
  }
  const BIN_ID = "/b/6016b4fcabdf9c55679565a0";
  const viewSection = document.querySelector("#view-section");
  const textInput = document.querySelector("#text-input");
  const prioritySelector = document.querySelector("#priority-selector");
  const addButton = document.querySelector("#add-button");
  const sortButton = document.querySelector("#sort-button");
  sortButton.sorted = false; //property I added for toggle option
  const loadingGif = document.querySelector("#loading-gif");
  loadingGif.hidden = false;
  let tasksArray = [];
  // const fetchResponse =
  fetch("http://localhost:3002/b")
    .then((res) => {
      return res.json();
    })
    .then(
      (jsonRes) => {
        tasksArray =
          JSON.stringify(jsonRes) !== `[{}]` //JSONBin as preffered database
            ? jsonRes
            : [];
        loadingGif.hidden = true;
        console.log(tasksArray);
        localStorage.setItem("my-todo", JSON.stringify(tasksArray));
      },
      (err) => {
        console.log(err);
        const offlineBar = document.getElementById("loading-bar");
        offlineBar.innerText = "You are offline, working on local storage";
        offlineBar.hidden = false;
        tasksArray =
          localStorage.getItem("my-todo") !== null
            ? JSON.parse(localStorage.getItem("my-todo")) //local storage as a safety net
            : [];
        loadingGif.hidden = true;
      }
    )
    .finally(() => {
      for (let task of tasksArray) {
        task.index = tasksArray.indexOf(task); //adds index proprty for use in other functions.
        printTask(task, viewSection);
      }
      updateCounter(tasksArray);
    });
  console.log(tasksArray);
  // console.log(fetchResponse);
  // loadingGif.hidden = true;
  // if (!fetchResponse.record) {
  // 	//if response isn't OK, expression is undefined, so !undefined is a thruthy expression
  // 	tasksArray =
  // 		localStorage.getItem("my-todo") !== null
  // 			? JSON.parse(localStorage.getItem("my-todo")) //local storage as a safety net
  // 			: [];
  // } else {
  // 	tasksArray =
  // 		JSON.stringify(fetchResponse.record["my-todo"]) !== `[{}]` //JSONBin as preffered database
  // 			? fetchResponse.record["my-todo"]
  // 			: [];
  // }

  addButton.addEventListener("click", newTask); //task add event
  document.addEventListener("keypress", (event) => {
    if (textInput.value && event.key === "Enter") {
      newTask(event);
    }
  });

  //function for adding a task
  async function newTask(event) {
    if (textInput.value === "" || textInput.value === " ") {
      alert("You have to have somthing to do!");
      textInput.focus();
    } else {
      console.log(tasksArray);
      const toDoContainer = {
        priority: prioritySelector.value,
        text: textInput.value,
        date: Number(new Date()), //for JSON adaptablity
        index: tasksArray.length,
      };
      textInput.value = ""; //resets input field
      tasksArray.push(toDoContainer);
      printTask(toDoContainer, viewSection);
      updateCounter(tasksArray);
      updateJSONBin(toDoContainer, "POST");
      textInput.focus();
      localStorage.setItem("my-todo", JSON.stringify(tasksArray));
    }
  }

  //sort event
  sortButton.addEventListener("click", (sort) => {
    let sortedTasksArray = [];
    if (sortButton.sorted) {
      let temp = null;
      sortedTasksArray = tasksArray;
      for (let i = 1; i < sortedTasksArray.length; i++) {
        for (let j = i; j < sortedTasksArray.length; j++) {
          if (sortedTasksArray[j - 1]["date"] > sortedTasksArray[j]["date"]) {
            temp = sortedTasksArray[j];
            sortedTasksArray[j] = sortedTasksArray[j - 1];
            sortedTasksArray[j - 1] = temp;
          }
        }
      }
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
    updateCounter(sortedTasksArray);
    sortButton.sorted = !sortButton.sorted; // toggle option
  });

  //function for printing a task (not adding, just the visual aspect of it)
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
  //updates counter, takes care of multipages
  function updateCounter(tasksArray) {
    const counter = document.querySelector("#counter");
    const arrowsDiv = document.querySelector("#arrows");
    if (tasksArray.length === 0) {
      counter.innerHTML = "no";
    } else {
      counter.innerHTML = tasksArray.length;
    }

    if (tasksArray.length > 9) {
      //9 notes on one page
      multiplePagesPrint(tasksArray);
      arrowsDiv.hidden = false;
    } else {
      arrowsDiv.hidden = true;
      printPage([tasksArray], 0);
    }
  }

  //function to print dates in a nice looking way
  function datePrinter(date) {
    let out = {
      year: date.getYear() - 100,
      month: date.getMonth() + 1,
      day: date.getDate(),
      hours: date.getHours(),
      minutes: date.getMinutes(),
    };
    for (let number in out) {
      if (Number(out[number]) < 10) {
        out[number] = "0" + out[number];
      }
    }
    return `${out.day}/${out.month}/${out.year} - ${out.hours}:${out.minutes}`; // DD/MM/YYYY - HH:MM
  }

  //function to upload datebase
  function updateJSONBin(task, act) {
    console.log(task);
    const loadingBar = document.getElementById("loading-bar");
    loadingBar.hidden = false;
    loadingBar.style = "transition :5000ms;";
    loadingBar.style.backgroundColor = "white";
    loadingBar.style.backgroundColor = "black";
    const fetchTry = fetch("http://localhost:3002/b/task" + task.date, {
      method: act,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(task),
    });
    fetchTry.then(success).catch(failure);
    function failure(error) {
      loadingBar.style.transition = "0ms";
      loadingBar.style.backgroundColor = "tomato";
      loadingBar.innerText = `couldn't complete action, please try again later (${error})`;
      setTimeout(() => {
        loadingBar.hidden = true;
        loadingBar.style.transition = "5000ms";
        loadingBar.style.backgroundColor = "white";
        loadingBar.innerText = `Loading...`;
        console.log(error);
      }, 3000);
      return;
    }
    function success() {
      loadingBar.style.transition = "0ms";
      loadingBar.style.backgroundColor = "limegreen";
      loadingBar.innerText = `Updated succesfully`;
      setTimeout(() => {
        loadingBar.hidden = true;
        loadingBar.style.transition = "5000ms";
        loadingBar.style.backgroundColor = "white";
        loadingBar.innerText = `Loading...`;
      }, 3000);
    }
  }

  //print multi pages
  function multiplePagesPrint(tasksArray) {
    const arrowsDiv = document.querySelector("#arrows");
    const multyTaskArray = [[]];
    for (let i = 0; i <= tasksArray.length / 9; i++) {
      for (let j = 0; j < 9; j++) {
        if (tasksArray[i * 9 + j]) {
          multyTaskArray[i].push(tasksArray[i * 9 + j]); //divides to arrays of 9 elements
        }
      }
      multyTaskArray.push([]);
    }
    multyTaskArray.pop();
    let pageIndex = Number(localStorage.getItem("page-index"));
    printPage(multyTaskArray, pageIndex); // prints one page

    arrowsDiv.addEventListener("click", (arrowEvent) => {
      const arrow = arrowEvent.target;
      if (arrow.id === "right-arrow" && pageIndex < multyTaskArray.length - 1) {
        pageIndex++;
        printPage(multyTaskArray, pageIndex);
        localStorage.setItem("page-index", JSON.stringify(pageIndex));
      }
      if (arrow.id === "left-arrow" && pageIndex > 0) {
        pageIndex--;
        printPage(multyTaskArray, pageIndex);
        localStorage.setItem("page-index", JSON.stringify(pageIndex));
      }
    });
  }

  //function to print one page
  function printPage(multyTaskArray, pageIndex) {
    const viewSection = document.querySelector("#view-section");
    const oldNotes = document.querySelectorAll(".todo-container");
    for (let i = 0; i < oldNotes.length; i++) {
      viewSection.removeChild(oldNotes[i]);
    }

    for (let i = 0; i < multyTaskArray[pageIndex].length; i++) {
      printTask(multyTaskArray[pageIndex][i], viewSection);
      // console.log(multyTaskArray[pageIndex][i]);
    }
  }
  //priority tool tip show
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
    }
  });
  //priority click to delete
  document.addEventListener("click", (clickEvent) => {
    if (clickEvent.target.classList[0] === "todo-priority") {
      let containerDiv = clickEvent.target.parentNode;
      updateJSONBin(tasksArray[containerDiv.index], "DELETE");
      tasksArray.splice(containerDiv.index, 1);
      for (let i = 0; i < tasksArray.length; i++) {
        tasksArray[i].index = i; //fixes index to match after deleting
      }
      updateCounter(tasksArray);
      // updateJSONBin(tasksArray[containerDiv.index], "DELETE");
      const tipWindow = document.querySelector("#tip-window");
      tipWindow.hidden = true;
    }
  });
  //ptiority tool tip hidden
  document.addEventListener("mouseout", (event) => {
    if (event.target.classList[0] === "todo-priority") {
      const priority = event.target;
      const tipWindow = document.querySelector("#tip-window");

      tipWindow.hidden = true;
    }
  });
  //dark mode functionality
  document.addEventListener("click", (darkModeEvent) => {
    if (darkModeEvent.target.id === "dark-mode-button") {
      let cssLink = document.head.querySelector("#style-link");
      if (darkModeEvent.target.innerText === "Dark mode") {
        cssLink.href = "./dark-mode.css";
        document.body.style = "transition:800ms;";
        darkModeEvent.target.innerText = "Normal";
        localStorage.setItem("mode", "dark");
      } else if (darkModeEvent.target.innerText === "Normal") {
        cssLink.href = "./style.css";
        document.body.style = "transition:800ms;";
        darkModeEvent.target.innerText = "Dark mode";
        localStorage.setItem("mode", "normal");
      }
    }
  });
  //search button
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
  //clear button
  document.addEventListener("click", (clearEvent) => {
    if (clearEvent.target["id"] === "clear-button") {
      const printedToDos = document.querySelectorAll(".todo-container");
      for (let toDo of printedToDos) {
        toDo.classList.remove("highlighted");
      }
    }
  });
  //text edit tool tip
  document.addEventListener("mouseover", (event) => {
    if (event.target.classList[0] === "todo-text") {
      const containerDiv = event.target.parentNode;
      const tipWindow = document.querySelector("#tip-window");
      tipWindow.innerHTML = "Click to edit task";
      tipWindow.style.left =
        containerDiv.getBoundingClientRect().left +
        containerDiv.getBoundingClientRect().width / 2 -
        70 +
        `px`;
      tipWindow.style.top =
        containerDiv.getBoundingClientRect().top +
        containerDiv.getBoundingClientRect().height +
        5 +
        "px";
      tipWindow.hidden = false;
      containerDiv.addEventListener("click", editEvent);
    }
  });
  //edit event
  function editEvent(event) {
    const newTextForm = document.querySelector("#edit-task-input");
    const newTextInput = document.querySelector("#edit-text");
    const newPriority = document.querySelector("#priority-changer");
    const newDate = document.querySelector("#date-changer");
    const saveButton = document.querySelector("#edit-text-button");
    let containerDiv = event.target.parentNode;
    containerDiv.appendChild(newTextForm);
    newTextInput.focus = true;
    newTextForm.hidden = false;
    saveButton.addEventListener("click", saveEvent);
    function saveEvent(event) {
      event.preventDefault();
      let changeMade = false; //avoid unneccesary calls to JSONBin
      if (newTextInput.value !== "" && newTextInput.value !== " ") {
        tasksArray[containerDiv.index]["text"] = newTextInput.value;
        changeMade = true;
        newTextInput.value = "";
      }
      if (newPriority.value !== "") {
        tasksArray[containerDiv.index]["priority"] = newPriority.value;
        changeMade = true;
        newPriority.firstElementChild.selected = true;
      }
      if (newDate.checked) {
        tasksArray[containerDiv.index]["date"] = Number(new Date());
        changeMade = true;
        newDate.checked = false;
      }
      if (changeMade) {
        localStorage.setItem("my-todo", JSON.stringify(tasksArray));
        updateCounter(tasksArray);
        updateJSONBin(tasksArray[containerDiv.index], "PUT");
      }
      newTextForm.hidden = true;
      document.body.appendChild(newTextForm);
      saveButton.removeEventListener("click", saveEvent);
    }
  }
  //edit tooltip hide
  document.addEventListener("mouseout", (event) => {
    if (event.target.classList[0] === "todo-text") {
      const originalText = event.target;
      const tipWindow = document.querySelector("#tip-window");

      tipWindow.hidden = true;
    }
  });
}
