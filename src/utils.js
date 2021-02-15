const API_KEY = "$2b$10$5P7RliLTaANiyqYHfkRvWepKYlCjfoARhVbWxxlqCTwQexhfzjuES"; // Assign this variable to your JSONBIN.io API key if you choose to use it.
const DB_NAME = "my-todo";

// Gets data from persistent storage by the given key and returns it
async function getPersistent(key) {
  return [];
}

// Saves the given data into persistent storage by the given key.
// Returns 'true' on success.
async function setPersistent(key, data) {
  return true;
}

//When the page is loaded its content is taken from jsonbin.io and updates the localStorage
document.addEventListener("DOMContentLoaded", (e) => {
  const resPromise = fetch("https://api.jsonbin.io/v3/b/6013b6761de5467ca6bdb0ce/latest");
  resPromise.then((res)=> {
    const jsonResponse = res.json();
    jsonResponse.then((json)=> {
      const objectResponse = json["record"];
      jsonList = objectResponse;
      todoList = jsonList["my-todo"];
      counter.innerText = todoList.length;
      localStorage.setItem("my-todo", JSON.stringify(todoList));
      arrayToDiv(todoList);
    })
  })
});

//Updates the list and sends a success/error in console log
function updateList() {
  fetch("https://api.jsonbin.io/v3/b/6013b6761de5467ca6bdb0ce", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "X-Master-Key":
        "$2b$10$5P7RliLTaANiyqYHfkRvWepKYlCjfoARhVbWxxlqCTwQexhfzjuES",
    },
    body: JSON.stringify(jsonList),
  })
    .then((response) => response.json())
    .then((jsonList) => {
      console.log("Success:", jsonList);
    })
    .catch((error) => {
      console.error("Error:", jsonList);
    });
}

//Empties the Jsonbin.io json
function emptyJsonbin() {
  fetch("https://api.jsonbin.io/v3/b/6013b6761de5467ca6bdb0ce", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "X-Master-Key":
        "$2b$10$5P7RliLTaANiyqYHfkRvWepKYlCjfoARhVbWxxlqCTwQexhfzjuES",
    },
    body: JSON.stringify({ "my-todo": [] }),
  });
}

// //When the page is loaded its content is taken from jsonbin.io and updates the localStorage
// document.addEventListener("DOMContentLoaded", async (e) => {
//   let response = await fetch(
//     "https://api.jsonbin.io/v3/b/6013b6761de5467ca6bdb0ce/latest"
//   );
//   let jsonResponse = await response.json();
//   let objectResponse = jsonResponse["record"];
//   jsonList = objectResponse;
//   todoList = jsonList["my-todo"];
//   counter.innerText = todoList.length;
//   localStorage.setItem("my-todo", JSON.stringify(todoList));
//   arrayToDiv(todoList);
// });