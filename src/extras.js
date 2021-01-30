const deleteButtons = document.getElementsByClassName("delete");
const containers = document.getElementsByClassName("todo-container");
const darkMode = document.getElementById("dark-mode");

darkMode.addEventListener("click", (e) => {
  
});

//remove the correct div + deletes from jsonbin and storageData
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

//edit button that makes it possible to chang the text
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

//done button when clicked the content cannot be changed and updates local storage+jsoonbin.io
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

//removes the divs resets the counter and empties jsonbin.io + localStorage
document.addEventListener("click", (e) => {
  if (e.target.id === "delete-all") {
    deleteAllDivs();
    emptyJsonbin();
    counter.innerText = 0;
    todoList = [];
  }
});

//deletes all the lists divs
function deleteAllDivs() {
  while (viewSection.firstChild) {
    viewSection.removeChild(viewSection.firstChild);
  }
}

//empties the Jsonbin.io json
async function emptyJsonbin() {
  await fetch("https://api.jsonbin.io/v3/b/6013b6761de5467ca6bdb0ce", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "X-Master-Key":
        "$2b$10$5P7RliLTaANiyqYHfkRvWepKYlCjfoARhVbWxxlqCTwQexhfzjuES",
    },
    body: JSON.stringify({ "my-todo": [] }),
  });
}

//gets an array filter property and property value returns an array without that value
function filterByKey(array, filter, keyword) {
  let filteredArray = array.filter(function (obj) {
    return obj[filter] !== keyword;
  });
  return filteredArray;
}

//finds the index in relation to its parent
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
