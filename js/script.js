const settings = {
	"async": true,
	"crossDomain": true,
	"url": "https://wordsapiv1.p.rapidapi.com/words/?random=true",
	"method": "GET",
	"headers": {
		"X-RapidAPI-Key": "dc2e0e8bddmshc3267816db39455p18c965jsn6c05ba4f9f24",
		"X-RapidAPI-Host": "wordsapiv1.p.rapidapi.com"
	}
};

$.ajax(settings).done(function (response) {
	console.log(response.word);
});