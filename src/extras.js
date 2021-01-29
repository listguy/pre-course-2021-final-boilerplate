const deleteButtons = document.getElementsByClassName("delete");
const containers = document.getElementsByClassName("todo-container");

document.addEventListener("click", (e) => {
  if (e.target.className === "delete") {
    if(confirm("this is delete")){
        alert("item deleted")
    }
  }
});


function deleteAll() {
  for (let i = 0; i < containers.length; i++) {
      viewSection.removeChild(containers[0]);
  }
}
