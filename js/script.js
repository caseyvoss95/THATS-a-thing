//GLOBAL VARIABLES

let score = 0;
let questionNum = 5;
let isReal;
let wordObjectA;
let wordObjectB;


//DOM ELEMENTS

const $word = $('#word');
const $definition = $('#definition');
const $yes = $('#yes');
const $no = $('#no');
const $score = $('#score');
const $questionsNum = $('#questionsNum');
const $reset = $('#reset');

//FUNCTIONS

////////////////////////////////////////////////////////////////////////////////////
//purpose: renders a question in the game
//input: none
//output: true if word is real, false if word is fake
////////////////////////////////////////////////////////////////////////////////////
function render() {

    //real or fake word chosen 50/50
    isReal = Math.round(Math.random());

    if (isReal) {
        findRealWord();
    }
    else {
        createFakeWord();
    }
}

////////////////////////////////////////////////////////////////////////////////////
//purpose: creates an AJAX call to Words API with the desired paramaters
//attributes used: definitions, syllables, random
//note: To retrieve a random word, set word and attribute to 0
//input: word, attribute, and JSON object to be overwritten
//output: sets global JSON wordObject to the results of the call
////////////////////////////////////////////////////////////////////////////////////
function callAPI(word, attribute, wordObject){

    //Syllable API Call
    const settings = {
        "async": false,
        "crossDomain": true,
        "url": `https://wordsapiv1.p.rapidapi.com/words/${word}/${attribute}`,
        "method": "GET",
        "headers": {
            "X-RapidAPI-Key": "dc2e0e8bddmshc3267816db39455p18c965jsn6c05ba4f9f24",
            "X-RapidAPI-Host": "wordsapiv1.p.rapidapi.com"
        }
    };

    //overwrite URL attribute if random word desired
    if (!word){
        settings.url = "https://wordsapiv1.p.rapidapi.com/words/?random=true"
    }

    $.ajax(settings).done(function (callResult) {
        wordObject = callResult;
    });

}




////////////////////////////////////////////////////////////////////////////////////
//purpose: retrieve a random word and definition from Words API and post to Document
//input: none
//output: none
////////////////////////////////////////////////////////////////////////////////////
function findRealWord() {

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

        $word.text(wordActual.word);

        //definition API call
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

            //check if API even *has* definition
            if (wordDefinition.definitions.length === 0) {
                $definition.text("");
            }
            else {
                $definition.text(wordDefinition.definitions[0].definition);
            }


        }, (error) => {
            $definition.text("Definition not found :(");

        })

    })
}

