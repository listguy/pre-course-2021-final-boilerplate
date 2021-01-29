const deleteButtons = document.getElementsByClassName("delete");
const containers = document.getElementsByClassName("todo-container");

document.addEventListener("click", (e) => {
  if (e.target.className === "delete") {
    if(confirm("this is delete")){
        alert("item deleted")
    }
  }
});

document.addEventListener("click", e => {
    if(e.target.id === "delete-all") {
        deleteAll();
    }
})

function deleteAll() {
  for (let i = 0; i < containers.length; i++) {
    let Child =  containers[0];
    viewSection.removeChild(Child);
  }
}
