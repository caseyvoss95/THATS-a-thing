//GLOBAL VARIABLES

let score = 0;
let questionNum = 5;
let isReal;
let wordObjectA;
let wordObjectB;


//AUDIO
const correct = new Audio("./assets/correct.wav");
const incorrect = new Audio("./assets/incorrect.wav");

//DOM ELEMENTS

const $word = $('#word');
const $definition = $('#definition');
const $yes = $('#yes');
const $no = $('#no');
const $score = $('#score');
const $questionsNum = $('#questionsNum');
const $reset = $('#reset');
const $correct = $('#correct');

//FUNCTIONS

////////////////////////////////////////////////////////////////////////////////////
//purpose: renders a question in the game
//input: none
//output: true if word is real, false if word is fake
////////////////////////////////////////////////////////////////////////////////////
function render() {

    //real or fake word chosen 50/50
    isReal = Math.round(Math.random());
    //isReal = true; //FOR DEBUG ONLY
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
//input: word, attribute, and JSON object to be overwritten (provide 0 or 1 for A & B)
//output: sets global JSON wordObject to the results of the call
////////////////////////////////////////////////////////////////////////////////////
function callAPI(word, attribute, wordObject) {

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
    if (!word) {
        settings.url = "https://wordsapiv1.p.rapidapi.com/words/?random=true"
    }

    $.ajax(settings).done(function (callResult) {
        if (!wordObject) { //set to 0
            wordObjectA = callResult;
        }
        else { //set to 1
            wordObjectB = callResult;
        }
    });
}

////////////////////////////////////////////////////////////////////////////////////
//purpose: retrieve a random word and definition from Words API and post to Document
//input: none
//output: none
////////////////////////////////////////////////////////////////////////////////////
function findRealWord() {

    //find random word and definition
    callAPI(0, 0, 0);
    $word.text(wordObjectA.word);
    callAPI(wordObjectA.word, 'definitions', 0);

    //check if API definition array is populated
    if (checkDefinition(wordObjectA.definitions.length)){
        $definition.text(wordObjectA.definitions[0].definition);
    }
}

////////////////////////////////////////////////////////////////////////////////////
//purpose: combine two random words to create a new fake word, post to document
//input: none
//output: none
////////////////////////////////////////////////////////////////////////////////////
function createFakeWord() {

    //random word calls
    callAPI(0, 0, 0);
    callAPI(0, 0, 1);
    
    //compound word check and slice
    const aPiece = compoundSlice(wordObjectA.word, compoundChoose(compoundCheck(wordObjectA.word)), 0);
    const bPiece = compoundSlice(wordObjectB.word, compoundChoose(compoundCheck(wordObjectB.word)), 1);

    //final output created
    if (compoundCheck(wordObjectA.word) && compoundCheck(wordObjectB.word)) { //concantenate if at least one compound word is present
        const connector = Math.round(Math.random());
        if (connector) {
            $word.text(aPiece + " " + bPiece)
        }
        else if (!connector) {
            $word.text(aPiece + "-" + bPiece)
        }
    }
    else if (!compoundCheck(wordObjectA.word) && !compoundCheck(wordObjectB.word)) { //concatenate if both words are simple

        //syllabel API Call
        callAPI(wordObjectA.word, 'syllables', 0);
        callAPI(wordObjectB.word, 'syllables', 1);

        //choosing  syllables for fake word
        let syllableCountA = wordObjectA.syllables.count;
        let syllableCountB = wordObjectB.syllables.count;

        //checking if syllable API calls return bogus empty object :(
        if (!syllableCountA) {
            syllableCountA = 1;
        }
        if (!syllableCountB) {
            syllableCountB = 1;
        }

        //6 total syllable max
        if (syllableCountA > 3){
            syllableCountA = 2;
        }
        if (syllableCountB > 3){
            syllableCountB = 2;
        }

        //new syllable count is between 1 and 3
        syllableCountA = Math.floor(Math.random() * (syllableCountA - 1)) + 1;
        syllableCountB = Math.floor(Math.random() * (syllableCountB - 1)) + 1;

        //checking if syllable API calls return bogus empty object
        if (!wordObjectA.syllables.list) {
            fakeWordA = wordObjectA.word;
        }
        else {
            fakeWordA = wordObjectA.syllables.list.slice(0, syllableCountA).join("");

        }
        if (!wordObjectB.syllables.list) {
            fakeWordB = wordObjectB.word;
        }
        else {
            fakeWordB = wordObjectB.syllables.list.slice(syllableCountB * -1).join("");
        }

        //fake word rendered
        $word.text(fakeWordA + fakeWordB);

    }
    else if (!compoundCheck(wordObjectA.word)) { //concatenate if just A is simple
        const connector = Math.round(Math.random());
        $word.text(wordObjectA.word + simpleConcatenate(connector) + bPiece);
    }
    else if (!compoundCheck(wordObjectB.word)) { //concatenate if just B is simple
        const connector = Math.round(Math.random());
        $word.text(aPiece + simpleConcatenate(connector) + wordObjectB.word);
    }

        //definition API call
        callAPI(wordObjectA.word, 'definitions', 0);

        //check if API has valid definition
        if (checkDefinition(wordObjectA.definitions.length)) {
            $definition.text(wordObjectA.definitions[0].definition);
        }
        else {
            callAPI(wordObjectB.word, 'definitions', 1); //fallback to definition of B
            if (checkDefinition(wordObjectB.definitions.length)){
                $definition.text(wordObjectB.definitions[0].definition);
            }
        }
}

////////////////////////////////////////////////////////////////////////////////////
//purpose: checks if definition exists in the API database
//input: length of definitions array
//output: true if definition exists, false if definition does not exist
////////////////////////////////////////////////////////////////////////////////////
function checkDefinition(length){
    if (length === 0){
        $definition.text(""); //display empty definition
        return 0;
    }
    else {
        return true;
    }

}

////////////////////////////////////////////////////////////////////////////////////
//purpose: checks if a word is compound (contains " " or "-")
//input: word and direction to slice 
//example: "compound-word" becomes "compound" w/ left and "word" w/ right
//output: returns 0 if not compound, 1 if ' ' compound, 2 if '-' compound
////////////////////////////////////////////////////////////////////////////////////

function compoundCheck(word){
    //checking A for compound word, take first half if true
    if (word.search(' ') != -1) {
        return 1;
    }
    else if (word.search('-') != -1) {
        return 2;
    }
    else {
        return 0;
    }
}

////////////////////////////////////////////////////////////////////////////////////
//purpose: delegates how a compound word will be sliced
//input: slice choice
//output: returns symbol that divdes the word, or false if simple
////////////////////////////////////////////////////////////////////////////////////
function compoundChoose(choice){
    if (choice === 1){
        return ' ';
    }
    else if (choice === 2) {
        return '-';
    }
    else {
        return 0;
    }
}

////////////////////////////////////////////////////////////////////////////////////
//purpose: slice a compound word to the left or right
//input: word, seperating symbol, and direction to slice: 0 = left, 1 = right
//example: "compound-word" becomes "compound" w/ left and "word" w/ right
//output: returns sliced half of compound word, or original word if simple
////////////////////////////////////////////////////////////////////////////////////

function compoundSlice(word, symbol, direction){
    
    if (direction === 1){
        return word.substr(word.search(symbol) + 1, word.length - 1)}
    else if (direction === 2){
        return word.substr(0, word.search(symbol));;
    }
    else {
        return word;
    }
}

////////////////////////////////////////////////////////////////////////////////////
//purpose: connect to simple words to create a compound word
//input: desired connector 0 for '-' or 1 for ' '
//output: compound word
////////////////////////////////////////////////////////////////////////////////////
function simpleConcatenate(connector){
    if (connector) {
        return ' ';
    }
    else if (!connector) {
        return '-';

    }
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

////////////////////////////////////////////////////////////////////////////////////
//purpose: tracks user choice, awards points if correct
//input: isReal boolean, choice boolean representing yes or no
//output: none
////////////////////////////////////////////////////////////////////////////////////
function makeChoice(isReal, choice){
    if (questionNum === 0) { //game over behavior
        return;
    }
    if (isReal == choice){
        correct.play();
        scoreAdd(10);
        removeQuestion();
        if (!gameOver()) {
            render();
        }
    }
    else {
        incorrect.play();
        removeQuestion();
        if (!gameOver()) {
            render();
        }
    }
}

function main() {

    //display counters
    $score.text(score);
    $questionsNum.text(questionNum);

    //render first question
    render();

    //listen for user choices 
    $yes.on('click', function () {
        makeChoice(isReal, true);
    })

    $no.on('click', function () {
        makeChoice(isReal, false);
    })

    $reset.on('click', function () {
        resetGame();
        render();
    })
}

main();