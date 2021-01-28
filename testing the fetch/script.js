const myKey = "$2b$10$5P7RliLTaANiyqYHfkRvWepKYlCjfoARhVbWxxlqCTwQexhfzjuES";
// function uploadPeople() {
//     fetch('https://api.jsonbin.io/b',{
//         method:'POST',
//         headers:{
//             'Content-Type':'application/json',
//             'secret-key': myKey,
//             'private':false,
//             'name':'test'
//         },
//         body: JSON.stringify(people),
//     })
//     .then(response => response.json())
//     .then(data => {
//         console.log('success', data);
//     })
//     .catch((error) => {
//         console.log('error:', error);
//     })
// }

// //THIS IS HOW TO PUSH THE DATA INTO THE WEBSITE
// let req = new XMLHttpRequest();

// req.onreadystatechange = () => {
//   if (req.readyState == XMLHttpRequest.DONE) {
//     console.log(req.responseText);
//   }
// };

// req.open("POST", "https://api.jsonbin.io/b", true);
// req.setRequestHeader("Content-Type", "application/json");
// req.setRequestHeader("secret-key", "$2b$10$5P7RliLTaANiyqYHfkRvWepKYlCjfoARhVbWxxlqCTwQexhfzjuES");
// req.send(JSON.stringify(people));
const people = [
  {
    name: "ophiruuuuuuuuu",
    lastName: "huberman",
    age: "21",
  },
  {
    name: "moshe",
    lastName: "luchim",
    age: "45",
  },
  {
    name: "tamir",
    lastName: "malol",
    age: "30",
  },
];

//USING FETCH WORKSSSSSSSS!!!!!!!!!!!!!!!!!!! V3 THIS CREATES
const data = [{}];
async function uploadList() {
  await fetch("https://api.jsonbin.io/v3/b", {
    method: "POST", // or 'PUT'
    headers: {
      "Content-Type": "application/json",
      "X-Master-Key":
        "$2b$10$5P7RliLTaANiyqYHfkRvWepKYlCjfoARhVbWxxlqCTwQexhfzjuES",
      "X-Bin-Name": "new list",
      'X-Bin-Private':false,
    },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Success:", data);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}
uploadList();

//THIS IS HOW TO UPDATE REQUIRES THE BIN ID TO UPDATE
async function updateList() {
  await fetch("https://api.jsonbin.io/v3/b/6012d3f5c9033f74c42790b5", {
    method: "PUT", 
    headers: {
      "Content-Type": "application/json",
      "X-Master-Key":
        "$2b$10$5P7RliLTaANiyqYHfkRvWepKYlCjfoARhVbWxxlqCTwQexhfzjuES",
    },
    body: JSON.stringify(array),
  })
}

// updateList();

//TO READ LIST !!!!!!!!!!!!!!
function readList(){
  await fetch('https://api.jsonbin.io/v3/b/6012d3f5c9033f74c42790b5/latest')
  .then(res => res.json())
  .then(data => data)
  return data;
}

console.log(readList());



