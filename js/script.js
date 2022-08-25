//GLOBAL VARIABLES

let score = 0;
let questionNum =5;
let currentWord;
let isReal;


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

    //decide if word will be real or fake (50/50)
    isReal = Math.round(Math.random());
    //isReal = false; //DEBUG ONLY

    if (isReal) { //real word chosen
        findRealWord();
    }
    else {         
        findFakeWord();
    }

    return isReal;
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

        console.log(wordActual.word);

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
//purpose: combine two random words to create a new fake word
//input: none
//output: none
////////////////////////////////////////////////////////////////////////////////////
function findFakeWord() {

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
            //DEBUG ONLY
            console.log(wordActualA);
            console.log(wordActualB);

            let aPiece;
            let bPiece;

            //checking A for compound word, take first half if true
            if (wordActualA.word.search(' ') != -1) {
                aPiece = wordActualA.word.substr(0, wordActualA.word.search(' '));
            }
            else if (wordActualA.word.search('-') != -1) {
                aPiece = wordActualA.word.substr(0, wordActualA.word.search('-'));
            }

            //DEBUG
            console.log(aPiece);

            //checking B for compound word, take second half if true
            if (wordActualB.word.search(' ') != -1) {
                bPiece = wordActualB.word.substr(wordActualB.word.search(' '), wordActualB.length - 1);
            }
            else if (wordActualB.word.search('-') != -1) {
                bPiece = wordActualB.word.substr((wordActualB.word.search('-'), wordActualB.length - 1));
            }

            //DEBUG
            console.log(bPiece);

            //final output created
            if (aPiece && bPiece) { //concantenate if at least one compound word is present
                const connector = Math.round(Math.random());
                console.log(connector);
                if (connector) {
                    console.log(aPiece + " " + bPiece);
                    $word.text(aPiece + " " + bPiece)
                }
                else if (!connector) {
                    console.log(aPiece + "-" + bPiece);
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

                        console.log(syllablesA);
                        console.log(syllablesB);


                        //choosing  syllables for fake word
                        let syllableCountA = syllablesA.syllables.count;
                        let syllableCountB = syllablesB.syllables.count;

                        //DEBUG ONLY
                        console.log(syllableCountA);
                        console.log(syllableCountB);

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

                        //DEBUG ONLY
                        console.log(syllableCountA);
                        console.log(syllableCountB);

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

                        //DEBUG ONLY
                        console.log(fakeWordA);
                        console.log(fakeWordB);

                        const fakeWordFinal = fakeWordA + fakeWordB;
                        $word.text(fakeWordA + fakeWordB);
                        //DEBUG ONLY
                        console.log(fakeWordFinal);


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

                            console.log(wordDefinition);

                            console.log("searching for definition");
                            //check if API even *has* definition
                            if (wordDefinition.definitions.length === 0) {
                                $definition.text("");
                            }
                            else {
                                $definition.text(wordDefinition.definitions[0].definition);
                                console.log(wordDefinition.definitions[0].definition)
                            }


                        }, (error) => {
                            $definition.text("Definition not found :(");

                        })

                    });


                });

            }
            else if (!aPiece) { //concatenate if just A is simple
                const connector = Math.round(Math.random());
                console.log(connector);
                if (connector) {
                    console.log(wordActualA.word + " " + bPiece);
                    $word.text(wordActualA.word + " " + bPiece)
                }
                else if (!connector) {
                    console.log(wordActualA.word + "-" + bPiece);
                    $word.text(wordActualA.word + "-" + bPiece)

                }
            }
            else if (!bPiece) { //concatenate if just B is simple
                const connector = Math.round(Math.random());
                console.log(connector);
                if (connector) {
                    console.log(aPiece + " " + wordActualB.word);
                    $word.text(aPiece + " " + wordActualB.word)
                }
                else if (!connector) {
                    console.log(aPiece + "-" + wordActualB.word);
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

                console.log(wordDefinition);

                console.log("searching for definition");
                //check if API even *has* definition
                if (wordDefinition.definitions.length === 0) {
                    $definition.text("");
                }
                else {
                    $definition.text(wordDefinition.definitions[0].definition);
                    console.log(wordDefinition.definitions[0].definition)
                }


            }, (error) => {
                $definition.text("Definition not found :(");

            })
        });
    });


    return { word: 'fake-concatenated-word', definition: 'and some BS nonsense about what it means' }



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
//purpose: checks if games is over
//input: none
//output: true if game is over, false if game is not over
////////////////////////////////////////////////////////////////////////////////////
function gameOver() {

    if (questionNum === 0) {
        //notify user that game is over
        console.log("GAME OVER"); //TODO display as message in document
        console.log("Final score is " + score);
        $word.text('GAME OVER');
        $definition.text(`Final Score: ${score}`);
        return true;
    }
    else {
        return false;
    }
}

////////////////////////////////////////////////////////////////////////////////////
//purpose: resets score and questions remaining
//input: none
//output: none
////////////////////////////////////////////////////////////////////////////////////
function resetGame() {
    console.log("game reset is running");
    score = 0;
    questionNum = 5;
    $score.text(score);
    $questionsNum.text(questionNum);
}

function main() {

    console.log('Main Activated');
    //display counters
    $score.text(score);
    $questionsNum.text(questionNum);

    //render first question
    render();

    //listen for user choices 
    //TODO: DRY it up
    $yes.on('click', function () {

        //game over 
        if (questionNum === 0) {
            return;
            // render();
        }

        if (isReal) {
            scoreAdd(10); //yes correct
            removeQuestion();
            if (!gameOver()) {
                isReal = render();
            }
        }
        else {
            console.log("WRONG"); //yes incorrect
            removeQuestion();
            if (!gameOver()) {
                console.log("game is NOT over BABY")
                isReal = render();
            }
        }
    })

    $no.on('click', function () {

        //game over 
        if (questionNum === 0) {
            return;
            // render();
        }


        if (!isReal) { //no correct
            scoreAdd(10);
            removeQuestion();
            if (!gameOver()) {
                isReal = render();
            }
        }
        else { //no incorrect
            console.log("WRONG");
            removeQuestion();
            if (!gameOver()) {
                isReal = render();
            }
        }
    })

    $reset.on('click', function () {
        resetGame();
        render();
    })
}

main();

