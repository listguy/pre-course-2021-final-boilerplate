document.addEventListener("DOMContentLoaded", onLoad);

function onLoad() {

}



function dateToSQLFormat(date) {
    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1); 
    const day = pad(date.getDate());
    const hour = pad(date.getHours());
    const minutes = pad(date.getMinutes()); 
    const seconds = pad(date.getSeconds()); 
    return `${year}-${month}-${day} ${hour}:${minutes}:${seconds}`;

    function pad(num) {
        return (num + "").length < 2 ? "0" + num : num;
    }
}