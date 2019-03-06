"use strict";

function submitForm() {
  	$(".form").submit(function(event) {
    event.preventDefault();
		$('h2').removeClass('hidden');
		const userInput = $('#searchbox').val();
		console.log(userInput);
    generateCityPics(userInput);
    generateWeather(userInput);
    generateRecs(userInput)
  	});
}

function generateCityPics(city) {
		const url = `https://pixabay.com/api/?key=11800701-4991cb3dddbd2f2db0ae8b7de&q=${city}&image_type=photo&orientation=horizontal&per_page=9`
  	fetch(url)
  	.then(response => {
		if (response.ok) {
			return response.json();
		}
		throw new Error(response.statusText)
	})
  	.then(responseJson => {
		if (responseJson.hits.length===0) {
		const badResults = '<p class="alert-text">Sorry no photos for this city yet, please check your spelling or try a different location.</p>';
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
	renderWeather(responseJsonWeather)})
	.catch(error => {
		$('#error-message').html(`something went wrong: ${error.message}`)
	})
 }

 function generateRecs(city) {
  	const url = `https://api.foursquare.com/v2/venues/explore?near=${city}&client_id=G0ZTRLEUNDR53BOKWQUKUOKJHNBVACEMHJRGGHDAN2HYAQRH&client_secret=DNNFDZOEDGOAAHLAUHRMZMZOFAKCT5BZY5RE13VHS5JATSXB&v=20190301`
	fetch(url)
	.then(response => {
	if (response.ok) {
		return response.json();
	}
	throw new Error(response.statusText)
	})
	.then(responseJsonRecs => {
		console.log(responseJsonRecs.response.groups);
		renderRecs(responseJsonRecs)})
	.catch(error => {
		$('#error-message').html(`something went wrong: ${error.message}`)
	})
}

function renderPics(responseJson) {
	//const userInput = $('#searchbox').val();
	console.log(responseJson);
  	const results = responseJson.hits.map(element => {
    return `
    <img src="${element.webformatURL}" alt="${element.tags}" class="results-img" />`;});
  	$(".gallery").html(results);
  	$('#searchbox').val("");
}

function renderWeather(responseJsonWeather, userInput) {
  //const userInput = $('#searchbox').val();
  const weather = `<h2>Wondering what to pack?</h2> <h3> The current weather in ${userInput} is ${responseJsonWeather.main.temp} F </h3>`;
  $(".weather").html(weather);
}

function renderRecs(responseJsonRecs, userInput) {
  let recs = responseJsonRecs.response.groups.map( element => {
		return element.items.map(ele => {
		return `<h3 class="button-closer">${ele.venue.name}</h3>
		<a href="https://www.google.com/search?q=${ele.venue.name}+${userInput}" target="_blank" class="own-line">more info</a>`
	}).join("")
});
    $(".recs").html(recs);
}

$(submitForm);