const deleteButtons = document.getElementsByClassName("delete");
const containers = document.getElementsByClassName("todo-container");
const darkMode = document.getElementById("dark-mode");
const regular = document.getElementById("regular-mode");
const style = document.getElementById("style");
const spinner = document.getElementById("spinner-img");

//Switch to dark mode on click
darkMode.addEventListener("click", (e) => {
  style.href = "./dark-mode.css";
  const instagram = document.getElementById("instagram");
  instagram.src = "./images/blue-back-instagram-icon.png";
});

//Switch to regular mode on click
regular.addEventListener("click", (e) => {
  style.href = "./style.css";
  const instagram = document.getElementById("instagram");
  instagram.src = "./images/blue-instagram-icon.png";
});

//Remove the correct div + deletes from jsonbin and storageData
document.addEventListener("click", (e) => {
  if (e.target.className === "delete") {
    if (confirm("todo is going to be deleted")) {
      const thisDiv = e.target.parentElement;
      const divDate = thisDiv.getElementsByClassName("todo-created-at")[0]
        .outerText;
      viewSection.removeChild(thisDiv);
      todoList = filterByKey(todoList, "date", divDate);
      localStorage.setItem("my-todo", JSON.stringify(todoList));
      jsonList["my-todo"] = todoList;
      updateList();
      counter.innerText = Number(counter.innerText) - 1;
    }
  }
});

//Edit button that makes it possible to chang the text
document.addEventListener("click", (e) => {
  if (e.target.className === "edit") {
    const parent = e.target.parentElement;
    const text = parent.getElementsByClassName("todo-text")[0];
    text.contentEditable = true;
    const done = parent.getElementsByClassName("done")[0];
    done.hidden = false;
    e.target.hidden = true;
  }
});

//Done button when clicked the content cannot be changed and updates local storage+jsoonbin.io
document.addEventListener("click", (e) => {
  if (e.target.className === "done") {
    const parent = e.target.parentElement;
    const text = parent.getElementsByClassName("todo-text")[0];
    text.contentEditable = false;
    const containerIndex = findChildNodeIndex(parent);
    const newText = text.innerHTML;
    todoList[containerIndex]["text"] = newText;
    localStorage.setItem("my-todo", JSON.stringify(todoList));
    jsonList["my-todo"] = todoList;
    updateList();
    const edit = parent.getElementsByClassName("edit")[0];
    edit.hidden = false;
    e.target.hidden = true;
  }
});

//Removes the divs resets the counter and empties jsonbin.io + localStorage
document.addEventListener("click", (e) => {
  if (e.target.id === "delete-all") {
    if (confirm("Are you sure you want to delete all items?")) {
      deleteAllDivs();
      emptyJsonbin();
      counter.innerText = 0;
      todoList = [];
    }
  }
});

//------------------------------------Functions------------------------------------//

//Deletes all the lists divs
function deleteAllDivs() {
  while (viewSection.firstChild) {
    viewSection.removeChild(viewSection.firstChild);
  }
}

//Gets an array, filter property and property value. Returns an array without that value
function filterByKey(array, filter, keyword) {
  let filteredArray = array.filter(function (obj) {
    return obj[filter] !== keyword;
  });
  return filteredArray;
}

//Finds the child index in relation to its parent
function findChildNodeIndex(child) {
  const parent = child.parentNode;
  const childrenNodes = parent.childNodes;
  const length = childrenNodes.length;
  let childIndex;
  for (let i = 0; i < length; i++) {
    if (child === childrenNodes[i]) {
      childIndex = i;
      break;
    }
  }
  return childIndex;
}
