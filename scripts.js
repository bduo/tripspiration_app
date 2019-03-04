"use strict";

function submitForm() {
  	$(".form").submit(function(event) {
    event.preventDefault();
    $('h2').removeClass('hidden');
    let userInput = $('#searchbox').val();
    generateCityPics(userInput);
    generateWeather(userInput);
    generateRecs(userInput)
  	});
}

function generateCityPics(city) {
  	const url = `https://api.pexels.com/v1/search?per_page=9&query=${city}`
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
	//console.log(responseJsonWeather);
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
  	const results = responseJson['photos'].map(element => {
    return `
    <img src="${element.src.tiny}" alt="city images" class="results-img" />`});
  	$(".gallery").html(results);
  	$('#searchbox').val("");
}

function renderWeather(responseJsonWeather) {
  let userInput = $('#searchbox').val();
  const weather = `<h2>Wondering what to pack?</h2> <h3> The current weather in ${userInput} is ${responseJsonWeather.main.temp} F </h3>`;
  $(".weather").html(weather);
}

function renderRecs(responseJsonRecs) {
  	const recs = responseJsonRecs.response.groups.map(element => {
	return element.items.map(ele => {
	return ` <h3>${ele.venue.name}</h3>
	<p><a href="https://www.google.com/search?q=${ele.venue.name}" target="_blank"><i class="fas fa-info-circle"></i></a></p>`
	}).join("");  
});
  	$(".recs").html(recs);
}

$(submitForm);