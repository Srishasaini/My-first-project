const apikey="ea2b6fc2eb5d85f0912c37f505342d7f";
const apiUrl="https://api.openweathermap.org/data/2.5/weather?q=delhi&units=metric";

async function checkweather(){
    const response = await fetch(apiUrl+ '&appid=$(apikey)');
    var data = await response.json();

    console.log(data)
}
checkweather();