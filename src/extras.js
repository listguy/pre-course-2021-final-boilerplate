const deleteButtons = document.getElementsByClassName("delete");
const containers = document.getElementsByClassName("todo-container");

document.addEventListener("click", (e) => {
  if (e.target.className === "delete") {
    if (confirm("this is delete")) {
      alert("item deleted");
    }
  }
});

//removes the divs and empties jsonbin.io + localStorage
document.addEventListener("click", (e) => {
  if (e.target.id === "delete-all") {
    deleteAllDivs();
    emptyJsonbin();
    counter.innerText = 0;
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
  })
    .then((response) => response.json())
    .then(({ "my-todo": [] }) => {
      console.log("Success:", { "my-todo": [] });
    })
    .catch((error) => {
      console.error("Error:", { "my-todo": [] });
    });
}
