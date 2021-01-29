const deleteButtons = document.getElementsByClassName("delete");
const containers = document.getElementsByClassName("todo-container");

document.addEventListener("click", (e) => {
  if (e.target.className === "delete") {
      alert("this is delete")
  }
});
