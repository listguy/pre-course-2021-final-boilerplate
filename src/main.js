
"use strict"
/**
 * taskList: the array of tasks.
*/

let taskList;
let body = document.body;
let view = document.getElementById("View");
let control = document.getElementById("Control");

let taskForm = document.getElementById("add-task-form");
taskForm.addEventListener("submit", addNewTask);
taskForm.addEventListener("click", eraseAll);
let counter = document.getElementById("counter");

getTaskListFromWeb();


async function getTaskListFromWeb() {
    let response = await fetch("https://api.jsonbin.io/b/6015fc78abdf9c55679525de/latest");
    if (response.ok) {
        taskList = await response.json();
        insertTaskListToHtml();
    } else {
        alert("HTTP-Error: " + response.status);
    }
}
function insertTaskListToHtml() {
    updateCounter();
    if (taskList[0] != false) {
        for (let task of taskList) {
            insertTaskToHtml(task)
        }
    }
}

function addNewTask(event) {
    let text = document.getElementById("text-input").value;
    let priority = document.getElementById("priority-list").value;
    let task = insertTaskToTaskList(text, priority);

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

    let containerTemplate = document.querySelector("[data-template]");
    let todoContainer = containerTemplate.cloneNode(true);
    todoContainer.removeAttribute("data-template");


    let textContainer = todoContainer.querySelector(".todo-text")
    let dateContainer = todoContainer.querySelector(".todo-created-at");
    let priorityContainer = todoContainer.querySelector(".todo-priority");

    dateContainer.append(date);
    textContainer.append(text);
    priorityContainer.append(priority);
    view.append(todoContainer);

}
function uploadJson() {
    fetch("https://api.jsonbin.io/b/6015fc78abdf9c55679525de", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(taskList),
    })
        .then(response => response.json())
        .then(null, error => {
            alert('Error:', error);
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
    taskList = [false];
    uploadJson();
    updateCounter();
}
function clearListFromHtml() {
    let tasks = document.querySelectorAll(".todo-container");
    for (let task of tasks) {
        task.remove();
    }
}
function updateCounter() {
    let i;
    i = (taskList[0] != false) ? taskList.length : 0;
    counter.innerText = "You have: " + i + " tasks.";
}

useCustomSelect();
function useCustomSelect() {
    const customSelectList = document.querySelectorAll(".custom-select");
    for (let customSelect of customSelectList) {
        const htmlSelectElement = customSelect.querySelector("select");
        let customFirstOption = document.createElement("DIV");
        customFirstOption.classList.add("custom-first-option");
        customFirstOption.append(htmlSelectElement[0].innerHTML);
        customSelect.append(customFirstOption);

        let customOptionsWrapper = document.createElement("DIV");
        customOptionsWrapper.classList.add("custom-options-wrapper");

        customOptionsWrapper.hidden = true;
        for (let i = 1; i < htmlSelectElement.length; i++) {
            let customOption = document.createElement("DIV");
            customOption.innerHTML = htmlSelectElement[i].innerHTML;

            customOption.addEventListener("click", clickCustomOption);

            customOptionsWrapper.append(customOption);
        }
        customSelect.append(customOptionsWrapper);
        customFirstOption.addEventListener("click", closeOpenBox);


        function clickCustomOption(event) {
            let target = event.target;
            let i;
            for (i = 0; i < htmlSelectElement.length; i++) {
                if (htmlSelectElement[i].innerHTML == target.innerHTML) {
                    htmlSelectElement.selectedIndex = i;
                    customFirstOption.innerHTML = target.innerHTML;
                    let temp = target.parentNode.querySelectorAll(".same-as-selected");
                    for (let item of temp) {
                        item.classList.remove("same-as-selected");
                    }
                    target.classList.add("same-as-selected");
                    break;
                }
            }
            customFirstOption.innerHTML.dispatchEvent("click");
        }
    }

    function closeAllSelect(index = -1) {
        let customOptionWrappers = document.querySelectorAll(".custom-options-wrapper");
        let customFirstOptions = document.querySelectorAll(".custom-first-option");

        for (let customFirstOption of customFirstOptions) {
            customFirstOption.classList.toggle("select-arrow-active");
        }

        if (index > -1) {
            customFirstOptions[index].classList.toggle("select-arrow-active");
        }

        for (let customOptionWrapper of customOptionWrappers) {
            customOptionWrapper.hidden = true;
        }
        if (index > -1) {
            customOptionWrappers[index].hidden = false;
        }
    }

    function closeOpenBox(event) {
        event.stopPropagation();
        const temp = document.querySelectorAll(".custom-first-option");
        for (let i = 0; i < temp.length; i++) {
            if (temp[i] === event.target)
                closeAllSelect(i);
            break;
        }
        event.target.querySelector(".custom-options-wrapper").classList.toggle("select-arrow-active");
    }
    document.addEventListener("click", closeAllSelect);

}