////////////////////////////////////////////////////////////////////////////////////
//purpose: combine two random words to create a new fake word, post to document
//input: none
//output: none
////////////////////////////////////////////////////////////////////////////////////
function createFakeWord() {

    //first random word API call
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

    $.ajax(settings).then((wordActualA) => {

        //second random word API call
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

        $.ajax(settings).then((wordActualB) => {

            let aPiece;
            let bPiece;

            //checking A for compound word, take first half if true
            if (wordActualA.word.search(' ') != -1) {
                aPiece = wordActualA.word.substr(0, wordActualA.word.search(' '));
            }
            else if (wordActualA.word.search('-') != -1) {
                aPiece = wordActualA.word.substr(0, wordActualA.word.search('-'));
            }

            //checking B for compound word, take second half if true
            if (wordActualB.word.search(' ') != -1) {
                bPiece = wordActualB.word.substr(wordActualB.word.search(' '), wordActualB.length - 1);
            }
            else if (wordActualB.word.search('-') != -1) {
                bPiece = wordActualB.word.substr((wordActualB.word.search('-'), wordActualB.length - 1));
            }

            //final output created
            if (aPiece && bPiece) { //concantenate if at least one compound word is present
                const connector = Math.round(Math.random());
                if (connector) {
                    $word.text(aPiece + " " + bPiece)
                }
                else if (!connector) {
                    $word.text(aPiece + "-" + bPiece)

                }
            }
            else if (!aPiece && !bPiece) { //concatenate if both words are simple

                //syllabel API Call
                const settings = {
                    "async": true,
                    "crossDomain": true,
                    "url": `https://wordsapiv1.p.rapidapi.com/words/${wordActualA.word}/syllables`,
                    "method": "GET",
                    "headers": {
                        "X-RapidAPI-Key": "dc2e0e8bddmshc3267816db39455p18c965jsn6c05ba4f9f24",
                        "X-RapidAPI-Host": "wordsapiv1.p.rapidapi.com"
                    }
                };

                $.ajax(settings).done(function (syllablesA) {

                    //syllabel API Call
                    const settings = {
                        "async": true,
                        "crossDomain": true,
                        "url": `https://wordsapiv1.p.rapidapi.com/words/${wordActualB.word}/syllables`,
                        "method": "GET",
                        "headers": {
                            "X-RapidAPI-Key": "dc2e0e8bddmshc3267816db39455p18c965jsn6c05ba4f9f24",
                            "X-RapidAPI-Host": "wordsapiv1.p.rapidapi.com"
                        }
                    };

                    $.ajax(settings).done(function (syllablesB) {

                        //choosing  syllables for fake word
                        let syllableCountA = syllablesA.syllables.count;
                        let syllableCountB = syllablesB.syllables.count;

                        //checking if syllable API calls return bogus empty object :(
                        if (!syllableCountA) {
                            syllableCountA = 1;
                        }
                        if (!syllableCountB) {
                            syllableCountB = 1;
                        }

                        //new syllable count is between 1 and (syllable total - 1)
                        syllableCountA = Math.floor(Math.random() * (syllableCountA - 1)) + 1;
                        syllableCountB = Math.floor(Math.random() * (syllableCountB - 1)) + 1;

                        //checking if syllable API calls return bogus empty object :(
                        if (!syllablesA.syllables.list) {
                            fakeWordA = wordActualA.word;
                        }
                        else {
                            fakeWordA = syllablesA.syllables.list.slice(0, syllableCountA).join("");

                        }

                        if (!syllablesB.syllables.list) {
                            fakeWordB = wordActualB.word;
                        }
                        else {
                            fakeWordB = syllablesB.syllables.list.slice(0, syllableCountB).join("");

                        }

                        $word.text(fakeWordA + fakeWordB);
                        //DEBUG ONLY

                        //definition API call
                        const settingsA = {
                            "async": true,
                            "crossDomain": true,
                            "url": `https://wordsapiv1.p.rapidapi.com/words/${wordActualA.word}/definitions`,
                            "method": "GET",
                            "headers": {
                                "X-RapidAPI-Key": "dc2e0e8bddmshc3267816db39455p18c965jsn6c05ba4f9f24",
                                "X-RapidAPI-Host": "wordsapiv1.p.rapidapi.com"
                            }
                        };

                        $.ajax(settingsA).then(function (wordDefinition) {

                            //check if API even *has* definition
                            if (wordDefinition.definitions.length === 0) {
                                $definition.text("");
                            }
                            else {
                                $definition.text(wordDefinition.definitions[0].definition);
                            }
                        }, (error) => {
                            $definition.text("Definition not found :(");
                        })
                    });
                });
            }
            else if (!aPiece) { //concatenate if just A is simple
                const connector = Math.round(Math.random());
                if (connector) {
                    $word.text(wordActualA.word + " " + bPiece)
                }
                else if (!connector) {
                    $word.text(wordActualA.word + "-" + bPiece)

                }
            }
            else if (!bPiece) { //concatenate if just B is simple
                const connector = Math.round(Math.random());
                if (connector) {
                    $word.text(aPiece + " " + wordActualB.word)
                }
                else if (!connector) {
                    $word.text(aPiece + "-" + wordActualB.word)

                }
            }

            //definition API call
            const settingsA = {
                "async": true,
                "crossDomain": true,
                "url": `https://wordsapiv1.p.rapidapi.com/words/${wordActualA.word}/definitions`,
                "method": "GET",
                "headers": {
                    "X-RapidAPI-Key": "dc2e0e8bddmshc3267816db39455p18c965jsn6c05ba4f9f24",
                    "X-RapidAPI-Host": "wordsapiv1.p.rapidapi.com"
                }
            };


            $.ajax(settingsA).then(function (wordDefinition) {

                //check if API even *has* definition
                if (wordDefinition.definitions.length === 0) {
                    $definition.text("");
                }
                else {
                    $definition.text(wordDefinition.definitions[0].definition);
                }


            }, (error) => {
                $definition.text("Definition not found :(");

            })
        });
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
//purpose: checks if games is over
//input: none
//output: true if game is over, false if game is not over
////////////////////////////////////////////////////////////////////////////////////
function gameOver() {

    if (questionNum === 0) {
        //notify user that game is over
        $word.text('GAME OVER');
        $definition.text(`Final Score: ${score}`);
        return true;
    }
    else {
        return false;
    }
}

////////////////////////////////////////////////////////////////////////////////////
//purpose: resets score and questions remaining counters
//input: none
//output: none
////////////////////////////////////////////////////////////////////////////////////
function resetGame() {
    score = 0;
    questionNum = 5;
    $score.text(score);
    $questionsNum.text(questionNum);
}

function main() {

    //display counters
    $score.text(score);
    $questionsNum.text(questionNum);

    //render first question
    render();

    //listen for user choices 
    //TODO: DRY it up
    $yes.on('click', function () {

        if (questionNum === 0) { //game over behavior
            return;
        }

        if (isReal) { //yes correct
            scoreAdd(10);
            removeQuestion();
            if (!gameOver()) {
                render();
            }
        }
        else { //yes incorrect
            removeQuestion();
            if (!gameOver()) {
                render();
            }
        }
    })

    $no.on('click', function () {

        if (questionNum === 0) { //game over behavior
            return;
        }

        if (!isReal) { //no correct
            scoreAdd(10);
            removeQuestion();
            if (!gameOver()) {
                render();
            }
        }
        else { //no incorrect
            removeQuestion();
            if (!gameOver()) {
                render();
            }
        }
    })

    $reset.on('click', function () {
        resetGame();
        render();
    })
}

//main();