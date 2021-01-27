
// let data;
// let req = new XMLHttpRequest();

// req.onreadystatechange = () => {
//     if (req.readyState == XMLHttpRequest.DONE) {
//         console.log(req.responseText);
//     }
// };

// req.open("GET", "https://api.jsonbin.io/b/6011936f3126bb747e9fd00f", true);
// req.send();
  
let requestURL = 'https://api.jsonbin.io/b/6011936f3126bb747e9fd00f';
let request = new XMLHttpRequest();
request.open('GET', requestURL);
request.responseType = 'json';
request.send();
request.onload = function() {
    let superHeroes = request.response;
    let todoContainer = document.createElement('div');

    for(task of superHeroes){
        todoContainer.classList.add('todo-container');

        let todoPriority = document.createElement('div');
        todoPriority.classList.add('todo-priority');
        todoPriority.append(task["priority"]);

        let todoCreatedAt = document.createElement('div');
        todoCreatedAt.classList.add('todo-created-at');
        todoCreatedAt.append(task["date"]);

        let todoText = document.createElement('div');
        todoText.classList.add('todo-text');
        todoText.append(task["text"]);
        
        todoContainer.append(todoPriority);
        todoContainer.append(todoCreatedAt);
        todoContainer.append(todoText);
    }

    document.body.append(todoContainer);
}

