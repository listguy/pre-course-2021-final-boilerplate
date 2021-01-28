list = [{"fuck": "me", "number": 4}, {"fuck": "you", "number": 2}, {"fuck": "you", "number": 1}]
console.log(list);
list.sort((a, b) => (a["number"] > b["number"]) ? 1 : -1);
console.log(list);