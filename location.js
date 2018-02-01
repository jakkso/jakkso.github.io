$(document).ready(function(){

    function initialLoad(pos) {
        let crd = pos.coords;
        let latitude = crd.latitude;
        let longitude = crd.longitude;
        page = "https://fcc-weather-api.glitch.me/api/current?lat=" + latitude + "&lon=" + longitude;
        fetch(page)
            .then(res => res.json())
    .then((out) => {
            $(".loading-icon-container").toggle();
        $("#city").html(out.name);
        $("#temp").html(round(((out.main.temp * 9 / 5) + 32), 2).toString() + "°F");
        $("#humidity").html("Humidity: " + out.main.humidity + '%');
        $("#wind").html("Wind: " + out.wind.speed + " MPH");
        $(".icon").attr("src", out.weather[0].icon);
        $(".container").slideDown(500);
    })
    .catch(err => { throw err });
    }

    function refreshConditions(tempString) {
        let system = tempString[tempString.indexOf("°") +  1];
        fetch(page)
            .then(res => res.json())
    .then((out) => {
            $(".loading-icon-container").toggle();
        if (system === "F") {
            $("#temp").html(round(((out.main.temp * 9 / 5) + 32), 2).toString() + "°F");
            $(".btn").html("Convert to °C");
        } else if (system === "C") {
            $("#temp").html(round(out.main.temp, 2).toString() + "°C");
            $(".btn").html("Convert to °F");
        }
        $("#humidity").html("Humidity: " + out.main.humidity + '%');
        $("#wind").html("Wind: " + out.wind.speed + " MPH");
        $(".icon").attr("src", out.weather[0].icon);
    })
    }

    function error(err) {
        console.log('Error: ' + err.message);
    }

    let options = {
        enableHighAccuracy: false,
        timeout: 5000,
        maximumAge: 0
    };

    function convertTemp(tempString) {
        let num = tempString.slice(0, tempString.indexOf("°")) - 0;
        let system = tempString[tempString.indexOf("°") +  1];
        if (system === 'C') {
            $(".btn").html("Convert to °C");
            return round(((num * 9 / 5) + 32), 2).toString() + "°F"
        } else if (system === 'F') {
            $(".btn").html("Convert to °F");
            return round(((num - 32) * (5/9)), 2).toString() + "°C"
        }
    }

    function round(value, decimals) {
        return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
    }

    $(".btn").click(function() {
        let temp = $(".temp");
        temp.html(convertTemp(temp.html()));
    });

    $(".refresh-link").click(function() {
        let temp = $(".temp");
        $(".loading-icon-container").toggle();
        refreshConditions(temp.html());
    });

    navigator.geolocation.getCurrentPosition(initialLoad, error, options);
});
