const nameInput = document.getElementById("name-input");
const getStartedButton = document.getElementById("submit-name");
const userName = nameInput.value;
const title = document.getElementById("main-title");

getStartedButton.addEventListener("click", (e) => {
    title.innerHTML = "Hello" + capitalizeFirstLetter(userName);
});

function capitalizeFirstLetter(name){
    return name.charAt(0).toUpperCase() + name.slice(1);
} 