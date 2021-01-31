
"use strict"
/**
 * taskList: the array of tasks.
*/
let API_KEY = "https://api.jsonbin.io/v3/b/60173c3d1380f27b1c205041";
let API_KEY_LATEST = "https://api.jsonbin.io/v3/b/60173c3d1380f27b1c205041/latest";
let taskList;
let jsonBin;
let body = document.body;
let view = document.getElementById("View");
let control = document.getElementById("Control");

let taskForm = document.getElementById("add-task-form");
taskForm.addEventListener("submit", addNewTask);
taskForm.addEventListener("click", eraseAll);

let dateButton = document.getElementById("sort-date");
dateButton.addEventListener("click", sortDate(), { once: false });

let priorityButton = document.getElementById("sort-button");
priorityButton.addEventListener("click", sortPriority(), { once: false });

let counter;
let counterWrapper = document.getElementById("counter");

getTaskListFromWeb();
useCustomSelect();


async function getTaskListFromWeb() {
    let response = await fetch(API_KEY_LATEST);
    if (response.ok) {
        jsonBin = await response.json();
        taskList = jsonBin.record["my-todo"];
        insertTaskListToHtml();
    } else {
        alert("HTTP-Error: " + response.status);
    }
}
function insertTaskListToHtml() {
    updateCounter();
    if (taskList.length != 0) {
        for (let task of taskList) {
            insertTaskToHtml(task)
        }
    }
}
function addNewTask(event) {
    let text = document.getElementById("text-input").value;
    let priority = document.getElementById("priority-selector").value;
    let task = insertTaskToTaskList(text, priority);
    if (text === "") {
        let basicControl = document.getElementById("basic-control");
        basicControl.setAttribute("shake", "on");
        setTimeout('basicControl.setAttribute("shake", "off")', 5000);
        return;
    }
    insertTaskToHtml(task);
    uploadJson();
    updateCounter()
    taskForm.reset();
    event.preventDefault();
}
function insertTaskToTaskList(text, priority, date = new Date()) {
    if (taskList[0] === false) {
        taskList = [];
    }
    taskList.push({
        text,
        priority,
        date
    });
    return taskList[taskList.length - 1];
}
function insertTaskToHtml(task) {
    let text = task.text;
    let date = (task.date instanceof Date) ? task.date : new Date(task.date);
    let priority = task.priority;
    date = date.toISOString();

    let containerTemplate = document.querySelector("[data-template]");
    let todoContainer = containerTemplate.cloneNode(true);
    todoContainer.removeAttribute("data-template");
    todoContainer.classList.add("todo-container");

    let textContainer = todoContainer.querySelector(".todo-text-template");
    textContainer.classList.add("todo-text");
    textContainer.classList.remove("todo-text-template");

    let priorityContainer = todoContainer.querySelector(".todo-priority-template");
    priorityContainer.classList.add("todo-priority");
    priorityContainer.classList.remove("todo-priority-template");

    let dateContainer = todoContainer.querySelector(".todo-created-at-template");
    dateContainer.classList.add("todo-created-at");
    dateContainer.classList.remove("todo-created-at-template");

    dateContainer.append(date);
    textContainer.append(text);
    priorityContainer.append(priority);
    view.append(todoContainer);

}
function uploadJson() {
    fetch(API_KEY, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ ["my-todo"]: [] }),
    })
        .then(response => response.json())
        .then(null, error => {
            alert('Error: ' + error);
        })
}
function eraseAll(event) {
    let deleteBtn = document.getElementById("delete-button")
    if (event.target != deleteBtn)
        return;
    let answer = confirm("Are you sure you want to delete all existing tasks on the list?");
    if (answer) {
        clearTaskList();
        clearListFromHtml();
    }
}
function clearTaskList() {
    taskList = [];
    uploadJson();
    updateCounter();
}
function clearListFromHtml() {
    let tasks = document.querySelectorAll(".todo-container");
    for (let task of tasks) {
        if (task.dataset.template !== "task-template")
            task.remove();
    }
}
function updateCounter() {
    counter = taskList.length;
    counterWrapper.innerText = counter;
}
//-------

