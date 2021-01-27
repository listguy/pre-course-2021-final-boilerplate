
const sqlTime = dateToSQLFormat(new Date()); 
console.log(sqlTime);


function dateToSQLFormat(date) {
    const year = date.getFullYear();
    const month = date.getMonth() + 1; 
    const day = date.getDate();
    const hour = date.getHours();
    const minutes = date.getMinutes(); 
    const seconds = date.getSeconds(); 
    return `${year}-${month}-${day} ${hour}:${minutes}:${seconds}`;
}