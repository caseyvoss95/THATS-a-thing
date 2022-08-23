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
const $questionsNum = $('#questionsNum');

//FUNCTIONS

////////////////////////////////////////////////////////////////////////////////////
//purpose: renders a question in the game
//input: takes no input
//output: true if word is real, false if word is fake
////////////////////////////////////////////////////////////////////////////////////
function render() {

    //decide if word will be real or fake (50/50)
    //const isReal = Math.round(Math.random());
    const isReal = true; //DEBUG ONLY

    if (isReal) { //real word chosen
        word = findRealWord();
    }
    else { //randomly choose between 2 procedures for fake word (50/50):
        const fake = Math.round(Math.random());
        if (fake) {
            word = findFakeWordA();
        }
        else {
            word = findFakeWordB();
        }
    }

    // //render word and definition to user DEBUG ONLY
    // $word.text(word.word);
    // $definition.text(word.definition);

    // return isReal;
}

////////////////////////////////////////////////////////////////////////////////////
//purpose: collect a random genuine word and definition
//input: takes no input
//output: returns an object with one string key-value pair - {word: realWord, definition: realDefinition}
////////////////////////////////////////////////////////////////////////////////////
function findRealWord() {
    
    //API call for a random word
    let wordObject = getRandomWord();
    console.log(wordObject);

    //API call this word to check if word is uncommon 
    //if common, back to beginning of function

    //if uncommon, return a string object in the format {word: definition}

}

////////////////////////////////////////////////////////////////////////////////////
//purpose: fabricate a convincing fake word from two real words
//input: takes no input
//output: returns an object with one string key-value pair - {word: fakeWord, definition: fakeDefinition}
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

    //API call for one random word that fits criteria (fine tuning and play testing needed)
    //swap vowels and consonants in a convincing way (requires some planning)
    //find another random words definition, attach this to the the word object
    //return a string object in the format {word: definition}

}

////////////////////////////////////////////////////////////////////////////////////
//purpose: retrieve a random word and definition from Words API
//input: none
//output: returns an object in this fashion - {word: wordActual, definition: definitionActual}
////////////////////////////////////////////////////////////////////////////////////
function getRandomWord() {

    //random word API call
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

    $.ajax(settings).done(function (wordActual) {
        console.log(wordActual);
        return { word: wordActual.word, definition: wordActual.definition }
    });

}


////////////////////////////////////////////////////////////////////////////////////
//purpose: add points to score
//input: takes number of points to add
//output: none
////////////////////////////////////////////////////////////////////////////////////
function scoreAdd(num) {
    score += num;
    $score.text(score);
}

////////////////////////////////////////////////////////////////////////////////////
//purpose: subtracts and displays one question from the count
//input: none
//output: none
////////////////////////////////////////////////////////////////////////////////////
function removeQuestion() {
    questionNum -= 1;
    $questionsNum.text(questionNum);
}

////////////////////////////////////////////////////////////////////////////////////
//purpose: checks if games is over, resets score and questionNum if true
//input: none
//output: true if game is over, false if game is not over
////////////////////////////////////////////////////////////////////////////////////
function gameOver() {

    if (questionNum === 0) {
        //notify user that game is over
        console.log("GAME OVER"); //TODO display as message in document
        console.log("Final score is " + score);

        //reset counters
        score = 0;
        questionNum = 5;
        $score.text(score);
        $questionsNum.text(questionNum);
        return true;
    }
    else {
        return false;
    }
}

function main() {

    $score.text(score); //display score of 0
    $questionsNum.text(questionNum);

    let isReal = render();

    //listen for user choices
    $yes.on('click', function () {

        if (isReal) {
            scoreAdd(10);
            removeQuestion();
            if (!gameOver()) {
                isReal = render();
            }
            else {

            }
        }
        else {
            console.log("WRONG");
            removeQuestion();
            if (!gameOver()) {
                isReal = render();
            }
        }
    })

    $no.on('click', function () {
        if (!isReal) {
            scoreAdd(10);
            removeQuestion();
            if (!gameOver()) {
                isReal = render();
            }
        }
        else {
            console.log("WRONG");
            removeQuestion();
            if (!gameOver()) {
                isReal = render();
            }
        }
    })
}

main();