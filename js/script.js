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
let currentWord;
let isReal;


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
//input: none
//output: true if word is real, false if word is fake
////////////////////////////////////////////////////////////////////////////////////
function render() {

    //decide if word will be real or fake (50/50)
    //const isReal = Math.round(Math.random());
    isReal = true; //DEBUG ONLY

    if (isReal) { //real word chosen
        findRealWord();
        console.log(currentWord);
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
//purpose: retrieve a random word from Words API
//input: none
//output: a string representing a random word
////////////////////////////////////////////////////////////////////////////////////
const getRandomWord = function () {

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

        $.ajax(settings).then((wordActual) => {
            currentWord = wordActual;
            $word.text(currentWord.word);
            
            
            console.log(wordActual.word);

            const settingsA = {
                "async": true,
                "crossDomain": true,
                "url": `https://wordsapiv1.p.rapidapi.com/words/${wordActual.word}/definitions`,
                "method": "GET",
                "headers": {
                    "X-RapidAPI-Key": "dc2e0e8bddmshc3267816db39455p18c965jsn6c05ba4f9f24",
                    "X-RapidAPI-Host": "wordsapiv1.p.rapidapi.com"
                }
            };
            
            $.ajax(settingsA).then(function (wordDefinition) {
                console.log(wordDefinition.definitions[0].definition);
                $definition.text(wordDefinition.definitions[0].definition);


            });






           
        })
    console.log(currentWord);

    //})
    return currentWord;
}

//getRandomWord();

////////////////////////////////////////////////////////////////////////////////////
//purpose: collect a random genuine word and definition
//input: none
//output: an object in the format - {word: realWord, definition: realDefinition}
////////////////////////////////////////////////////////////////////////////////////
const findRealWord = function () {

    //API call for a random word
    //const wordActual2 = getRandomWord();

    console.log(currentWord);

    let garbage = getRandomWord();
    return garbage;
    //console.log(garbage);




    //API call to check frequency of use for word
    //let wordCheck = wordObject.word;
    //console.log(typeof checkFrequency("the"));

    //if common, back to beginning of function
    //if uncommon, API call to retrieve definition of word

    //return a string object in the format {word: definition}

}

////////////////////////////////////////////////////////////////////////////////////
//purpose: fabricate a convincing fake word from two real words
//input: none
//output: returns an object with one string key-value pair - {word: fakeWord, definition: fakeDefinition}
////////////////////////////////////////////////////////////////////////////////////
function findFakeWordA() {
    return { word: 'fake-concatenated-word', definition: 'and some BS nonsense about what it means' }

    //API calls for two random words that fit criteria (fine tuning and play testing needed)
    //trim and concantenate them in a way that is feasible (maybe look up "how to make fake words")
    //randomly select one word's definition to be the final definition (50/50)
    //return a string object in the format {word: fakeWord, definition: fakeDefinition}

}

////////////////////////////////////////////////////////////////////////////////////
//purpose: fabricate a convincing fake word by swapping vowels and consonants
//input: none
//output: an object with one string key-value pair - {word: fakeWord, definition: fakeDefinition}
////////////////////////////////////////////////////////////////////////////////////
function findFakeWordB() {
    return { word: 'fake-letter-swap-word', definition: 'and some BS nonsense about what it means' }

    //API call for one random word that fits criteria (fine tuning and play testing needed)
    //swap vowels and consonants in a convincing way (requires some planning)
    //API call for  another random words definition, attach this to the the word object
    //return a string object in the format {word: fakeWord, definition: fakeDefinition}

}


// console.log(wordA);
// wordA = wordActual.word;
// console.log(wordA);
// console.log(wordActual.word);
// def = wordActual.def;
// NOTES: the JSON object is completely accessible in this scope. I need to figure out how to save the data I found here and use it outside of this scope. look up then() method.


////////////////////////////////////////////////////////////////////////////////////
//purpose: check the frequency of a use of a given word via Words API
//input: string of word being checked
//output: number score from 1 - 7
////////////////////////////////////////////////////////////////////////////////////
function checkFrequency(word) {

    //frequency API call
    const settings = {
        "async": true,
        "crossDomain": true,
        "url": `https://wordsapiv1.p.rapidapi.com/words/${word}/frequency`,
        "method": "GET",
        "headers": {
            "X-RapidAPI-Key": "dc2e0e8bddmshc3267816db39455p18c965jsn6c05ba4f9f24",
            "X-RapidAPI-Host": "wordsapiv1.p.rapidapi.com"
        }
    };
    return 'foo';
    $.ajax(settings).done(function (wordActual) {
        console.log(wordActual.frequency.zipf);

        return 'foo';
        //return typeof wordActual.frequency.zipf;
    });


}

////////////////////////////////////////////////////////////////////////////////////
//purpose: add points to score and updates score display
//input: number of points to add
//output: none
////////////////////////////////////////////////////////////////////////////////////
function scoreAdd(num) {
    score += num;
    $score.text(score);
}

////////////////////////////////////////////////////////////////////////////////////
//purpose: subtracts question from the count and updates question quantity display
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

    //set counters
    $score.text(score);
    $questionsNum.text(questionNum);

    //render question
    render();

    //listen for user choices TODO: DRY it up
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