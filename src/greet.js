const nameInput = document.getElementById("name-input");
const getStartedButton = document.getElementById("submit-name");
const title = document.getElementById("main-title");
const userName = nameInput.value;

getStartedButton.addEventListener("click", (e) => {
    updateName();
});

function capitalizeFirstLetter(name){
    return name.charAt(0).toUpperCase() + name.slice(1);
} 

async function updateName() {
    await fetch("https://api.jsonbin.io/v3/b/601439001de5467ca6bde774", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "X-Master-Key":
          "$2b$10$5P7RliLTaANiyqYHfkRvWepKYlCjfoARhVbWxxlqCTwQexhfzjuES",
      },
      body: JSON.stringify({name: nameInput}),
    })
      .then((response) => response.json())
      .then(({name: nameInput}) => {
        console.log("Success:", {name: nameInput});
      })
      .catch((error) => {
        console.error("Error:", {name: nameInput});
      });
  }