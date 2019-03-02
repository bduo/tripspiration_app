"use strict";

console.log('JavaScript is working!')


function submitForm() {
  $(".form").submit(function(event) {
    event.preventDefault();
    let userInput = $('#searchbox').val();
    generateCityPics(userInput);
  });
}

function generateCityPics(city) {
  const url = `https://api.flickr.com/services/feeds/photos_public.gne?api_key=2d07518749b2f22d95a0014dfa38c300&format=json&jsoncallback=processJSON&tags=${city}&method=get`
  fetch(url, {
    mode: 'cors',
    headers: {
      'Access-Control-Allow-Origin':'*'
    }
  })
  .then(response => {
    if (response.ok) {
        return response.json();
    }
    throw new Error(response.statusText)
})
.then(responseJson => renderResults(responseJson))
.catch(error => {
    $('#error-message').html(`something went wrong: ${error.message}`)
})
}


function renderResults(responseJson) {
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