function useCustomSelect() {
    let customFirstOption;
    let htmlSelectElement;
    let customOptionsWrapper;

    let customSelectList = document.querySelectorAll(".custom-select");
    for (let customSelect of customSelectList) {
        //
        htmlSelectElement = customSelect.querySelector("select");
        htmlSelectElement.selectedIndex = 0;
        customFirstOption = document.createElement("div");
        customFirstOption.classList.add("custom-first-option");
        customFirstOption.append(htmlSelectElement[0].innerHTML);
        customSelect.append(customFirstOption);
        //
        customOptionsWrapper = document.createElement("div");
        customOptionsWrapper.classList.add("custom-options-wrapper");
        customOptionsWrapper.classList.add("select-hide");

        // adding custom options to replace option tag 
        for (let i = 1; i < htmlSelectElement.length; i++) {
            let customOption = document.createElement("div");
            customOption.innerHTML = htmlSelectElement[i].innerHTML;

            customOption.addEventListener("click", clickCustomOption);
            function clickCustomOption(event) {
                let target = event.target;
                for (let i = 1; i < htmlSelectElement.length; i++) {
                    if (htmlSelectElement[i].innerHTML === target.innerHTML) {
                        htmlSelectElement.selectedIndex = i;
                        customFirstOption.innerHTML = target.innerHTML;

                        let temp = target.parentNode.querySelectorAll(".same-as-selected");
                        for (let j = 0; j < temp.length; j++) {
                            temp[j].classList.remove("same-as-selected");
                        }
                        target.classList.add("same-as-selected");
                        break;
                    }
                }
                customFirstOption.click();
            }
            customOptionsWrapper.append(customOption);
        }
        customSelect.append(customOptionsWrapper);
        customFirstOption.addEventListener("click", closeOpenBox);
        function closeOpenBox(event) {
            let target = event.target;
            event.stopPropagation();
            closeAllSelect(target);
            target.nextSibling.classList.toggle("select-hide");
            target.classList.toggle("select-arrow-active");
        }
    }
    function closeAllSelect(element) {
        let customOptionWrappers = document.querySelectorAll(".custom-options-wrapper");
        let customFirstOptions = document.querySelectorAll(".custom-first-option");
        let arr = [];
        for (let i = 0; i < customFirstOptions.length; i++) {
            if (element === customFirstOptions[i]) {
                arr.push(i);
            } else {
                customFirstOptions[i].classList.remove("select-arrow-active");
            }
        }
        for (let i = 0; i < customOptionWrappers.length; i++) {
            if (arr.indexOf(i)) {
                customOptionWrappers[i].classList.add("select-hide");
            }
        }
    }
    document.addEventListener("click", closeAllSelect);
    taskForm.addEventListener("reset", function () {
        htmlSelectElement.selectedIndex = 0;
        customFirstOption.innerHTML = document.createElement("div");
        customFirstOption.classList.add("custom-first-option");
        customFirstOption.innerHTML = htmlSelectElement[0].innerHTML;
    });
}

//------
function sortDate() {
    let latestOnTop = true;
    return function () {
        latestOnTop = !latestOnTop;
        if (latestOnTop) {
            taskList.sort((a, b) => new Date(a.date) - new Date(b.date));
        } else {
            taskList.sort((a, b) => new Date(b.date) - new Date(a.date));
        }
        clearListFromHtml()
        insertTaskListToHtml();
    }
}
function sortPriority() {
    let highestOnTop = true;
    return function () {
        highestOnTop = !highestOnTop;
        if (highestOnTop) {
            taskList.sort((a, b) => a.priority - b.priority);
        } else {
            taskList.sort((a, b) => b.priority - a.priority);
        }
        clearListFromHtml()
        insertTaskListToHtml();
    }
}

