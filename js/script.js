//random word API call
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


//frequency API call
// const settings = {
// 	"async": true,
// 	"crossDomain": true,
// 	"url": "https://wordsapiv1.p.rapidapi.com/words/clinometer/frequency",
// 	"method": "GET",
// 	"headers": {
// 		"X-RapidAPI-Key": "dc2e0e8bddmshc3267816db39455p18c965jsn6c05ba4f9f24",
// 		"X-RapidAPI-Host": "wordsapiv1.p.rapidapi.com"
// 	}
// };

// $.ajax(settings).done(function (response) {
// 	console.log(response);
// });

//GLOBAL VARIABLES

let score = 0;
let questionNum = 5;

//DOM ELEMENTS

const $word = $('#word');
const $definition = $('#definition');
const $yes = $('#yes');
const $no = $('#no');
const $score = $('#score');

//FUNCTIONS

////////////////////////////////////////////////////////////////////////////////////
//purpose: renders a question in the game
//input: takes no input
//output: true if word is real, false if word is fake
////////////////////////////////////////////////////////////////////////////////////
function render() {

    //decide if word will be real or fake (50/50)
    const isReal = Math.round(Math.random());

    if (isReal) { //real word chosen
        word = findRealWord();
    }
    else { //randomly choose between 2 procedures for fake word (50/50):
        const fakeA = Math.round(Math.random());
        if (fakeA) {
            word = findFakeWordA();
        }
        else {
            word = findFakeWordB();
        }
    }

    //render word and definition to user
    $word.text(word.word);
    $definition.text(word.definition);

    return isReal;
}

////////////////////////////////////////////////////////////////////////////////////
//purpose: collect a random genuine word and definition
//input: takes no input
//output: returns a object with one string key-value pair - {word: realWord, definition: realDefinition}
////////////////////////////////////////////////////////////////////////////////////
function findRealWord() {
    return { word: 'a-real-word', definition: 'a real word definition here' };

    //API call for a random word

    //API call this word to check if word is uncommon 
    //if common, back to beginning of function

    //if uncommon, return a string object in the format {word: definition}

}

////////////////////////////////////////////////////////////////////////////////////
//purpose: fabricate a convincing fake word from two real words
//input: takes no input
//output: returns a object with one string key-value pair - {word: fakeWord, definition: fakeDefinition}
////////////////////////////////////////////////////////////////////////////////////
function findFakeWordA() {
    return { word: 'fake-concatenated-word', definition: 'and some BS nonsense about what it means' }

    //API call for two random words that fit criteria (fine tuning and play testing needed)
    //trim and concantenate them in a way that is feasible (maybe look up "how to make fake words")
    //randomly select one word's definition to be the final definition (50/50)
    //return a string object in the format {word: definition}

}

////////////////////////////////////////////////////////////////////////////////////
//purpose: fabricate a convincing fake word by swapping vowels and consonants
//input: takes no input
//output: returns a object with one string key-value pair - {word: fakeWord, definition: fakeDefinition}
////////////////////////////////////////////////////////////////////////////////////
function findFakeWordB() {
    return { word: 'fake-letter-swap-word', definition: 'and some BS nonsense about what it means' }

    //API call for one random word that fit criteria (fine tuning and play testing needed)
    //swap vowels and consonants in a convincing way (requires some planning)
    //find another random words definition, attach this to the the word object
    //return a string object in the format {word: definition}

}

////////////////////////////////////////////////////////////////////////////////////
//purpose: add points to score
//input: takes number of points to add
//output: none
////////////////////////////////////////////////////////////////////////////////////
function scoreAdd(num) {
    score += num;
    $score.text(score);
    return num;
}


function main() {

    $score.text(score, score); //display score of 0


    //TODO add iterate through all questions
    isReal = render();

    //listen for user choice
    $yes.on('click', function () {
        if (isReal) {
            scoreAdd(10);
        }
        else {
            console.log("WRONG");
        }
    })

    $no.on('click', function () {
        if (!isReal) {
            scoreAdd(10);
        }
        else {
            console.log("WRONG");
        }
    })

    console.log("onto the next question");




    //display final score 
    //MVP game is finished
}

main();