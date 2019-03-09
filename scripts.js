"use strict";

function submitForm() {
  	$(".form").submit(function(event) {
    event.preventDefault();
		$("h2").removeClass("hidden");
		const userInput = $("#searchbox").val();
    generateCityPics(userInput);
    generateWeather(userInput);
    generateRecs(userInput)
  	});
}

function noFocus() {
	$(".form").on(click, (event) => {
	event.preventDefault();
	$("#travelmonth:focus, #submit:focus, #searchbox:focus").css("outline", "none");
	})
}

function generateCityPics(city) {
		const url = `https://pixabay.com/api/?key=11800701-4991cb3dddbd2f2db0ae8b7de&q=${city}&image_type=photo&orientation=horizontal&per_page=3`
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
      $('#error-message-pics').html(`Sorry couldn't find the pictures, check spelling: ${error.message}`)
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
		generateHistory(responseJsonWeather)
		renderWeather(responseJsonWeather)})
	.catch(error => {
		$('#error-message-weather').html(`Problem finding weather, please check spelling: ${error.message}`)
	})
 }

function generateHistory(responseJsonWeather) {
	const month = $('#travelmonth').val();
	const url = `https://cors-anywhere.herokuapp.com/https://api.darksky.net/forecast/dc1ac9820b3586324209af8c5002d883/${responseJsonWeather.coord.lat},${responseJsonWeather.coord.lon},2019-${month}-10T12:00:00`
	fetch(url)
		.then(response => {
			if (response.ok) {
				return response.json();
			}
			throw new Error(response.statusText)
		})
		.then(responseJsonHistory => {
			renderHistory(responseJsonHistory)
		})
		.catch(error => {
			$('#error-message-history').html(`Sorry couldn't find historical weather date, check spelling: ${error.message}`)
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
		renderRecs(responseJsonRecs, city)})
	.catch(error => {
		$('#error-message-recs').html(`Sorry couldn't find the points of interest, check spelling: ${error.message}`)
	})
}

function renderPics(responseJson, city) {
  	const results = responseJson.hits.map(element => {
		return `
   <a href="${element.pageURL}" target="_blank"><img src="${element.webformatURL}" alt="${element.tags}" class="results-img" />`;});
  	$(".gallery").html(results);
  	$('#searchbox').val("");
}

function renderWeather(responseJsonWeather) {
  const weather = `</h2><div id="openweathermap-widget-19"></div> <script>window.myWidgetParam ? window.myWidgetParam : window.myWidgetParam = []; window.myWidgetParam.push({id: 19,cityid: '${responseJsonWeather.id}',appid: '3a891b3d82936c6e090048a99d733621',units: 'imperial',containerid: 'openweathermap-widget-19', }); (function() {var script = document.createElement('script');script.async = true;script.charset = "utf-8";script.src = "//openweathermap.org/themes/openweathermap/assets/vendor/owm/js/weather-widget-generator.js";var s = document.getElementsByTagName('script')[0];s.parentNode.insertBefore(script, s); })();</script>` 
  $(".weather").html(weather)
}

function renderHistory(responseJsonHistory) {
	const month = $('#travelmonth').val();
	let history = responseJsonHistory.daily.data.map(element => {
		return `<h3 class="weather-text"> The projected weather for ${month}/2019 based on historical averages is a high of ${element.temperatureHigh.toFixed(0)}&#176;F and a low of ${element.temperatureLow.toFixed(0)}&#176;F. ${element.summary}</h3>`;
	});
	$(".history").html(history)
}

function renderRecs(responseJsonRecs, city) {
  let recs = responseJsonRecs.response.groups.map( element => {
		return element.items.map(ele => {
		return `<h3 class="button-closer">${ele.venue.name}</h3>
		<a href="https://www.google.com/search?q=${ele.venue.name}+${city}" target="_blank" class="own-line"><i class="fas fa-globe-americas"></i>&nbsp;more info: Google &nbsp;</a>`
	}).join("")
});
    $(".recs").html(recs);
}

$(submitForm);