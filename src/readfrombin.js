funk();


async function funk(){
    let response = await fetch('https://api.jsonbin.io/v3/b/6011936f3126bb747e9fd00f/latest');

    let text = await response.json(); 
    let bunny = text["record"];
    console.log(bunny);
}