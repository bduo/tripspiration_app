"use strict";

console.log('JavaScript is working!')


function submitForm() {
  $(".form").submit(function(event) {
    event.preventDefault();
    let userInput = $('#searchbox').val();
    console.log(userInput);
    generateCityPics(userInput);
  });
}

function generateCityPics(city) {
  const url = `https://api.flickr.com/services/feeds/photos_public.gne?api_key=2d07518749b2f22d95a0014dfa38c300&format=json&tags=paris+landmark`
  fetch(url)
    .then(response => response.json())
    .then(responseJson => renderPics(responseJson))
    .catch(error => console.error(error));
}

function renderPics(responseJson) {
  let results = `<img src="${
    responseJson.urls.small
  }" alt="city images" class="results-img" />`;

  $(".gallery").html(results);
  $('#searchbox').val("");
}

function renderForm() {
  submitForm();
  generateCityPics();
}

$(renderForm);