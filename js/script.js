// const settings = {
// 	"async": true,
// 	"crossDomain": true,
// 	"url": "https://wordsapiv1.p.rapidapi.com/words/?random=true",
// 	"method": "GET",
// 	"headers": {
// 		"X-RapidAPI-Key": "dc2e0e8bddmshc3267816db39455p18c965jsn6c05ba4f9f24",
// 		"X-RapidAPI-Host": "wordsapiv1.p.rapidapi.com"
// 	}
// };

// $.ajax(settings).done(function (response) {
// 	console.log(response.word);
// });

const settings = {
	"async": true,
	"crossDomain": true,
	"url": "https://wordsapiv1.p.rapidapi.com/words/clinometer/frequency",
	"method": "GET",
	"headers": {
		"X-RapidAPI-Key": "dc2e0e8bddmshc3267816db39455p18c965jsn6c05ba4f9f24",
		"X-RapidAPI-Host": "wordsapiv1.p.rapidapi.com"
	}
};

$.ajax(settings).done(function (response) {
	console.log(response);
});


////////////////////////////////////////////////////////////////////////////////////
//purpose: renders a question in the game
//input: takes no input
//output: true if player's guess is successful and false if it is unsuccessful
////////////////////////////////////////////////////////////////////////////////////
function render(){

//decide if word will be real or fake (50/50 probability)

//if REAL
//call findRealWord();

//if FAKE
//randomly choose between 2 procedures (50/50):
//call either findFakeWordA(); or findFakeWordB();

//display rendered word and definition

//listen for user choice

/////enclose in a score function
//if successful +10 points!
//if unsuccessful +0 points :(
/////enclose in a score function

//if number of questions is still > total, back to beginning
//else, display final score 
//MVP game is finished

}


////////////////////////////////////////////////////////////////////////////////////
//purpose: collect a random genuine word and definition
//input: takes no input
//output: returns a object with one string key-value pair - {word: definition}
////////////////////////////////////////////////////////////////////////////////////
function findRealWord(){

//API call for a random word

//check if word is uncommon
//if not uncommon, back to beginning of function

//if uncommon, return a string object in the format {word: definition}

}

////////////////////////////////////////////////////////////////////////////////////
//purpose: fabricate a convincing fake word from two real words
//input: takes no input
//output: returns a object with one string key-value pair - {word: definition}
////////////////////////////////////////////////////////////////////////////////////
function findFakeWordA(){

//API call for two random words that fit criteria (fine tuning and play testing needed)
//trim and concantenate them in a way that is feasible (maybe look up "how to make fake words")
//randomly select one word's definition to be the final definition (50/50)
//return a string object in the format {word: definition}

}

////////////////////////////////////////////////////////////////////////////////////
//purpose: fabricate a convincing fake word by swapping vowels and consonants
//input: takes no input
//output: returns a object with one string key-value pair - {word: definition}
////////////////////////////////////////////////////////////////////////////////////
function findFakeWordB(){

//API call for one random word that fit criteria (fine tuning and play testing needed)
//swap vowels and consonants in a convincing way (requires some planning)
//return a string object in the format {word: definition}

}




function main(){
    //game runs here
}

main();