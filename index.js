let search = document.getElementById("search");
let city = document.getElementById("city");
let date = document.getElementById("date");
let temp = document.getElementById("temp");
let weather = document.getElementById("weather");
let minTemp = document.getElementById("min-temp");
let maxTemp = document.getElementById("max-temp");
let minMaxTempDiv = document.getElementById("min-max-temp-div");
minMaxTempDiv.style.display = "none";
let prompt = document.getElementById("prompt");
prompt.style.display = "none";
let loader = document.getElementById("loader");
loader.style.display = "none";

function sanitize(str) {
  var splitStr = str.toLowerCase().split(" ");
  for (var i = 0; i < splitStr.length; i++) {
    splitStr[i] =
      splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
  }
  return splitStr.join(" ");
}

function resetDetails() {
  city.style.display = "none";
  date.style.display = "none";
  temp.style.display = "none";
  minMaxTempDiv.style.display = "none";
  weather.style.display = "none";
}

function enableDisplay() {
  city.style.display = "block";
  date.style.display = "block";
  temp.style.display = "block";
  minMaxTempDiv.style.display = "flex";
  weather.style.display = "block";
}

search.addEventListener("keyup", async (event) => {
  if (event.key === "Enter" || event.keyCode === 13) {
    loader.style.display = "block";

    const options = {
      method: "GET",
      headers: {
        "X-RapidAPI-Key": "04f4b8e63bmshd087194c7bae741p1e7440jsn94e3ef714f53",
        "X-RapidAPI-Host": "weather-by-api-ninjas.p.rapidapi.com",
      },
    };

    fetch(
      "https://weather-by-api-ninjas.p.rapidapi.com/v1/weather?city=" +
        search.value,
      options
    )
      .then((response) => response.json())
      .then(async (response) => {
        if (!response.error) {
          const countryOptions = {
            method: "GET",
            headers: {
              "X-RapidAPI-Key":
                "04f4b8e63bmshd087194c7bae741p1e7440jsn94e3ef714f53",
              "X-RapidAPI-Host": "foreca-weather.p.rapidapi.com",
            },
          };
          const countryResponse = await fetch(
            "https://foreca-weather.p.rapidapi.com/location/search/" +
              search.value,
            countryOptions
          );
          const countryData = await countryResponse.json();

          const weatherResponse = await fetch(
            "https://foreca-weather.p.rapidapi.com/current/" +
              countryData.locations[0].id +
              "?tempunit=C",
            countryOptions
          );
          const weatherData = await weatherResponse.json();

          const weatherPhrase = sanitize(weatherData.current.symbolPhrase);

          const cityName = sanitize(search.value);
          const countryName = sanitize(countryData.locations[0].country);

          city.innerHTML = cityName + ", " + countryName;
          const dateOptions = {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          };

          prompt.style.display = "none";
          loader.style.display = "none";

          enableDisplay();
          date.innerHTML = new Date().toLocaleDateString("en", dateOptions);
          weather.innerHTML = weatherPhrase;
          temp.innerHTML = response.temp + "&deg;C";
          minMaxTempDiv.style.display = "flex";
          minTemp.innerHTML = response.min_temp + "&deg;C";
          maxTemp.innerHTML = response.max_temp + "&deg;C";
        } else {
          loader.style.display = "none";
          prompt.style.display = "block";
          resetDetails();
        }
      })
      .catch((err) => {
        console.error("Reaching error", err);
        resetDetails();
      });
  }
});
