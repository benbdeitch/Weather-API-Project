
//Constant declarations, and an importing of the 'ISO 3166' country codes, to avoid having to institute API calls solely for the sake of verification. 
import secret from '../static/json/secret.json' assert {type: 'json'};
import countryCodes from '../static/json/country_codes.json' assert {type: 'json'};



const API_KEY = secret.API_KEY

const locBox = document.getElementById("locBox")
const locButton = document.getElementById("currentLocation")
const locForm = document.getElementById("loc_form")
///search box initialization
const searchBox = document.getElementById("searchBox")
const countryBar = document.getElementById("countrybar")
/*for (let i = 0; i<countryCodes.length; i++){
    const option = document.createElement("option")
    option.value = countryCodes[i].Code;
    option.innerHTML = countryCodes[i].Name;
    countryBar.appendChild(option)
}*/
let countryDictionary = {}
for (let i = 0; i<countryCodes.length; i++){
    countryDictionary[countryCodes[i].Code] = countryCodes[i].Name;
}




//Elements grabbed for pagination purposes.
const mainPage = document.getElementById("main_page")
const displayWeather = document.getElementById("displayWeather")
const homeLink = document.getElementById("home_link")
const currentLink = document.getElementById("current_link")
const searchLink = document.getElementById("search_link")
displayWeather.remove()
let lat = 0;
let lon = 0;
let populated = false; 
let  currentWeather = -1; 
// This button will send an API call, based on the direct coordinates required. 



function titleCase(string) {
    string = string.toLowerCase();
    string = string.split(' ');
    for (var i = 0; i < string.length; i++) {
        string[i] = string[i].charAt(0).toUpperCase() + string[i].slice(1); 
        }
    return string.join(' ');
}

locButton.addEventListener("click", getLocalWeather )
async function getLocalWeather()  {
    navigator.geolocation.getCurrentPosition(
        (position) => {
        lat = position.coords.latitude;
        lon = position.coords.longitude;
        getWeatherbyLatLon(lat,lon)},
    (error) => { window.alert("Error getting user location", error);})
 
    
}    
locForm.addEventListener('submit', async (e) => {
    e.preventDefault() 
    console.log("hello")
    //let country = locForm.country.value
    let city = locForm.city.value
    let url = "";
    //if (country = "default"){
        url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=imperial`;
    /*}
    else{
        url = `http://api.openweathermap.org/geo/1.0/direct?q=${city},${country}&limit={1}&appid=${API_KEY}&units=imperial`;
        
    }*/

    const response = await fetch(url)
    if (response.ok){
    const data = await response.json()
    console.log(data)
    toWeather()
    populateWeather(data)
    }
    else{
        window.alert("City not found.")
    }
})



async function getWeatherbyLatLon(lat, lon){
    console.log(` Before call: lat is ${lat}, lon is ${lon}`)
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=imperial`);
    if (response.ok){
        console.log(response)
        toWeather()
        const json = await response.json();
        console.log(json)
        populateWeather(json)
    }
    else{
        window.alert("Error. Unsuccessful call.")
    }
}

function populateWeather(json){
        populated = true;
        let image = json.weather[0].id;
        let background = ""
        console.log(image)
        console.log(json)
        if (200 <= image <=232){
           
            background = "url(./static/images/thunderstorm.jpg)"
        }
        else if (300<= image <= 321){
            background = "url(./static/images/drizzle.jpg)"
        }
        else if (500 <= image <= 531){

            background = "url(./static/images/rain.jpg)"

        }
        else if (600 <= image <= 622){
            background = "url(./static/images/Snow.jpg)"
        }
        else if (701 <= image <= 781){
            background = "url(./static/images/fog.jpg)"

        }
        else if (image == 800){
            background = "url(./static/images/sunny.webp)"
        }
        else{
            background = "url(./static/images/cloudy.jpg)"

        }
        
        document.querySelector("#location").innerHTML = `Location: ${json.name}, ${countryDictionary[json.sys.country]}`
        document.querySelector("#main_temp").innerHTML = ` ${Math.round(json.main.temp)}\xB0`
        document.querySelector("#low_temp").innerHTML = `Low Temp: ${Math.round(json.main.temp_min)}\xB0`
        document.querySelector("#high_temp").innerHTML = `${Math.round(json.main.temp_max)}\xB0`
        document.querySelector("#forecast").innerHTML = `Forecast: ${titleCase(json.weather[0].description)}`
        document.querySelector("#forecast_icon").src = `https://openweathermap.org/img/wn/${json.weather[0].icon}@2x.png`
        document.querySelector("#Humidity").innerHTML = `Humidity: ${json.main.humidity}%`
        document.querySelector("#feels_like").innerHTML = `${Math.round(json.main.feels_like)}\xB0`
        document.body.style.backgroundImage = background;
    }   

//This section handles pagination functions

function toWeather(){
    homeLink.classList.remove("active")
    currentLink.classList.add("active")
    mainPage.remove()
    document.body.appendChild(displayWeather)
    if (!populated){
        getLocalWeather()
    }
}

function toMainPage(){
    homeLink.classList.add("active")
    currentLink.classList.remove("active")
    displayWeather.remove()
    document.body.appendChild(mainPage)
}
currentLink.addEventListener('click', toWeather)
homeLink.addEventListener('click', toMainPage)