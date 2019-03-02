"use strict";

console.log('JavaScript is working!')


function submitForm() {
  $(".form").submit(function(event) {
    event.preventDefault();
    let userInput = $('#searchbox').val();
    generateCityPics(userInput);
    generateWeather(userInput);
  });
}

function generateCityPics(city) {
  const url = `https://api.pexels.com/v1/search?query=${city}`
  fetch(url, {
    headers: {'Authorization':"563492ad6f917000010000016d5ccf602df64d5aaf09707eb3e72208"},
      method: 'GET'})
  .then(response => {
    if (response.ok) {
        return response.json();
    }
    throw new Error(response.statusText)
  })
  .then(responseJson => {
    console.log(responseJson);
    if (responseJson['photos'].length===0) {
      const badResults = '<p>we do not have photos for this city yet, please check your spelling or try a different location</p>';
        $(".gallery").html(badResults);
    } else return renderPics(responseJson);
  })
  .catch(error => {
      $('#error-message').html(`something went wrong: ${error.message}`)
  })
 }

function generateWeather(city) {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&APPID=3a891b3d82936c6e090048a99d733621&units=imperial`
  fetch(url)
  .then(response => {
    if (response.ok) {
        return response.json();
    }
    throw new Error(response.statusText)
 })
 .then(responseJsonWeather => {
   console.log(responseJsonWeather);
  renderWeather(responseJsonWeather)})
 .catch(error => {
    $('#error-message').html(`something went wrong: ${error.message}`)
 })
 }



function renderPics(responseJson) {
  const results = responseJson['photos'].map(element => {
    return `
    <img src="${element.src.small}" alt="city images" class="results-img" />`});

  $(".gallery").html(results);
  $('#searchbox').val("");
}

function renderWeather(responseJsonWeather) {
  let userInput = $('#searchbox').val();
  const weather = `<p> The current weather in ${userInput} is ${responseJsonWeather.main.temp} F </p>`;
  $(".weather").html(weather);
}


$(submitForm);