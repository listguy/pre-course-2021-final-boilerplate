const API_KEY = "$2b$10$HQwOejfJc5AdOgPXf8yJvO9vLU7G6WvMojCjBiPXEdreVE0A7bM96"; // Assign this variable to your JSONBIN.io API key if you choose to use it.
const DB_NAME = "my-todo";
const DB_URL = "https://api.jsonbin.io/v3/b/6011dbcf9f55707f6dfcf2b7";
// Gets data from persistent storage by the given key and returns it
async function getPersistent(key) { 
  const request = new Request(
    DB_URL,
    {
      method: "GET",
      headers: {
        "X-Master-Key": API_KEY
      }
    }
  );
  const title = document.querySelector("h1");
  title.innerText = "TO-DO List: Loading...";
  const response = await (await fetch(request)).json();
  title.innerText = "TO-DO List:";
  console.log(response);
  return response.record[key];
  // return JSON.parse(localStorage.getItem(key));

}

// Saves the given data into persistent storage by the given key.
// Returns 'true' on success.
async function setPersistent(key, data) {
  const sendObject = {};
  sendObject[key] = data;
  if(data.length === 0) sendObject[key] = null;
  const dataString = JSON.stringify(sendObject); 
  const request = new Request(
    DB_URL,
    {
      method: "PUT",
      body: dataString,
      headers: {
        "Content-Type": "application/json",
        "X-Master-Key": API_KEY,
        "X-Bin-Versioning": false
      }
    });
    const response = await fetch(request);
    console.log(response);
  // return localStorage.setItem(key, JSON.stringify(data));
  }