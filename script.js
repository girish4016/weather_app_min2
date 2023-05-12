

// check if you have data of latitude and longitude
// geolocation data

let lat = null;
let long = null;

let currentmode = null;
let weatherBox = document.querySelector(".weather_details");
let searchBar = document.querySelector(".search_bar");

function getLocation(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(updateposition);
    }
    else{
        console.log('NO geolocation support');
    }
}

async function updateposition(pos){
    console.log('vo');
    if(pos){
        lat = pos.coords.latitude;
        long = pos.coords.longitude;
    }
    console.log(lat);
    console.log(long);
    document.querySelector('.ask_permission').classList.remove('active');
    setWeather();
}

async function setWeather(){
    if(weatherBox.classList.contains('active'))
    weatherBox.classList.remove('active');
    showGif();
    let val = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=c6eb2c2a10e3ac84df3f2efa6566a178`);
    let data = await val.json();
    updateweather(data);
    hideGif();
    weatherBox.classList.add('active');
}

async function setWeathercity(){
    let city = document.querySelector('.city_name').value.toLowerCase();
    if(weatherBox.classList.contains('active'))
    weatherBox.classList.remove('active');
    if(city==='')return;
    showGif();
    let val = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=c6eb2c2a10e3ac84df3f2efa6566a178`);
    let data = await val.json();
    updateweather(data);
    hideGif();
    weatherBox.classList.add('active');
}


function showGif(){
    document.querySelector('.loading').classList.add('active');
}
function hideGif(){
    document.querySelector('.loading').classList.remove('active');
}


function updateweather(data){
    console.log(data);
    document.querySelector('.country_name').innerHTML = data?.name;
    document.querySelector('.country_flag').src = `https://hatscripts.github.io/circle-flags/flags/${data?.sys?.country.toLowerCase()}.svg`;
    document.querySelector('.weather_name').innerHTML = data?.weather?.[0]?.main;
    document.querySelector('.weather_symbol').src = `https://openweathermap.org/img/w/${data?.weather?.[0]?.icon}.png`;
    document.querySelector('.temperature').innerHTML = (data?.main?.temp - 273).toFixed(1);    
    document.querySelector('.windspeed').innerHTML = data?.wind?.speed + " "+'m/s';
    document.querySelector('.humidity').innerHTML = data?.main?.humidity +'%';
    document.querySelector('.clouds').innerHTML = data?.clouds?.all +'%';
}

let myLocation = document.querySelector('.your_location');
let searchLocation = document.querySelector('.search_location');

myLocation.addEventListener('click',mylocmode);
searchLocation.addEventListener('click',searchlocmode);


function mylocmode(){
    if(currentmode===myLocation)return;
    if(currentmode)
    currentmode.classList.remove('active_button');
    currentmode = myLocation;
    currentmode.classList.add('active_button')
    searchBar.classList.remove('active');
    weatherBox.classList.remove('active');
    navigator.permissions.query({name: 'geolocation'}).then(
        function(result){
            if(result.state=='granted'){console.log('click');
                updateposition();
            }
            else{
                document.querySelector('.ask_permission').classList.add('active');
            }
        }
    );
}
function searchlocmode(){
    if(currentmode===searchLocation)return;
    if(currentmode)
    currentmode.classList.remove('active_button')
    if(document.querySelector('.ask_permission').classList.contains('active'))
    document.querySelector('.ask_permission').classList.remove('active');
    currentmode = searchLocation;
    currentmode.classList.add('active_button')
    searchBar.classList.add('active');
    weatherBox.classList.remove('active');
}

document.querySelector('.grant_permission').addEventListener('click',getLocation);

document.querySelector('.search_button').addEventListener('click',setWeathercity);

mylocmode();
