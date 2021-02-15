
"use strict"
/**
 * taskList: the array of tasks.
 * jsonBin an object with the structure {my-to:taskList}
 * for problems with synchronizing 
 * uploaded.then(function(){ });
*/
let API_KEY = "https://api.jsonbin.io/v3/b/6018738fdde2a87f921c29a6";
let API_KEY_LATEST = "https://api.jsonbin.io/v3/b/6018738fdde2a87f921c29a6/latest";
let taskList;
let jsonBin;
let body = document.body;

let control = document.getElementById("Control");
let basicControl = document.getElementById("basic-control");

let taskForm = document.getElementById("add-task-form");
taskForm.addEventListener("submit", addNewTask);
taskForm.addEventListener("click", eraseAll);
taskForm.addEventListener("click", removeAllMarked);

let counter;
let counterWrapper = document.getElementById("counter");

let listWrapper = document.getElementById("list-wrapper");
listWrapper.addEventListener("click", markedTask, { once: false });

let dateButton = document.getElementById("sort-date");
dateButton.addEventListener("click", sortDate(), { once: false });

let priorityButton = document.getElementById("sort-button");
priorityButton.addEventListener("click", sortPriority(), { once: false });
useCustomSelect();


getTaskListFromWeb().then(insertTaskListToHtml).catch(error => alert(error));
function getTaskListFromWeb() {
    return fetch(API_KEY_LATEST).then(response => {
        if (!response.ok)
            throw new Error("HTTP-Error: " + response.status);
        else
            return response.json();
    }).then(json => {
        taskList = json.record["my-todo"]
        return taskList;
    });
}

function insertTaskListToHtml(taskList) {
    updateCounter(taskList);
    if (taskList.length != 0) {
        for (let task of taskList) {
            insertTaskToHtml(task)
        }
    }
}
function addNewTask(event) {
    let text = document.getElementById("text-input").value;
    let priority = document.getElementById("priority-selector").value;

    if (text === "" || priority < 1) {
        denyInput(text, priority)
    } else {
        let task = insertTaskToTaskList(text, priority, new Date(), false, taskList);
        insertTaskToHtml(task);
        uploadJson(taskList);
        updateCounter(taskList);
        taskForm.reset();
        event.preventDefault();
    }
    function denyInput(text, priority) {
        basicControl.setAttribute("shake", "on");
        event.preventDefault();
        setTimeout('basicControl.setAttribute("shake", "off")', 1000);
        setTimeout('return', 500);
    }
}
function insertTaskToTaskList(text, priority, date = new Date(), marked = false, taskList) {
    if (taskList[0] === false) {
        taskList = [];
    }

    taskList.push({
        text,
        priority,
        date,
        marked
    });
    return taskList[taskList.length - 1];
}
function insertTaskToHtml(task) {
    let text = task.text;
    let priority = task.priority;
    let date = (task.date instanceof Date) ? task.date : new Date(task.date);
    date = dateToSQL(date);
    let marked = task.marked;

    let containerTemplate = document.querySelector("[data-template]");
    let todoContainer = containerTemplate.cloneNode(true);
    todoContainer.removeAttribute("data-template");
    todoContainer.classList.add("todo-container");
    todoContainer.dataset.priority = priority;

    let textContainer = todoContainer.querySelector(".todo-text-template");
    textContainer.classList.add("todo-text");
    textContainer.classList.remove("todo-text-template");

    let priorityContainer = todoContainer.querySelector(".todo-priority-template");
    priorityContainer.classList.add("todo-priority");
    priorityContainer.classList.remove("todo-priority-template");

    let dateContainer = todoContainer.querySelector(".todo-created-at-template");
    dateContainer.classList.add("todo-created-at");
    dateContainer.classList.remove("todo-created-at-template");

    if (marked) {
        todoContainer.dataset.marked = "true";
        todoContainer.querySelector(".delete-checkbox-input").checked = true;
    }

    dateContainer.append(date);
    textContainer.append(text);
    priorityContainer.append(priority);
    listWrapper.append(todoContainer);

}
function uploadJson(taskList) {
    body.dataset.loading = true;
    fetch(API_KEY, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ ["my-todo"]: taskList }),
    })
        .then(response => response.json())
        .catch(error => {
            alert('Error: ' + error);
        });
    body.dataset.loading = false;

}
function eraseAll(event) {
    let deleteBtn = document.getElementById("delete-button")
    if (event.target != deleteBtn)
        return;
    let answer = confirm("Are you sure you want to delete all existing tasks on the list?");
    if (answer) {
        clearTaskList(taskList);
        clearListFromHtml();
    }
}
function clearTaskList(taskList) {
    taskList = [];
    uploadJson(taskList);
    updateCounter(taskList);
}
function clearListFromHtml() {
    let tasks = document.querySelectorAll(".todo-container");
    for (let task of tasks) {
        if (task.dataset.template !== "task-template") {
            task.remove();
            let checkBox = task.querySelector(".delete-checkbox input");
            checkBox.checked === false;
        }
    }
}
function updateCounter(taskList) {
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
        let sortFunction = (latestOnTop) ?
            (a, b) => new Date(a.date) - new Date(b.date) :
            (a, b) => new Date(b.date) - new Date(a.date);
        taskList.sort(sortFunction);
        clearListFromHtml()
        insertTaskListToHtml();
    }
}
function sortPriority() {
    let highestOnTop = true;
    return function () {
        highestOnTop = !highestOnTop;
        let sortFunction = (highestOnTop) ?
            (a, b) => a.priority - b.priority :
            (a, b) => b.priority - a.priority;
        taskList.sort(sortFunction);
        clearListFromHtml()
        insertTaskListToHtml();
    }
}
function dateToSQL(date) {
    let pad = function (num) {
        return ('00' + num).slice(-2);
    }
    let sql = date.getUTCFullYear() + '-' +
        pad(date.getUTCMonth() + 1) + '-' +
        pad(date.getUTCDate()) + ' ' +
        pad(date.getUTCHours()) + ':' +
        pad(date.getUTCMinutes()) + ':' +
        pad(date.getUTCSeconds());
    return sql;
}
function markedTask(event) {
    let target = event.target;
    if (target.className != "delete-checkbox-input")
        return;
    let container = event.target.closest("DIV").parentNode;
    if (target.checked === true) {
        container.dataset.marked = "true";
    } else {
        container.dataset.marked = "false";
    }
    /*enter marked to jsonBin */
    let allTaskWrappers = document.querySelectorAll(".todo-container")
    for (let i = 0; i < allTaskWrappers.length; i++) {
        if (allTaskWrappers[i] === container) {
            taskList[i].marked = target.checked;
            break;
        }
    }
    uploadJson(taskList);
}
function removeAllMarked(event) {
    let deleteMarkBtn = document.getElementById("delete-marked")
    if (event.target != deleteMarkBtn) {
        return;
    }

    let allTaskWrappers = document.querySelectorAll(".todo-container");
    for (let task of allTaskWrappers) {
        if (task.dataset.template != "task-template" && task.dataset.marked === "true") {
            task.remove();
        }
    }
    for (let i = 0; i <= taskList.length; i++) {
        if (i === taskList.length)
            break;
        if (taskList[i].marked === true) {
            taskList.splice(i, 1);
            i--;
        }
        uploadJson(taskList);
    }
    updateCounter(taskList);
}











