const API_KEY = "$2b$10$HQwOejfJc5AdOgPXf8yJvO9vLU7G6WvMojCjBiPXEdreVE0A7bM96"; // Assign this variable to your JSONBIN.io API key if you choose to use it.
const DB_NAME = "my-todo";
const DB_URL = "https://api.jsonbin.io/v3/b/6011dbcf9f55707f6dfcf2b7";

// Gets data from persistent storage by the given key and returns it
async function getPersistent(key) { 
  const init = {
    method: "GET",
    headers: {
      "X-Master-Key": API_KEY
    }
  };
  const request = new Request(DB_URL, init);
  const loadIcon = document.querySelector("#loading");
  loadIcon.style.visibility = "visible";
  const response = await ( await fetch(request) ).json();
  loadIcon.style.visibility = "hidden";
  return response.record[key];
}

// Saves the given data into persistent storage by the given key.
// Returns 'true' on success.
async function setPersistent(key, data) {
  const sendObject = {};
  sendObject[key] = data;
  if(data.length === 0) sendObject[key] = null;
  const dataString = JSON.stringify(sendObject); 
  const init = {
    method: "PUT",
    body: dataString,
    headers: {
      "Content-Type": "application/json",
      "X-Master-Key": API_KEY,
      "X-Bin-Versioning": false
    }
  };
  const request = new Request(DB_URL, init);
  const loadIcon = document.querySelector("#loading");
  loadIcon.style.visibility = "visible";
  const response = await fetch(request);
  loadIcon.style.visibility = "hidden";
  return response.ok;
}