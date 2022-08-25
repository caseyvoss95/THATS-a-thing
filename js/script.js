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
    isReal = false; //DEBUG ONLY

    if (isReal) { //real word chosen
        findRealWord();
    }
    else { //randomly choose between 2 procedures for fake word (50/50):
        //const fake = Math.round(Math.random());
        const fake = true; //DEBUG only
        if (fake) {
            findFakeWordA();
        }
        else {
            findFakeWordB();
        }
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
                $definition.text("Definition not found :(");
            }
            else {
                $definition.text(wordDefinition.definitions[0].definition);
            }


        }, (error) => {
            $definition.text("Definition not found :(");

        })

    })
    return currentWord;
}

////////////////////////////////////////////////////////////////////////////////////
//purpose: combine two random words to create a new fake word
//input: none
//output: none
////////////////////////////////////////////////////////////////////////////////////
function findFakeWordA() {

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

            //checking A for compound word, slice if true
            if (wordActualA.word.search(' ') != -1) {
                aPiece = wordActualA.word.substr(0, wordActualA.word.search(' '));
            }
            else if (wordActualA.word.search('-') != -1) {
                aPiece = wordActualA.word.substr(0, wordActualA.word.search('-'));
            }
            else {
                aPiece = wordActualA.word;
            }

            console.log(aPiece);

            //checking B for compound word, slice if true
            if (wordActualB.word.search(' ') != -1) {
                bPiece = wordActualB.word.substr(wordActualB.word.search(' '), wordActualB.length - 1);
            }
            else if (wordActualB.word.search('-') != -1) {
                bPiece = wordActualB.word.substr((wordActualB.word.search('-'), wordActualB.length - 1));
            }
            else {
                bPiece = wordActualB.word;
            }
            console.log(bPiece);

            //final product created
            if (aPiece || bPiece) { //concantenate if at least one compound word is present
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
            else {


                //syllabel calls here



            }





            //randomly select one word's definition to be the final definition (50/50)




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

//main();

//syllables functionality TEST ZONE
const settings = {
    "async": true,
    "crossDomain": true,
    "url": "https://wordsapiv1.p.rapidapi.com/words/random/syllables",
    "method": "GET",
    "headers": {
        "X-RapidAPI-Key": "dc2e0e8bddmshc3267816db39455p18c965jsn6c05ba4f9f24",
        "X-RapidAPI-Host": "wordsapiv1.p.rapidapi.com"
    }
};

$.ajax(settings).done(function (syllablesA) {


    const settings = {
        "async": true,
        "crossDomain": true,
        "url": "https://wordsapiv1.p.rapidapi.com/words/symmetrical/syllables",
        "method": "GET",
        "headers": {
            "X-RapidAPI-Key": "dc2e0e8bddmshc3267816db39455p18c965jsn6c05ba4f9f24",
            "X-RapidAPI-Host": "wordsapiv1.p.rapidapi.com"
        }
    };

    $.ajax(settings).done(function (syllablesB) {

        console.log(syllablesA);
        console.log(syllablesB);

        
        //deciding which syllables to use in fake word
        
        let syllableCountA = syllablesA.syllables.count;
        let syllableCountB= syllablesB.syllables.count;
        
        console.log(syllableCountA);
        console.log(syllableCountB);

        //randomly minimize new



        // const syllableTotal = syllablesA.syllables.count + syllablesB.syllables.count - 1;

        // console.log("syllable total: " + syllableTotal);

        //swithPoint CANCELLED
        // //fake word has between 2 and (n - 1) syllables 
        // const newSyllable = Math.floor(Math.random() * (syllableTotal - 1)) + 2;
        // console.log("new word syllables: " + newSyllable);

    });


});