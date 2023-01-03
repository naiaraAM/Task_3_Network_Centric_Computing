async function getWeatherAPI(url) {
    const response = await fetch(url);
    const data = await response.json();

    // Weather conditions
    const weather = data.weather;
    //const url = 'https://openweathermap.org/img/wn/'
    let icon = weather[0].icon;
    let png = icon + ".png";
    let iconUrl = 'https://openweathermap.org/img/wn/' + png;
    document.getElementById("icon").innerHTML = `<img src="${iconUrl}" alt="Weather icon">`;
    let description = weather[0].description;
    document.getElementById("description").innerHTML = description.charAt(0).toUpperCase() + description.slice(1);


    // Temperature
    const temp = data.main;
    document.getElementById("actual").innerHTML = Math.round(temp.temp);
    document.getElementById("feels-like").innerHTML = Math.round(temp.feels_like);
    document.getElementById("min").innerHTML = Math.round(temp.temp_min);
    document.getElementById("max").innerHTML = Math.round(temp.temp_max);

    // Sunrise and sunset
    const sys = data.sys;
    let sunrise = sys.sunrise;
    let sunset = sys.sunset;
    let dateSunrise = new Date(sunrise * 1000);
    let dateSunset = new Date(sunset * 1000);
    document.getElementById("sunrise").innerHTML = dateSunrise.toLocaleTimeString();
    document.getElementById("sunset").innerHTML = dateSunset.toLocaleTimeString();

    //Humidity
    const humidity = data.main;
    document.getElementById("humidity").innerHTML = humidity.humidity;
    // Cloudiness
    const cloudiness = data.clouds;
    document.getElementById("cloudiness").innerHTML = cloudiness.all;

    // Forecast
    let longitude = data.coord.lon;
    let latitude = data.coord.lat;
    const urlForecast = 'https://api.openweathermap.org/data/2.5/forecast?lat=' + longitude.toFixed(2) + '&lon=' + latitude.toFixed(2) + '&units=metric&appid=cb2e9426acc7b3bdabd14474ae9e8311';
    getWeatherForecast(urlForecast);

    let lat = data.coord.lat;
    let lon = data.coord.lon;
    const urlMap = 'https://openweathermap.org/weathermap?basemap=map&cities=false&layer=precipitation&lat=' + lat + '&lon=' + lon + '&zoom=10';
    document.getElementById("map").innerHTML = `<iframe width="100%" height="500" style="border:0" loading="lazy" allowfullscreen src="${urlMap}"></iframe>`;
}

async function getWeatherForecast(urlForecast) {
    const response = await fetch(urlForecast);
    const data = await response.json();

    const list = data.list;
    let days = [];
    for (let i = 0; i < list.length; i++) {
        let dateTime = list[i].dt_txt;
        let day = dateTime.substring(8, 10);
        if (!days.includes(day)) {
            days.push(day);
        }
    }
    let temp = [];
    for (let i = 0; i < days.length; i++) {
        let dayNumber = days[i];
        let temperatures = {
            day: dayNumber,
            max: -100,
            min: 100
        }
        for (let j = 0; j < list.length; j++) {
            let day = list[j].dt_txt.substring(8, 10);
            if (day === dayNumber) {
                const main = list[j].main;
                if (main.temp_max > temperatures.max) {
                    temperatures.max = Math.round(main.temp_max);
                }
                if (main.temp_min < temperatures.min) {
                    temperatures.min = Math.round(main.temp_min);
                }

            }
        }
        temp.push(temperatures);
    }
    console.log(temp);
    document.getElementById("day1").innerHTML = temp[0].day;
    document.getElementById("day2").innerHTML = temp[1].day;
    document.getElementById("day3").innerHTML = temp[2].day;
    document.getElementById("day4").innerHTML = temp[3].day;
    document.getElementById("day5").innerHTML = temp[4].day;

    document.getElementById("day1-max").innerHTML = temp[0].max;
    document.getElementById("day2-max").innerHTML = temp[1].max;
    document.getElementById("day3-max").innerHTML = temp[2].max;
    document.getElementById("day4-max").innerHTML = temp[3].max;
    document.getElementById("day5-max").innerHTML = temp[4].max;

    document.getElementById("day1-min").innerHTML = temp[0].min;
    document.getElementById("day2-min").innerHTML = temp[1].min;
    document.getElementById("day3-min").innerHTML = temp[2].min;
    document.getElementById("day4-min").innerHTML = temp[3].min;
    document.getElementById("day5-min").innerHTML = temp[4].min;

}


let e = document.getElementById("city");
function onChange() {
    let text = e.options[e.selectedIndex].text;
    let city = text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();

    let url = 'https://api.openweathermap.org/data/2.5/weather?q=' + city + '&units=metric&appid=cb2e9426acc7b3bdabd14474ae9e8311';
    getWeatherAPI(url);
}

e.onchange = onChange;
onChange();